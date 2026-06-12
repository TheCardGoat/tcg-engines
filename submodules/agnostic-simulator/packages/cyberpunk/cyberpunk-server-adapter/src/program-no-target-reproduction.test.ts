import { describe, expect, test } from "vite-plus/test";
import {
  AIPlayer,
  CyberpunkTestEngine,
  LocalEngine,
  P1,
  P2,
  createTestMatchState,
  createMockUnit,
  firstLegalStrategy,
  greedyStrategy,
  type ActiveEffect,
  type AvailableMove,
  type CardRef,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import {
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaIndustrialAssembly,
  alphaRebootOptics,
  spoilerAfterpartyAtLizzieS,
  spoilerCarnageAtTheColosseum,
  spoilerCyberpsychosis,
  spoilerPeaceOffering,
} from "@tcg/cyberpunk-cards";
import { CyberpunkServerEngine } from "./cyberpunk-server-engine.ts";

const PROGRAM_HEAVY_HAND = [
  alphaCorporateSurveillance,
  alphaFloorIt,
  alphaIndustrialAssembly,
  alphaRebootOptics,
  spoilerAfterpartyAtLizzieS,
  spoilerCarnageAtTheColosseum,
  spoilerCyberpsychosis,
  spoilerPeaceOffering,
] satisfies CardRef[];

function createProgramHeavyNoTargetFixture(): CyberpunkTestEngine {
  return CyberpunkTestEngine.createWithFixture(
    {
      field: [],
      gigArea: [],
    },
    {
      hand: PROGRAM_HEAVY_HAND,
      field: [],
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      eddies: 12,
    },
    {
      activePlayerId: P2,
      seed: "program-heavy-no-target-engine-repro",
    },
  );
}

function createProgramHeavyNoTargetState(): MatchState {
  return createTestMatchState(
    {
      field: [],
      gigArea: [],
    },
    {
      hand: PROGRAM_HEAVY_HAND,
      field: [],
      gigArea: [{ dieType: "d4", faceValue: 1 }],
      eddies: 12,
    },
    {
      activePlayerId: P2,
      seed: "program-heavy-no-target-server-adapter-repro",
    },
  );
}

function createUnsafeDefaultAttackState(): MatchState {
  const attacker = createMockUnit({ id: "adapter-default-attacker", power: 2 });
  const defender = createMockUnit({ id: "adapter-default-defender", power: 5 });
  const engine = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: attacker, spent: false, playedThisTurn: true }] },
    { field: [{ card: defender, spent: true }] },
    { seed: "adapter-default-unsafe-attack" },
  );
  engine.passPhase();

  const attackerId = engine.findCardId(attacker, "field", P1);
  const effect: ActiveEffect = {
    id: "adapter-default-unit-only",
    sourceCardId: attackerId,
    targetCardId: attackerId,
    kind: "grantRule",
    rule: "canAttackOnPlayedTurnAgainstUnits",
    duration: "turn",
    origin: "imperative",
    abilityIndex: 0,
  };
  engine.judgeAddActiveEffect(effect, { as: P1 });

  return engine.getState();
}

function getPlayCardCandidates(engine: CyberpunkTestEngine): string[] {
  const playCard = engine
    .getPrompt(P2)
    .availableMoves.find((move): move is AvailableMove & { moveId: "playCard" } => {
      return move.moveId === "playCard";
    });
  expect(playCard).toBeDefined();
  expect(playCard!.inputSpec.type).toBe("playCard");
  if (playCard!.inputSpec.type !== "playCard") return [];
  return playCard!.inputSpec.candidates.map((candidate) => candidate.cardId);
}

function expectProgramInZone(
  engine: CyberpunkTestEngine,
  zone: "hand" | "trash",
  cardId: string,
): void {
  expect(engine.getCardsInZone(zone, P2).some((card) => card.definitionId === cardId)).toBe(true);
}

