import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import styles from "../thoughts.module.css";

export const metadata: Metadata = {
  title: "Figuring things out — Shrey Jain",
  description: "On learning from Feynman, testing ideas, and thinking critically while working with AI.",
  alternates: {
    canonical: "https://jainshrey.com/thoughts/figuring-things-out",
  },
};

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="prose-link">
      {children}
    </a>
  );
}

export default function FiguringThingsOut() {
  return (
    <main className="page-shell">
      <article className={`content-haze ${styles.article}`} aria-labelledby="post-title">
        <header className={styles.header}>
          <Link href="/thoughts" className={styles.back}>
            Thoughts
          </Link>
          <h1 id="post-title" className={styles.title}>Figuring things out</h1>
          <time dateTime="2026-11" className={styles.date}>November 2026</time>
        </header>
        <div className={styles.body}>
          <p>
              {"I lose hours to problems. It’s rarely the whole problem, just one step that won’t make sense. Sometimes my answer disagrees with the worked solution and I can’t find where my reasoning broke. More often, I can follow every line of the solution and still have no idea how anyone thought to try it. And sometimes I’m just going in circles, and more of the same thinking won’t save me. I need a different way in."}
          </p>
          <p>
              {"I recently finished reading "}
              <ExternalLink href="https://en.wikipedia.org/wiki/Surely_You%27re_Joking,_Mr._Feynman!"><em>{"Surely You're Joking, Mr. Feynman!"}</em></ExternalLink>
              {" (objectively one of the greatest books of all time). In one of his stories, Feynman fixes a radio that makes a loud noise when it is switched on, then starts working normally. Something must be changing between the moment it is turned on and the moment the noise stops. Feynman thought the vacuum tubes were heating up in the wrong order, so he switched their positions, and the noise stopped. While this is probably the most trivial example you will see, it shows a fundamental issue in society today: we don't really think. We don't think about why things happen the way they do or what causes certain things; we often rush to ChatGPT asking for answers."}
          </p>
          <p>
              {"What I really liked about this is that he didn't start with an answer. He used something he noticed to narrow down what might be wrong, then tried something that could test it. This is the essence of science. I struggle with this immensely, and that's one of my goals as I continue to work and progress through "}
              <ExternalLink href="https://www.feynmanlectures.caltech.edu/">{"higher levels of math and physics"}</ExternalLink>
              {"."}
          </p>
          <p>
              {"Following a worked solution can make a problem feel obvious without explaining why I missed it. If the solution uses conservation of energy, why should I have thought of that? Going back to the question with those things in mind gives me something to look for on the next problem, rather than another solution I comprehend after I look at it. In the end, repetition is what builds the intuition for how to approach problems. However, not all problems are similar, and that's what makes research so great."}
          </p>
          <p>
              {"Examples are core to Feynman's philosophy. I found it funny that he would either debunk or understand difficult mathematical claims simply by constructing examples! His "}
              <ExternalLink href="https://authors.library.caltech.edu/3514">{"work on beta decay"}</ExternalLink>
              {" also involved questioning accepted results."}
          </p>
          <p>
              {"Take two masses connected by a light string over a frictionless, massless pulley. If the masses are equal, neither side should accelerate. If one is much heavier, the acceleration should approach free fall, though neither mass alone is actually falling freely. Swapping the masses should reverse the direction without changing the magnitude. Something that "}
              <ExternalLink href="https://knzhou.github.io/handouts/P1.pdf">{"fails one of these checks"}</ExternalLink>
              {" is deemed wrong, despite the algebra potentially looking fair. Drawing the forces on each mass also makes it harder to forget that the tension acts on both. I have utilized this concept heavily when working through textbooks, "}
              <ExternalLink href="https://knzhou.github.io/teaching/">{"handouts"}</ExternalLink>
              {", and problems. This does not solve every version of the initial problem, but it gives me something to work with. It doesn't matter if it is a simple example, as long as I know which assumptions made it simple."}
          </p>
          <p>
              {"When talking to my agent, I can ask where it is headed and actually write down what I want to achieve before it starts. "}
              <ExternalLink href="https://x.com/addyosmani/status/2117512471930167377">{"Addy Osmani's article"}</ExternalLink>
              {" on critical thinking when agents do (pretty much) all the work makes a point that I pondered: "}
              <ExternalLink href="https://papers.ssrn.com/abstract=6097646">{"a convincing answer can become the answer I accept before I have formed one of my own"}</ExternalLink>
              {". An \"educated guess\" of what potential output or results may look like can provide slight value when understanding agent output. If I can't describe what a successful result would look like, having the agent ask me questions (which is also a great tactic) might be more useful than asking it to start building."}
          </p>
          <p>
              {"For something that I don't understand, I could ask the agent to trace one input through it, then change the input and predict what should happen. I don't need to fully understand the system to check a part of it, but I do need to understand what that check leaves out. This is the type of practitioner I want to be: someone who can take an explanation and work with it, rather than just accept it because it sounds right."}
          </p>
          <p>
              {"At the "}
              <ExternalLink href="https://www.sabetilab.org/">{"Sabeti Lab"}</ExternalLink>
              {", we often think about what the flaws in our research are and what different angles we could get attacked from (in the end, that's a big part of academia; whether it's for better or for worse, I couldn't care less). We also think about alternate explanations for our results (the more people who can interpret your findings, the more power they hold). For example, if our model performs better on an evaluation, is it genuinely improving at the task, or have we made it better at the particular examples we keep testing (aka "}
              <ExternalLink href="https://en.wikipedia.org/wiki/Goodhart%27s_law">{"benchmarkmaxxing"}</ExternalLink>
              {")?"}
          </p>
          <p>
              {"In "}
              <ExternalLink href="https://calteches.library.caltech.edu/51/2/CargoCult.htm">{"\"Cargo Cult Science,\""}</ExternalLink>
              {" Feynman talks about researchers needing to consider alternative causes, including ones that weaken their own interpretation. It is useful to argue both sides, but I don't want to stop there. I want to know where they differ in their predictions."}
          </p>
          <p>
              {"In "}
              <em>{"Surely You're Joking, Mr. Feynman!"}</em>
              {", he also talks about investigating the wobble of a plate tossed into the air at Cornell. I like that he focused on finding out why it was happening without needing to justify what it would be useful for. I would like to do more of this. Sometimes I just want to understand why something is happening."}
          </p>
          <p>
              {"The goal of everything I do is to find the truth. I'm still trying to work out how to do this on a day-to-day basis. I want to get better at identifying what is confusing me, trying something tangible, and being attentive to any surprises. Not every question will have a clear answer, but I can usually be more specific about what I have tried."}
          </p>
          <p>
              {"This is why I'm writing this. I have lots of ideas on how I want to approach things. And maybe by writing them down here, I can think about what I will actually do differently (which may also help you)."}
          </p>
          <p>
              {"I'll still get stuck on problems for hours like I always have, and that's probably fine. What I want to change is how I spend that time. Like Feynman with the radio, I'd rather walk away with a guess that I actually tested than an answer that was put in my lap, and I think you should too."}
          </p>
        </div>
      </article>
    </main>
  );
}
