/**
 * Battle Phase — Rule compliance tests (Section 8: Attacking and Battles)
 *
 * Tests the battle-phase flow: attack step → block step → action step →
 * damage step → battle end step, then return to main phase.
 *
 * Start with the simplest happy case and progressively add complexity.
 */

import { describe, it, expect } from "vite-plus/test";
import "../../testing/register-matchers.ts";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  expectSuccess,
  expectFailure,
  createMockUnit,
  createMockResource,
} from "../../../index.ts";
import type { TestCardEntry } from "../../../index.ts";

function activeResources(count: number): TestCardEntry[] {
  return Array.from({ length: count }, () => ({
    card: createMockResource(),
    exhausted: false,
  }));
}

function rested(card: ReturnType<typeof createMockUnit>): TestCardEntry {
  return { card, exhausted: true };
}

// =============================================================================
// Simplest Happy Case
// =============================================================================

describe("Battle Phase — Simplest happy case", () => {
  it("unit attacks rested enemy unit: mutual damage, no block, no effects, action step skipped", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));

    expect(engine.getState().ctx.status.phase).toBe("battle-phase");

    expect(p1.isExhausted(attacker)).toBe(true);

    expectSuccess(p2.passBlock());

    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");

    expect(p2.getDamage(defenderId)).toBe(3);
    expect(p1.getDamage(attacker)).toBe(2);
  });

  it("attacker is added to attackedThisTurn after entering battle", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));

    expect(engine.getG().turnMetadata.attackedThisTurn).toContain(attackerId);
  });

  it("pendingCombat is cleared after battle returns to main phase", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getG().turnMetadata.pendingCombat).toBeUndefined();
  });

  it("player can enter battle again after first battle resolves (multiple attacks per turn)", () => {
    const unit1 = createMockUnit({ ap: 2, hp: 5 });
    const unit2 = createMockUnit({ ap: 1, hp: 5 });
    const enemy = createMockUnit({ ap: 1, hp: 10 });

    const engine = GundamTestEngine.create({ play: [unit1, unit2] }, { play: [rested(enemy)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const enemyId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(unit1, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(p2.getDamage(enemyId)).toBe(2);

    expectSuccess(p1.enterBattle(unit2, enemyId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(p2.getDamage(enemyId)).toBe(3);
  });
});

// =============================================================================
// Validation — enterBattle
// =============================================================================

describe("Battle Phase — enterBattle validation", () => {
  it("cannot enter battle with exhausted unit", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const enemy = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create({ play: [rested(unit)] }, { play: [rested(enemy)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const enemyId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    expectFailure(p1.enterBattle(unit, enemyId));
  });

  it("cannot enter battle with unit deployed this turn (rule 3-2-4)", () => {
    const unit = createMockUnit({ level: 1, cost: 1 });
    const enemy = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create(
      { hand: [unit], resourceArea: activeResources(3) },
      { play: [rested(enemy)] },
    );

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    expectSuccess(p1.deployUnit(unit));

    const enemyId = p2.getCardsInZone("battleArea")[0]!;
    expectFailure(p1.enterBattle(unit, enemyId));
  });

  it("cannot enter battle targeting own unit", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const ownUnit = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create({ play: [unit, ownUnit] }, {});

    const p1 = engine.asPlayer(PLAYER_ONE);
    const ownId = p1.getCardsInZone("battleArea")[1]!;

    expectFailure(p1.enterBattle(unit, ownId));
  });

  it("cannot enter battle when already in battle-phase", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));

    expectFailure(p1.enterBattle(attacker, defenderId));
  });
});

// =============================================================================
// Validation — passBlock
// =============================================================================

describe("Battle Phase — passBlock validation", () => {
  it("attacker cannot pass block (only standby player)", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    expectSuccess(p1.enterBattle(attacker, defenderId));

    expectFailure(p1.passBlock());
  });
});

// =============================================================================
// Damage resolution
// =============================================================================

describe("Battle Phase — Damage resolution", () => {
  it("defending unit is destroyed when damage >= HP", () => {
    const attacker = createMockUnit({ ap: 5, hp: 3 });
    const defender = createMockUnit({ ap: 1, hp: 3 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const trashCards = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO });
    expect(trashCards).toContain(defenderId);
  });

  it("attacking unit is destroyed when counter damage >= HP", () => {
    const attacker = createMockUnit({ ap: 1, hp: 2 });
    const defender = createMockUnit({ ap: 5, hp: 3 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    const trashCards = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE });
    expect(trashCards).toContain(attackerId);
  });

  it("both units destroyed simultaneously when both take fatal damage", () => {
    const attacker = createMockUnit({ ap: 5, hp: 2 });
    const defender = createMockUnit({ ap: 5, hp: 2 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);

    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");

    const p1Trash = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE });
    const p2Trash = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO });
    expect(p1Trash).toContain(attackerId);
    expect(p2Trash).toContain(defenderId);
  });
});

