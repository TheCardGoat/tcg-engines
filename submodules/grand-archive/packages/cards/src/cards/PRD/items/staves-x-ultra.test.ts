import { describe } from "vitest";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";

import { proveIntrinsicLink } from "../../../testing/intrinsic-link.ts";
import { stavesXUltra } from "./staves-x-ultra.ts";

/** @covers 33mWk4HYLF-a1 */
describe("Staves X Ultra — Link", () => {
  proveIntrinsicLink({
    card: stavesXUltra,
    host: trainingSword,
    invalidHost: giantTortoise,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  requireSingleFace,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";

/** @covers 33mWk4HYLF-a3 */
describe("Staves X Ultra — banished end-phase counter and linked objects", () => {
  for (const matching of [false, true])
    for (const element of [false, true])
      for (const zone of ["banishment", "graveyard"] as const) {
        it(`Lorraine=${matching}, arcane=${element}, source=${zone}`, () => {
          const base = createLineageTestChampion(stavesXUltra, matching ? "Lorraine" : "Other");
          const champion = enableAllTestElements({
            ...base,
            layout: {
              kind: "single-faced",
              face: { ...requireSingleFace(base), elements: [element ? "ARCANE" : "NORM"] },
            },
          });
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                [zone]: [stavesXUltra],
                hand: [stavesXUltra, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
                field: [trainingSword, giantTortoise],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: {
                field: [trainingSword],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            sword = p.card(trainingSword),
            linked = p.card(stavesXUltra, { zone: "hand" }),
            source = p.card(stavesXUltra, { zone });
          p.activate(linked, {
            targets: { "intrinsic-link-target": [sword.objectId] },
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[linked.objectId]!.hostId).toBe(sword.objectId);
          for (let turn = 1; turn <= 2; turn++) {
            for (let i = 0; i < 64 && game.state.turn.phase !== "end"; i++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.turn.phase).toBe("end");
            passEffectsStack(game);
            if (matching && element && zone === "banishment") {
              const before = game.state;
              for (const ids of [
                [],
                [q.card(trainingSword).objectId],
                [linked.objectId],
                [p.card(giantTortoise).objectId],
              ]) {
                expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
                expect(game.state).toEqual(before);
              }
              answerDecision(game, "resolve-effect-choice", [sword.objectId]);
              passEffectsStack(game);
            }
            const count = matching && element && zone === "banishment" ? turn : 0;
            expect(game.state.objects[sword.objectId]!.counters.static ?? 0).toBe(count);
            expect(game.state.objects[linked.objectId]!.counters.static ?? 0).toBe(count);
            expect(game.state.objects[source.objectId]!.counters.static ?? 0).toBe(0);
            expect(game.state.objects[q.card(trainingSword).objectId]!.counters.static ?? 0).toBe(
              0,
            );
            expect(game.state.decision).toBeNull();
            advanceToMain(game, q.id);
            advanceToMain(game, p.id, game.state.turn.number);
          }
        });
      }
});
