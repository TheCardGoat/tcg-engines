import { useLocation, useParams } from "react-router-dom";
import {
  getStrategyById,
  listScenarios,
  type AISideConfig,
  type AiMode,
  type AiSpeed,
  type ScenarioId,
  type Side,
} from "../engine";
import { BoardSharedPage, type BoardSharedPageProps } from "./BoardShared.page";
import { NotFound } from "./Tests.page";

const VALID_IDS: ReadonlySet<string> = new Set(listScenarios().map((s) => s.id));
const DEFAULT_FIXTURE_STRATEGY_ID = "default";

/**
 * Dev-only route that bootstraps the board with a specific fixture. URL shape:
 * `/tests/<fixtureId>`. Mirrors the lorcana-simulator's `[fixtureId]` route.
 * Returns 404 in production or for unknown fixture ids.
 */
export function TestFixturePage() {
  const params = useParams<{ fixtureId: string }>();
  const location = useLocation();
  const fixtureId = params.fixtureId ?? "";

  if (!import.meta.env.DEV) {
    return <NotFound />;
  }
  if (!VALID_IDS.has(fixtureId)) {
    return <NotFound />;
  }

  const aiOptions = resolveFixtureAiOptions(location.search);

  return (
    <>
      <BoardSharedPage
        scenarioId={fixtureId as ScenarioId}
        initialAi={aiOptions.initialAi}
        initialHumanSide={aiOptions.initialHumanSide}
        initialAiMode={aiOptions.initialAiMode}
        initialAiSpeed={aiOptions.initialAiSpeed}
        autoResolveSingletonCardTargets={false}
      />
    </>
  );
}

export type FixtureAiOptions = Pick<
  BoardSharedPageProps,
  "initialAi" | "initialHumanSide" | "initialAiMode" | "initialAiSpeed"
>;

export function resolveFixtureAiOptions(search: string): FixtureAiOptions {
  const params = new URLSearchParams(search);
  const ai = params.get("ai");
  const strategyId = params.get("botStrategyId") ?? DEFAULT_FIXTURE_STRATEGY_ID;
  const requestedStrategy = getStrategyById(strategyId)?.strategy;
  const fallbackStrategy = getStrategyById(DEFAULT_FIXTURE_STRATEGY_ID)?.strategy ?? null;
  const strategy = requestedStrategy ?? fallbackStrategy;

  if (ai === "off") {
    return {
      initialAi: { player: null, opponent: null },
      initialHumanSide: undefined,
      initialAiMode: readAiMode(params),
      initialAiSpeed: readAiSpeed(params),
    };
  }

  const initialAi = resolveAiSides(ai ?? "opponent", strategy);
  return {
    initialAi,
    initialHumanSide: readHumanSide(ai ?? "opponent"),
    initialAiMode: readAiMode(params),
    initialAiSpeed: readAiSpeed(params),
  };
}

function resolveAiSides(ai: string, strategy: AISideConfig["player"]): AISideConfig {
  if (ai === "both") {
    return { player: strategy, opponent: strategy };
  }
  if (ai === "player") {
    return { player: strategy, opponent: null };
  }
  if (ai === "opponent") {
    return { player: null, opponent: strategy };
  }

  const namedStrategy = getStrategyById(ai)?.strategy;
  if (namedStrategy) {
    return { player: null, opponent: namedStrategy };
  }
  return { player: null, opponent: strategy };
}

function readHumanSide(ai: string): Side | undefined {
  if (ai === "player") {
    return "opponent";
  }
  return undefined;
}

function readAiMode(params: URLSearchParams): AiMode {
  return params.get("ai-mode") === "step" ? "step" : "auto";
}

function readAiSpeed(params: URLSearchParams): AiSpeed {
  const speed = params.get("ai-speed");
  return speed === "fast" || speed === "slow" ? speed : "balanced";
}