// =============================================================================
// TODO: Complex scenarios (to be implemented incrementally)
// =============================================================================

describe("Battle Phase — TODO: Complex scenarios", () => {
  it.todo("Blocker keyword — standby player declares block with <Blocker> unit");
  it.todo("Direct attack on player — damage to shields/base");
  it.todo("Shield removal on direct attack (no base)");
  it.todo("Base damage on direct attack (base present)");
  it.todo("Burst effect trigger when shield is destroyed");
  it.todo("<Breach> — bonus damage to shield/base after destroying a unit");
  // <High-Maneuver> has its own dedicated describe block below.
  it.todo("<Repair> — heal at end of turn");
  it.todo("Player defeat when no shields/base and direct attack lands");
});

// =============================================================================
// Step-interrupt rules (8-2-4, 8-3-5, 8-4-2)
// =============================================================================

/**
 * Simulate a mid-combat destruction by moving a card out of the battle area
 * into the trash without firing any effects. This mirrors "destroyed or
 * otherwise moved to another location due to some event" from rules 8-2-4,
 * 8-3-5, and 8-4-2 — the engine does not yet have card effects that can
 * produce this outcome during the attack/block/action steps, so we inject it.
 */
function forceToTrash(engine: GundamTestEngine, playerId: string, cardId: string) {
  const state = engine.getState();
  const privateZones = state.ctx.zones.private;
  const publicZones = state.ctx.zones.public as {
    zoneSummaries?: Record<string, { count?: number; revision?: number }>;
  };
  const cardIndex = privateZones.cardIndex;
  const zoneCards = privateZones.zoneCards;
  const entry = cardIndex[cardId];
  if (!entry) return;

  const syncSummary = (zoneKey: string) => {
    const summary = publicZones.zoneSummaries?.[zoneKey];
    if (!summary) return;
    summary.count = zoneCards[zoneKey]?.length ?? 0;
    summary.revision = (summary.revision ?? 0) + 1;
  };

  const oldKey = entry.zoneKey;
  const trashKey = `trash:${playerId}`;
  const oldCards = zoneCards[oldKey];
  if (oldCards) {
    const idx = oldCards.indexOf(cardId);
    if (idx >= 0) {
      oldCards.splice(idx, 1);
      // Reindex remaining cards so cardIndex[*].index stays consistent.
      for (let i = idx; i < oldCards.length; i++) {
        const remaining = cardIndex[oldCards[i]!];
        if (remaining) remaining.index = i;
      }
      syncSummary(oldKey);
    }
  }

  const trashCards = zoneCards[trashKey] ?? (zoneCards[trashKey] = []);
  trashCards.push(cardId);
  entry.zoneKey = trashKey;
  entry.index = trashCards.length - 1;
  syncSummary(trashKey);
}

