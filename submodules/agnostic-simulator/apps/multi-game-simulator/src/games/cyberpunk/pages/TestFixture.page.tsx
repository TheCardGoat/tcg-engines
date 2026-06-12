import { useParams } from "react-router-dom";
import { listScenarios, type ScenarioId } from "../engine";
import { BoardPage } from "./Board.page";
import { NotFound } from "./Tests.page";

const VALID_IDS: ReadonlySet<string> = new Set(listScenarios().map((s) => s.id));

/**
 * Dev-only route that bootstraps the board with a specific fixture. URL shape:
 * `/tests/<fixtureId>`. Mirrors the lorcana-simulator's `[fixtureId]` route.
 * Returns 404 in production or for unknown fixture ids.
 */
export function TestFixturePage() {
  const params = useParams<{ fixtureId: string }>();
  const fixtureId = params.fixtureId ?? "";

  if (!import.meta.env.DEV) {
    return <NotFound />;
  }
  if (!VALID_IDS.has(fixtureId)) {
    return <NotFound />;
  }

  return (
    <>
      <BoardPage scenarioId={fixtureId as ScenarioId} autoResolveSingletonCardTargets={false} />
    </>
  );
}
