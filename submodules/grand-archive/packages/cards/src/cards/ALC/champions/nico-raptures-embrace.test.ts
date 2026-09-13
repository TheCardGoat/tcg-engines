import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import {
  lineageTestChampion,
  proveChampionSuccessorRestriction,
} from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { nicoRapturesEmbrace } from "./nico-raptures-embrace.ts";

/** @covers 29lqrve8fz-a1 */
describe("Nico, Rapture's Embrace — Lineage", () => {
  proveChampionSuccessorRestriction({
    card: nicoRapturesEmbrace,
    lineageName: "Nico",
  });
});

function starter(withWater: boolean) {
  const champion = lineageTestChampion("Nico", 0);
  if (champion.layout.kind !== "single-faced") throw new Error("Expected fixture champion");
  return {
    ...champion,
    layout: {
      kind: "single-faced" as const,
      face: {
        ...champion.layout.face,
        elements: withWater ? (["NORM", "WATER"] as const) : (["NORM"] as const),
      },
    },
  };
}

/** @covers 29lqrve8fz-a2 */
describe("Nico, Rapture's Embrace — conditional lineage inspection", () => {
  for (const withWater of [false, true]) {
    it(`${withWater ? "uses" : "skips"} the top-two choice with another water lineage card`, () => {
      const startingChampion = starter(withWater);
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion: startingChampion,
          zones: {
            "material-deck": [nicoRapturesEmbrace],
            memory: [woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion: lineageTestChampion("Opponent", 0) },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.materialize(nicoRapturesEmbrace);
      const deck = player.zone("main-deck");
      player.pass();
      opponent.pass();
      passEffectsStack(game);

      if (!withWater) {
        expect(game.state.decision).toBeNull();
        expect(player.zone("main-deck")).toEqual(deck);
        expect(player.zone("graveyard")).toHaveLength(0);
        return;
      }

      const choice = game.state.decision;
      if (choice?.kind !== "resolve-effect-choice") throw new Error("Expected top-two choice");
      expect(choice.playerId).toBe(player.id);
      const beforeInvalid = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [deck[2]!.objectId])).toThrow();
      expect(game.state).toEqual(beforeInvalid);
      answerDecision(game, "resolve-effect-choice", [deck[0]!.objectId]);
      passEffectsStack(game);
      expect(player.zone("graveyard")).toEqual([deck[0]]);
      expect(player.zone("main-deck")).toEqual([...deck.slice(2), deck[1]]);
    });
  }
});
