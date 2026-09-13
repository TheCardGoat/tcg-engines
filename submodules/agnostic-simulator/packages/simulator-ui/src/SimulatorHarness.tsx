import type { HarnessFixture } from "@tcg/simulator-contract";

import { BoardLayout } from "./components/BoardLayout";
import { CoreComponentMap } from "./components/CoreComponentMap";
import { FixtureNavigation } from "./components/FixtureNavigation";
import { InteractionPanel, type InteractionPanelProps } from "./components/InteractionPanel";
import { RunbookPanel } from "./components/RunbookPanel";
import { SimulatorViewportShell } from "./components/SimulatorViewportShell";
import { StatusBar } from "./components/StatusBar";

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
  const sidebar = (
    <div className="flex min-h-full flex-col gap-3 p-3">
      <header>
        <p className="text-[11px] font-extrabold uppercase tracking-wide text-[var(--game-accent)]">
          Multi-game simulator
        </p>
        <h1 className="mt-1 text-xl font-extrabold text-[var(--text)]">Fixture harness</h1>
        <p className="mt-1 text-sm text-[var(--muted)]">{activeFixture.summary}</p>
      </header>
      <StatusBar fixture={activeFixture} />
      <FixtureNavigation
        fixtures={fixtures}
        activeFixture={activeFixture}
        onSelectFixture={onSelectFixture}
      />
      <RunbookPanel fixture={activeFixture} />
      <InteractionPanel fixture={activeFixture} onSubmitInteraction={onSubmitInteraction} />
      <CoreComponentMap fixture={activeFixture} />
    </div>
  );

  return (
    <SimulatorViewportShell
      data-game={activeFixture.gameSlug}
      data-theme={theme}
      sidebar={sidebar}
      mobilePanel={sidebar}
      mobileTopRail={({ openSidebar }) => (
        <div className="flex min-h-14 items-center justify-between gap-2 border-b border-[var(--board-border)] bg-[var(--board-surface)] px-2">
          <strong>{activeFixture.gameSlug}</strong>
          <button
            type="button"
            className="min-h-11 rounded-md border border-[var(--board-border)] px-3"
            onClick={openSidebar}
          >
            Fixtures
          </button>
        </div>
      )}
      mobileBottomRail={
        <div className="flex min-h-14 items-center justify-center border-t border-[var(--board-border)] bg-[var(--board-surface)] px-2 text-sm font-semibold">
          {activeFixture.name}
        </div>
      }
      tabletop={<BoardLayout fixture={activeFixture} />}
    />
  );
}
