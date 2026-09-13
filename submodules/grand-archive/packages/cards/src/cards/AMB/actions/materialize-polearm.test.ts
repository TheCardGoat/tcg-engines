import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { crescentGlaive } from "../weapons/crescent-glaive.ts";
import { trainingSword } from "../weapons/training-sword.ts";
import { materializePolearm } from "./materialize-polearm.ts";

/** @covers zc7wxgur23-a1 */
describe("Materialize Polearm — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: materializePolearm, discount: 1 });
});

/** @covers zc7wxgur23-a2 */
describe("Materialize Polearm — materialize a Polearm", () => {
  it("materializes a Polearm after paying its costs and rejects a Sword", () => {
    const champion = createClassBonusTestChampion(materializePolearm, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [materializePolearm, ...Array.from({ length: 3 }, () => woodlandSquirrels)],
          "material-deck": [crescentGlaive, trainingSword],
          memory: [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const polearm = player.card(crescentGlaive, { zone: "material-deck" });
    const sword = player.card(trainingSword, { zone: "material-deck" });
    player.activate(materializePolearm, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    const before = game.state;
    expect(() => answerDecision(game, "resolve-effect-choice", [sword.objectId])).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "resolve-effect-choice", [polearm.objectId]);
    answerDecision(game, "announce-effect-materialization", {
      reservePayment: [],
    });
    passEffectsStack(game);
    expect(player.cards(crescentGlaive, { zone: "field" })).toEqual([polearm]);
    expect(player.cards(trainingSword, { zone: "material-deck" })).toEqual([sword]);
  });
});
