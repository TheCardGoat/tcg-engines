import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { scryTheSkies } from "../../DOA/actions/scry-the-skies.ts";
import { dawnsReversal } from "./dawns-reversal.ts";
import { scryTheStars } from "./scry-the-stars.ts";

/** @covers oz23yfzk96-a1 */
describe("Scry the Stars — graveyard alternative cost", () => {
  it("banishes Scry the Skies instead of paying reserve when Class Bonus applies", () => {
    const champion = createClassBonusTestChampion(scryTheStars, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [scryTheStars],
          graveyard: [scryTheSkies],
          "main-deck": Array.from({ length: 3 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const skies = player.card(scryTheSkies, { zone: "graveyard" });
    player.activate(scryTheStars, { costOptionIndex: 1, costSelections: [[skies.objectId]] });
    expect(game.state.objects[skies.objectId]!.zone).toBe("banishment");
    expect(player.cards(scryTheStars, { zone: "effects-stack" })).toHaveLength(1);
  });
});

/** @covers oz23yfzk96-a2 */
describe("Scry the Stars — temporary Starcalling", () => {
  it("lets a looked-at card be starcalled for its reserve cost", () => {
    const champion = createClassBonusTestChampion(scryTheStars, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [scryTheStars, ...Array.from({ length: 7 }, () => woodlandSquirrels)],
          "main-deck": [dawnsReversal, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const target = game.player("player-two").card(champion);
    const payments = player.cards(woodlandSquirrels, { zone: "hand" });
    player.activate(scryTheStars, {
      reservePayment: payments.slice(0, 3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    passEffectsStack(game);
    const glimpse = game.state.decision;
    if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    const called = player.card(dawnsReversal, { zone: "main-deck" });
    answerDecision(game, "resolve-glimpse", {
      kind: "starcall",
      cardId: called.objectId,
      bottom: glimpse.cardIds.filter((id) => id !== called.objectId),
      targets: { "target-1": [target.objectId] },
      reservePayment: payments.slice(3).map((card) => ({ kind: "card", cardId: card.objectId })),
    });
    expect(game.state.objects[called.objectId]!.activationStates.has("starcalled")).toBe(true);
    expect(game.state.objects[called.objectId]!.zone).toBe("effects-stack");
  });
});
