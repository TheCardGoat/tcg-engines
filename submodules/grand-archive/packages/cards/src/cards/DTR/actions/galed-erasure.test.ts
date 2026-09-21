import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { galedErasure } from "./galed-erasure.ts";
import { evercurrentRaider } from "../allies/evercurrent-raider.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers jtp4cy6pdy-a1 */
describe("Galed Erasure — ephemeral object targeting", () => {
  for (const own of [true, false])
    it(`destroys an ephemeral ${own ? "own" : "opposing"} ally and rejects ordinary objects`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(galedErasure, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: own ? "playerOne" : "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [galedErasure, ...Array.from({ length: 5 }, () => woodlandSquirrels)],
            field: [woodlandSquirrels],
            graveyard: own ? [evercurrentRaider] : [],
            "main-deck": [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [woodlandSquirrels, woodlandSquirrels],
            field: [woodlandSquirrels],
            graveyard: own ? [] : [evercurrentRaider],
            "main-deck": [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        owner = own ? p : q;
      const target = owner.card(evercurrentRaider);
      owner.activate(target, {
        activationMethod: "ephemerate",
        reservePayment: owner
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card", cardId: c.objectId })),
      });
      passEffectsStack(game);
      if (!own) advanceToMain(game, p.id);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 3)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const invalid of [
        p.card(champion),
        q.card(woodlandSquirrels, { zone: "field" }),
        p.cards(woodlandSquirrels, { zone: "hand" })[0]!,
      ]) {
        const before = game.state;
        expect(() =>
          p.activate(galedErasure, {
            targets: { "target-1": [invalid.objectId] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const before = game.state;
      expect(() =>
        p.activate(galedErasure, {
          targets: { "target-1": [target.objectId] },
          reservePayment: payment.slice(1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(galedErasure, {
        targets: { "target-1": [target.objectId] },
        reservePayment: payment,
      });
      expect(game.state.objects[target.objectId]!.zone).toBe("field");
      passEffectsStack(game);
      expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
      expect(owner.cards(evercurrentRaider, { zone: "banishment" })).toHaveLength(1);
      expect(p.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
      expect(q.cards(woodlandSquirrels, { zone: "field" })).toHaveLength(1);
    });
});
