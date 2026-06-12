import { IconSparkles } from "@tabler/icons-react";
import { useEffect, type CSSProperties } from "react";
import type { HarnessFixture } from "@tcg/simulator-contract";
import { GAMES, groupFixturesByGame } from "../simulator/games";
import { buildMountedHref } from "../router-paths";

export interface GameIndexProps {
  fixtures: readonly HarnessFixture[];
  onNavigate: (path: string) => void;
}

export default function GameIndex({ fixtures, onNavigate }: GameIndexProps) {
  useEffect(() => {
    document.title = "Multi-Game Simulator Harness";
  }, []);

  const grouped = groupFixturesByGame(fixtures);

  return (
    <main className="mx-auto min-h-svh w-full max-w-[1200px] p-6 max-[900px]:p-4">
      <header className="mb-10">
        <p className="text-[12px] font-extrabold uppercase tracking-normal text-[var(--game-accent)]">
          multi-game simulator
        </p>
        <h1 className="mt-2 text-4xl font-extrabold leading-[1.08] tracking-normal text-[var(--text)] max-[900px]:text-[28px]">
          Fixture harness for humans and agents
        </h1>
        <p className="mt-3 max-w-[820px] text-base leading-relaxed text-[var(--muted)]">
          One renderer consumes sample snapshots for One Piece, Gundam, Cyberpunk, and Lorcana.
          Engines stay outside this app; adapters own state projection and move conversion.
        </p>
      </header>

      <section
        className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-4"
        aria-label="Game index"
      >
        <button
          type="button"
          className="group relative flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
          style={
            {
              "--game-accent": "#0f8f83",
              "--game-accent-soft": "#dff8f3",
            } as CSSProperties
          }
          onClick={() => onNavigate(buildMountedHref("/animation-fixtures"))}
        >
          <div
            className="flex h-10 w-10 items-center justify-center rounded-lg"
            style={{ background: "#dff8f3", color: "#0f8f83" }}
          >
            <IconSparkles size={20} />
          </div>
          <div>
            <h2 className="text-lg font-extrabold leading-tight text-[var(--text)]">
              Animation fixtures
            </h2>
            <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
              Draw and zone-transfer motion for shared card and zone primitives.
            </p>
          </div>
          <div className="mt-auto pt-2">
            <span
              className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
              style={{ background: "#dff8f3", color: "#0f8f83" }}
            >
              2 animation fixtures
            </span>
          </div>
        </button>
        {GAMES.map((game) => {
          const count = grouped[game.slug]?.length ?? 0;
          return (
            <button
              key={game.slug}
              type="button"
              className="group relative flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-left shadow-[var(--shadow)] transition-all hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
              style={
                {
                  "--game-accent": game.accentColor,
                  "--game-accent-soft": game.accentSoft,
                } as CSSProperties
              }
              onClick={() => onNavigate(`/${game.slug}`)}
            >
              <div
                className="flex h-10 w-10 items-center justify-center rounded-lg"
                style={{ background: game.accentSoft, color: game.accentColor }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-extrabold leading-tight text-[var(--text)]">
                  {game.name}
                </h2>
                <p className="mt-1 text-sm leading-relaxed text-[var(--muted)]">
                  {game.description}
                </p>
              </div>
              <div className="mt-auto pt-2">
                <span
                  className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold"
                  style={{ background: game.accentSoft, color: game.accentColor }}
                >
                  {count} fixture{count === 1 ? "" : "s"}
                </span>
              </div>
            </button>
          );
        })}
      </section>
    </main>
  );
}