describe("Battle Phase — step-interrupt rules (8-2-4, 8-3-5, 8-4-2)", () => {
  it("8-3-5: attacker destroyed during block step → no damage, return to main-phase", () => {
    const attacker = createMockUnit({ ap: 5, hp: 3 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expect(engine.getState().ctx.status.step).toBe("block-step");

    // Simulate the attacker being destroyed/moved during the block step.
    forceToTrash(engine, PLAYER_ONE, attackerId);

    // passBlock flips stage; flow advances block → action-step, whose onEnter
    // must detect broken combat and jump to battle-end-step.
    expectSuccess(p2.passBlock());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(p2.getDamage(defenderId)).toBe(0);
    expect(engine.getG().turnMetadata.pendingCombat).toBeUndefined();
  });

  it("8-3-5: target destroyed during block step → no damage, return to main-phase", () => {
    const attacker = createMockUnit({ ap: 5, hp: 3 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    forceToTrash(engine, PLAYER_TWO, defenderId);

    expectSuccess(p2.passBlock());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(p1.getDamage(attackerId)).toBe(0);
  });

  it("8-4-2: attacker destroyed during action step → no damage, return to main-phase", () => {
    const attacker = createMockUnit({ ap: 5, hp: 3 });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });

    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expect(engine.getState().ctx.status.step).toBe("action-step");

    // Simulate destruction during action step (e.g. via a command effect).
    forceToTrash(engine, PLAYER_ONE, attackerId);

    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(p2.getDamage(defenderId)).toBe(0);
    expect(engine.getG().turnMetadata.pendingCombat).toBeUndefined();
  });
});

// =============================================================================
// 【Attack】 triggers (rule 8-2-2)
// =============================================================================

describe("Battle Phase — 【Attack】 triggers fire in attack step (rule 8-2-2)", () => {
  it("attacker's own 【Attack】 effect fires on declareAttack", () => {
    const attackTriggerDraw: CardEffect = {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Attack】 Draw 1.",
    };
    const attacker = createMockUnit({ ap: 2, hp: 5, effects: [attackTriggerDraw] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [attacker], deck: 5 },
      { play: [rested(defender)] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE });
    expectSuccess(p1.enterBattle(attacker, defenderId));

    // Attacker's 【Attack】 trigger fired → deck decreased by 1.
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_ONE })).toBe(deckBefore - 1);
  });

  it("【Attack】 stat-modifier with thisBattle duration boosts damage in damage-step", () => {
    const attackApBoost: CardEffect = {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [
        {
          action: {
            action: "statModifier",
            stat: "ap",
            amount: 3,
            duration: "thisBattle",
            target: { owner: "self" },
          },
        },
      ],
      sourceText: "【Attack】 This unit gets AP+3 during this battle.",
    };
    const attacker = createMockUnit({ ap: 2, hp: 5, effects: [attackApBoost] });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Base 2 + buff 3 = 5 AP → defender (HP 5) destroyed.
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(defenderId);
    // Rule 8-6-1: this-battle buff cleared.
    expect(engine.getG().continuousEffects.some((e) => e.duration === "this-battle")).toBe(false);
  });

  it("8-2-4: 【Attack】 trigger destroys target → battle-phase skipped, no mutual damage", () => {
    const attackKillsTarget: CardEffect = {
      type: "triggered",
      activation: { timing: ["attack"] },
      directives: [
        {
          action: {
            action: "dealDamage",
            amount: 99,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ],
      sourceText: "【Attack】 Deal 99 damage to an enemy unit.",
    };
    // High-AP attacker (would normally die from mutual damage if battle proceeds).
    const attacker = createMockUnit({ ap: 10, hp: 1, effects: [attackKillsTarget] });
    const defender = createMockUnit({ ap: 10, hp: 3 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));

    // Target was destroyed by the 【Attack】 trigger → rule 8-2-4 skips
    // block/action/damage steps, battle-phase never entered.
    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(defenderId);
    // Attacker did NOT take counter-damage (damage-step skipped).
    expect(p1.getDamage(attackerId)).toBe(0);
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).not.toContain(
      attackerId,
    );
  });
});

// =============================================================================
// "During this battle" duration (8-2-3, 8-6-1)
// =============================================================================

/**
 * Inject a "this-battle" stat modifier onto a card, mirroring what an
 * 【Attack】 trigger granting AP+N "during this battle" would produce.
 * Bypasses the effect handlers because no current test card emits one yet.
 */
