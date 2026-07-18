/**
 * `attackerDestroyedDefender` event / `onDestroyByBattle` timing.
 *
 * Card text like "when this Unit destroys an enemy Unit with battle
 * damage, deal 1 damage to all enemy Units" (Gundam Kyrios GD03-022,
 * Heavyarms Custom GD03-029) keys on this attacker-side event. The
 * trigger fires only on battle-damage destruction — effect-damage kills
 * deliberately don't fire it (see card text "with battle damage").
 */

import { describe, it, expect } from "vite-plus/test";
import type { CardEffect, UnitCard } from "@tcg/gundam-types";
import {
  activeResources,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockPilot,
  createMockUnit,
  expectSuccess,
} from "../../../../index.ts";

const probeUnit: UnitCard = {
  cardNumber: "TEST-PROBE-01",
  name: "Probe Attacker",
  type: "unit",
  canonicalId: "mock",
  slug: "mock",
  printings: [],
  color: "blue",
  traits: ["test"],
  level: 3,
  cost: 2,
  ap: 5,
  hp: 5,
  effect:
    "When this Unit destroys an enemy Unit with battle damage, deal 1 damage to all enemy Units.",
  effects: [
    {
      type: "triggered",
      activation: { timing: ["onDestroyByBattle"] },
      directives: [
        {
          action: {
            action: "dealDamageAll",
            amount: 1,
            target: { owner: "opponent", cardType: "unit" },
          },
        },
      ],
      sourceText: "test probe",
    },
  ] as CardEffect[],
  keywordEffects: [],
  rarity: "common",
};

const drawForDefeatingPairedNewtype: CardEffect = {
  type: "triggered",
  activation: {
    timing: ["onDestroyByBattle"],
    conditions: [
      {
        type: "eventDefeatedCardMatches",
        target: {
          owner: "opponent",
          cardType: "unit",
          attributeFilters: [
            { attribute: "pairedPilotTrait", comparison: "includes", value: "newtype" },
          ],
        },
      },
    ],
  },
  directives: [{ action: { action: "draw", count: 1 } }],
  sourceText:
    "When this Unit destroys an enemy Unit paired with a (Newtype) Pilot with battle damage, draw 1.",
};

function defeatUnitPairedWithPilot(defenderPilotTraits: string[]) {
  const attacker = createMockUnit({ name: "Pilot-host attacker", ap: 5, hp: 5 });
  const attackerPilot = createMockPilot({
    name: "Battle observer Pilot",
    level: 0,
    cost: 0,
    effects: [drawForDefeatingPairedNewtype],
  });
  const defender = createMockUnit({ name: "Paired defender", ap: 1, hp: 1 });
  const defenderPilot = createMockPilot({
    name: "Defender Pilot",
    traits: defenderPilotTraits,
    level: 0,
    cost: 0,
  });
  const engine = GundamTestEngine.create(
    {
      hand: [attackerPilot],
      play: [attacker],
      resourceArea: activeResources(1),
      deck: 5,
    },
    {
      hand: [defenderPilot],
      play: [{ card: defender, exhausted: true }],
      resourceArea: activeResources(1),
      deck: 5,
    },
    { initialActivePlayer: PLAYER_TWO },
  );
  const p1 = engine.asPlayer(PLAYER_ONE);
  const p2 = engine.asPlayer(PLAYER_TWO);
  const attackerId = p1.getCardsInZone("battleArea")[0]!;
  const defenderId = p2.getCardsInZone("battleArea")[0]!;

  expectSuccess(p2.assignPilot(defenderPilot, defenderId));
  expectSuccess(p2.passPhase());
  expectSuccess(p1.passActionStep());
  expectSuccess(p2.passActionStep());
  expectSuccess(p1.assignPilot(attackerPilot, attackerId));
  const deckCountBeforeBattle = p1.getCardsInZone("deck").length;
  const handCountBeforeBattle = p1.getHand().length;
  expectSuccess(p1.enterBattle(attackerId, defenderId));
  expectSuccess(p2.passBlock());
  expectSuccess(p2.passBattleAction());
  expectSuccess(p1.passBattleAction());

  return { p1, p2, defenderId, deckCountBeforeBattle, handCountBeforeBattle };
}

