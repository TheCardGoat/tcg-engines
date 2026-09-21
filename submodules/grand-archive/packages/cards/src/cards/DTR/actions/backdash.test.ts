import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { backdash } from "./backdash.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers mf0jmealoy-a1 @covers mf0jmealoy-a2 */
describe("Backdash — distant and restricted draw", () => {
  for (const matching of [true, false])
    for (const level of [1, 2, 3])
      for (const own of [true, false]) {
        it(`targets ${own ? "own ally" : "opposing champion"}, class=${matching}, level=${level}`, () => {
          const champion = grantTestChampionLevel(
            createClassBonusTestChampion(backdash, matching, "activation-discount"),
            level,
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [backdash, woodlandSquirrels],
                field: [woodlandSquirrels, trainingSword],
                "main-deck": [woodlandSquirrels, woodlandSquirrels],
              },
            },
            playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const target = own ? p.card(woodlandSquirrels, { zone: "field" }) : q.card(champion);
          const top = p.zone("main-deck")[0]!;
          const payment = [
            { kind: "card" as const, cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
          ];
          const before = game.state;
          expect(() =>
            p.activate(backdash, {
              targets: { "target-1": [p.card(trainingSword).objectId] },
              reservePayment: payment,
            }),
          ).toThrow();
          expect(game.state).toEqual(before);
          p.activate(backdash, {
            targets: { "target-1": [target.objectId] },
            reservePayment: payment,
          });
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
          expect(game.state.objects[top.objectId]!.zone).toBe("main-deck");
          passEffectsStack(game);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(true);
          expect(game.state.objects[top.objectId]!.zone).toBe(
            matching && level >= 2 ? "hand" : "main-deck",
          );
          advanceToMain(game, q.id);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(!own);
          advanceToMain(game, p.id);
          expect(game.state.objects[target.objectId]!.states.has("distant")).toBe(false);
        });
      }
});
