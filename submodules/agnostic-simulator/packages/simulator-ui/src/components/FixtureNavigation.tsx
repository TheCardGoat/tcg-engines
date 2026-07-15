import type { HarnessFixture } from "@tcg/simulator-contract";

import { cx } from "../class-names";

interface FixtureNavigationProps {
  fixtures: HarnessFixture[];
  activeFixture: HarnessFixture;
  onSelectFixture: (fixtureId: string) => void;
}

export function FixtureNavigation({
  fixtures,
  activeFixture,
  onSelectFixture,
}: FixtureNavigationProps) {
  return (
    <nav className="fixture-navigation grid gap-2" aria-label="Fixture navigation">
      {fixtures.map((fixture) => (
        <button
          key={fixture.id}
          className={cx(
            "grid gap-1 rounded-lg border p-3 text-left transition-colors",
            fixture.id === activeFixture.id
              ? "border-[var(--game-accent)] bg-[var(--game-accent)]/10"
              : "border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-soft)]",
          )}
          onClick={() => onSelectFixture(fixture.id)}
          aria-current={fixture.id === activeFixture.id ? "page" : undefined}
          data-testid={`fixture-button:${fixture.id}`}
          data-fixture-id={fixture.id}
        >
          <span className="text-xs font-black text-[var(--text)]">{fixture.name}</span>
          <span className="text-[11px] font-bold text-[var(--muted)]">{fixture.summary}</span>
        </button>
      ))}
    </nav>
  );
}
