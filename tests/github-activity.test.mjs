import assert from "node:assert/strict";
import { afterEach, beforeEach, test } from "node:test";
import { fetchContributions } from "../app/lib/github-activity.ts";

const savedToken = process.env.GITHUB_TOKEN;
beforeEach(() => { delete process.env.GITHUB_TOKEN; });
afterEach(() => {
  if (savedToken === undefined) delete process.env.GITHUB_TOKEN;
  else process.env.GITHUB_TOKEN = savedToken;
});

function calendar(count) {
  return new Response(`
    <td id="day-2" data-date="2026-11-09" data-level="0"></td>
    <td data-level="4" data-date="2026-11-08" id="day-1"></td>
    <tool-tip for="day-1">${count.toLocaleString("en-US")} contributions on November 8th.</tool-tip>
    <tool-tip for="day-2">No contributions on November 9th.</tool-tip>
  `);
}

test("uses the current public profile before any cached third-party calendar", async (t) => {
  const fetch = t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(url, "https://github.com/users/shreyjain11/contributions");
    assert.equal(options.cache, "no-store");
    assert.equal(options.next, undefined);
    return calendar(1662);
  });
  const result = await fetchContributions("shreyjain11");
  assert.equal(result.source, "github");
  assert.deepEqual(result.contributions, [
    { date: "2026-11-08", count: 1662, level: 4 },
    { date: "2026-11-09", count: 0, level: 0 },
  ]);
  assert.equal(fetch.mock.callCount(), 1);
});

test("a new upstream read picks up changed historical counts", async (t) => {
  let count = 363;
  t.mock.method(globalThis, "fetch", async (_url, options) => {
    assert.equal(options.cache, "no-store");
    return calendar(count);
  });
  assert.equal((await fetchContributions("shreyjain11")).contributions[0].count, 363);
  count = 1662;
  assert.equal((await fetchContributions("shreyjain11")).contributions[0].count, 1662);
});

test("retains the optional official API fallback when the public calendar fails", async (t) => {
  process.env.GITHUB_TOKEN = "test-only-placeholder";
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.cache, "no-store");
    if (url.startsWith("https://github.com/")) return new Response("Unavailable", { status: 503 });
    assert.equal(url, "https://api.github.com/graphql");
    return Response.json({ data: { user: { contributionsCollection: { contributionCalendar: {
      weeks: [{ contributionDays: [{ date: "2026-11-08", contributionCount: 12, contributionLevel: "SECOND_QUARTILE" }] }],
    } } } } });
  });
  const result = await fetchContributions("shreyjain11");
  assert.equal(result.source, "github-api");
  assert.deepEqual(result.contributions, [{ date: "2026-11-08", count: 12, level: 2 }]);
});

test("falls back without a token if GitHub omits the tooltip counts", async (t) => {
  t.mock.method(globalThis, "fetch", async (url, options) => {
    assert.equal(options.cache, "no-store");
    if (url.startsWith("https://github.com/")) {
      return new Response('<td id="day-1" data-date="2026-11-08" data-level="4"></td>');
    }
    assert.ok(url.startsWith("https://github-contributions-api.jogruber.de/v4/"));
    return Response.json({ contributions: [{ date: "2026-11-08", count: 12, level: 2 }] });
  });
  const result = await fetchContributions("shreyjain11");
  assert.equal(result.source, "contributions-api");
  assert.equal(result.contributions[0].count, 12);
});

test("does not turn a complete upstream outage into an empty successful calendar", async (t) => {
  t.mock.method(globalThis, "fetch", async () => new Response("Unavailable", { status: 403 }));
  assert.equal(await fetchContributions("shreyjain11"), null);
});
