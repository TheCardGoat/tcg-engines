import { useCallback, useEffect, useMemo, useState } from "react";

import type { GameSlug } from "@tcg/simulator-contract";
import { getGameDefaultIndexPath, isGameSlug } from "./simulator/games";
import { normalizeRouterBasename } from "./routes/router-paths.ts";
import GameIndex from "./components/GameIndex";
import AnimationFixturesPage from "./components/AnimationFixturesPage";

function getPath(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return window.location.pathname;
}

function parseGameSlug(pathValue: string): GameSlug | null {
  const firstSegment = pathValue.split("/").filter(Boolean)[0];
  if (!firstSegment) {
    return null;
  }

  try {
    const slug = decodeURIComponent(firstSegment);
    return isGameSlug(slug) ? slug : null;
  } catch {
    return null;
  }
}

function trimTrailingSlash(pathValue: string): string {
  return pathValue.length > 1 && pathValue.endsWith("/") ? pathValue.slice(0, -1) : pathValue;
}

function isExternalNavigationTarget(to: string): boolean {
  try {
    const url = new URL(to);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

function isAnimationFixturePath(pathValue: string): boolean {
  if (pathValue === "/animation-fixtures") {
    return true;
  }

  const basePath = normalizeRouterBasename(import.meta.env.BASE_URL);
  return basePath !== "/" && pathValue === `${basePath}/animation-fixtures`;
}

interface NavigateOptions {
  replace?: boolean;
}

export interface AppProps {
  initialPath?: string;
}

function GameIndexRedirect({
  to,
  onNavigate,
}: {
  to: string;
  onNavigate: (path: string, options?: NavigateOptions) => void;
}) {
  useEffect(() => {
    onNavigate(to, { replace: true });
  }, [onNavigate, to]);

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-center justify-center p-6">
      <p className="text-sm font-semibold text-[var(--muted)]">Opening visual fixtures...</p>
    </main>
  );
}

export default function App({ initialPath }: AppProps) {
  const [path, setPath] = useState(() => initialPath ?? getPath());

  const gameSlug = useMemo(() => parseGameSlug(path), [path]);

  const navigate = useCallback((to: string, options: NavigateOptions = {}) => {
    if (isExternalNavigationTarget(to)) {
      if (options.replace) {
        window.location.replace(to);
      } else {
        window.location.assign(to);
      }
      return;
    }

    if (options.replace) {
      window.history.replaceState({}, "", to);
    } else {
      window.history.pushState({}, "", to);
    }
    setPath(getPath());
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (path === "/" || path === "") {
    return <GameIndex onNavigate={navigate} />;
  }

  if (isAnimationFixturePath(path)) {
    return <AnimationFixturesPage onNavigate={navigate} />;
  }

  if (gameSlug) {
    const defaultIndexPath = getGameDefaultIndexPath(gameSlug);
    const normalizedPath = trimTrailingSlash(path);
    if (
      defaultIndexPath &&
      normalizedPath === `/${gameSlug}` &&
      defaultIndexPath !== normalizedPath
    ) {
      return <GameIndexRedirect to={defaultIndexPath} onNavigate={navigate} />;
    }
  }

  return (
    <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-center justify-center p-6">
      <div className="text-center">
        <p className="text-2xl font-extrabold text-[var(--text)]">Page not found</p>
        <p className="mt-2 text-[var(--muted)]">{path} does not match a known game route.</p>
        <button
          type="button"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--game-accent)] px-4 py-2 text-sm font-semibold text-white"
          onClick={() => navigate("/")}
        >
          Back to index
        </button>
      </div>
    </main>
  );
}
