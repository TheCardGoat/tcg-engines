import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { expeditiousOpening } from "./expeditious-opening.ts";
import { backdash } from "./backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers w1wgpeifd0-a1 @covers w1wgpeifd0-a2 */
describe("Expeditious Opening — next controlled ally only, this turn", () => {
  for (const intervening of ["none", "non-ally", "opponent", "expiry"] as const)
    it(`draws into memory and handles ${intervening} before the next ally`, () => {
      const champion = enableAllTestElements(
        createClassBonusTestChampion(expeditiousOpening, false, "activation-discount"),
      );
      const game = GrandArchiveTestEngine.startFixture({
        firstPlayer: "playerTwo",
        playerOne: {
          champion,
          zones: {
            hand: [
              expeditiousOpening,
              backdash,
              giantTortoise,
              giantTortoise,
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: [woodlandSquirrels, woodlandSquirrels],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const payment = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const [first, second] = p.cards(giantTortoise);
      q.pass();
      const before = game.state;
      expect(() => p.activate(first!, { reservePayment: payment(4) })).toThrow();
      expect(game.state).toEqual(before);
      expect(() => p.activate(expeditiousOpening, { reservePayment: payment(1) })).toThrow();
      expect(game.state).toEqual(before);
      const top = p.zone("main-deck")[0]!;
      p.activate(expeditiousOpening, { reservePayment: payment(2) });
      expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
      passEffectsStack(game);
      expect(game.state.objects[top.objectId]!.zone).toBe("memory");
      expect(p.zone("memory")).toHaveLength(3);
      if (intervening === "opponent") {
        const [ally] = q.cards(woodlandSquirrels);
        q.activate(ally!);
        passEffectsStack(game);
        expect(game.state.objects[ally!.objectId]!.zone).toBe("field");
      }
      if (intervening === "expiry") advanceToMain(game, p.id);
      else q.pass();
      if (intervening === "non-ally" || intervening === "expiry") {
        p.activate(backdash, {
          targets: { "target-1": [p.card(champion).objectId] },
          reservePayment: payment(1),
        });
      }
      if (intervening === "expiry") {
        const expired = game.state;
        expect(() => p.activate(first!, { reservePayment: payment(4) })).toThrow();
        expect(game.state).toEqual(expired);
        passEffectsStack(game);
        p.activate(first!, { reservePayment: payment(4) });
        passEffectsStack(game);
        expect(game.state.objects[first!.objectId]!.zone).toBe("field");
        return;
      }
      p.activate(first!, { reservePayment: payment(4) });
      const consumed = game.state;
      expect(() => p.activate(second!, { reservePayment: payment(4) })).toThrow();
      expect(game.state).toEqual(consumed);
      passEffectsStack(game);
      expect(game.state.objects[first!.objectId]!.zone).toBe("field");
      q.pass();
      const afterResolution = game.state;
      expect(() => p.activate(second!, { reservePayment: payment(4) })).toThrow();
      expect(game.state).toEqual(afterResolution);
    });
});
