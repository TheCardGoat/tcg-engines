/**
 * Dev-only visual fixture routes (one-piece pattern): an index of engine-built
 * board states and a per-fixture render page. Interactive shells are left off;
 * these pages are for visual/storybook parity and POM-free DOM inspection.
 */

import { Link, useParams } from "react-router-dom";

import { NarutoBoard } from "../board/NarutoBoard.tsx";
import {
  NARUTO_FIXTURE_GROUPS,
  NARUTO_FIXTURES,
  getNarutoFixture,
  type NarutoFixtureId,
} from "../stories/fixtures.ts";
import classes from "./pages.module.css";

const NARUTO_SIMULATOR_BASE_PATH = "/naruto/simulator";

export function NarutoFixtureIndexPage() {
  if (!import.meta.env.DEV) {
    return <NarutoFixtureNotFound />;
  }

  return (
    <main className={classes.page} data-testid="naruto-fixture-index">
      <header className={classes.header}>
        <p>Dev only - Naruto visual fixtures</p>
        <h1>Pick a board state</h1>
      </header>

      {NARUTO_FIXTURE_GROUPS.map((group) => {
        const fixtures = NARUTO_FIXTURES.filter((fixture) => fixture.group === group.id);
        if (fixtures.length === 0) {
          return null;
        }

        return (
          <section key={group.id} className={classes.group}>
            <h2>{group.label}</h2>
            <ul>
              {fixtures.map((fixture) => (
                <li key={fixture.id}>
                  <Link to={`${NARUTO_SIMULATOR_BASE_PATH}/tests/${fixture.id}`}>
                    <span>{fixture.label}</span>
                    <code>
                      {NARUTO_SIMULATOR_BASE_PATH}/tests/{fixture.id}
                    </code>
                    <p>{fixture.description}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </main>
  );
}

export function NarutoFixturePage() {
  const params = useParams<{ fixtureId: string }>();
  const fixture = getNarutoFixture(params.fixtureId ?? "");

  if (!import.meta.env.DEV || !fixture) {
    return <NarutoFixtureNotFound />;
  }

  return (
    <NarutoBoard
      state={fixture.state}
      viewer={fixture.viewer}
      interactive={false}
      forceMobile={fixture.mobile ?? false}
      onAction={() => undefined}
    />
  );
}

export function NarutoFixtureNotFound() {
  return (
    <main className={classes.page} data-testid="naruto-fixture-not-found">
      <header className={classes.header}>
        <h1>404</h1>
        <p>Fixture not found.</p>
        <Link to={`${NARUTO_SIMULATOR_BASE_PATH}/tests`}>Back to fixtures</Link>
      </header>
    </main>
  );
}

export type { NarutoFixtureId };
