import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { rocketJump } from "./rocket-jump.ts";

/** @covers rhlq2kkvoq-a1 */
describe("rocket-jump — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: rocketJump, discount: 2 });
});

/** @covers rhlq2kkvoq-a2 */
describe("Rocket Jump — distant target and defending retaliation", () => {
  it("makes the defending unit distant and deals four damage to only its attacker", () => {
    const champion = createClassBonusTestChampion(rocketJump, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [giantTortoise, potionOfHealing],
          hand: [rocketJump, giantTortoise, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const defender = player.card(giantTortoise, { zone: "field" });
    const attacker = opponent.card(automatedGardener, { zone: "field" });
    opponent.declareAttack(attacker, defender);
    opponent.pass();
    const payment = player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
      kind: "card" as const,
      cardId: card.objectId,
    }));
    for (const invalid of [
      player.card(potionOfHealing, { zone: "field" }),
      player.card(giantTortoise, { zone: "hand" }),
    ]) {
      const before = game.state;
      expect(() =>
        player.activate(rocketJump, {
          reservePayment: payment,
          targets: { "target-1": [invalid.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
    }
    player.activate(rocketJump, {
      reservePayment: payment,
      targets: { "target-1": [defender.objectId] },
    });
    expect(game.state.objects[defender.objectId]!.states.has("distant")).toBe(false);
    expect(game.state.objects[attacker.objectId]!.damage).toBe(0);
    passEffectsStack(game);

    expect(game.state.objects[defender.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[attacker.objectId]?.zone).toBe("graveyard");
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[defender.objectId]!.damage).toBe(0);
  });

  it("does not deal damage when the target is not defending", () => {
    const champion = createClassBonusTestChampion(rocketJump, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [giantTortoise],
          hand: [rocketJump, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener] } },
    });
    const player = game.player("player-one");
    const target = player.card(giantTortoise, { zone: "field" });
    const unrelated = game.player("player-two").card(automatedGardener, { zone: "field" });
    player.activate(rocketJump, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card",
        cardId: card.objectId,
      })),
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
    expect(game.state.objects[unrelated.objectId]!.damage).toBe(0);
  });
});
