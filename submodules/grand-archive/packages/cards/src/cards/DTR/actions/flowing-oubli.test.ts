import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { flowingOubli } from "./flowing-oubli.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import {
  createClassBonusTestChampion,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers vcxw3yh2t4-a1 @covers vcxw3yh2t4-a2 */
describe("Flowing Oubli — level discount, private look and chosen omen", () => {
  for (const level of [0, 1, 2])
    for (const mode of ["empty", "single", "first", "second"] as const)
      it(`level ${level}, choose ${mode}`, () => {
        const champion = grantTestChampionLevel(
          createClassBonusTestChampion(flowingOubli, false, "activation-discount"),
          level,
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [flowingOubli, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
              "main-deck": Array.from(
                { length: mode === "empty" ? 0 : mode === "single" ? 1 : 4 },
                () => woodlandSquirrels,
              ),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          deck = p.zone("main-deck"),
          looked = deck.slice(0, 2);
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, level === 0 ? 3 : 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() => p.activate(flowingOubli, { reservePayment: payment.slice(1) })).toThrow();
        expect(game.state).toEqual(before);
        p.activate(flowingOubli, { reservePayment: payment });
        expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
        passEffectsStack(game);
        const selected = looked[mode === "second" ? 1 : 0];
        if (looked.length === 2) {
          for (const invalid of [
            [],
            looked.map((c) => c.objectId),
            [deck[2]!.objectId],
            [q.zone("main-deck")[0]!.objectId],
            [p.cards(woodlandSquirrels, { zone: "hand" })[0]!.objectId],
          ]) {
            const checkpoint = game.state;
            expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
            expect(game.state).toEqual(checkpoint);
          }
        }
        if (selected) {
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        if (selected) {
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
        }
        expect(p.zone("main-deck")).toEqual([
          ...deck.slice(2),
          ...looked.filter((c) => c !== selected),
        ]);
        expect(p.zone("banishment")).toHaveLength(selected ? 1 : 0);
        expect(p.zone("memory")).toHaveLength(level === 0 ? 3 : 2);
        const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
        expect(looks).toHaveLength(looked.length ? 1 : 0);
        if (looked.length)
          expect(looks[0]).toMatchObject({
            playerId: p.id,
            actorId: p.id,
            objectIds: looked.map((c) => c.objectId),
          });
        expect(game.state.eventHistory.filter((e) => e.type === "card-revealed")).toHaveLength(0);
        expect(q.zone("main-deck")).toHaveLength(1);
      });
});
