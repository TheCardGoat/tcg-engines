import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { glacialGuidance } from "../../DOA/actions/glacial-guidance.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { aqueousStallion } from "./aqueous-stallion.ts";

/** @covers 4le7ehjyxs-a1 */
describe("Aqueous Stallion — water graveyard power", () => {
  for (const water of [3, 4, 5]) {
    it(`${water >= 4 ? "attacks for 3" : "cannot attack"} with ${water} water cards in the graveyard`, () => {
      const champion = createClassBonusTestChampion(aqueousStallion, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [aqueousStallion],
            graveyard: Array.from({ length: water }, () => glacialGuidance),
          },
        },
        playerTwo: {
          champion,
          zones: { graveyard: Array.from({ length: 5 }, () => glacialGuidance) },
        },
      });
      const player = game.player("player-one");
      const target = game.player("player-two").card(champion, { zone: "field" });
      if (water < 4) {
        const before = game.state;
        expect(() =>
          player.declareAttack(player.card(aqueousStallion, { zone: "field" }), target),
        ).toThrow(/cannot declare an attack/i);
        expect(game.state).toEqual(before);
        return;
      }
      player.declareAttack(player.card(aqueousStallion, { zone: "field" }), target);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[target.objectId]!.damage).toBe(3);
      expect(player.zone("graveyard")).toHaveLength(water);
    });
  }

  it("does not count non-water cards toward the threshold", () => {
    const champion = createClassBonusTestChampion(aqueousStallion, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [aqueousStallion],
          graveyard: [
            glacialGuidance,
            glacialGuidance,
            glacialGuidance,
            woodlandSquirrels,
            woodlandSquirrels,
          ],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    const before = game.state;
    expect(() =>
      player.declareAttack(
        player.card(aqueousStallion, { zone: "field" }),
        game.player("player-two").card(champion, { zone: "field" }),
      ),
    ).toThrow(/cannot declare an attack/i);
    expect(game.state).toEqual(before);
  });
});
