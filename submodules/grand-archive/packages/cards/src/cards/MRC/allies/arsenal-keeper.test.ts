import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { arsenalKeeper } from "./arsenal-keeper.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers rn0yetaebj-a1 */
describe("Arsenal Keeper — optional damage then weapon choice", () => {
  for (const matching of [false, true])
    for (const accept of [false, true])
      for (const ownWeapons of [0, 1, 2]) {
        it(`class=${matching}, accept=${accept}, weapons=${ownWeapons}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(arsenalKeeper, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [arsenalKeeper, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
                field: [
                  woodlandSquirrels,
                  ...Array.from({ length: ownWeapons }, () => trainingSword),
                ],
              },
            },
            playerTwo: { champion, zones: { field: [trainingSword] } },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const swords = p.cards(trainingSword),
            other = q.card(trainingSword),
            hero = p.card(champion);
          const beforeCounters = swords.map(
            (c) => game.state.objects[c.objectId]!.counters.durability ?? 0,
          );
          const otherCounters = game.state.objects[other.objectId]!.counters.durability ?? 0;
          p.activate(arsenalKeeper, {
            reservePayment: p
              .cards(woodlandSquirrels, { zone: "hand" })
              .map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.objects[hero.objectId]!.damage).toBe(0);
          if (matching) {
            answerDecision(game, "resolve-optional-effect", accept);
            passEffectsStack(game);
          }
          if (matching && accept && ownWeapons) {
            expect(game.state.objects[hero.objectId]!.damage).toBe(2);
            const before = game.state;
            for (const ids of [
              [],
              [other.objectId],
              [hero.objectId],
              [p.card(woodlandSquirrels, { zone: "field" }).objectId],
            ]) {
              expect(() => answerDecision(game, "resolve-effect-choice", ids)).toThrow();
              expect(game.state).toEqual(before);
            }
            answerDecision(game, "resolve-effect-choice", [swords[0]!.objectId]);
            passEffectsStack(game);
          }
          expect(game.state.objects[hero.objectId]!.damage).toBe(matching && accept ? 2 : 0);
          for (const [i, sword] of swords.entries())
            expect(game.state.objects[sword.objectId]!.counters.durability ?? 0).toBe(
              beforeCounters[i]! + (matching && accept && i === 0 ? 1 : 0),
            );
          expect(game.state.objects[other.objectId]!.counters.durability ?? 0).toBe(otherCounters);
          expect(game.state.decision).toBeNull();
        });
      }
});
