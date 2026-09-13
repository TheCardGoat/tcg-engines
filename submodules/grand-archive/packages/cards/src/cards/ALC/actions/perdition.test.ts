import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { perdition } from "./perdition.ts";

/** @covers nlf619svrr-a1 */
describe("perdition — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: perdition, discount: 2 });
});

/** @covers nlf619svrr-a2 */
describe("Perdition — opposing allies and granted death damage", () => {
  it("damages only the target opponent's allies, then their dying ally damages their units", () => {
    const champion = createClassBonusTestChampion(perdition, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [perdition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          field: [giantTortoise],
        },
      },
      playerTwo: {
        champion,
        zones: { field: [woodlandSquirrels, giantTortoise] },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const ownChampion = player.card(champion, { zone: "field" });
    const ownAlly = player.card(giantTortoise, { zone: "field" });
    const opposingChampion = opponent.card(champion, { zone: "field" });
    const opposingSquirrel = opponent.card(woodlandSquirrels, { zone: "field" });
    const opposingTortoise = opponent.card(giantTortoise, { zone: "field" });

    player.activate(perdition, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      targets: { "target-opponent": [opponent.id] },
    });
    passEffectsStack(game);

    expect(game.state.objects[opposingSquirrel.objectId]!.zone).toBe("graveyard");
    expect(game.state.objects[opposingTortoise.objectId]!.damage).toBe(2);
    expect(game.state.objects[opposingChampion.objectId]!.damage).toBe(1);
    expect(game.state.objects[ownChampion.objectId]!.damage).toBe(0);
    expect(game.state.objects[ownAlly.objectId]!.damage).toBe(0);
  });
});
