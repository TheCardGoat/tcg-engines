import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { navigateTheStreets } from "../actions/navigate-the-streets.ts";
import { shatterfallKeep } from "./shatterfall-keep.ts";

/** @covers n1voy5ttkk-a1 */
describe("Shatterfall Keep — Floating Memory fuel", () => {
  it("rests, banishes one eligible graveyard card, and mills the top two cards", () => {
    const champion = lineageTestChampion("Shatterfall", 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [shatterfallKeep],
          graveyard: [navigateTheStreets, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const source = player.card(shatterfallKeep, { zone: "field" });
    const eligible = player.card(navigateTheStreets, { zone: "graveyard" });
    const ineligible = player.card(woodlandSquirrels, { zone: "graveyard" });
    const deck = player.zone("main-deck");
    const before = game.state;
    expect(() =>
      player.activateAbility(source, "n1voy5ttkk-a1", {
        costSelections: [[ineligible.objectId]],
      }),
    ).toThrow();
    expect(game.state).toEqual(before);

    player.activateAbility(source, "n1voy5ttkk-a1", {
      costSelections: [[eligible.objectId]],
    });
    expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
    expect(game.state.objects[eligible.objectId]!.zone).toBe("banishment");
    passEffectsStack(game);
    expect(player.zone("graveyard")).toEqual([ineligible, deck[0], deck[1]]);
    expect(player.zone("main-deck")).toEqual(deck.slice(2));
  });
});

/** @covers n1voy5ttkk-a2 */
describe("Shatterfall Keep — Upkeep water threshold", () => {
  for (const waterCards of [2, 3]) {
    it(`${waterCards < 3 ? "sacrifices" : "remains"} with ${waterCards} water cards`, () => {
      const champion = lineageTestChampion("Shatterfall", 0);
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [shatterfallKeep],
            graveyard: Array.from({ length: waterCards }, () => shatterfallKeep),
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(shatterfallKeep, { zone: "field" });
      advanceToRecollection(game, player.id);
      expect(game.state.stack).toMatchObject([
        { kind: "triggered-ability", ability: { id: "n1voy5ttkk-a2" } },
      ]);
      passEffectsStack(game);
      expect(game.state.objects[source.objectId]!.zone).toBe(
        waterCards < 3 ? "graveyard" : "field",
      );
    });
  }
});
