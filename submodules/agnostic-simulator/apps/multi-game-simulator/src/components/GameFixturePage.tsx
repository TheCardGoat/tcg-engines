import { useCallback, useEffect, useMemo, useState } from "react";

import { SimulatorHarness } from "@tcg/simulator-ui";
import type { GameSlug, HarnessFixture } from "@tcg/simulator-contract";
import { getGameMeta } from "../simulator/games";
import { findMountedSimulatorRouteForGame } from "../simulator/mountedSimulators";

export interface GameFixturePageProps {
  gameSlug: GameSlug;
  fixtures: readonly HarnessFixture[];
  onNavigate: (path: string) => void;
}

export default function GameFixturePage({ gameSlug, fixtures, onNavigate }: GameFixturePageProps) {
  const gameMeta = getGameMeta(gameSlug);
  const mountedSimulatorRoute = findMountedSimulatorRouteForGame(gameSlug);

  const defaultFixture = fixtures[0];

  const fixtureIds = useMemo(() => new Set(fixtures.map((f) => f.id)), [fixtures]);

  const requestedFixtureId = new URLSearchParams(window.location.search).get("fixture");

  const [selectedFixtureId, setSelectedFixtureId] = useState(
    requestedFixtureId && fixtureIds.has(requestedFixtureId)
      ? requestedFixtureId
      : (defaultFixture?.id ?? ""),
  );

  const selectedFixture = useMemo(
    () => fixtures.find((f) => f.id === selectedFixtureId) ?? defaultFixture,
    [fixtures, selectedFixtureId, defaultFixture],
  );

  useEffect(() => {
    document.title = `${selectedFixture?.name ?? gameMeta?.name ?? gameSlug} | Multi-Game Simulator Harness`;
  }, [selectedFixture, gameMeta, gameSlug]);

  const selectFixture = useCallback(
    (fixtureId: string): void => {
      if (!fixtureIds.has(fixtureId) || fixtureId === selectedFixtureId) {
        return;
      }
      setSelectedFixtureId(fixtureId);
      const url = new URL(window.location.href);
      url.searchParams.set("fixture", fixtureId);
      window.history.replaceState(null, "", url);
    },
    [fixtureIds, selectedFixtureId],
  );

  const goBack = () => onNavigate("/");

  return (
    <div className="relative">
      <div className="absolute left-6 top-6 z-10 flex flex-wrap gap-2 max-[900px]:left-4 max-[900px]:top-4">
        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)] shadow-sm transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
          onClick={goBack}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          All games
        </button>
        {mountedSimulatorRoute ? (
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2 text-sm font-semibold text-[var(--muted)] shadow-sm transition-colors hover:bg-[var(--surface-soft)] hover:text-[var(--text)]"
            onClick={() => onNavigate(mountedSimulatorRoute.basename)}
          >
            Simulator
          </button>
        ) : null}
      </div>

      {selectedFixture ? (
        <SimulatorHarness
          fixtures={[...fixtures]}
          activeFixture={selectedFixture}
          onSelectFixture={selectFixture}
        />
      ) : (
        <main className="mx-auto flex min-h-svh w-full max-w-[1200px] items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-[var(--text)]">No fixtures for {gameSlug}</p>
            <button
              type="button"
              className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[var(--game-accent)] px-4 py-2 text-sm font-semibold text-white"
              onClick={goBack}
            >
              Back to index
            </button>
          </div>
        </main>
      )}
    </div>
  );
}
