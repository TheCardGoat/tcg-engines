import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { tempestDownfall } from "./tempest-downfall.ts";
import { zephyr } from "../../DOA/actions/zephyr.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 4etkr73opc-a1 */
describe("Tempest Downfall — suppression this turn", () => {
  const events = [
    { kind: "none", otherActor: false, otherTarget: false },
    ...["ally", "regalia"].flatMap((kind) =>
      [false, true].flatMap((otherActor) =>
        [false, true].map((otherTarget) => ({ kind, otherActor, otherTarget })),
      ),
    ),
  ];
  for (const matching of [false, true])
    for (const event of events)
      for (const expired of [false, true]) {
        it(`class=${matching}, suppress=${event.kind}, opposing actor=${event.otherActor}, opposing target=${event.otherTarget}, expired=${expired}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(tempestDownfall, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                field: [woodlandSquirrels, trainingSword],
                hand: [
                  tempestDownfall,
                  zephyr,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [woodlandSquirrels, trainingSword],
                hand: [zephyr, woodlandSquirrels, woodlandSquirrels],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = (player: typeof p, n: number) =>
            player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (event.kind !== "none") {
            const actor = event.otherActor ? q : p,
              target = (event.otherTarget ? q : p).card(
                event.kind === "ally" ? woodlandSquirrels : trainingSword,
                { zone: "field" },
              );
            if (event.otherActor) p.pass();
            actor.activate(zephyr, {
              reservePayment: pay(actor, 2),
              targets: { "target-1": [target.objectId] },
            });
            passEffectsStack(game);
            expect(game.state.objects[target.objectId]!.zone).toBe("banishment");
          }
          if (expired) advanceToMain(game, p.id, game.state.turn.number);
          const cost = matching && event.kind === "ally" && !expired ? 0 : 3,
            before = game.state;
          expect(() =>
            p.activate(tempestDownfall, {
              reservePayment: pay(p, cost ? cost - 1 : 1),
              targets: { "target-1": [q.card(champion).objectId] },
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(tempestDownfall, {
            reservePayment: pay(p, cost),
            targets: { "target-1": [q.card(champion).objectId] },
          });
          passEffectsStack(game);
          expect(game.state.objects[q.card(champion).objectId]!.damage).toBe(3);
          expect(p.cards(tempestDownfall, { zone: "graveyard" })).toHaveLength(1);
        });
      }
});

import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
/** @covers 4etkr73opc-a2 */
describe("Tempest Downfall — additional damage on a new ally", () => {
  for (const matching of [false, true])
    for (const opposing of [false, true])
      for (const entry of ["old", "new", "previous-turn"]) {
        it(`class=${matching}, opposing ally=${opposing}, entry=${entry}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(tempestDownfall, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            firstPlayer: opposing ? "playerTwo" : "playerOne",
            playerOne: {
              champion,
              zones: {
                field: !opposing && entry === "old" ? [giantTortoise] : [],
                hand: [
                  tempestDownfall,
                  ...(!opposing && entry !== "old" ? [giantTortoise] : []),
                  ...Array.from({ length: 7 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: opposing && entry === "old" ? [giantTortoise] : [],
                hand: [
                  ...(opposing && entry !== "old" ? [giantTortoise] : []),
                  ...Array.from({ length: 4 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            actor = opposing ? q : p,
            target = actor.card(giantTortoise);
          const pay = (player: typeof p, n: number) =>
            player
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          if (entry !== "old") {
            actor.activate(target, { reservePayment: pay(actor, 4) });
            passEffectsStack(game);
          }
          if (entry !== "new") advanceToMain(game, actor.id, game.state.turn.number);
          if (opposing) q.pass();
          const start = game.state.eventHistory.length;
          p.activate(tempestDownfall, {
            reservePayment: pay(p, 3),
            targets: { "target-1": [target.objectId] },
          });
          passEffectsStack(game);
          const events = game.state.eventHistory
            .slice(start)
            .filter(
              (event) => event.type === "damage-marked" && event.objectId === target.objectId,
            );
          expect(
            events.map((event) => (event.type === "damage-marked" ? event.amount : 0)),
          ).toEqual(entry === "new" ? [3, 3] : [3]);
          expect(game.state.objects[target.objectId]!.zone).toBe(
            entry === "new" ? "graveyard" : "field",
          );
        });
      }
});
