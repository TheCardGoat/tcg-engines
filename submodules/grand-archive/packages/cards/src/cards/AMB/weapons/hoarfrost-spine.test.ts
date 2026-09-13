import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveBowMustBeLoaded } from "../../../testing/bow-loaded.ts";
import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../../ALC/actions/reposition.ts";
import { hoarfrostSpine } from "./hoarfrost-spine.ts";

/** @covers 5hns3byfm8-a1 */
describe("Hoarfrost Spine — Bow", () => {
  proveBowMustBeLoaded({ card: hoarfrostSpine });
});

/** @covers 5hns3byfm8-a2 */
describe("Hoarfrost Spine — On Enter look", () => {
  for (const mill of [false, true]) {
    it(`${mill ? "mills" : "keeps"} the looked-at top card`, () => {
      const { starter } = classBonusLeveledChampion(hoarfrostSpine, true, 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion: starter,
          zones: {
            hand: [hoarfrostSpine, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [reposition, woodlandSquirrels],
          },
        },
        playerTwo: { champion: starter },
      });
      const player = game.player("player-one");
      const top = player.card(reposition, { zone: "main-deck" });
      player.activate(hoarfrostSpine, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      expect(player.cards(hoarfrostSpine, { zone: "field" })).toHaveLength(0);
      player.pass();
      game.player("player-two").pass();
      expect(player.cards(hoarfrostSpine, { zone: "field" })).toHaveLength(1);
      passEffectsStack(game);
      if (game.state.decision?.kind === "resolve-optional-effect") {
        answerDecision(game, "resolve-optional-effect", mill);
        passEffectsStack(game);
      }
      expect(game.state.objects[top.objectId]!.zone).toBe(mill ? "graveyard" : "main-deck");
    });
  }
});
