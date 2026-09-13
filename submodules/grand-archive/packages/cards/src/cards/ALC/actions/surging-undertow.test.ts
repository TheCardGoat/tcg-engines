import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { sealedBladeDoa } from "../../DOA/weapons/sealed-blade-doa.ts";
import { conjureDownpour } from "./conjure-downpour.ts";
import { surgingUndertow } from "./surging-undertow.ts";

/** @covers 44eld1c5ac-a1 */
describe("surging-undertow — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: surgingUndertow, discount: 2 });
});

/** @covers 44eld1c5ac-a2 */
describe("Surging Undertow — mill and water threshold", () => {
  for (const preexistingWater of [false, true]) {
    it(`${preexistingWater ? "reaches" : "misses"} three water cards after milling`, () => {
      const champion = createClassBonusTestChampion(surgingUndertow, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [surgingUndertow, woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels, sealedBladeDoa],
            graveyard: preexistingWater ? [conjureDownpour] : undefined,
            "main-deck": [conjureDownpour, woodlandSquirrels, woodlandSquirrels, conjureDownpour],
          },
        },
        playerTwo: { champion, zones: { field: [woodlandSquirrels] } },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const deck = player.zone("main-deck");
      const target = opponent.card(woodlandSquirrels, { zone: "field" });
      player.activate(surgingUndertow, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((card) => ({ kind: "card", cardId: card.objectId })),
      });
      passEffectsStack(game);
      expect(player.zone("main-deck")).toEqual(deck.slice(3));
      expect(player.cards(conjureDownpour, { zone: "graveyard" })).toHaveLength(
        preexistingWater ? 3 : 2,
      );

      if (!preexistingWater) {
        expect(game.state.decision).toBeNull();
        expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
        return;
      }

      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      const before = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-choice", [
          player.card(sealedBladeDoa, { zone: "field" }).objectId,
        ]),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "resolve-effect-choice", [target.objectId]);
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
    });
  }
});
