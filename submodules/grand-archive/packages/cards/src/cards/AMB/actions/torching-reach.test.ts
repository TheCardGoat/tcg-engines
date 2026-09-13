import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { torchingReach } from "./torching-reach.ts";

/** @covers kHhxq4UZTe-a1 */
describe("Torching Reach — draw, discard, distant bonus", () => {
  for (const distant of [false, true]) {
    it(`${distant ? "draws a second card when" : "does not draw again unless"} the champion is distant`, () => {
      const champion = createClassBonusTestChampion(torchingReach, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [
              torchingReach,
              reposition,
              ...Array.from({ length: 3 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      if (distant) {
        player.activate(reposition, {
          reservePayment: [
            {
              kind: "card",
              cardId: player.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId,
            },
          ],
          targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
        });
        passEffectsStack(game);
        expect(
          game.state.objects[player.card(champion, { zone: "field" }).objectId]!.states.has(
            "distant",
          ),
        ).toBe(true);
      }
      const deck = player.zone("main-deck");
      const handBefore = player.zone("hand");
      player.activate(torchingReach, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
      });
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-effect-choice") {
        const drawn = player
          .zone("hand")
          .find((card) => !handBefore.some((held) => held.objectId === card.objectId));
        if (!drawn) throw new Error("Expected a drawn card before the discard");
        answerDecision(game, "resolve-effect-choice", [drawn.objectId]);
        passEffectsStack(game);
        expect(player.zone("graveyard")).toContainEqual(drawn);
      }
      if (distant) {
        expect(player.zone("main-deck").length).toBe(deck.length - 2);
      } else {
        expect(player.zone("main-deck")).toHaveLength(deck.length - 1);
      }
    });
  }
});
