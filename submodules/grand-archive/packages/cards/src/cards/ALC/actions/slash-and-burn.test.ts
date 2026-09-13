import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { blightroot } from "../tokens/blightroot.ts";
import { fraysia } from "../tokens/fraysia.ts";
import { manaroot } from "../tokens/manaroot.ts";
import { razorvine } from "../tokens/razorvine.ts";
import { silvershine } from "../tokens/silvershine.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { slashAndBurn } from "./slash-and-burn.ts";

/** @covers o0nkly21ee-a1 */
describe("slash-and-burn — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: slashAndBurn, discount: 1 });
});

/** @covers o0nkly21ee-a2 */
describe("Slash and Burn — Gather for committed Fire banishments", () => {
  it("gathers once plus once for each of three selected Fire cards", () => {
    const champion = createClassBonusTestChampion(slashAndBurn, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      randomSeed: 1,
      definitions: [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf],
      playerOne: {
        champion,
        zones: {
          hand: [slashAndBurn, woodlandSquirrels],
          graveyard: [slashAndBurn, slashAndBurn, slashAndBurn, woodlandSquirrels],
        },
      },
      playerTwo: { champion, zones: { graveyard: [slashAndBurn] } },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const payment = player.card(woodlandSquirrels, { zone: "hand" });
    const fireCards = player.cards(slashAndBurn, { zone: "graveyard" });

    player.activate(slashAndBurn, {
      reservePayment: [{ kind: "card", cardId: payment.objectId }],
    });
    passEffectsStack(game);
    expect(
      player.zone("field").filter((card) => game.state.objects[card.objectId]?.isToken),
    ).toHaveLength(1);
    answerDecision(game, "resolve-optional-effect", true);

    for (const invalid of [
      [player.card(woodlandSquirrels, { zone: "graveyard" }).objectId],
      [opponent.card(slashAndBurn, { zone: "graveyard" }).objectId],
      [...fireCards.map((card) => card.objectId), payment.objectId],
    ]) {
      const before = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
      expect(game.state).toEqual(before);
    }
    answerDecision(
      game,
      "resolve-effect-choice",
      fireCards.map((card) => card.objectId),
    );
    passEffectsStack(game);

    expect(player.cards(slashAndBurn, { zone: "banishment" })).toEqual(fireCards);
    expect(
      player.zone("field").filter((card) => game.state.objects[card.objectId]?.isToken),
    ).toHaveLength(4);
  });

  it("may decline the extra banishment after the initial Gather", () => {
    const champion = createClassBonusTestChampion(slashAndBurn, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      randomSeed: 1,
      definitions: [blightroot, fraysia, manaroot, razorvine, silvershine, springleaf],
      playerOne: {
        champion,
        zones: { hand: [slashAndBurn, woodlandSquirrels], graveyard: [slashAndBurn] },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(slashAndBurn, {
      reservePayment: [
        { kind: "card", cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
      ],
    });
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);

    expect(player.cards(slashAndBurn, { zone: "banishment" })).toHaveLength(0);
    expect(
      player.zone("field").filter((card) => game.state.objects[card.objectId]?.isToken),
    ).toHaveLength(1);
  });
});
