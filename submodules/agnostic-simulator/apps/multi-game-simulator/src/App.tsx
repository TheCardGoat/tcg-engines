import { useCallback, useEffect, useMemo, useState } from "react";

import type { GameSlug } from "@tcg/simulator-contract";
import { fixtures } from "./simulator/fixtures";
import { findMountedSimulatorRoute } from "./simulator/mountedSimulators";
import { isGameSlug } from "./simulator/games";
import { normalizeRouterBasename } from "./router-paths";
import GameIndex from "./components/GameIndex";
import GameFixturePage from "./components/GameFixturePage";
import { MountedBrowserSimulator } from "./components/MountedBrowserSimulator";
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

function isAnimationFixturePath(pathValue: string): boolean {
  if (pathValue === "/animation-fixtures") {
    return true;
  }

  const basePath = normalizeRouterBasename(import.meta.env.BASE_URL);
  return basePath !== "/" && pathValue === `${basePath}/animation-fixtures`;
}

export interface AppProps {
  initialPath?: string;
}

export default function App({ initialPath }: AppProps) {
  const [path, setPath] = useState(() => initialPath ?? getPath());

  const mountedSimulatorRoute = useMemo(() => findMountedSimulatorRoute(path), [path]);

  const gameSlug = useMemo(() => parseGameSlug(path), [path]);

  const gameFixtures = useMemo(
    () => (gameSlug ? fixtures.filter((f) => f.gameSlug === gameSlug) : []),
    [gameSlug],
  );

  const navigate = useCallback((to: string) => {
    window.history.pushState({}, "", to);
    setPath(getPath());
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const onPopState = () => setPath(getPath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  if (path === "/" || path === "") {
    return <GameIndex fixtures={fixtures} onNavigate={navigate} />;
  }

  if (isAnimationFixturePath(path)) {
    return <AnimationFixturesPage onNavigate={navigate} />;
  }

  if (mountedSimulatorRoute) {
    return (
      <MountedBrowserSimulator
        basename={mountedSimulatorRoute.basename}
        routes={mountedSimulatorRoute.routes}
        Providers={mountedSimulatorRoute.Providers}
      />
    );
  }

  if (gameSlug) {
    return <GameFixturePage gameSlug={gameSlug} fixtures={gameFixtures} onNavigate={navigate} />;
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