describe("engine strategy program-heavy no-target bot reproduction", () => {
  test("firstLegalStrategy selects an affordable Program with no target and discards it", () => {
    const engine = createProgramHeavyNoTargetFixture();
    const candidateIds = getPlayCardCandidates(engine);

    expect(candidateIds).toHaveLength(PROGRAM_HEAVY_HAND.length);
    expect(candidateIds.map((id) => engine.getState().G.cardIndex[id]!.definitionId)).toContain(
      alphaCorporateSurveillance.id,
    );

    const bot = new AIPlayer(engine.getLocalEngine(), P2, firstLegalStrategy, {
      rngSeed: "program-heavy-first-legal",
    });
    const result = bot.step();

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.result.success).toBe(true);
    if (!result.result.success) return;
    expect(result.decision).toMatchObject({
      kind: "command",
      move: "playCard",
    });

    expectProgramInZone(engine, "trash", alphaCorporateSurveillance.id);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      result.result.moveLogs.some(
        (log) => log.type === "action" && log.messageKey === "trigger.noValidTargets",
      ),
    ).toBe(true);
  });

  test("greedyStrategy selects the highest-cost no-target Program and discards it", () => {
    const engine = createProgramHeavyNoTargetFixture();
    const candidateIds = getPlayCardCandidates(engine);

    expect(candidateIds.map((id) => engine.getState().G.cardIndex[id]!.definitionId)).toContain(
      spoilerCarnageAtTheColosseum.id,
    );

    const bot = new AIPlayer(engine.getLocalEngine(), P2, greedyStrategy, {
      rngSeed: "program-heavy-greedy",
    });
    const result = bot.step();

    expect(result.kind).toBe("acted");
    if (result.kind !== "acted") return;
    expect(result.result.success).toBe(true);
    if (!result.result.success) return;
    expect(result.decision).toMatchObject({
      kind: "command",
      move: "playCard",
    });

    expectProgramInZone(engine, "trash", spoilerCarnageAtTheColosseum.id);
    expectProgramInZone(engine, "hand", alphaCorporateSurveillance.id);
    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(
      result.result.moveLogs.some(
        (log) => log.type === "action" && log.messageKey === "trigger.noValidTargets",
      ),
    ).toBe(true);
  });
});

describe("server adapter automated action strategy dispatch", () => {
  test("takeAutomatedAction uses the requested engine strategy to choose Program args", () => {
    const state = createProgramHeavyNoTargetState();
    const serverEngine = new CyberpunkServerEngine(new LocalEngine(state));
    const prompt = serverEngine.engine.getPrompt(P2);
    const playCard = prompt.availableMoves.find((move) => move.moveId === "playCard");

    expect(playCard?.inputSpec.type).toBe("playCard");
    if (!playCard || playCard.inputSpec.type !== "playCard") return;
    expect(playCard.inputSpec.candidates).toHaveLength(PROGRAM_HEAVY_HAND.length);
    expect(
      playCard.inputSpec.candidates.map(
        (candidate) => serverEngine.engine.getState().G.cardIndex[candidate.cardId]!.definitionId,
      ),
    ).toContain(alphaCorporateSurveillance.id);

    const result = serverEngine.takeAutomatedAction(
      { strategyId: "greedy" },
      { gameId: "program-heavy-no-target", sourceAuthority: "server" },
    );

    expect(result.finalResult.success).toBe(true);
    if (!result.finalResult.success) return;
    expect(result.finalResult.acceptedMoveRecord?.moveId).toBe("playCard");
    expect(result.selectedCandidate?.family).toBe("playCard");
    expect(
      serverEngine
        .getRawState()
        .G.players[P2 as string]!.zones.trash.some(
          (cardId) =>
            serverEngine.getRawState().G.cardIndex[cardId as string]?.definitionId ===
            spoilerCarnageAtTheColosseum.id,
        ),
    ).toBe(true);
  });

  test("missing strategyId resolves to the default strategy and avoids losing Unit fights", () => {
    const serverEngine = new CyberpunkServerEngine(
      new LocalEngine(createUnsafeDefaultAttackState()),
    );

    const result = serverEngine.takeAutomatedAction(
      {},
      { gameId: "default-unsafe-attack", sourceAuthority: "server" },
    );

    expect(result.finalResult.success).toBe(true);
    if (!result.finalResult.success) return;
    // Under Beta rules callLegend costs 1 €$, so the bot calls a legend
    // rather than passing or attacking into a losing fight.
    expect(result.finalResult.acceptedMoveRecord?.moveId).toBe("callLegend");
    expect(result.selectedCandidate?.family).toBe("callLegend");
  });
});