function pushThisBattleApBuff(
  engine: GundamTestEngine,
  sourceId: string,
  targetId: string,
  amount: number,
) {
  const g = engine.getG();
  g.continuousEffects.push({
    id: `test_thisBattleAp_${targetId}`,
    sourceId,
    targetId,
    payload: { kind: "stat-modifier", stat: "ap", modifier: amount },
    duration: "this-battle",
    createdAtTurn: engine.getState().ctx.status.turn,
  });
}

describe("Battle Phase — 'during this battle' duration (8-2-3, 8-6-1)", () => {
  it("this-battle AP buff is effective in damage-step and cleared at battle-end", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    // Attack step complete, now in block-step. Simulate an 【Attack】 trigger
    // that granted the attacker AP+3 "during this battle".
    pushThisBattleApBuff(engine, attackerId, attackerId, 3);

    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Attacker AP is base 2 + buff 3 = 5 → defender (HP 5) destroyed.
    const p2Trash = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO });
    expect(p2Trash).toContain(defenderId);

    // Rule 8-6-1: the buff is cleared when the battle ends.
    expect(engine.getG().continuousEffects.some((e) => e.duration === "this-battle")).toBe(false);
  });

  it("this-battle effect does not persist into a second battle same turn", () => {
    const attacker = createMockUnit({ ap: 2, hp: 10 });
    const first = createMockUnit({ ap: 1, hp: 2 });
    const second = createMockUnit({ ap: 1, hp: 4 });

    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(first), rested(second)] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const firstId = p2.getCardsInZone("battleArea")[0]!;
    const secondId = p2.getCardsInZone("battleArea")[1]!;

    // First battle — grant AP+5 "during this battle".
    expectSuccess(p1.enterBattle(attacker, firstId));
    pushThisBattleApBuff(engine, attackerId, attackerId, 5);
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(firstId);

    // Ready the attacker for another attack (simulating Repeat/Ready effect).
    engine.getG().exhausted[attackerId] = false;
    engine.getG().turnMetadata.attackedThisTurn = [];
    const meta = engine.getState().ctx.zones.private.cardMeta[attackerId];
    if (meta) meta.exhausted = false;

    // Second battle — no buff applied. Attacker AP is base 2, second has HP 4:
    // defender should survive (damage = 2, not enough to defeat).
    expectSuccess(p1.enterBattle(attacker, secondId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).not.toContain(secondId);
    expect(p2.getDamage(secondId)).toBe(2);
  });

  it("this-battle effects are also cleared when combat is aborted mid-step", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    pushThisBattleApBuff(engine, attackerId, attackerId, 3);

    // Combat breaks mid-block-step.
    forceToTrash(engine, PLAYER_ONE, attackerId);
    expectSuccess(p2.passBlock());

    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(engine.getG().continuousEffects.some((e) => e.duration === "this-battle")).toBe(false);
  });
});

// =============================================================================
// <Suppression> keyword (rules 13-1-7)
// =============================================================================

/**
 * Move the top `count` cards from the defender's deck into their shield area.
 * Bypasses mulligan setup; used to construct controlled shield configurations
 * for direct-attack tests.
 */
