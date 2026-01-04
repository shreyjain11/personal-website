"use client";

import { useEffect, useState } from "react";

interface Repo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  stargazers_count: number;
  language: string | null;
  fork: boolean;
}

const languageColors: Record<string, string> = {
  TypeScript: "#3178c6",
  JavaScript: "#f1e05a",
  Python: "#3572A5",
  Rust: "#dea584",
  Go: "#00ADD8",
  Java: "#b07219",
  "C++": "#f34b7d",
  C: "#555555",
  HTML: "#e34c26",
  CSS: "#563d7c",
  Swift: "#F05138",
  Kotlin: "#A97BFF",
  Ruby: "#701516",
  PHP: "#4F5D95",
};

export function GitHubRepos({ username }: { username: string }) {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`
        );
        if (!response.ok) throw new Error("Failed to fetch");
        const data: Repo[] = await response.json();
        // Filter out forks and get top 6
        const filteredRepos = data
          .filter((repo) => !repo.fork)
          .slice(0, 6);
        setRepos(filteredRepos);
      } catch {
        // Silently fail, will show empty state
      } finally {
        setLoading(false);
      }
    };

    fetchRepos();
  }, [username]);

  if (loading) {
    return (
      <div className="w-full">
        <div className="flex items-center gap-2 mb-4">
          <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white">
            <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          <h3 className="text-lg font-medium text-white">GitHub</h3>
        </div>
        <div className="text-white/60 text-sm">Loading repositories...</div>
      </div>
    );
  }

  if (repos.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="flex items-center gap-2 mb-4">
        <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24" className="text-white">
          <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387 0.6 0.113 0.82-0.258 0.82-0.577 0-0.285-0.011-1.04-0.017-2.04-3.338 0.726-4.042-1.61-4.042-1.61-0.546-1.387-1.333-1.756-1.333-1.756-1.089-0.745 0.084-0.729 0.084-0.729 1.205 0.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495 0.997 0.108-0.775 0.418-1.305 0.762-1.605-2.665-0.305-5.466-1.334-5.466-5.931 0-1.31 0.469-2.381 1.236-3.221-0.124-0.303-0.535-1.523 0.117-3.176 0 0 1.008-0.322 3.301 1.23 0.957-0.266 1.983-0.399 3.003-0.404 1.02 0.005 2.047 0.138 3.006 0.404 2.291-1.553 3.297-1.23 3.297-1.23 0.653 1.653 0.242 2.873 0.119 3.176 0.77 0.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921 0.43 0.372 0.823 1.102 0.823 2.222 0 1.606-0.015 2.898-0.015 3.293 0 0.322 0.216 0.694 0.825 0.576 4.765-1.589 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        <h3 className="text-lg font-medium text-white">GitHub</h3>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {repos.map((repo) => (
          <a
            key={repo.id}
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group p-3 rounded-lg bg-transparent hover:bg-white/10 backdrop-blur-sm transition-all duration-200 border border-white/10"
          >
            <div className="flex items-start justify-between gap-2">
              <span className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">
                {repo.name}
              </span>
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1 text-xs text-white/60 shrink-0">
                  <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
                  </svg>
                  {repo.stargazers_count}
                </span>
              )}
            </div>
            {repo.description && (
              <p className="text-xs text-white/60 mt-1 line-clamp-2">
                {repo.description}
              </p>
            )}
            {repo.language && (
              <div className="flex items-center gap-1.5 mt-2">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: languageColors[repo.language] || "#8b8b8b" }}
                />
                <span className="text-xs text-white/50">{repo.language}</span>
              </div>
            )}
          </a>
        ))}
      </div>
    </div>
  );
}

