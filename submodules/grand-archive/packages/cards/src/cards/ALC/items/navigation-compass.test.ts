import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { sanctumOfEsotericTruth } from "../domains/sanctum-of-esoteric-truth.ts";
import { navigationCompass } from "./navigation-compass.ts";

/** @covers sw2ugmnmp5-a1 */
describe("Navigation Compass — Class Bonus materialization discount", () => {
  for (const classBonus of [false, true]) {
    it(`costs ${classBonus ? 0 : 1} memory with Class Bonus ${classBonus}`, () => {
      const champion = createClassBonusTestChampion(
        navigationCompass,
        classBonus,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            memory: classBonus ? [] : [woodlandSquirrels],
            "material-deck": [navigationCompass],
          },
        },
        playerTwo: { champion },
      });
      if (!classBonus) {
        const underpaid = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: { champion, zones: { "material-deck": [navigationCompass] } },
          playerTwo: { champion },
        });
        const before = underpaid.state;
        expect(() => underpaid.player("player-one").materialize(navigationCompass)).toThrow();
        expect(underpaid.state).toEqual(before);
      }
      const player = game.player("player-one");
      player.materialize(navigationCompass);
      passEffectsStack(game);
      expect(player.cards(navigationCompass, { zone: "field" })).toHaveLength(1);
      expect(player.zone("memory")).toHaveLength(0);
    });
  }
});

/** @covers sw2ugmnmp5-a2 */
describe("Navigation Compass — discard a Domain to draw into memory", () => {
  for (const deckSize of [1, 2]) {
    it(`pays the typed discard and draws one of ${deckSize} cards into memory`, () => {
      const champion = createClassBonusTestChampion(navigationCompass, true, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [navigationCompass],
            hand: [sanctumOfEsotericTruth, woodlandSquirrels],
            "main-deck": [reposition, woodlandSquirrels].slice(0, deckSize),
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [sanctumOfEsotericTruth] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const compass = player.card(navigationCompass);
      const domain = player.card(sanctumOfEsotericTruth, { zone: "hand" });
      const nonDomain = player.card(woodlandSquirrels, { zone: "hand" });
      const opposingDomain = opponent.card(sanctumOfEsotericTruth, { zone: "hand" });
      const deck = player.zone("main-deck");

      for (const selection of [
        [],
        [nonDomain.objectId],
        [opposingDomain.objectId],
        [domain.objectId, nonDomain.objectId],
      ]) {
        const before = game.state;
        expect(() =>
          player.activateAbility(navigationCompass, "sw2ugmnmp5-a2", {
            costSelections: [selection],
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }

      player.activateAbility(navigationCompass, "sw2ugmnmp5-a2", {
        costSelections: [[domain.objectId]],
      });
      expect(game.state.objects[compass.objectId]!.states.has("rested")).toBe(true);
      expect(player.zone("graveyard")).toEqual([domain]);
      expect(player.zone("memory")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);

      expect(player.zone("memory")).toEqual(deck.slice(0, 1));
      expect(player.zone("main-deck")).toEqual(deck.slice(1));
      expect(player.zone("hand")).toEqual([nonDomain]);
      expect(opponent.zone("hand")).toEqual([opposingDomain]);
    });
  }
});
