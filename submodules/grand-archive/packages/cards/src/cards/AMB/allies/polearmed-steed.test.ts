import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { steelHalberd } from "../../P24/weapons/steel-halberd.ts";
import { intricateLongbow } from "../weapons/intricate-longbow.ts";
import { polearmedSteed } from "./polearmed-steed.ts";

/** @covers 7j79KANWEP-a1 */
describe("Pole-armed Steed — Jin Bonus materialize Polearm", () => {
  for (const jin of [false, true]) {
    it(`Jin Bonus=${jin}`, () => {
      const champion = lineageTestChampion(jin ? "Jin" : "Not Jin", 0);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [polearmedSteed, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            "material-deck": [steelHalberd, intricateLongbow],
            memory: [woodlandSquirrels],
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activate(polearmedSteed, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
      });
      player.pass();
      opponent.pass();
      expect(player.cards(polearmedSteed, { zone: "field" })).toHaveLength(1);
      expect(
        game.state.stack.some(
          (item) => item.kind === "triggered-ability" && item.ability.id === "7j79KANWEP-a1",
        ) || game.state.decision?.kind === "resolve-effect-choice",
      ).toBe(jin);
      expect(player.cards(steelHalberd, { zone: "field" })).toHaveLength(0);
      if (!jin) {
        passEffectsStack(game);
        expect(player.cards(steelHalberd, { zone: "material-deck" })).toHaveLength(1);
        expect(player.cards(steelHalberd, { zone: "field" })).toHaveLength(0);
        return;
      }
      passEffectsStack(game);
      const beforeBow = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-choice", [
          player.card(intricateLongbow, { zone: "material-deck" }).objectId,
        ]),
      ).toThrow();
      expect(game.state).toEqual(beforeBow);
      answerDecision(game, "resolve-effect-choice", [
        player.card(steelHalberd, { zone: "material-deck" }).objectId,
      ]);
      if (game.state.decision?.kind === "announce-effect-materialization") {
        answerDecision(game, "announce-effect-materialization", {});
      }
      passEffectsStack(game);
      expect(player.cards(steelHalberd, { zone: "field" })).toHaveLength(1);
      expect(player.cards(intricateLongbow, { zone: "material-deck" })).toHaveLength(1);
    });
  }
});
