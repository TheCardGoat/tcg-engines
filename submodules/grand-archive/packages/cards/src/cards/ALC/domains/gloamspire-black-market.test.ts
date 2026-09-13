import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { gloamspireBlackMarket } from "./gloamspire-black-market.ts";

function fixture(
  controllerInfluence: number,
  opponentInfluence: number,
  firstPlayer: "playerOne" | "playerTwo" = "playerOne",
) {
  const champion = lineageTestChampion("Market", 0);
  return GrandArchiveTestEngine.startFixture({
    firstPlayer,
    playerOne: {
      champion,
      zones: {
        field: [gloamspireBlackMarket],
        hand: Array.from({ length: controllerInfluence }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
    playerTwo: {
      champion,
      zones: {
        memory: Array.from({ length: opponentInfluence }, () => woodlandSquirrels),
        "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
      },
    },
  });
}

/** @covers waf8urrqtj-a1 */
describe("Gloamspire, Black Market — influence draw", () => {
  for (const [controllerInfluence, opponentInfluence] of [
    [6, 7],
    [7, 6],
  ] as const) {
    it(`draws only for the player below seven (${controllerInfluence}/${opponentInfluence})`, () => {
      const game = fixture(controllerInfluence, opponentInfluence);
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      player.activateAbility(gloamspireBlackMarket, "waf8urrqtj-a1");
      passEffectsStack(game);
      expect(player.zone("memory")).toHaveLength(controllerInfluence < 7 ? 1 : 0);
      expect(opponent.zone("memory")).toHaveLength(
        opponentInfluence + (opponentInfluence < 7 ? 1 : 0),
      );
    });
  }

  it("rejects the slow ability during an opponent's turn without resting", () => {
    const game = fixture(0, 0, "playerTwo");
    const player = game.player("player-one");
    game.player("player-two").pass();
    const source = player.card(gloamspireBlackMarket, { zone: "field" });
    const before = game.state;
    expect(() => player.activateAbility(gloamspireBlackMarket, "waf8urrqtj-a1")).toThrow();
    expect(game.state).toEqual(before);
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
  });
});

/** @covers waf8urrqtj-a2 */
describe("Gloamspire, Black Market — Upkeep", () => {
  for (const influence of [7, 8]) {
    it(`${influence >= 8 ? "sacrifices" : "stays"} at ${influence} influence`, () => {
      const game = fixture(influence, 0, "playerTwo");
      const player = game.player("player-one");
      advanceToRecollection(game, player.id);
      const source = player.card(gloamspireBlackMarket, {
        zone: influence >= 8 ? undefined : "field",
      });
      if (influence < 8) {
        expect(game.state.stack).toHaveLength(0);
        expect(game.state.objects[source.objectId]!.zone).toBe("field");
        return;
      }
      expect(game.state.stack).toMatchObject([
        { kind: "triggered-ability", ability: { id: "waf8urrqtj-a2" } },
      ]);
      passEffectsStack(game);
      expect(player.cards(gloamspireBlackMarket, { zone: "graveyard" })).toHaveLength(1);
    });
  }
});
