import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatonDrone } from "../tokens/automaton-drone.ts";
import { springleaf } from "../tokens/springleaf.ts";
import { refabrication } from "./refabrication.ts";

function fixture(influence: number) {
  const champion = createClassBonusTestChampion(refabrication, false, "activation-discount");
  const game = GrandArchiveTestEngine.startFixture({
    definitions: [automatonDrone, springleaf],
    playerOne: {
      champion,
      zones: {
        hand: [refabrication, ...Array.from({ length: influence }, () => woodlandSquirrels)],
        field: [automatonDrone, springleaf],
        "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
      },
    },
    playerTwo: { champion },
  });
  return { game, champion };
}

/** @covers cri23mf3vs-a1 */
describe("Refabrication — token alternative cost", () => {
  it("sacrifices exactly two controlled tokens instead of paying three reserve", () => {
    const { game } = fixture(1);
    const player = game.player("player-one");
    const tokens = [
      player.card(automatonDrone, { zone: "field" }),
      player.card(springleaf, { zone: "field" }),
    ];
    const before = game.state;
    expect(() =>
      player.activate(refabrication, {
        costOptionIndex: 1,
        costSelections: [[tokens[0]!.objectId]],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activate(refabrication, {
      costOptionIndex: 1,
      costSelections: [tokens.map((card) => card.objectId)],
    });
    expect(player.zone("memory")).toHaveLength(0);
    for (const token of tokens) expect(game.state.objects[token.objectId]?.zone).not.toBe("field");
    expect(game.state.stack).toHaveLength(1);
  });
});

/** @covers cri23mf3vs-a2 */
describe("Refabrication — influence draw threshold", () => {
  for (const influence of [5, 6]) {
    it(`${influence <= 5 ? "draws two" : "does not draw"} at ${influence} influence`, () => {
      const { game } = fixture(influence);
      const player = game.player("player-one");
      const tokens = player
        .zone("field")
        .filter((card) => game.state.objects[card.objectId]?.isToken)
        .map((card) => card.objectId);
      const hand = player.zone("hand");
      const deck = player.zone("main-deck");
      player.activate(refabrication, { costOptionIndex: 1, costSelections: [tokens] });
      passEffectsStack(game);

      expect(player.zone("hand")).toEqual(
        influence <= 5 ? [...hand.slice(1), ...deck.slice(0, 2)] : hand.slice(1),
      );
      expect(player.zone("main-deck")).toEqual(influence <= 5 ? deck.slice(2) : deck);
    });
  }
});
