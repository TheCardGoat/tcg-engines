import type { HarnessFixture } from "@tcg/simulator-contract";

import { BoardLayout } from "./components/BoardLayout";
import { CoreComponentMap } from "./components/CoreComponentMap";
import { FixtureNavigation } from "./components/FixtureNavigation";
import { InteractionPanel } from "./components/InteractionPanel";
import { MobileShell } from "./components/MobileShell";
import { RunbookPanel } from "./components/RunbookPanel";
import { StatusBar } from "./components/StatusBar";
import type { InteractionPanelProps } from "./components/InteractionPanel";

export interface SimulatorHarnessProps {
  fixtures: HarnessFixture[];
  activeFixture: HarnessFixture;
  onSelectFixture: (fixtureId: string) => void;
  onSubmitInteraction?: InteractionPanelProps["onSubmitInteraction"];
  theme?: "dark" | "light";
}

export function SimulatorHarness({
  fixtures,
  activeFixture,
  onSelectFixture,
  onSubmitInteraction,
  theme = "dark",
}: SimulatorHarnessProps) {
  const eyebrowClass =
    "eyebrow text-[12px] font-extrabold leading-tight tracking-normal text-[var(--game-accent)] uppercase";
  const shellClass =
    "simulator-shell mx-auto min-h-svh w-full max-w-[1600px] overflow-x-hidden p-6 max-[900px]:max-w-[100vw] max-[900px]:p-3";

  return (
    <main className={shellClass} data-game={activeFixture.gameSlug} data-theme={theme}>
      <header className="app-header grid grid-cols-[minmax(0,1fr)_auto] items-end gap-6 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-6 shadow-[var(--shadow)] max-[900px]:grid-cols-1 max-[520px]:p-3.5">
        <div className="title-block min-w-0 max-w-[900px]">
          <p className={eyebrowClass}>multi-game simulator</p>
          <h1 className="mt-2 break-words text-4xl font-extrabold leading-[1.08] tracking-normal text-[var(--text)] max-[900px]:text-[28px] max-[520px]:text-2xl">
            Fixture harness for humans and agents
          </h1>
          <p className="mt-3 max-w-[820px] text-base leading-relaxed text-[var(--muted)] max-[520px]:max-w-[32ch]">
            One renderer consumes sample snapshots for One Piece, Gundam, Cyberpunk, and Lorcana.
            Engines stay outside this app; adapters own state projection and move conversion.
          </p>
        </div>
        <StatusBar fixture={activeFixture} />
      </header>

      <section
        className="fixture-section mt-4 grid grid-cols-[minmax(280px,440px)_minmax(0,1fr)] gap-4 max-[900px]:grid-cols-1"
        aria-label="Fixture selector"
      >
        <FixtureNavigation
          fixtures={fixtures}
          activeFixture={activeFixture}
          onSelectFixture={onSelectFixture}
        />
        <article className="fixture-summary min-w-0 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-[18px] max-[520px]:p-3.5">
          <p className={eyebrowClass}>selected fixture</p>
          <h2 className="mt-1.5 break-words text-[22px] font-extrabold leading-tight tracking-normal text-[var(--text)]">
            {activeFixture.name}
          </h2>
          <p className="mt-2.5 leading-relaxed text-[var(--muted)]">{activeFixture.summary}</p>
          <p className="mt-2.5 border-t border-[var(--border)] pt-3 font-semibold leading-relaxed text-[var(--text)]">
            {activeFixture.adapterGoal}
          </p>
        </article>
      </section>

      <section className="workspace-grid mt-4" aria-label="Simulator workspace">
        <MobileShell
          hasLog={Boolean(activeFixture.eventLog && activeFixture.eventLog.length > 0)}
          sidebar={<RunbookPanel fixture={activeFixture} />}
          board={<BoardLayout fixture={activeFixture} />}
          interactions={
            <InteractionPanel fixture={activeFixture} onSubmitInteraction={onSubmitInteraction} />
          }
          log={
            activeFixture.eventLog && activeFixture.eventLog.length > 0 ? (
              <div className="p-3 text-xs text-[var(--board-muted)]">Event log placeholder</div>
            ) : null
          }
        />
      </section>

      <CoreComponentMap fixture={activeFixture} />
    </main>
  );
}
