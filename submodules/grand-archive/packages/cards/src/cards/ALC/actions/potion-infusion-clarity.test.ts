import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";
import { potionInfusionClarity } from "./potion-infusion-clarity.ts";

/** @covers 300z2snsdw-a1 */
describe("Potion Infusion: Clarity — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: potionInfusionClarity, discount: 2 });
});

/** @covers 300z2snsdw-a2 */
describe("Potion Infusion: Clarity — temporary sacrifice trigger", () => {
  it("rests a Potion and makes its sacrifice draw two cards before turn end", () => {
    const champion = createClassBonusTestChampion(
      potionInfusionClarity,
      true,
      "activation-discount",
    );
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [potionInfusionClarity, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
          field: [potionOfHealing, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const potion = player.card(potionOfHealing, { zone: "field" });
    const nonPotion = player.card(woodlandSquirrels, { zone: "field" });
    const reservePayment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((card) => ({ kind: "card" as const, cardId: card.objectId }));
    const before = game.state;
    expect(() =>
      player.activate(potionInfusionClarity, {
        reservePayment,
        targets: { "target-1": [nonPotion.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(potionInfusionClarity, {
      reservePayment,
      targets: { "target-1": [potion.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[potion.objectId]!.states.has("rested")).toBe(true);

    const deck = player.zone("main-deck");
    player.activateAbility(potion, "qtb31x97n2-a2");
    expect(game.state.objects[potion.objectId]!.zone).toBe("graveyard");
    passEffectsStack(game);
    expect(player.zone("hand")).toEqual(deck.slice(0, 2));
    expect(player.zone("main-deck")).toEqual(deck.slice(2));
  });
});