describe("onDestroyByBattle (attackerDestroyedDefender event)", () => {
  it("fires on the attacker when its battle damage destroys the defender", () => {
    const fragile = createMockUnit({ ap: 1, hp: 1 });
    const witness = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [probeUnit] },
      { play: [{ card: fragile, exhausted: true }, witness] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const [defenderId, witnessId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.resolveCombat({ attackerId, target: defenderId! });

    // Witness took the trigger's 1 damage.
    expect(engine.getG().damage[witnessId!]).toBe(1);
  });

  it("does NOT fire when the defender survives (hp > damage taken)", () => {
    const sturdy = createMockUnit({ ap: 1, hp: 9 });
    const witness = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create(
      { play: [probeUnit] },
      { play: [{ card: sturdy, exhausted: true }, witness] },
    );
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const [defenderId, witnessId] = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea");

    engine.resolveCombat({ attackerId, target: defenderId! });

    expect(engine.getG().damage[witnessId!] ?? 0).toBe(0);
  });

  it("does NOT fire on direct attacks (target is 'direct', no defender unit)", () => {
    const witness = createMockUnit({ ap: 1, hp: 5 });

    const engine = GundamTestEngine.create({ play: [probeUnit] }, { play: [witness], deck: 5 });
    const attackerId = engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0]!;
    const witnessId = engine.asPlayer(PLAYER_TWO).getCardsInZone("battleArea")[0]!;

    // Direct attack — defender side has shields/no base, the attack goes
    // through to shields. No unit-vs-unit destruction → no event.
    engine.resolveCombat({ attackerId, target: "direct" });

    expect(engine.getG().damage[witnessId] ?? 0).toBe(0);
  });

  it("fires when the attacker and defender destroy each other simultaneously", () => {
    const mutualAttacker = { ...probeUnit, hp: 1 };
    const fragile = createMockUnit({ ap: 1, hp: 1 });
    const witness = createMockUnit({ ap: 1, hp: 5 });
    const engine = GundamTestEngine.create(
      { play: [mutualAttacker] },
      { play: [{ card: fragile, exhausted: true }, witness] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const attackerId = p1.getCardsInZone("battleArea")[0]!;
    const [defenderId, witnessId] = p2.getCardsInZone("battleArea");

    expectSuccess(p1.enterBattle(attackerId, defenderId!));
    expectSuccess(p2.passBlock());
    expectSuccess(p2.passBattleAction());
    expectSuccess(p1.passBattleAction());

    expect(p1.getCardZone(attackerId)).toBe(`trash:${PLAYER_ONE}`);
    expect(p2.getCardZone(defenderId!)).toBe(`trash:${PLAYER_TWO}`);
    expect(p2.getDamage(witnessId!)).toBe(1);
  });

  it("lets a paired Pilot observe that the defeated Unit had a qualifying Pilot", () => {
    const { p1, p2, defenderId, deckCountBeforeBattle, handCountBeforeBattle } =
      defeatUnitPairedWithPilot(["newtype"]);

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckCountBeforeBattle - 1);
    expect(p1.getHand()).toHaveLength(handCountBeforeBattle + 1);
  });

  it("does not fire when the defeated Unit's paired Pilot lacks the qualification", () => {
    const { p1, p2, defenderId, deckCountBeforeBattle, handCountBeforeBattle } =
      defeatUnitPairedWithPilot(["coordinator"]);

    expect(p2.getCardsInZone("trash")).toContain(defenderId);
    expect(p1.getCardsInZone("deck")).toHaveLength(deckCountBeforeBattle);
    expect(p1.getHand()).toHaveLength(handCountBeforeBattle);
  });
});
