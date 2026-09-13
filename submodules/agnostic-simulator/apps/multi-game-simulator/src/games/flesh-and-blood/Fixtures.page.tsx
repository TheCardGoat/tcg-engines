import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { FAB_FIXTURE_CATALOG, FAB_FIXTURE_GROUPS, type FabFixtureGroupId } from "./fixtures";
import { HeroSpecialPreviewGallery } from "./HeroSpecialPreviewGallery";
import classes from "./FixtureRoutes.module.css";
import "./flesh-and-blood.css";

const FAB_SIMULATOR_BASE = "/flesh-and-blood/simulator";
const ALL_GROUPS = "all" as const;

/**
 * `/tests` catalog only — discovery helper for humans.
 *
 * Opening a fixture navigates to `/tests/:fixtureId`. Engine scenarios mount the
 * same practice/play page players use; focused component labs mount the shipped
 * surface directly with clearly marked mock data.
 */
export function FleshAndBloodFixtureIndexPage() {
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState<FabFixtureGroupId | typeof ALL_GROUPS>(ALL_GROUPS);

  const visible = useMemo(() => {
    const q = query.trim().toLocaleLowerCase();
    return FAB_FIXTURE_CATALOG.filter((fixture) => {
      if (group !== ALL_GROUPS && fixture.group !== group) return false;
      if (!q) return true;
      return [fixture.label, fixture.description, fixture.id, ...fixture.tags].some((value) =>
        value.toLocaleLowerCase().includes(q),
      );
    });
  }, [group, query]);

  return (
    <main className={classes.page} data-testid="fab-fixture-index">
      <header className={classes.header}>
        <p>Flesh &amp; Blood · developer fixture bench</p>
        <h1>Visual fixture catalog</h1>
        <p style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "inherit" }}>
          Engine fixtures boot a <strong>local runtime</strong> on the same practice play surface as
          <code style={{ fontSize: 12 }}>/play/practice</code>. Component labs mount shipped UI with
          clearly marked mock data. No server connection is required.
        </p>
        <p style={{ textTransform: "none", letterSpacing: 0, fontWeight: 500, color: "inherit" }}>
          Filter group <strong>Hero special UI</strong> for Ash / blood debt / chi / soul boards
          (e.g. <code style={{ fontSize: 12 }}>hero-special-dromai</code>). Spec:{" "}
          <code style={{ fontSize: 12 }}>games/flesh-and-blood/hero-special-ui/</code>.
        </p>
        <Link to={FAB_SIMULATOR_BASE} data-testid="fab-fixture-index-hub">
          ← Simulator hub
        </Link>
        <Link to={`${FAB_SIMULATOR_BASE}/play/practice`} data-testid="fab-fixture-index-practice">
          Practice vs bot (live path)
        </Link>
      </header>

      <div className={classes.toolbar}>
        <label>
          <span className="visually-hidden">Search fixtures</span>
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.currentTarget.value)}
            placeholder="Search fixtures, heroes, or combat mode"
            data-testid="fab-fixture-search"
          />
        </label>
        <label>
          <span className="visually-hidden">Filter by group</span>
          <select
            value={group}
            onChange={(event) => {
              const value = event.currentTarget.value;
              const match = FAB_FIXTURE_GROUPS.find((g) => g.id === value);
              setGroup(match?.id ?? ALL_GROUPS);
            }}
            data-testid="fab-fixture-group-filter"
          >
            <option value={ALL_GROUPS}>All groups</option>
            {FAB_FIXTURE_GROUPS.map((entry) => (
              <option key={entry.id} value={entry.id}>
                {entry.label}
              </option>
            ))}
          </select>
        </label>
        <div className={classes.count} data-testid="fab-fixture-count">
          Showing {visible.length} of {FAB_FIXTURE_CATALOG.length}
        </div>
      </div>

      {FAB_FIXTURE_GROUPS.map((groupEntry) => {
        const fixtures = visible.filter((fixture) => fixture.group === groupEntry.id);
        if (fixtures.length === 0) return null;
        return (
          <section
            key={groupEntry.id}
            className={classes.group}
            data-testid={`fab-fixture-group-${groupEntry.id}`}
          >
            <h2>{groupEntry.label}</h2>
            <p style={{ margin: 0, fontSize: 13, color: "rgb(254 242 242 / 60%)" }}>
              {groupEntry.description}
            </p>
            <ul>
              {fixtures.map((fixture) => (
                <li key={fixture.id}>
                  <Link
                    to={`${FAB_SIMULATOR_BASE}/tests/${fixture.id}`}
                    data-testid={`fab-fixture-link-${fixture.id}`}
                  >
                    <span>{fixture.label}</span>
                    <code>
                      {FAB_SIMULATOR_BASE}/tests/{fixture.id}
                    </code>
                    <p>{fixture.description}</p>
                    <div className={classes.meta}>
                      {fixture.tags.map((tag) => (
                        <span key={tag} className={classes.chip}>
                          {tag}
                        </span>
                      ))}
                      <span className={classes.chip}>real play surface</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
      <HeroSpecialPreviewGallery />
    </main>
  );
}
