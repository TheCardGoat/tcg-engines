import { ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

import {
  GUNDAM_FIXTURE_GROUPS,
  GUNDAM_FIXTURE_SCENARIOS,
  type GundamFixtureGroup,
  type GundamFixtureStartPoint,
} from "../../game/fixtures/scenarios.ts";

const ALL_GROUPS = "all";
const FIXTURE_GROUP_ORDER: readonly GundamFixtureGroup[] = [
  "ST10 · Release review",
  "GD05 · Release review",
  "ST10 · Generation Pulse",
  ...GUNDAM_FIXTURE_GROUPS.filter(
    (group) =>
      group !== "ST10 · Release review" &&
      group !== "GD05 · Release review" &&
      group !== "ST10 · Generation Pulse",
  ),
];

export function FixtureCatalog({ fixtureRoot }: { readonly fixtureRoot: string }) {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<GundamFixtureGroup | typeof ALL_GROUPS>(ALL_GROUPS);

  const visibleFixtures = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();

    return GUNDAM_FIXTURE_SCENARIOS.filter((fixture) => {
      if (group !== ALL_GROUPS && fixture.group !== group) return false;
      if (!normalizedQuery) return true;

      return [
        fixture.label,
        fixture.description,
        fixture.instructions,
        fixture.id,
        fixture.group,
        fixture.startPoint,
        ...(fixture.cards ?? []),
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
    }).toSorted((left, right) => {
      const groupDifference =
        FIXTURE_GROUP_ORDER.indexOf(left.group) - FIXTURE_GROUP_ORDER.indexOf(right.group);
      return groupDifference || left.label.localeCompare(right.label);
    });
  }, [group, query]);

  const handleGroupChange = (value: string) => {
    const fixtureGroup = GUNDAM_FIXTURE_GROUPS.find((candidate) => candidate === value);
    setGroup(fixtureGroup ?? ALL_GROUPS);
  };

  return (
    <section
      aria-labelledby="fixture-catalog-title"
      className="overflow-hidden clip-hud-10 bg-hud-deep text-hud-text shadow-[0_24px_60px_rgba(0,0,0,.24)]"
      data-testid="fixture-catalog"
    >
      <header className="px-5 py-5 sm:px-7 sm:py-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="text-xs font-bold uppercase tracking-hud-label text-[oklch(0.78_0.11_84)]">
              Gundam developer fixture bench
            </div>
            <h1
              id="fixture-catalog-title"
              className="gd-display mt-2 text-3xl font-extrabold leading-tight tracking-hud-body text-hud-text sm:text-4xl"
            >
              Deterministic fixture catalog
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-hud-text-muted">
              One catalog for prepared board states, interaction work, prompts, targeting, bots, and
              regression checks.
            </p>
          </div>
          <div className="text-sm font-bold text-hud-info">
            {GUNDAM_FIXTURE_SCENARIOS.length} fixtures
          </div>
        </div>

        <div className="mt-6 grid gap-2 border-t border-hud-line pt-4 sm:grid-cols-[minmax(0,1fr)_15rem]">
          <label className="relative block">
            <span className="sr-only">Search fixtures</span>
            <Search
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-hud-text-dim"
              aria-hidden="true"
            />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search fixtures, cards, or behavior"
              className="h-10 w-full clip-hud-6 border border-hud-border bg-hud-surface pl-10 pr-3 text-sm text-hud-text outline-none placeholder:text-hud-text-faint hover:border-hud-border-hot focus-visible:ring-2 focus-visible:ring-hud-info"
            />
          </label>
          <label>
            <span className="sr-only">Filter fixtures by group</span>
            <select
              value={group}
              onChange={(event) => handleGroupChange(event.currentTarget.value)}
              className="h-10 w-full clip-hud-6 border border-hud-border bg-hud-surface px-3 text-sm font-bold text-hud-text outline-none hover:border-hud-border-hot focus-visible:ring-2 focus-visible:ring-hud-info"
            >
              <option value={ALL_GROUPS}>All fixture groups</option>
              {FIXTURE_GROUP_ORDER.map((fixtureGroup) => (
                <option key={fixtureGroup} value={fixtureGroup}>
                  {fixtureGroup}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="mt-3 text-xs text-hud-text-dim" aria-live="polite">
          Showing {visibleFixtures.length} of {GUNDAM_FIXTURE_SCENARIOS.length}
        </div>
      </header>

      <ul
        aria-label="Gundam fixtures"
        className="divide-y divide-hud-line border-t border-hud-line"
      >
        {visibleFixtures.map((fixture) => (
          <li key={fixture.id}>
            <Link
              to={`${fixtureRoot}/${encodeURIComponent(fixture.id)}`}
              className="group grid gap-3 px-5 py-4 transition-colors hover:bg-hud-surface-raised focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-hud-info sm:px-7 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:items-start"
            >
              <span className="flex flex-wrap items-center gap-2 md:block">
                <span
                  className={`block text-xs font-bold uppercase tracking-hud-label ${
                    fixture.group === "ST10 · Generation Pulse" ||
                    fixture.group === "ST10 · Release review" ||
                    fixture.group === "GD05 · Release review"
                      ? "text-[oklch(0.78_0.11_84)]"
                      : "text-hud-info"
                  }`}
                >
                  {fixture.group}
                </span>
                <span className="mt-1 block text-xs text-hud-text-dim">
                  {startPointLabel(fixture.startPoint)}
                </span>
              </span>

              <span className="min-w-0">
                <span className="block text-base font-bold leading-5 text-hud-text">
                  {fixture.label}
                </span>
                <span className="mt-1 block text-xs leading-5 text-hud-text-muted">
                  {fixture.description}
                </span>
                <span className="mt-1 block text-xs leading-5 text-hud-text">
                  {fixture.instructions}
                </span>
                <span
                  className="mt-3 flex flex-wrap items-center gap-1.5"
                  aria-label={
                    fixture.cards?.length ? `Cards: ${fixture.cards.join(", ")}` : undefined
                  }
                >
                  {fixture.cards?.map((cardNumber) => (
                    <span
                      key={cardNumber}
                      className="rounded border border-hud-info/25 bg-hud-bg px-1.5 py-0.5 font-mono text-[9px] font-bold text-hud-info"
                    >
                      {cardNumber}
                    </span>
                  ))}
                  <code className="font-mono text-[10px] text-hud-text-faint">{fixture.id}</code>
                </span>
              </span>

              <span className="inline-flex items-center gap-1 text-xs font-bold text-hud-info md:pt-0.5">
                Open fixture
                <ChevronRight
                  className="size-3.5 transition-transform group-hover:translate-x-0.5"
                  aria-hidden="true"
                />
              </span>
            </Link>
          </li>
        ))}

        {visibleFixtures.length === 0 ? (
          <li className="px-5 py-12 text-center sm:px-7">
            <p className="text-sm font-bold text-hud-text">No fixtures match this search.</p>
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setGroup(ALL_GROUPS);
              }}
              className="mt-2 text-sm font-bold text-hud-info hover:text-hud-accent-hot focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hud-info"
            >
              Clear filters
            </button>
          </li>
        ) : null}
      </ul>
    </section>
  );
}

function startPointLabel(startPoint: GundamFixtureStartPoint): string {
  switch (startPoint) {
    case "before-game":
      return "Before game";
    case "main-phase":
      return "Main Phase";
    case "battle":
      return "Battle";
    case "end-phase":
      return "End Phase";
    case "automation":
      return "Automation";
  }
}
