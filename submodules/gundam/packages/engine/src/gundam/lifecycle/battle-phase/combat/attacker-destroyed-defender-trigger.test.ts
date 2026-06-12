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
import { GundamTestEngine, PLAYER_ONE, PLAYER_TWO, createMockUnit } from "../../../../index.ts";

const probeUnit: UnitCard = {
  cardNumber: "TEST-PROBE-01",
  name: "Probe Attacker",
  type: "unit",
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
});
