import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { automatedGardener } from "../allies/automated-gardener.ts";
import { loneGunslinger } from "../allies/lone-gunslinger.ts";
import { reposition } from "../actions/reposition.ts";
import { dormantSacrificialAltar } from "./dormant-sacrificial-altar.ts";

/** @covers px8jypwc8t-a1 */
describe("Dormant Sacrificial Altar — memory entry draw", () => {
  for (const deckSize of [1, 2]) {
    it(`draws one of ${deckSize} cards into memory on separate entry resolution`, () => {
      const champion = createClassBonusTestChampion(
        dormantSacrificialAltar,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [dormantSacrificialAltar, woodlandSquirrels, woodlandSquirrels],
            "main-deck": [reposition, automatedGardener].slice(0, deckSize),
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const deck = player.zone("main-deck");
      player.activate(dormantSacrificialAltar, {
        reservePayment: player
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((ref) => ({ kind: "card", cardId: ref.objectId })),
      });
      const paid = player.zone("memory");
      expect(paid).toHaveLength(2);
      player.pass();
      game.player("player-two").pass();
      expect(player.cards(dormantSacrificialAltar, { zone: "field" })).toHaveLength(1);
      expect(player.zone("memory")).toEqual(paid);
      expect(player.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(player.zone("memory")).toEqual([...paid, deck[0]]);
      expect(player.zone("hand")).toHaveLength(0);
      expect(player.zone("main-deck")).toEqual(deck.slice(1));
      expect(game.player("player-two").zone("memory")).toHaveLength(0);
    });
  }
});

/** @covers px8jypwc8t-a2 */
describe("Dormant Sacrificial Altar — Automaton and Human sacrifice cost", () => {
  for (const deckSize of [0, 1, 3]) {
    it(`pays both distinct allies before milling up to two of ${deckSize} cards`, () => {
      const champion = createClassBonusTestChampion(
        dormantSacrificialAltar,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [dormantSacrificialAltar, automatedGardener, loneGunslinger, woodlandSquirrels],
            "main-deck": [reposition, woodlandSquirrels, automatedGardener].slice(0, deckSize),
          },
        },
        playerTwo: { champion, zones: { field: [loneGunslinger], "main-deck": [reposition] } },
      });
      const player = game.player("player-one");
      const automaton = player.card(automatedGardener, { zone: "field" });
      const human = player.card(loneGunslinger, { zone: "field" });
      const squirrel = player.card(woodlandSquirrels, { zone: "field" });
      const opposingHuman = game.player("player-two").card(loneGunslinger, { zone: "field" });
      const deck = player.zone("main-deck");
      for (const selections of [
        [[automaton.objectId]],
        [[automaton.objectId], [squirrel.objectId]],
        [[automaton.objectId], [opposingHuman.objectId]],
        [[automaton.objectId], [automaton.objectId]],
      ]) {
        const before = game.state;
        expect(() =>
          player.activateAbility(dormantSacrificialAltar, "px8jypwc8t-a2", {
            costSelections: selections,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      player.activateAbility(dormantSacrificialAltar, "px8jypwc8t-a2", {
        costSelections: [[automaton.objectId], [human.objectId]],
      });
      expect(player.zone("graveyard")).toEqual([automaton, human]);
      expect(player.zone("main-deck")).toEqual(deck);
      expect(player.cards(dormantSacrificialAltar, { zone: "field" })).toHaveLength(1);
      passEffectsStack(game);
      expect(player.zone("graveyard")).toEqual([automaton, human, ...deck.slice(0, 2)]);
      expect(player.zone("main-deck")).toEqual(deck.slice(2));
      expect(game.player("player-two").zone("main-deck")).toHaveLength(1);
      expect(game.state.objects[squirrel.objectId]!.zone).toBe("field");
      expect(game.state.objects[opposingHuman.objectId]!.zone).toBe("field");
    });
  }
});
