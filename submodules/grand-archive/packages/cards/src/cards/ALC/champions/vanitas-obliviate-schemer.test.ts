import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  lineageTestChampion,
  proveChampionSuccessorRestriction,
} from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { vanitasObliviateSchemer } from "./vanitas-obliviate-schemer.ts";

/** @covers x8bd7ozuj6-a1 */
describe("Vanitas, Obliviate Schemer — Lineage", () => {
  proveChampionSuccessorRestriction({
    card: vanitasObliviateSchemer,
    lineageName: "Vanitas",
  });
});

function starter(withWind: boolean) {
  const champion = lineageTestChampion("Vanitas", 0);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: withWind ? (["NORM", "WIND"] as const) : (["NORM"] as const),
      },
    },
  };
}

/** @covers x8bd7ozuj6-a2 */
describe("Vanitas, Obliviate Schemer — conditional lineage Glimpse", () => {
  for (const withWind of [false, true]) {
    it(`${withWind ? "Glimpses four" : "does not Glimpse"} with another wind lineage card`, () => {
      const startingChampion = starter(withWind);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: startingChampion,
          zones: {
            "material-deck": [vanitasObliviateSchemer],
            memory: [woodlandSquirrels],
            "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      player.materialize(vanitasObliviateSchemer);
      const deck = player.zone("main-deck");
      player.pass();
      game.player("player-two").pass();
      passEffectsStack(game);

      if (!withWind) {
        expect(game.state.decision).toBeNull();
        expect(player.zone("main-deck")).toEqual(deck);
        return;
      }

      const glimpse = game.state.decision;
      if (glimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 4");
      expect(glimpse.playerId).toBe(player.id);
      expect(glimpse.cardIds).toEqual(deck.slice(0, 4).map((card) => card.objectId));
      const top = deck.slice(3, 4);
      const bottom = deck.slice(0, 3).reverse();
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: top.map((card) => card.objectId),
        bottom: bottom.map((card) => card.objectId),
      });
      passEffectsStack(game);
      expect(player.zone("main-deck")).toEqual([...top, ...deck.slice(4), ...bottom]);
    });
  }
});
