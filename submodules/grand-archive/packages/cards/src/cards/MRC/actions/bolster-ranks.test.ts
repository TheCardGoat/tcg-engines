import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { bolsterRanks } from "./bolster-ranks.ts";

/** @covers n0esog2898-a1 */
describe("Bolster Ranks — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: bolsterRanks, discount: 1 });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { deriveGrandArchiveNumericProperty } from "@tcg/grand-archive-engine/runtime";
import { expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
/** @covers n0esog2898-a2 */
describe("Bolster Ranks — summon and counter modes", () => {
  for (const matching of [false, true])
    for (const populated of [false, true])
      for (const order of [["mode-1"], ["mode-2"], ["mode-1", "mode-2"], ["mode-2", "mode-1"]])
        it(`class=${matching}, allies=${populated}, stack=${order.join(",")}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(bolsterRanks, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [automatonDrone],
            playerOne: {
              champion,
              zones: {
                field: [
                  trainingSword,
                  ...(populated ? [woodlandSquirrels, woodlandSquirrels] : []),
                ],
                hand: [
                  bolsterRanks,
                  bolsterRanks,
                  ...Array.from({ length: 8 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const allies = p.cards(woodlandSquirrels, { zone: "field" });
          const pay = () =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, matching ? 2 : 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const before = game.state;
          for (const modeIds of [[], ["mode-1", "mode-2"], ["mode-1", "mode-1"], ["invalid"]]) {
            expect(() =>
              p.activate(p.cards(bolsterRanks, { zone: "hand" })[0]!, {
                reservePayment: pay(),
                modeIds,
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          for (const mode of order)
            p.activate(p.cards(bolsterRanks, { zone: "hand" })[0]!, {
              reservePayment: pay(),
              modeIds: [mode],
            });
          expect(p.cards(automatonDrone, { zone: "field" })).toHaveLength(0);
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(0);
          passEffectsStack(game);
          const counters = order.includes("mode-2") ? 1 : 0;
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(counters);
          expect(game.state.objects[p.card(trainingSword).objectId]?.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[p.card(champion).objectId]?.counters.buff ?? 0).toBe(0);
          expect(game.state.objects[q.card(woodlandSquirrels).objectId]?.counters.buff ?? 0).toBe(
            0,
          );
          const drones = p.cards(automatonDrone, { zone: "field" });
          expect(drones).toHaveLength(order.includes("mode-1") ? 1 : 0);
          const expected = order[0] === "mode-2" && order.length === 2 ? 2 : 1;
          for (const drone of drones) {
            const object = game.state.objects[drone.objectId]!;
            expect(object).toMatchObject({
              isToken: true,
              ownerId: p.id,
              controllerId: p.id,
              counters: { buff: expected },
            });
            for (const stat of ["power", "life"] as const)
              expect(
                deriveGrandArchiveNumericProperty(object, stat, {
                  program: game.program,
                  state: game.state,
                  controllerId: p.id,
                  bindings: {},
                }),
              ).toBe(1 + expected);
          }
          const late = p.cards(woodlandSquirrels, { zone: "hand" })[0]!;
          p.activate(late);
          passEffectsStack(game);
          expect(game.state.objects[late.objectId]?.counters.buff ?? 0).toBe(0);
          advanceToMain(game, p.id, game.state.turn.number);
          for (const ally of allies)
            expect(game.state.objects[ally.objectId]?.counters.buff ?? 0).toBe(counters);
          for (const drone of drones)
            expect(game.state.objects[drone.objectId]?.counters.buff).toBe(expected);
        });
});
