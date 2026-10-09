import { describe } from "vitest";
import { displace } from "./displace.ts";
import { proveTargetedClassCounter } from "../../../testing/targeted-class-counter.ts";
/** @covers bro89w0ejc-a2 */
describe("Displace — Class Bonus enlighten", () =>
  proveTargetedClassCounter(displace, "enlighten", "ally"));

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { ordainedCharisma } from "../../RDO/actions/ordained-charisma.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { exquisiteDessert } from "../../PRD/items/exquisite-dessert.ts";
import { cooktechApron } from "../../PRD/items/cooktech-apron.ts";
/** @covers bro89w0ejc-a1 */
describe("Displace — new object under its owner's control", () => {
  for (const matching of [false, true])
    for (const opposingOwner of [false, true])
      for (const stolen of opposingOwner ? [false, true] : [false])
        for (const token of [false, true])
          it(`class=${matching}, opposing owner=${opposingOwner}, stolen=${stolen}, token=${token}`, () => {
            const champion = enableAllTestElements(
              createClassBonusTestChampion(displace, matching, "activation-discount"),
            );
            const allyCard = token ? automatonDrone : giantTortoise;
            const game = GrandArchiveTestEngine.startFixture({
              playerOne: {
                champion,
                zones: {
                  field: [exquisiteDessert, ...(!opposingOwner ? [allyCard] : [])],
                  hand: [
                    displace,
                    ordainedCharisma,
                    fireball,
                    cooktechApron,
                    ...Array.from({ length: 13 }, () => woodlandSquirrels),
                  ],
                },
              },
              playerTwo: { champion, zones: { field: opposingOwner ? [allyCard] : [] } },
            });
            const p = game.player("player-one"),
              q = game.player("player-two"),
              owner = opposingOwner ? q : p;
            const ally = owner.card(allyCard);
            const pay = (n: number) =>
              p
                .cards(woodlandSquirrels, { zone: "hand" })
                .slice(0, n)
                .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
            p.activateAbility(exquisiteDessert, "5HPvGPjsD9-a2", {
              reservePayment: pay(1),
              targets: { "target-1": [ally.objectId] },
            });
            passEffectsStack(game);
            p.activate(cooktechApron, {
              reservePayment: pay(2),
              targets: { "intrinsic-link-target": [ally.objectId] },
            });
            passEffectsStack(game);
            p.activate(fireball, {
              reservePayment: pay(matching ? 2 : 4),
              targets: { "target-1": [ally.objectId] },
            });
            passEffectsStack(game);
            if (stolen) {
              p.activate(ordainedCharisma, {
                reservePayment: pay(3),
                targets: { "target-1": [ally.objectId] },
              });
              passEffectsStack(game);
            }
            expect(game.state.objects[ally.objectId]).toMatchObject({
              damage: 1,
              counters: { buff: 1 },
              controllerId: stolen ? p.id : owner.id,
            });
            const apron = p.card(cooktechApron, { zone: "field" });
            const initial = game.state.objects[ally.objectId]!;
            const before = game.state;
            for (const ids of [
              [],
              [p.card(champion).objectId],
              [apron.objectId],
              [ally.objectId, ally.objectId],
            ]) {
              expect(() =>
                p.activate(displace, { reservePayment: pay(2), targets: { "target-1": ids } }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
            p.activate(displace, {
              reservePayment: pay(2),
              targets: { "target-1": [ally.objectId] },
            });
            expect(game.state.objects[ally.objectId]).toEqual(initial);
            passEffectsStack(game);
            expect(game.state.objects[apron.objectId]?.zone).toBe("graveyard");
            if (token) {
              expect(game.state.objects[ally.objectId]).toBeUndefined();
              expect(owner.cards(allyCard, { zone: "field" })).toHaveLength(0);
            } else {
              const returned = game.state.objects[ally.objectId]!;
              expect(returned).toMatchObject({
                zone: "field",
                ownerId: owner.id,
                controllerId: owner.id,
                damage: 0,
              });
              expect(returned.counters.buff ?? 0).toBe(0);
              expect(returned.states.has("rested")).toBe(true);
              expect(owner.cards(allyCard, { zone: "field" })).toHaveLength(1);
              if (stolen) expect(p.cards(allyCard, { zone: "field" })).toHaveLength(0);
            }
          });
});
