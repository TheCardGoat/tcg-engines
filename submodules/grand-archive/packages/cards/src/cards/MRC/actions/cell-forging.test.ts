import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { powercell } from "../tokens/powercell.ts";
import { cellForging } from "./cell-forging.ts";
/** @covers pufooz13xf-a1 */
describe("Cell Forging — durability or Powercell", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      for (const mode of ["mode-1", "mode-2"])
        it(`class=${matching}, opposing weapon=${opposing}, mode=${mode}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(cellForging, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            definitions: [powercell],
            playerOne: {
              champion,
              zones: {
                field: mode === "mode-1" ? [trainingSword, woodlandSquirrels] : [woodlandSquirrels],
                hand: [
                  cellForging,
                  cellForging,
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: mode === "mode-1" ? [trainingSword] : [],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const target = mode === "mode-1" ? (opposing ? q : p).card(trainingSword) : undefined;
          const initial = target
            ? (game.state.objects[target.objectId]!.counters.durability ?? 0)
            : 0;
          const pay = () =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 3)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          const options = {
            modeIds: [mode],
            ...(target ? { targets: { "target-1": [target.objectId] } } : {}),
          };
          const before = game.state;
          for (const modeIds of [[], ["mode-1", "mode-2"], ["mode-2", "mode-2"], ["invalid"]]) {
            expect(() =>
              p.activate(p.cards(cellForging, { zone: "hand" })[0]!, {
                ...options,
                modeIds,
                reservePayment: pay(),
              }),
            ).toThrow();
            expect(game.state).toEqual(before);
          }
          if (target) {
            for (const ids of [
              [],
              [p.card(champion).objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
              [target.objectId, target.objectId],
            ]) {
              expect(() =>
                p.activate(p.cards(cellForging, { zone: "hand" })[0]!, {
                  ...options,
                  reservePayment: pay(),
                  targets: { "target-1": ids },
                }),
              ).toThrow();
              expect(game.state).toEqual(before);
            }
          }
          for (let copy = 1; copy <= 2; copy++) {
            p.activate(p.cards(cellForging, { zone: "hand" })[0]!, {
              ...options,
              reservePayment: pay(),
            });
            if (target)
              expect(game.state.objects[target.objectId]?.counters.durability).toBe(
                initial + 2 * (copy - 1),
              );
            else expect(p.cards(powercell, { zone: "field" })).toHaveLength(copy - 1);
            passEffectsStack(game);
            if (target) {
              expect(game.state.objects[target.objectId]?.counters.durability).toBe(
                initial + 2 * copy,
              );
              expect(p.cards(powercell, { zone: "field" })).toHaveLength(0);
            } else {
              const tokens = p.cards(powercell, { zone: "field" });
              expect(tokens).toHaveLength(copy);
              for (const token of tokens)
                expect(game.state.objects[token.objectId]).toMatchObject({
                  isToken: true,
                  ownerId: p.id,
                  controllerId: p.id,
                });
            }
          }
          expect(q.cards(powercell, { zone: "field" })).toHaveLength(0);
          advanceToMain(game, p.id, game.state.turn.number);
          if (target)
            expect(game.state.objects[target.objectId]?.counters.durability).toBe(initial + 4);
          else expect(p.cards(powercell, { zone: "field" })).toHaveLength(2);
        });
});
