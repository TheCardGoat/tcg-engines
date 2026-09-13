import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { markTheTarget } from "./mark-the-target.ts";
import { giantTortoise } from "../allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { giveBath } from "./give-bath.ts";

/** @covers XeXek4dKav-a2 */
describe("Give Bath — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: giveBath });
});

/** @covers XeXek4dKav-a1 */
describe("Give Bath removes temporary ally damage", () => {
  for (const owner of ["self", "opponent"] as const)
    for (const damage of [0, 1, 2])
      it(`heals ${damage} damage on ${owner}'s ally`, () => {
        const base = createClassBonusTestChampion(giveBath, false, "activation-discount"),
          face = requireSingleFace(base);
        const champion = {
          ...base,
          layout: {
            kind: "single-faced" as const,
            face: { ...face, elements: [...face.elements, "FIRE" as const] },
          },
        };
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [
                giveBath,
                ...Array.from({ length: damage }, () => markTheTarget),
                ...Array.from({ length: damage + 2 }, () => woodlandSquirrels),
              ],
              field: [giantTortoise],
            },
          },
          playerTwo: { champion, zones: { field: [giantTortoise] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = (owner === "self" ? p : q).card(giantTortoise);
        for (let n = 0; n < damage; n++) {
          p.activate(p.cards(markTheTarget, { zone: "hand" })[0]!, {
            reservePayment: [
              { kind: "card", cardId: p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId },
            ],
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
        }
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(giveBath, {
            reservePayment: payment,
            targets: { "target-1": [p.card(champion).objectId] },
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(giveBath, {
          reservePayment: payment,
          targets: { "target-1": [target.objectId] },
        });
        expect(game.state.objects[target.objectId]!.damage).toBe(damage);
        passEffectsStack(game);
        expect(game.state.objects[target.objectId]!.damage).toBe(0);
        expect(game.state.objects[target.objectId]!.zone).toBe("field");
      });
});
