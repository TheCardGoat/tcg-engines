import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { mementoMori } from "./memento-mori.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { umbilicalRitual } from "../../PRD/actions/umbilical-ritual.ts";
import {
  createClassBonusTestChampion,
  enableAllTestElements,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers 9xycwz9gv4-a1 @covers 9xycwz9gv4-a2 */
describe("Memento Mori's prize threshold and slow draw", () => {
  for (const matching of [false, true])
    for (const deaths of [6, 7])
      it(`requires six prizes and slow timing: class=${matching}, deaths=${deaths}`, () => {
        const champion = enableAllTestElements(
          createClassBonusTestChampion(mementoMori, matching, "activation-discount"),
        );
        const game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              field: [mementoMori, ...Array.from({ length: deaths }, () => woodlandSquirrels)],
              hand: Array.from({ length: deaths }, () => umbilicalRitual),
              "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion,
            zones: {
              field: [mementoMori],
              "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two");
        const source = p.card(mementoMori),
          opposing = q.card(mementoMori);
        const reject = () => {
          const before = game.state;
          expect(() => p.activateAbility(source, "9xycwz9gv4-a2")).toThrow();
          expect(game.state).toEqual(before);
        };
        for (let n = 0; n < deaths; n++) {
          if (n < 6) reject();
          p.activate(p.cards(umbilicalRitual, { zone: "hand" })[0]!, {
            costSelections: [[p.cards(woodlandSquirrels, { zone: "field" })[0]!.objectId]],
          });
          expect(game.state.objects[source.objectId]!.counters["named:prize"] ?? 0).toBe(n);
          // Both items see the death. Resolve their ordering through the public decision.
          while (game.state.decision?.kind === "order-triggered-abilities") {
            const decision = game.state.decision;
            game.player(decision.playerId).execute({
              move: "answer-decision",
              decisionId: decision.id,
              stateVersion: decision.stateVersion,
              answer: decision.pendingTriggerIds,
            });
          }
          if (n >= 6) reject();
          passEffectsStack(game);
          expect(game.state.objects[source.objectId]!.counters["named:prize"]).toBe(n + 1);
          expect(game.state.objects[opposing.objectId]!.counters["named:prize"]).toBe(n + 1);
        }
        advanceToMain(game, q.id);
        q.pass();
        reject();
        advanceToMain(game, p.id);
        const hand = p.zone("hand").map((c) => c.objectId),
          deck = p.zone("main-deck").map((c) => c.objectId);
        const opponentHand = q.zone("hand");
        p.activateAbility(source, "9xycwz9gv4-a2");
        expect(p.cards(mementoMori, { zone: "banishment" })).toEqual([source]);
        expect(game.state.objects[source.objectId]!.counters["named:prize"] ?? 0).toBe(0);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual(hand);
        reject();
        passEffectsStack(game);
        expect(p.zone("hand").map((c) => c.objectId)).toEqual([...hand, ...deck.slice(0, 3)]);
        expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(3));
        expect(q.zone("hand")).toEqual(opponentHand);
        expect(q.cards(mementoMori, { zone: "field" })).toEqual([opposing]);
        expect(game.state.objects[opposing.objectId]!.counters["named:prize"]).toBe(deaths);
      });
});
