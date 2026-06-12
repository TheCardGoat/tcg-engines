/**
 * enterBattle — `enumerateCandidates` + `describeProcedure` tests.
 *
 * Covers the attacker-selection hook (legal attackers: active,
 * deploy-turn-exempt link units, not already attacked, no cannot-attack
 * restriction, has at least one legal target) and the two-step procedure
 * hook (attacker → target → auto-submit) together with runtime-ability
 * interactions: `HighManeuver`, `cannot-target-player`, `force-attack-
 * target`, and `grant-attack-target-option`.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import type { PlayerId } from "../../../types/branded.ts";
import type { MoveStepOption } from "../../../types/move-types.ts";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockUnit,
  createMockPilot,
  createMockResource,
  expectFailure,
} from "../../index.ts";
import { enumerateAvailableMovesDetailed, getMoveProcedure } from "../../../index.ts";
import type { GundamG, PendingEffect } from "../../types.ts";

function resources(n: number) {
  return Array.from({ length: n }, () => createMockResource());
}

function rested<T>(card: T): { card: T; exhausted: true } {
  return { card, exhausted: true };
}

function getEnterBattleMove(engine: GundamTestEngine, playerId: string) {
  const runtime = engine.getRuntime() as unknown as {
    state: Parameters<typeof enumerateAvailableMovesDetailed>[0];
    staticResources: Parameters<typeof enumerateAvailableMovesDetailed>[2];
  };
  const moves = enumerateAvailableMovesDetailed(
    runtime.state,
    playerId as PlayerId,
    runtime.staticResources,
  );
  return moves.find((m) => m.moveName === "enterBattle");
}

function procedure(
  engine: GundamTestEngine,
  partial: Record<string, unknown> = {},
  playerId: string = PLAYER_ONE,
): readonly MoveStepOption[] | undefined {
  const runtime = engine.getRuntime() as unknown as {
    state: Parameters<typeof getMoveProcedure>[0];
    staticResources: Parameters<typeof getMoveProcedure>[1];
  };
  return getMoveProcedure(
    runtime.state,
    runtime.staticResources,
    playerId as PlayerId,
    "enterBattle",
    partial,
  );
}

describe("enterBattle.enumerateCandidates", () => {
  it("returns attackers with at least one legal target during main-phase", () => {
    const attacker = createMockUnit({ ap: 2, hp: 3 });
    const enemyRested = createMockUnit({ ap: 1, hp: 2 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(enemyRested)] });

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeDefined();
    expect(move!.requiresCardSelection).toBe(true);
    expect(move!.selectableCardIds).toContain(
      engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0],
    );
  });

  it("drops enterBattle entirely outside main-phase", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create({ play: [attacker] }, {});
    engine.getRuntime().state.ctx.status.phase = "draw-phase";

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeUndefined();
  });

  it("excludes rested (exhausted) attackers", () => {
    const attacker = createMockUnit();
    const enemyRested = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [rested(attacker)] },
      { play: [rested(enemyRested)] },
    );

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    // No legal attacker → move drops out of availableMoves.
    expect(move).toBeUndefined();
  });

  it("excludes a unit that already attacked this turn", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit())] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    (engine.getRuntime().state.G as GundamG).turnMetadata.attackedThisTurn.push(attackerId);

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeUndefined();
  });

  it("excludes a unit deployed this turn that is NOT a link unit", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: resources(2) },
      { play: [rested(createMockUnit())] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.deployUnit(unit);

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeUndefined();
  });

  it("includes a link unit deployed this turn (rule 3-2-6-3)", () => {
    const unit = createMockUnit({ level: 1, cost: 1, linkCondition: "[Amuro Ray]" });
    const pilot = createMockPilot({ name: "Amuro Ray", level: 1, cost: 1 });
    const engine = GundamTestEngine.create(
      { hand: [unit, pilot], resourceArea: resources(5) },
      { play: [rested(createMockUnit())] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    p1.deployUnit(unit);
    p1.assignPilot(pilot, unit);

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeDefined();
    expect(move!.selectableCardIds.length).toBeGreaterThan(0);
  });

  it("includes an attacker even when only enemy targets are active (direct attack remains legal)", () => {
    const attacker = createMockUnit();
    const activeEnemy = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [activeEnemy] }, // active, not rested
    );

    // Enemy unit is active → not a legal unit target. But the attacker can
    // still declare a direct attack on the player (rule 8-1). The defender's
    // only recourse is the <Blocker> keyword in the block step.
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeDefined();
    expect(move!.selectableCardIds).toContain(attackerId);
  });

  it("skips a unit under a cannot-attack restriction", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit())] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const g = engine.getRuntime().state.G as GundamG;
    g.continuousEffects.push({
      id: "ce-cannot-attack",
      sourceId: attackerId,
      targetId: attackerId,
      payload: { kind: "restriction", restriction: "cannot-attack" },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    const move = getEnterBattleMove(engine, PLAYER_ONE);
    expect(move).toBeUndefined();
  });
});

describe("enterBattle.describeProcedure", () => {
  it("returns selectTarget(attacker) when no attackerId is set", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit())] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, {})!;
    expect(steps.length).toBe(1);
    const step = steps[0]!;
    expect(step.kind).toBe("selectTarget");
    if (step.kind === "selectTarget") {
      expect(step.role).toBe("attacker");
      expect(step.candidateIds).toContain(attackerId);
      expect(step.minTargets).toBe(1);
      expect(step.maxTargets).toBe(1);
    }
  });

  it("returns selectTarget(attackTarget) once attackerId is set", () => {
    const attacker = createMockUnit();
    const enemyRested = createMockUnit();
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(enemyRested)] });
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, { attackerId })!;
    expect(steps.length).toBe(1);
    const step = steps[0]!;
    expect(step.kind).toBe("selectTarget");
    if (step.kind === "selectTarget") {
      expect(step.role).toBe("attackTarget");
      expect(step.candidateIds).toContain(enemyId);
      // 'direct' is always a valid target choice (rule 8-1); the defender's
      // <Blocker> option is enforced in the block step, not here.
      expect(step.candidateIds).toContain("direct");
    }
  });

  it("includes 'direct' in candidates when opponent has no units", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create({ play: [attacker] }, {});
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, { attackerId })!;
    const step = steps[0]!;
    expect(step.kind).toBe("selectTarget");
    if (step.kind === "selectTarget") {
      expect(step.candidateIds).toContain("direct");
    }
  });

  it("allows 'direct' even when enemy has units, if attacker has HighManeuver", () => {
    const attacker = createMockUnit({
      keywordEffects: [{ keyword: "HighManeuver" }],
    } as unknown as Parameters<typeof createMockUnit>[0]);
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit())] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, { attackerId })!;
    const step = steps[0]!;
    if (step.kind === "selectTarget") {
      expect(step.candidateIds).toContain("direct");
    }
  });

  it("excludes 'direct' when attacker has cannot-target-player", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create({ play: [attacker] }, {});
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const g = engine.getRuntime().state.G as GundamG;
    g.continuousEffects.push({
      id: "ce-cannot-target-player",
      sourceId: attackerId,
      targetId: attackerId,
      payload: { kind: "restriction", restriction: "cannot-target-player" },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    const steps = procedure(engine, { attackerId })!;
    const step = steps[0]!;
    if (step.kind === "selectTarget") {
      expect(step.candidateIds).not.toContain("direct");
    }
  });

  it("restricts target set when a force-attack-target effect is active", () => {
    const attacker = createMockUnit();
    const enemyA = createMockUnit({ traits: ["earth federation"] });
    const enemyB = createMockUnit({ traits: ["zeon"] });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(enemyA), rested(enemyB)] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const p2Field = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");
    const enemyAId = p2Field.find((id) => id.includes(`_${enemyA.cardNumber}_`))!;
    const enemyBId = p2Field.find((id) => id.includes(`_${enemyB.cardNumber}_`))!;
    const g = engine.getRuntime().state.G as GundamG;
    g.continuousEffects.push({
      id: "ce-force",
      sourceId: attackerId,
      targetId: attackerId,
      payload: {
        kind: "force-attack-target",
        attackTarget: {
          owner: "opponent",
          attributeFilters: [{ attribute: "trait", comparison: "includes", value: "zeon" }],
        },
      },
      duration: "this-turn",
      createdAtTurn: 1,
    });

    const steps = procedure(engine, { attackerId })!;
    const step = steps[0]!;
    expect(step.kind).toBe("selectTarget");
    if (step.kind === "selectTarget") {
      expect(step.candidateIds).toContain(enemyBId);
      expect(step.candidateIds).not.toContain(enemyAId);
      // Force-attack-target dropouts also exclude the "direct" sentinel
      // (a filter that matches cards can never match the player).
      expect(step.candidateIds).not.toContain("direct");
    }
  });

  it("returns [] once both attackerId and target are set (auto-submit, no confirm gate)", () => {
    const attacker = createMockUnit();
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit())] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    const steps = procedure(engine, { attackerId, target: enemyId })!;
    expect(steps).toEqual([]);
  });
});

describe("enterBattle — pending-effect gate (rule 5-2)", () => {
  const dummyEffect: CardEffect = {
    type: "activated",
    activation: { timing: ["activate:main"] },
    directives: [
      {
        action: {
          action: "rest",
          target: { owner: "opponent", cardType: "unit", count: 1 },
        },
      },
    ],
    sourceText: "Dummy pending effect",
  };

  function seedPending(engine: GundamTestEngine, controllerId: string, sourceCardId: string): void {
    const pending: PendingEffect = {
      id: "pe_test",
      sourceCardId,
      effectIndex: 0,
      kind: "activated",
      controllerId,
      effect: dummyEffect,
    };
    engine.getG().pendingEffects.push(pending);
  }

  it("drops enterBattle from available moves while a pending effect exists", () => {
    const attacker = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit({ ap: 1, hp: 2 }))] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    expect(getEnterBattleMove(engine, PLAYER_ONE)).toBeDefined();

    seedPending(engine, PLAYER_ONE, attackerId);

    expect(getEnterBattleMove(engine, PLAYER_ONE)).toBeUndefined();
  });

  it("rejects a direct enterBattle submission with EFFECT_PENDING", () => {
    const attacker = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit({ ap: 1, hp: 2 }))] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    seedPending(engine, PLAYER_ONE, attackerId);

    expectFailure(engine.asPlayer(PLAYER_ONE).enterBattle(attackerId, enemyId), "EFFECT_PENDING");
  });

  it("keeps resolveEffect available while a pending effect exists", () => {
    const attacker = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(createMockUnit({ ap: 1, hp: 2 }))] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;

    seedPending(engine, PLAYER_ONE, attackerId);

    const runtime = engine.getRuntime() as unknown as {
      state: Parameters<typeof enumerateAvailableMovesDetailed>[0];
      staticResources: Parameters<typeof enumerateAvailableMovesDetailed>[2];
    };
    const moves = enumerateAvailableMovesDetailed(
      runtime.state,
      PLAYER_ONE as PlayerId,
      runtime.staticResources,
    );
    expect(moves.some((m) => m.moveName === "resolveEffect")).toBe(true);
  });
});
