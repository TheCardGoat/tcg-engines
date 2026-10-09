import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { singeingLeap } from "../../PTM/actions/singeing-leap.ts";
import { pearledPrayer } from "./pearled-prayer.ts";
/** @covers HLcmZLe7Xr-a1 */
describe("Pearled Prayer — activation phase recovery", () => {
  for (const matching of [false, true])
    for (const phase of ["own-main", "opponent-main", "own-end"])
      for (const damage of [0, 3, 6, 9])
        it(`class=${matching}, phase=${phase}, damage=${damage}`, () => {
          const champion = enableAllTestElements(
            createClassBonusTestChampion(pearledPrayer, matching, "activation-discount"),
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  pearledPrayer,
                  ...Array.from({ length: damage }, () => singeingLeap),
                  ...Array.from({ length: damage + 3 }, () => woodlandSquirrels),
                ],
                "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels) },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const pay = (n: number) =>
            p
              .cards(woodlandSquirrels, { zone: "hand" })
              .slice(0, n)
              .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          for (const leap of p.cards(singeingLeap, { zone: "hand" })) {
            p.activate(leap, { reservePayment: pay(1) });
            passEffectsStack(game);
          }
          if (phase === "opponent-main") {
            advanceToMain(game, q.id);
            q.pass();
          }
          if (phase === "own-end") {
            for (let i = 0; i < 16 && game.state.turn.phase !== "end"; i++) {
              const wait = game.waitState();
              if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
              game.player(wait.playerId).pass();
            }
            expect(game.state.turn.phase).toBe("end");
          }
          const deck = p.zone("main-deck"),
            otherDeck = q.zone("main-deck");
          const before = game.state;
          expect(() => p.activate(pearledPrayer, { reservePayment: pay(1) })).toThrow();
          expect(game.state).toEqual(before);
          p.activate(pearledPrayer, { reservePayment: pay(2) });
          const memory = p.zone("memory"),
            hand = p.zone("hand");
          expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(damage);
          passEffectsStack(game);
          expect(p.zone("memory")).toEqual([...memory, deck[0]!]);
          expect(p.zone("main-deck")).toEqual(deck.slice(1));
          expect(p.zone("hand")).toEqual(hand);
          expect(q.zone("main-deck")).toEqual(otherDeck);
          expect(game.state.objects[p.card(champion).objectId]?.damage).toBe(
            Math.max(0, damage - (phase === "own-main" ? 7 : 4)),
          );
        });
});
