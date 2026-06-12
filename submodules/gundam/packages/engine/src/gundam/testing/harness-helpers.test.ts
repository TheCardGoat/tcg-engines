/**
 * Tests for the combat / lifecycle harness helpers added to
 * GundamTestEngine: fireShieldBurst, endTurn, resolveCombat.
 *
 * These exercise the helpers against synthetic card definitions so the
 * engine package has coverage independent of the cards package.
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, PilotCard } from "@tcg/gundam-types";

import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO } from "./test-engine.ts";
import { createMockUnit, createMockBase } from "./card-mocks.ts";
import { expectAttackRedirectedTo, markAsLinkUnit } from "./command-test-helpers.ts";
import { asPlayerId } from "../../types/branded.ts";

function makeBurstPilot(cardNumber = "TEST-BURST-PILOT"): PilotCard {
  return {
    cardNumber,
    name: "Test Burst Pilot",
    type: "pilot",
    color: "blue",
    traits: [],
    level: 1,
    cost: 1,
    apBonus: 1,
    hpBonus: 0,
    effect: "【Burst】Add this card to your hand.",
    effects: [
      {
        type: "triggered",
        activation: { timing: ["burst"] },
        directives: [{ action: { action: "addSelfToHand" } }],
        sourceText: "【Burst】Add this card to your hand.",
      },
    ] as CardEffect[],
    keywordEffects: [],
    rarity: "common",
  };
}

describe("GundamTestEngine.fireShieldBurst", () => {
  it("fires a 【Burst】 trigger without a full combat sequence", () => {
    const pilot = makeBurstPilot();
    const engine = GundamTestEngine.create({}, { deck: [pilot] });
    const p2Id = asPlayerId(PLAYER_TWO);

    // Seed the deck card into shieldArea + register with the runtime so
    // framework.cards.getDefinition(shieldId) returns the burst pilot.
    const state = engine.getState();
    const priv = state.ctx.zones.private;
    const deckKey = `deck:${PLAYER_TWO}`;
    const shieldKey = `shieldArea:${PLAYER_TWO}`;
    const deck = priv.zoneCards[deckKey] ?? [];
    const shieldId = deck.shift();
    if (!shieldId) throw new Error("seed setup: deck was empty");
    (priv.zoneCards[shieldKey] ??= []).push(shieldId);
    priv.cardIndex[shieldId]!.zoneKey = shieldKey;
    priv.cardIndex[shieldId]!.index = priv.zoneCards[shieldKey]!.length - 1;
    const pub = state.ctx.zones.public.zoneSummaries;
    pub[deckKey] = { count: deck.length, revision: (pub[deckKey]?.revision ?? 0) + 1 };
    pub[shieldKey] = {
      count: priv.zoneCards[shieldKey]!.length,
      revision: (pub[shieldKey]?.revision ?? 0) + 1,
    };
    engine.getRuntime().registerCardInstance(shieldId, pilot.cardNumber, p2Id);

    engine.fireShieldBurst(shieldId);

    // Burst "addSelfToHand" moves the card into the controller's hand.
    const finalZone = engine.getState().ctx.zones.private.cardIndex[shieldId]?.zoneKey;
    expect(finalZone).toBe(`hand:${PLAYER_TWO}`);
  });

  it("throws when the card is not in a shieldArea", () => {
    const engine = GundamTestEngine.create({ play: [createMockUnit()] });
    const [unitId] = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_ONE),
    });
    expect(() => engine.fireShieldBurst(unitId!)).toThrow(/SHIELD_NOT_IN_AREA/);
  });
});

describe("GundamTestEngine.endTurn", () => {
  it("advances to the next turn and fires <Repair> at end-of-turn", () => {
    const unit = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Repair", value: 2 } as unknown as never],
    });
    const engine = GundamTestEngine.create({ play: [{ card: unit, damage: 3 }] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_ONE),
    })[0]!;

    // Damage was applied pre-turn via the fixture's damage counter —
    // but TestCardEntry.damage lands on `ctx.zones.private.cardMeta`,
    // not `g.damage`. Normalise so Repair has something to heal.
    engine.getG().damage[unitId] = 3;

    engine.endTurn();

    expect(engine.getState().ctx.status.turnPlayer).toBe(PLAYER_TWO);
    // Repair 2 subtracts 2 from damage; 3 - 2 = 1.
    expect(p1.getDamage(unit)).toBe(1);
  });

  it("returns control to main-phase of the next turn", () => {
    const engine = GundamTestEngine.create();
    engine.endTurn();
    expect(engine.getState().ctx.status.phase).toBe("main-phase");
    expect(engine.getState().ctx.status.turnPlayer).toBe(PLAYER_TWO);
  });
});

describe("GundamTestEngine.resolveCombat", () => {
  it("runs a unit-vs-unit fight to completion with simultaneous damage", () => {
    const attacker = createMockUnit({ ap: 3, hp: 4 });
    const defender = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender] });
    const p1Id = asPlayerId(PLAYER_ONE);
    const p2Id = asPlayerId(PLAYER_TWO);
    const attackerId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;
    const defenderId = engine.getCardsInZone({ zone: "battleArea", playerId: p2Id })[0]!;

    // Attacker must be ready. Deploy-turn summoning sickness is
    // sidestepped because the fixture pre-places the unit.
    engine.getG().exhausted[attackerId] = false;

    engine.resolveCombat({ attackerId, target: defenderId });

    // Mutual damage: attacker 2, defender 3 (defender destroyed).
    expect(engine.getG().damage[attackerId]).toBe(2);
    const defenderZone = engine.getState().ctx.zones.private.cardIndex[defenderId]?.zoneKey;
    expect(defenderZone).toBe(`trash:${PLAYER_TWO}`);
  });
});

describe("TestPlayerState.baseSection seeding", () => {
  it("places bases directly into baseSection (skipping deployBase)", () => {
    const base = createMockBase({ hp: 5 });
    const engine = GundamTestEngine.create({ baseSection: [base] }, {});
    const ids = engine.getCardsInZone({ zone: "baseSection", playerId: asPlayerId(PLAYER_ONE) });
    expect(ids).toHaveLength(1);
    expect(engine.getCardsInZone({ zone: "battleArea", playerId: asPlayerId(PLAYER_ONE) })).toEqual(
      [],
    );
  });
});

describe("GundamPlayerActions.activateBaseAbility", () => {
  it("auto-locates the sole activated ability and forwards targets", () => {
    // Base activated ability — rest self, buff AP+1 of one friendly.
    const base = createMockBase({
      effects: [
        {
          type: "activated",
          activation: { timing: ["activate:main"] },
          cost: { restSelf: true },
          directives: [
            {
              action: {
                action: "statModifier",
                stat: "ap",
                amount: 1,
                duration: "thisTurn",
                target: { owner: "friendly", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Activate･Main】Rest this Base: chosen friendly Unit AP+1.",
        },
      ],
    });
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ baseSection: [base], play: [unit] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [baseId] = engine.getCardsInZone({
      zone: "baseSection",
      playerId: asPlayerId(PLAYER_ONE),
    });
    const [unitId] = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_ONE),
    });

    const result = p1.activateBaseAbility(base, { targets: [unitId!] });
    expect(result.success).toBe(true);
    // Cost paid: base rested.
    expect(engine.getG().exhausted[baseId!]).toBe(true);
    // Buff landed on the unit (continuousEffects carries the AP+1).
    expect(
      engine
        .getG()
        .continuousEffects.some(
          (e) =>
            e.targetId === unitId && e.payload.kind === "stat-modifier" && e.payload.stat === "ap",
        ),
    ).toBe(true);
  });

  it("returns NO_ACTIVATED_ABILITY when the base has no activated clauses", () => {
    const base = createMockBase({ effects: [] });
    const engine = GundamTestEngine.create({ baseSection: [base] }, {});
    const p1 = engine.asPlayer(PLAYER_ONE);
    const result = p1.activateBaseAbility(base);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.errorCode).toBe("NO_ACTIVATED_ABILITY");
    }
  });
});

describe("expectAttackRedirectedTo", () => {
  it("passes when a blocker is in place with stage=blocker-declared", () => {
    // Rule 8-3-2 / 13-1-4: a <Blocker> friendly re-targets an attack
    // aimed at another friendly Unit onto itself (recorded on
    // `pendingCombat.blockerId`; the original `target` is preserved).
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const blocker = createMockUnit({
      ap: 2,
      hp: 5,
      keywordEffects: [{ keyword: "Blocker" }],
    });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender, blocker] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = p2.getCardsInZone("battleArea")[0]!;
    const blockerId = p2.getCardsInZone("battleArea")[1]!;

    expect(p1.enterBattle(attackerId, defenderId).success).toBe(true);
    expect(p2.declareBlock(blockerId).success).toBe(true);
    expectAttackRedirectedTo(engine, blockerId);
  });

  it("throws when no blocker is recorded", () => {
    const attacker = createMockUnit({ ap: 3, hp: 5 });
    const defender = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create({ play: [attacker] }, { play: [defender] });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const defenderId = engine.getCardsInZone({
      zone: "battleArea",
      playerId: asPlayerId(PLAYER_TWO),
    })[0]!;
    p1.enterBattle(attackerId, defenderId);

    expect(() => expectAttackRedirectedTo(engine, "some-other-id")).toThrow(/blockerId/);
  });
});

describe("markAsLinkUnit synthetic pilot", () => {
  it("seeds keywordEffects/traits as empty arrays so downstream consumers don't crash", () => {
    const unit = createMockUnit({ ap: 2, hp: 3 });
    const engine = GundamTestEngine.create({ play: [unit] }, {});
    const p1Id = asPlayerId(PLAYER_ONE);
    const unitId = engine.getCardsInZone({ zone: "battleArea", playerId: p1Id })[0]!;

    markAsLinkUnit(engine, unitId);

    const pilotId = engine.getG().pilotAssignments[unitId];
    expect(pilotId).toBeDefined();

    // biome-ignore lint/suspicious/noExplicitAny: test-only access to internal maps
    const staticResources = (engine.getRuntime() as any).staticResources;
    const pilotDef = staticResources.cardsMaps.definitions.get(pilotId!);

    expect(pilotDef?.keywordEffects).toEqual([]);
    expect(pilotDef?.traits).toEqual([]);
    expect(pilotDef?.type).toBe("pilot");
    expect(typeof pilotDef?.name).toBe("string");
  });
});