function seedShieldsFromDeck(engine: GundamTestEngine, playerId: string, count: number): string[] {
  const state = engine.getState();
  const privateZones = state.ctx.zones.private;
  const publicZones = state.ctx.zones.public as {
    zoneSummaries?: Record<string, { count?: number; revision?: number }>;
  };
  const deckKey = `deck:${playerId}`;
  const shieldKey = `shieldArea:${playerId}`;
  const deck = privateZones.zoneCards[deckKey] ?? [];
  const shields = privateZones.zoneCards[shieldKey] ?? (privateZones.zoneCards[shieldKey] = []);
  const moved: string[] = [];

  for (let i = 0; i < count; i++) {
    const cardId = deck.shift();
    if (!cardId) break;
    shields.push(cardId);
    const entry = privateZones.cardIndex[cardId];
    if (entry) {
      entry.zoneKey = shieldKey;
      entry.index = shields.length - 1;
    }
    moved.push(cardId);
  }
  // Reindex deck.
  for (let i = 0; i < deck.length; i++) {
    const e = privateZones.cardIndex[deck[i]!];
    if (e) e.index = i;
  }
  // Sync summaries where present.
  const syncSummary = (key: string, len: number) => {
    const s = publicZones.zoneSummaries?.[key];
    if (s) {
      s.count = len;
      s.revision = (s.revision ?? 0) + 1;
    } else if (publicZones.zoneSummaries) {
      publicZones.zoneSummaries[key] = { count: len, revision: 1 };
    }
  };
  syncSummary(deckKey, deck.length);
  syncSummary(shieldKey, shields.length);
  return moved;
}

describe("Battle Phase — <Suppression> (rules 13-1-7)", () => {
  it("13-1-7-3: Suppression with a single enemy shield removes only that shield (no player defeat)", () => {
    // Attacker has Suppression; defender has 1 shield, 0 battle-area units, 0 base.
    const attacker = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const shieldCard = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [shieldCard] });
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_TWO, 1);

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Shield moved to trash.
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(shieldIds[0]);
    // Shield area now empty.
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_TWO })).toHaveLength(0);
    // Rule 13-1-7-3 fix: game must NOT end just because Suppression's second
    // target was absent.
    expect(engine.getState().ctx.status.gameEnded).toBeFalsy();
  });

  it("13-1-7-1: Suppression with multiple enemy shields removes exactly two (top-to-bottom)", () => {
    const attacker = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const s1 = createMockUnit({ ap: 1, hp: 1 });
    const s2 = createMockUnit({ ap: 1, hp: 1 });
    const s3 = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { deck: [s1, s2, s3] });
    const shieldIds = seedShieldsFromDeck(engine, PLAYER_TWO, 3);

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expectSuccess(p1.passBattleAction());

    const trash = engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO });
    expect(trash).toContain(shieldIds[0]);
    expect(trash).toContain(shieldIds[1]);
    expect(trash).not.toContain(shieldIds[2]);
    expect(engine.getCardsInZone({ zone: "shieldArea", playerId: PLAYER_TWO })).toEqual([
      shieldIds[2],
    ]);
    expect(engine.getState().ctx.status.gameEnded).toBeFalsy();
  });

  it("13-1-7-4: Suppression fires Burst effects for both destroyed shields", () => {
    const burstDraw: CardEffect = {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "draw", count: 1 } }],
      sourceText: "【Burst】 Draw 1.",
    };
    const attacker = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Suppression" }],
    });
    const shield1 = createMockUnit({ ap: 1, hp: 1, effects: [burstDraw] });
    const shield2 = createMockUnit({ ap: 1, hp: 1, effects: [burstDraw] });
    // Extra cards in deck so Burst's Draw has cards to pull.
    const filler1 = createMockUnit({ ap: 1, hp: 1 });
    const filler2 = createMockUnit({ ap: 1, hp: 1 });
    const filler3 = createMockUnit({ ap: 1, hp: 1 });

    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { deck: [shield1, shield2, filler1, filler2, filler3] },
    );
    seedShieldsFromDeck(engine, PLAYER_TWO, 2);
    const deckBefore = engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO });

    const p1 = engine.asPlayer(PLAYER_ONE);
    expectSuccess(p1.enterBattle(attacker, "direct"));
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBlock());
    expectSuccess(engine.asPlayer(PLAYER_TWO).passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Both Burst effects fired → deck decreased by 2 (one per Burst draw).
    expect(engine.getCardCount({ zone: "deck", playerId: PLAYER_TWO })).toBe(deckBefore - 2);
  });
});

// =============================================================================
// Self-block rejection (rule 8-3-3)
// =============================================================================

