import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { heatedVengeance } from "../attacks/heated-vengeance.ts";
import { hulaoGateSunsAscent } from "./hulao-gate-suns-ascent.ts";

/** @covers snke7lneo4-a1 */
describe("Hulao Gate — attack damage", () => {
  it("deals 2 to a unit that declares an attack", () => {
    const { starter } = classBonusLeveledChampion(hulaoGateSunsAscent, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: { champion: starter, zones: { field: [hulaoGateSunsAscent] } },
      playerTwo: { champion: starter, zones: { field: [woodlandSquirrels] } },
    });
    const ally = game.player("player-two").card(woodlandSquirrels, { zone: "field" });
    game
      .player("player-two")
      .declareAttack(ally, game.player("player-one").card(starter, { zone: "field" }));
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.zone).toBe("graveyard");
  });
});

/** @covers snke7lneo4-a2 */
describe("Hulao Gate — Upkeep", () => {
  for (const pay of [false, true]) {
    it(`${pay ? "stays after banishing a fire card" : "is sacrificed when declined"}`, () => {
      const { starter } = classBonusLeveledChampion(hulaoGateSunsAscent, false, 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion: starter,
          zones: {
            field: [hulaoGateSunsAscent],
            graveyard: [heatedVengeance],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion: starter,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(hulaoGateSunsAscent, { zone: "field" });
      advanceToRecollection(game, player.id);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", pay);
      if (pay && game.state.decision?.kind === "resolve-effect-choice") {
        answerDecision(game, "resolve-effect-choice", [
          player.card(heatedVengeance, { zone: "graveyard" }).objectId,
        ]);
      }
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(pay ? "field" : "graveyard");
    });
  }
});
