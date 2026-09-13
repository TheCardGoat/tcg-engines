import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { tidestoneBovine } from "./tidestone-bovine.ts";

/** @covers thxvlynvy5-a2 */
describe("Tidestone Bovine — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: tidestoneBovine });
});

/** @covers thxvlynvy5-a1 */
describe("Tidestone Bovine — On Attack mill", () => {
  for (const targetSelf of [false, true]) {
    it(`mills two from ${targetSelf ? "its controller" : "the opponent"}`, () => {
      const champion = createClassBonusTestChampion(tidestoneBovine, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [tidestoneBovine],
            "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const milled = game.player(targetSelf ? "player-one" : "player-two");
      const other = game.player(targetSelf ? "player-two" : "player-one");
      const deck = milled.zone("main-deck");
      const otherDeck = other.zone("main-deck");
      player.declareAttack(
        player.card(tidestoneBovine, { zone: "field" }),
        opponent.card(champion, { zone: "field" }),
      );
      expect(game.state.decision?.kind).toBe("announce-triggered-ability");
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-player": [milled.id] },
      });
      expect(milled.zone("main-deck")).toEqual(deck);
      passEffectsStack(game);
      expect(milled.zone("graveyard").map((card) => card.objectId)).toEqual(
        deck.slice(0, 2).map((card) => card.objectId),
      );
      expect(milled.zone("main-deck")).toEqual(deck.slice(2));
      expect(other.zone("main-deck")).toEqual(otherDeck);
      game.resolveCombatWithoutRetaliation();
      expect(game.state.objects[opponent.card(champion, { zone: "field" }).objectId]!.damage).toBe(
        1,
      );
    });
  }
});
