import { useMemo, useState, type ReactNode } from "react";

import styles from "./TesterHub.module.css";

export type TesterHubCapabilityKind =
  | "practice"
  | "fixtures"
  | "state"
  | "live-match"
  | "replay"
  | "bots"
  | "decks"
  | "tool";

export interface TesterHubCapability {
  readonly id: string;
  readonly kind: TesterHubCapabilityKind;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly requirements?: readonly string[];
  readonly featured?: readonly { title: string; description: string; href: string }[];
}

export interface TesterHubSection {
  readonly id: string;
  readonly title: string;
  readonly description?: string;
  readonly capabilities: readonly TesterHubCapability[];
}

export interface TesterHubFixtureGroup {
  readonly id: string;
  readonly label: string;
  readonly description?: string;
}

export interface TesterHubFixture {
  readonly id: string;
  readonly groupId: string;
  readonly title: string;
  readonly description: string;
  readonly href: string;
  readonly metadata?: readonly string[];
}

export interface TesterHubProps {
  readonly title: string;
  readonly description: string;
  readonly notices?: readonly string[];
  readonly fixtureGroups: readonly TesterHubFixtureGroup[];
  readonly fixtures: readonly TesterHubFixture[];
  readonly sections: readonly TesterHubSection[];
  readonly footer?: ReactNode;
}

const capabilityLabel: Record<TesterHubCapabilityKind, string> = {
  practice: "Local play",
  fixtures: "Fixtures",
  state: "State handoff",
  "live-match": "Live match",
  replay: "Replay",
  bots: "Bots",
  decks: "Deck tools",
  tool: "Tooling",
};

/**
 * A capability-driven route directory for simulator maintainers. Games opt in
 * to their actual testing surfaces; the hub deliberately has no game rules or
 * route assumptions.
 */
export function TesterHub({
  title,
  description,
  notices = [],
  fixtureGroups,
  fixtures,
  sections,
  footer,
}: TesterHubProps) {
  const [query, setQuery] = useState("");
  const [groupId, setGroupId] = useState("all");
  const visibleFixtures = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    return fixtures.filter((fixture) => {
      if (groupId !== "all" && fixture.groupId !== groupId) return false;
      if (!normalizedQuery) return true;
      const group = fixtureGroups.find((candidate) => candidate.id === fixture.groupId);
      return [
        fixture.title,
        fixture.description,
        fixture.id,
        group?.label ?? "",
        ...(fixture.metadata ?? []),
      ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery));
    });
  }, [fixtureGroups, fixtures, groupId, query]);

  return (
    <main className={styles.page} data-testid="tester-hub">
      <header className={styles.header}>
        <div className={styles.identity}>
          <h1>{title}</h1>
          <span>Internal simulator tools</span>
        </div>
        <p className={styles.visuallyHidden}>{description}</p>
        {notices.length > 0 ? (
          <details className={styles.notices}>
            <summary>Notes ({notices.length})</summary>
            <ul aria-label="Testing notices">
              {notices.map((notice) => (
                <li key={notice}>{notice}</li>
              ))}
            </ul>
          </details>
        ) : null}
      </header>

      <section className={styles.fixtureBench} aria-labelledby="tester-hub-fixtures">
        <div className={styles.fixtureToolbar}>
          <div className={styles.fixtureTitle}>
            <h2 id="tester-hub-fixtures">Fixtures</h2>
            <span>{fixtures.length}</span>
          </div>
          <label>
            <span className={styles.visuallyHidden}>Search fixtures</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.currentTarget.value)}
              placeholder="Search fixtures or behavior"
            />
          </label>
          <label>
            <span className={styles.visuallyHidden}>Filter fixtures by group</span>
            <select value={groupId} onChange={(event) => setGroupId(event.currentTarget.value)}>
              <option value="all">All fixture groups</option>
              {fixtureGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.label}
                </option>
              ))}
            </select>
          </label>
          <p className={styles.resultCount} aria-live="polite">
            {visibleFixtures.length} shown
          </p>
        </div>
        <ul className={styles.fixtures} aria-label={`${title} fixtures`}>
          {visibleFixtures.map((fixture) => {
            const group = fixtureGroups.find((candidate) => candidate.id === fixture.groupId);
            return (
              <li key={fixture.id}>
                <a href={fixture.href} data-testid={`tester-hub-fixture-${fixture.id}`}>
                  <span className={styles.fixtureGroup}>{group?.label ?? fixture.groupId}</span>
                  <span className={styles.fixtureCopy}>
                    <strong>{fixture.title}</strong>
                    <span>{fixture.description}</span>
                    {fixture.metadata?.length ? (
                      <span className={styles.fixtureMetadata}>{fixture.metadata.join(" · ")}</span>
                    ) : null}
                  </span>
                  <span className={styles.fixtureAction}>Open fixture</span>
                </a>
              </li>
            );
          })}
          {visibleFixtures.length === 0 ? (
            <li className={styles.empty}>
              <strong>No fixtures match.</strong>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setGroupId("all");
                }}
              >
                Clear filters
              </button>
            </li>
          ) : null}
        </ul>
      </section>

      {sections.map((section) => (
        <section
          key={section.id}
          className={styles.section}
          aria-labelledby={`tester-hub-${section.id}`}
        >
          <div className={styles.sectionHeader}>
            <h2 id={`tester-hub-${section.id}`}>{section.title}</h2>
            {section.description ? <p>{section.description}</p> : null}
          </div>
          <ul className={styles.list}>
            {section.capabilities.map((capability) => (
              <li key={capability.id} className={styles.item}>
                <a
                  href={capability.href}
                  className={styles.capability}
                  data-testid={`tester-hub-${capability.id}`}
                >
                  <span className={styles.kind}>{capabilityLabel[capability.kind]}</span>
                  <strong>{capability.title}</strong>
                  <span>{capability.description}</span>
                  <span className={styles.action}>Open</span>
                </a>
                {capability.requirements?.length ? (
                  <p className={styles.requirements}>
                    Requires: {capability.requirements.join(" · ")}
                  </p>
                ) : null}
                {capability.featured?.length ? (
                  <ul className={styles.featured} aria-label={`${capability.title} highlights`}>
                    {capability.featured.map((entry) => (
                      <li key={entry.href}>
                        <a href={entry.href}>
                          <strong>{entry.title}</strong>
                          <span>{entry.description}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
      {footer ? <footer className={styles.footer}>{footer}</footer> : null}
    </main>
  );
}