describe("Battle Phase — 8-3-3: targeted unit cannot block itself", () => {
  it("rejects declareBlock when blockerId equals the attack target", () => {
    // Defender has Blocker so canBlock passes; the self-target is the
    // only reason the validation should reject this block.
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));

    // Defender tries to use its own Blocker to "re-target" the incoming
    // attack onto itself — forbidden by rule 8-3-3.
    expectFailure(p2.declareBlock(defenderId), "BLOCKER_IS_TARGET");
  });

  it("allows a different friendly unit with Blocker to intercept", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });
    const guardian = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const guardianId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    // Guardian (not the target) blocking the attack is legal.
    expectSuccess(p2.declareBlock(guardianId));
  });

  it("8-4-1: after declareBlock, both players get to act in the action step", () => {
    // Rule 8-4-1: action step takes turns starting with the standby
    // player. declareBlock must not leave pendingDecision stuck on just
    // [standby] (which would end the step after one pass, skipping the
    // attacker's action window).
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 2, hp: 5 });
    const guardian = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const guardianId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(guardianId));

    // In action-step; standby (p2) first per rule 8-4-1.
    expect(engine.getState().ctx.status.step).toBe("action-step");
    expect(engine.getState().ctx.status.pendingDecision).toEqual([PLAYER_TWO, PLAYER_ONE]);

    expectSuccess(p2.passBattleAction());
    // Attacker must still be in the queue.
    expect(engine.getState().ctx.status.pendingDecision).toEqual([PLAYER_ONE]);

    expectSuccess(p1.passBattleAction());
    // Both passed → flow advances through damage-step to main-phase.
    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    // Blocked combat resolved: guardian took 3 damage (attacker AP), attacker took 2 (guardian AP).
    expect(p2.getDamage(guardianId)).toBe(3);
    expect(p1.getDamage(attackerId)).toBe(2);
  });
});

// =============================================================================
// <First Strike> in unblocked unit-vs-unit combat (rule 13-1-5-2)
// =============================================================================

describe("Battle Phase — <First Strike> unblocked unit vs unit (rule 13-1-5-2)", () => {
  it("attacker FS kills target → attacker receives no counter-damage", () => {
    const attacker = createMockUnit({
      ap: 3,
      hp: 2,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });
    // Target HP 3 → attacker AP 3 is lethal. Target AP 5 would KO attacker if
    // counter-damage were dealt (attacker HP 2), but FS must prevent it.
    const defender = createMockUnit({ ap: 5, hp: 3 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Defender destroyed by attacker's FS damage.
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(defenderId);
    // Attacker took no counter-damage.
    expect(p1.getDamage(attackerId)).toBe(0);
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).not.toContain(
      attackerId,
    );
  });

  it("attacker FS without lethal damage → both units exchange damage normally", () => {
    // Target HP 5, attacker AP 3 → not lethal. Target still deals counter.
    const attacker = createMockUnit({
      ap: 3,
      hp: 5,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });
    const defender = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Target not destroyed (HP 5 > 3), attacker took defender's AP 2.
    expect(p1.getDamage(attackerId)).toBe(2);
    expect(p2.getDamage(defenderId)).toBe(3);
  });

  it("target FS kills attacker → target receives no counter-damage", () => {
    // Attacker HP 2, target AP 3 (FS) → attacker dies first. Attacker AP 5
    // would KO target without FS.
    const attacker = createMockUnit({ ap: 5, hp: 2 });
    const defender = createMockUnit({
      ap: 3,
      hp: 5,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).toContain(attackerId);
    // Target took no counter-damage.
    expect(p2.getDamage(defenderId)).toBe(0);
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).not.toContain(
      defenderId,
    );
  });

  it("both sides have FS → simultaneous mutual damage (no precedence)", () => {
    const attacker = createMockUnit({
      ap: 5,
      hp: 2,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });
    const defender = createMockUnit({
      ap: 5,
      hp: 2,
      keywordEffects: [{ keyword: "FirstStrike" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(defender)] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    // Both destroyed (rule 8-5-3-2-3 — simultaneous destruction).
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_ONE })).toContain(attackerId);
    expect(engine.getCardsInZone({ zone: "trash", playerId: PLAYER_TWO })).toContain(defenderId);
  });
});

// =============================================================================
// <High-Maneuver> (rule 13-1-6) — attacker cannot be blocked.
// =============================================================================

describe("Battle Phase — <High-Maneuver> (rule 13-1-6)", () => {
  it("rejects declareBlock when attacker has <High-Maneuver>", () => {
    const attacker = createMockUnit({
      ap: 3,
      hp: 5,
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const defender = createMockUnit({ ap: 2, hp: 5 });
    const blocker = createMockUnit({
      ap: 2,
      hp: 3,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create(
      { play: [attacker] },
      { play: [rested(defender), blocker] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attacker, defenderId));
    expectFailure(p2.declareBlock(blockerId), "CANNOT_BLOCK_HIGH_MANEUVER");
  });

  it("allows direct attack even when opponent has units in play", () => {
    const attacker = createMockUnit({
      ap: 3,
      hp: 5,
      keywordEffects: [{ keyword: "HighManeuver" }],
    });
    const bystander = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [rested(bystander)] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    // Direct attack must be accepted even though p2 has a unit in play.
    expectSuccess(p1.enterBattle(attacker, "direct"));
    expect(engine.getState().ctx.status.phase).toBe("battle-phase");
  });
});

// =============================================================================
// Direct attacks against the player are always a valid target choice
// (rule 8-1: valid targets are the opposing player or a rested enemy unit).
// The defender's only recourse is the <Blocker> keyword in the block step.
// =============================================================================

describe("Battle Phase — direct attack target legality (rule 8-1)", () => {
  it("allows a direct attack on the player when opponent has only active units", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const bystander = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [bystander] });
    const p1 = engine.asPlayer(PLAYER_ONE);

    expectSuccess(p1.enterBattle(attacker, "direct"));
    expect(engine.getState().ctx.status.phase).toBe("battle-phase");
  });

  it("allows opponent to redirect a direct attack via <Blocker>", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const guardian = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const guardianId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.enterBattle(attacker, "direct"));
    // The defender uses <Blocker> to convert the direct attack into a unit fight.
    expectSuccess(p2.declareBlock(guardianId));
  });
});

