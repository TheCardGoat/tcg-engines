import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "./class-bonus-test-champion.ts";
import { passEffectsStack, advanceToMain } from "./decisions.ts";

export function proveVanillaAlly({
  card,
  cost,
  power,
  life,
}: {
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;
  cost: number;
  power: number;
  life: number;
}): void {
  it("pays the printed cost, enters awake, deals printed power, and dies at printed life", () => {
    const champion = createClassBonusTestChampion(card, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [card, ...Array.from({ length: cost }, () => woodlandSquirrels)],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: {
        champion,
        zones: {
          field: Array.from({ length: life }, () => woodlandSquirrels),
          "main-deck": [woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    const payments = p
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
    const before = game.state;
    expect(() => p.activate(card, { reservePayment: payments.slice(1) })).toThrow();
    expect(game.state).toEqual(before);
    p.activate(card, { reservePayment: payments });
    expect(p.cards(card, { zone: "field" })).toHaveLength(0);
    passEffectsStack(game);
    const ally = p.card(card, { zone: "field" });
    p.declareAttack(ally, q.card(champion));
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(power);
    expect(game.state.objects[ally.objectId]!.states.has("rested")).toBe(true);
    advanceToMain(game, q.id);
    const attackers = q.cards(woodlandSquirrels, { zone: "field" });
    for (const [i, attacker] of attackers.entries()) {
      q.declareAttack(attacker, ally);
      game.resolveCombatWithoutRetaliation();
      expect(p.cards(card, { zone: "field" })).toHaveLength(i + 1 < life ? 1 : 0);
    }
    expect(p.cards(card, { zone: "graveyard" })).toHaveLength(1);
  });
}
