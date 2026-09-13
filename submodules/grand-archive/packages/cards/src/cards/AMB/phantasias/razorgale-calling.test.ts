import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tailwindsBlessing } from "./tailwinds-blessing.ts";
import { razorgaleCalling } from "./razorgale-calling.ts";

/** @covers 1m48260b7b-a1 */
describe("Razorgale Calling — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: razorgaleCalling, discount: 2 });
});

/** @covers 1m48260b7b-a2 */
describe("Razorgale Calling — wind activations", () => {
  it("deals 1 to a champion when a later wind card is activated, not a norm card", () => {
    const { starter } = classBonusLeveledChampion(razorgaleCalling, true, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [
            razorgaleCalling,
            tailwindsBlessing,
            woodlandSquirrels,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two").card(starter, { zone: "field" });
    player.activate(razorgaleCalling, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    player.activate(tailwindsBlessing, {
      reservePayment: [
        { kind: "card", cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
      ],
    });
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [opponent.objectId] },
      });
    }
    expect(
      game.state.stack.some(
        (item) => item.kind === "triggered-ability" && item.ability.id === "1m48260b7b-a2",
      ) || game.state.decision?.kind === "announce-triggered-ability",
    ).toBe(true);
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [opponent.objectId] },
      });
    }
    player.pass();
    game.player("player-two").pass();
    const wait = game.waitState();
    if (wait.kind === "decision") {
      player.executeLegal(
        (candidate) =>
          candidate.command.move === "answer-decision" &&
          typeof candidate.command.answer === "object" &&
          candidate.command.answer !== null &&
          "target-1" in (candidate.command.answer as object),
        "target the opposing champion",
      );
    }
    passEffectsStack(game);
    expect(game.state.objects[opponent.objectId]!.damage).toBe(1);
  });
});
