import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { immolationTrap } from "./immolation-trap.ts";
import { markTheTarget } from "./mark-the-target.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
/** @covers Uxn14UqyQg-a1 @covers Uxn14UqyQg-a2 */
describe("Immolation Trap's damaged-ally restriction and class discount", () => {
  for (const classBonus of [false, true])
    for (const self of [false, true])
      it(`class=${classBonus}, target=${self ? "own" : "opposing"}`, () => {
        const champion = createClassBonusTestChampion(
            immolationTrap,
            classBonus,
            "activation-discount",
          ),
          cost = classBonus ? 0 : 2;
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                immolationTrap,
                markTheTarget,
                ...Array.from({ length: cost + 1 }, () => woodlandSquirrels),
              ],
              field: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (self ? p : q).card(giantTortoise),
          other = (self ? q : p).card(giantTortoise);
        const pay = () =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(immolationTrap, {
            reservePayment: pay(),
            targets: { "target-1": [target.objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(markTheTarget, {
          reservePayment: [
            { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
          ],
          targets: { "target-1": [target.objectId] },
        });
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(1);
        const ready = game.state;
        for (const ref of [other, p.card(champion)]) {
          expect(() =>
            p.activate(immolationTrap, {
              reservePayment: pay(),
              targets: { "target-1": [ref.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(ready);
        }
        if (cost) {
          expect(() =>
            p.activate(immolationTrap, {
              reservePayment: pay().slice(1),
              targets: { "target-1": [target.objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(ready);
        }
        p.activate(immolationTrap, {
          reservePayment: pay(),
          targets: { "target-1": [target.objectId] },
        });
        expect(p.zone("memory")).toHaveLength(cost + 1);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.zone).toBe("graveyard");
        expect(game.state.objects[other.objectId]!.zone).toBe("field");
      });
});
