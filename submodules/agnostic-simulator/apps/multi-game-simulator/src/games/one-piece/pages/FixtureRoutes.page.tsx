import { Link, useParams } from "react-router-dom";
import { buildOnePieceBoardFromFixture } from "../data/projectVisualFixture.ts";
import {
  ONE_PIECE_VISUAL_FIXTURE_GROUPS,
  ONE_PIECE_VISUAL_FIXTURES,
  getOnePieceVisualFixture,
  type OnePieceVisualFixtureId,
} from "../data/visualFixtures.ts";
import { OnePieceSimulatorShell } from "../components/OnePieceSimulatorShell.tsx";
import classes from "./FixtureRoutes.module.css";

export function OnePieceFixtureIndexPage() {
  if (!import.meta.env.DEV) {
    return <OnePieceFixtureNotFound />;
  }

  return (
    <main className={classes.page} data-testid="one-piece-fixture-index">
      <header className={classes.header}>
        <p>Dev only · One Piece visual fixtures</p>
        <h1>Pick a board state</h1>
      </header>

      {ONE_PIECE_VISUAL_FIXTURE_GROUPS.map((group) => {
        const fixtures = ONE_PIECE_VISUAL_FIXTURES.filter((fixture) => fixture.group === group.id);
        if (fixtures.length === 0) {
          return null;
        }

        return (
          <section key={group.id} className={classes.group}>
            <h2>{group.label}</h2>
            <ul>
              {fixtures.map((fixture) => (
                <li key={fixture.id}>
                  <Link to={`/tests/${fixture.id}`}>
                    <span>{fixture.label}</span>
                    <code>/tests/{fixture.id}</code>
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

export function OnePieceFixturePage() {
  const params = useParams<{ fixtureId: string }>();
  const fixture = getOnePieceVisualFixture(params.fixtureId ?? "");

  if (!import.meta.env.DEV || !fixture) {
    return <OnePieceFixtureNotFound />;
  }

  return <OnePieceSimulatorShell board={buildOnePieceBoardFromFixture(fixture)} />;
}

export function OnePieceFixtureNotFound() {
  return (
    <main className={classes.page} data-testid="one-piece-fixture-not-found">
      <header className={classes.header}>
        <h1>404</h1>
        <p>Fixture not found.</p>
        <Link to="/tests">Back to fixtures</Link>
      </header>
    </main>
  );
}

export type { OnePieceVisualFixtureId };
