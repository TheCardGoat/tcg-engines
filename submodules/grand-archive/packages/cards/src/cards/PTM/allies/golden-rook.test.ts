import { describe } from "vitest";
import { goldenRook } from "./golden-rook.ts";

import { proveDefenderDependentPower } from "../../../testing/defender-dependent-power.ts";
/** @covers iCgcAFU458-a1 */
describe("goldenRook defender-dependent power", () => {
  proveDefenderDependentPower(goldenRook, "even-life", 1);
});

import { expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSession } from "../../DOA/actions/training-session.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
for (const counters of [1, 2])
  it(`uses current defender life after ${counters} buff counters`, () => {
    const champion = lineageTestChampion("Own", 0),
      opponent = lineageTestChampion("Other", 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { field: [goldenRook], "main-deck": [woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: {
        champion: opponent,
        zones: {
          field: [giantTortoise],
          hand: [
            trainingSession,
            trainingSession,
            ...Array.from({ length: 4 }, () => woodlandSquirrels),
          ],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two"),
      target = q.card(giantTortoise);
    for (let i = 0; i < counters; i++) {
      q.activate(q.cards(trainingSession, { zone: "hand" })[0]!, {
        reservePayment: q
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
        targets: { "target-1": [target.objectId] },
      });
      passEffectsStack(game);
    }
    advanceToMain(game, p.id);
    p.declareAttack(p.card(goldenRook), target);
    game.resolveCombatWithoutRetaliation();
    expect(game.state.objects[target.objectId]!.damage).toBe(counters === 1 ? 1 : 2);
  });
