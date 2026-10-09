import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { prismaticEdge } from "../../DOA/weapons/prismatic-edge.ts";
import { steelHalberd } from "../../P24/weapons/steel-halberd.ts";
import { describe, expect, it } from "vitest";
import { guardedDissipation } from "./guarded-dissipation.ts";
import { proveLevelOneDraw } from "../../../testing/level-one-draw.ts";
/** @covers r5zs29xxoo-a2 */
describe("guarded-dissipation — level-gated draw", () =>
  proveLevelOneDraw(guardedDissipation, true));

/** @covers r5zs29xxoo-a1 */
describe("Guarded Dissipation — greatest controlled Sword power", () => {
  const setups = [
    { field: [], capacity: 0 },
    { field: [steelHalberd], capacity: 0 },
    { field: [trainingSword], capacity: 1 },
    { field: [trainingSword, trainingSword], capacity: 1 },
    { field: [trainingSword, prismaticEdge], capacity: 3 },
  ];
  for (const [index, setup] of setups.entries())
    for (const expired of [false, true]) {
      it(`prevents the maximum, not sum, setup=${index}, expired=${expired}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(guardedDissipation, false, "activation-discount"),
        );
        const opponent = grantTestChampionLevel(champion, 3);
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: expired ? "playerOne" : "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: setup.field,
              hand: [guardedDissipation, woodlandSquirrels, woodlandSquirrels],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [prismaticEdge],
              hand: [
                fireball,
                fireball,
                fireball,
                ...Array.from({ length: 12 }, () => woodlandSquirrels),
              ],
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          target = p.card(champion);
        if (!expired) q.pass();
        p.activate(guardedDissipation, {
          targets: { "target-1": [target.objectId] },
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        if (expired) advanceToMain(game, q.id);
        const wait = game.waitState();
        if (wait.kind === "opportunity" && wait.playerId === p.id) p.pass();
        for (let shot = 1; shot <= 3; shot++) {
          q.activate(q.cards(fireball, { zone: "hand" })[0]!, {
            targets: { "target-1": [target.objectId] },
            reservePayment: q
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, 4)
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.damage).toBe(
            4 * shot - (expired ? 0 : setup.capacity),
          );
        }
      });
    }
});
