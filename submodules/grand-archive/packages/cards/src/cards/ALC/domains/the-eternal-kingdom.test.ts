import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { advanceToRecollection } from "../../../testing/aging-potion.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { reposition } from "../actions/reposition.ts";
import { oasisTradingPost } from "./oasis-trading-post.ts";
import { theEternalKingdom } from "./the-eternal-kingdom.ts";

/** @covers fyoz23yfzk-a1 */
describe("The Eternal Kingdom — Class Bonus Reservable domains", () => {
  for (const classMatches of [false, true]) {
    it(`lets a controlled Domain pay reserve only with class match=${classMatches}`, () => {
      const champion = createClassBonusTestChampion(
        theEternalKingdom,
        classMatches,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: { field: [theEternalKingdom, oasisTradingPost], hand: [reposition] },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      const domain = player.card(oasisTradingPost, { zone: "field" });
      const options = {
        reservePayment: [{ kind: "reservable" as const, objectId: domain.objectId }],
        targets: { "target-1": [player.card(champion, { zone: "field" }).objectId] },
      };
      if (!classMatches) {
        const before = game.state;
        expect(() => player.activate(reposition, options)).toThrow();
        expect(game.state).toEqual(before);
        return;
      }
      player.activate(reposition, options);
      expect(game.state.objects[domain.objectId]!.states.has("rested")).toBe(true);
      expect(player.zone("memory")).toHaveLength(0);
    });
  }
});

/** @covers fyoz23yfzk-a2 */
describe("The Eternal Kingdom — Upkeep", () => {
  for (const payUpkeep of [false, true]) {
    it(`${payUpkeep ? "pays two reserve and remains" : "is sacrificed when payment is declined"}`, () => {
      const champion = createClassBonusTestChampion(
        theEternalKingdom,
        false,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            field: [theEternalKingdom],
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
        },
      });
      const player = game.player("player-one");
      const source = player.card(theEternalKingdom, { zone: "field" });
      advanceToRecollection(game, player.id);
      expect(game.state.stack).toMatchObject([
        { kind: "triggered-ability", ability: { id: "fyoz23yfzk-a2" } },
      ]);
      passEffectsStack(game);
      answerDecision(game, "resolve-optional-effect", payUpkeep);
      if (payUpkeep) {
        const payment = player.cards(woodlandSquirrels, { zone: "hand" });
        expect(game.state.decision?.kind).toBe("resolve-effect-payment");
        answerDecision(game, "resolve-effect-payment", {
          reservePayment: payment.map((card) => ({ kind: "card", cardId: card.objectId })),
        });
      }
      passEffectsStack(game);

      expect(game.state.objects[source.objectId]!.zone).toBe(payUpkeep ? "field" : "graveyard");
      expect(player.zone("memory")).toHaveLength(payUpkeep ? 2 : 0);
    });
  }
});
