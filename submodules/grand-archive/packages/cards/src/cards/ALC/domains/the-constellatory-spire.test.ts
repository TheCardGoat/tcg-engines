import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { proveOnEnterDraw } from "../../../testing/on-enter-draw.ts";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { flashFreeze } from "../actions/flash-freeze.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { theConstellatorySpire } from "./the-constellatory-spire.ts";

/** @covers yd609g44vm-a2 */
describe("The Constellatory Spire — entry draw", () => {
  proveOnEnterDraw({
    card: theConstellatorySpire,
    abilityId: "yd609g44vm-a2",
    cost: { kind: "reserve", amount: 3 },
  });
});

/** @covers yd609g44vm-a1 */
describe("the-constellatory-spire — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: theConstellatorySpire, discount: 2 });
});

/** @covers yd609g44vm-a3 */
describe("The Constellatory Spire — negation trigger", () => {
  it("may rest after its controller negates a card activation to deal two damage", () => {
    const baseChampion = createClassBonusTestChampion(
      theConstellatorySpire,
      true,
      "activation-discount",
    );
    if (baseChampion.layout.kind !== "single-faced") throw new Error("Expected champion");
    const champion = {
      ...baseChampion,
      layout: {
        kind: "single-faced" as const,
        face: { ...baseChampion.layout.face, elements: ["ASTRA", "WATER"] as const },
      },
    };
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: {
          field: [theConstellatorySpire],
          hand: [flashFreeze, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { field: [automatedGardener], hand: [woodlandSquirrels] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    opponent.activate(woodlandSquirrels);
    const activation = game.state.stack.at(-1);
    if (activation?.kind !== "card-activation") throw new Error("Expected activation");
    opponent.pass();
    player.activate(flashFreeze, {
      targets: { "target-stack-item": [activation.id] },
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-effect-payment", false);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    const target = opponent.card(automatedGardener);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [target.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[target.objectId]!.damage).toBe(2);
    expect(
      game.state.objects[player.card(theConstellatorySpire).objectId]!.states.has("rested"),
    ).toBe(true);
  });
});