// =============================================================================
// <Blocker> keyword required on the blocker (rule 13-1-4)
// =============================================================================

describe("Battle Phase — <Blocker> keyword required on the blocker (rule 13-1-4)", () => {
  it("rejects declareBlock when the blocker lacks <Blocker> (unit-vs-unit attack)", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    // Guardian is a plain unit — no <Blocker> keyword.
    const guardian = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const guardianId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    // A unit without <Blocker> must not be allowed to intercept the attack.
    expectFailure(p2.declareBlock(guardianId), "MISSING_BLOCKER_KEYWORD");
  });

  it("allows a unit with <Blocker> to intercept a unit-vs-unit attack", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const guardian = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const guardianId = p2.getCardsInZone("battleArea")[1]!;

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(guardianId));
  });

  it("allows a unit with a continuous <Blocker> grant to intercept an attack", () => {
    const attacker = createMockUnit({ ap: 2, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    // Guardian has NO base <Blocker>; keyword will be granted via a
    // continuous effect (e.g. "While X, this unit gains <Blocker>").
    const guardian = createMockUnit({ ap: 2, hp: 5 });

    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, guardian] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const guardianId = p2.getCardsInZone("battleArea")[1]!;

    // Inject a keyword-grant continuous effect. hasKeyword aggregates
    // grants from G.continuousEffects, so this should make the guardian
    // eligible to block.
    const g = engine.getG();
    g.continuousEffects.push({
      id: `test_grantBlocker_${guardianId}`,
      sourceId: guardianId,
      targetId: guardianId,
      payload: { kind: "keyword-grant", keyword: "Blocker" },
      duration: "permanent",
      createdAtTurn: engine.getState().ctx.status.turn,
    });

    expectSuccess(p1.enterBattle(attackerId, defenderId));
    expectSuccess(p2.declareBlock(guardianId));
  });
});
