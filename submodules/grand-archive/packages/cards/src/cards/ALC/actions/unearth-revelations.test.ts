import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { harvestHerbs } from "./harvest-herbs.ts";
import { reposition } from "./reposition.ts";
import { unearthRevelations } from "./unearth-revelations.ts";
import { potionOfHealing } from "../items/potion-of-healing.ts";

/** @covers 96yd609g44-a1 */
describe("Unearth Revelations — draw then put two cards on the bottom", () => {
  for (const deckSize of [2, 3, 4]) {
    it(`draws two from a ${deckSize}-card deck before choosing held and/or drawn cards`, () => {
      const champion = createClassBonusTestChampion(
        unearthRevelations,
        false,
        "activation-discount",
      );
      const deckCards = [
        potionOfHealing,
        woodlandSquirrels,
        potionOfHealing,
        woodlandSquirrels,
      ].slice(0, deckSize);
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [unearthRevelations, woodlandSquirrels, reposition, harvestHerbs],
            memory: [potionOfHealing],
            "main-deck": deckCards,
          },
        },
        playerTwo: {
          champion,
          zones: { hand: [potionOfHealing], "main-deck": [woodlandSquirrels] },
        },
      });
      const player = game.player("player-one");
      const opponent = game.player("player-two");
      const payment = player.card(woodlandSquirrels, { zone: "hand" });
      const held = [player.card(reposition), player.card(harvestHerbs)];
      const originalDeck = player.zone("main-deck");
      const originalMemory = player.zone("memory");
      player.activate(unearthRevelations, {
        reservePayment: [{ kind: "card", cardId: payment.objectId }],
      });
      passEffectsStack(game);
      expect(game.state.decision?.kind).toBe("resolve-effect-choice");
      const drawn = originalDeck.slice(0, 2);
      expect(player.zone("hand")).toEqual([...held, ...drawn]);
      const chosen =
        deckSize === 2
          ? [held[1]!, held[0]!]
          : deckSize === 3
            ? [drawn[0]!, held[1]!]
            : [drawn[1]!, drawn[0]!];
      for (const invalid of [
        [],
        [chosen[0]!.objectId],
        [chosen[0]!.objectId, chosen[0]!.objectId],
        [player.card(potionOfHealing, { zone: "memory" }).objectId, chosen[0]!.objectId],
        [opponent.card(potionOfHealing, { zone: "hand" }).objectId, chosen[0]!.objectId],
      ]) {
        const before = game.state;
        expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
        expect(game.state).toEqual(before);
      }
      answerDecision(
        game,
        "resolve-effect-choice",
        chosen.map((card) => card.objectId),
      );
      passEffectsStack(game);
      const unchosenHand = [...held, ...drawn].filter(
        (card) => !chosen.some((selected) => selected.objectId === card.objectId),
      );
      expect(player.zone("hand")).toEqual(unchosenHand);
      expect(player.zone("main-deck")).toEqual([...originalDeck.slice(drawn.length), ...chosen]);
      expect(player.zone("memory")).toEqual([...originalMemory, payment]);
    });
  }
});
