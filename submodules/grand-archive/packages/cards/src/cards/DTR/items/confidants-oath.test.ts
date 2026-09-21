import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { confidantsOath } from "./confidants-oath.ts";
import { condemnedTrinket } from "./condemned-trinket.ts";
import { flowingOubli } from "../actions/flowing-oubli.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createLineageTestChampion } from "../../../testing/champion-lineage.ts";
import {
  enableAllTestElements,
  grantTestChampionLevel,
} from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers nlufjh84vm-a1 @covers nlufjh84vm-a2 */
describe("Confidant's Oath — owned omen refinements and paid draw", () => {
  for (const ciel of [false, true])
    for (const count of [0, 1, 2, 4])
      it(`controller Ciel=${ciel}, ${count} newly placed omens`, () => {
        const champion = enableAllTestElements(
          grantTestChampionLevel(
            createLineageTestChampion(confidantsOath, ciel ? "Ciel" : "Other"),
            1,
          ),
        );
        const opponent = enableAllTestElements(createLineageTestChampion(confidantsOath, "Ciel"));
        const game = GrandArchiveTestEngine.startFixture({
          firstPlayer: "playerTwo",
          playerOne: {
            champion,
            zones: {
              field: [confidantsOath],
              banishment: [woodlandSquirrels],
              hand: [
                ...Array.from({ length: count }, () => flowingOubli),
                ...Array.from({ length: 2 * count + 4 }, () => woodlandSquirrels),
              ],
              "main-deck": Array.from({ length: 12 }, () => woodlandSquirrels),
            },
          },
          playerTwo: {
            champion: opponent,
            zones: {
              field: [confidantsOath, condemnedTrinket],
              hand: Array.from({ length: 3 }, () => woodlandSquirrels),
              graveyard: [woodlandSquirrels, woodlandSquirrels],
              "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
            },
          },
        });
        const p = game.player("player-one"),
          q = game.player("player-two"),
          source = p.card(confidantsOath),
          enemySource = q.card(confidantsOath);
        const counters = () =>
          game.state.objects[source.objectId]!.counters["named:refinement"] ?? 0;
        q.activateAbility(condemnedTrinket, "21oy1nd4nw-a1", {
          reservePayment: q
            .cards(woodlandSquirrels, { zone: "hand" })
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
        expect(counters()).toBe(0);
        answerDecision(game, "resolve-effect-choice", [
          q.cards(woodlandSquirrels, { zone: "graveyard" })[0]!.objectId,
        ]);
        passEffectsStack(game);
        expect(counters()).toBe(0);
        expect(game.state.objects[enemySource.objectId]!.counters["named:refinement"]).toBe(1);
        advanceToMain(game, p.id);
        const payment = (n: number) =>
          p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, n)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        for (const [index, action] of p.cards(flowingOubli, { zone: "hand" }).entries()) {
          const selected = p.zone("main-deck")[0]!;
          p.activate(action, { reservePayment: payment(2) });
          passEffectsStack(game);
          expect(counters()).toBe(ciel ? index : 0);
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          expect(game.state.objects[selected.objectId]!.zone).toBe("banishment");
          expect(game.state.objects[selected.objectId]!.counters.omen).toBe(1);
          expect(counters()).toBe(ciel ? index : 0);
          passEffectsStack(game);
          expect(counters()).toBe(ciel ? index + 1 : 0);
          expect(game.state.objects[enemySource.objectId]!.counters["named:refinement"]).toBe(1);
        }
        const before = game.state;
        expect(() =>
          p.activateAbility(source, "nlufjh84vm-a2", {
            reservePayment: payment(ciel && count >= 2 ? 1 : 2),
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        if (!ciel || count < 2) return;
        const deck = p.zone("main-deck"),
          hand = p.zone("hand").length;
        p.activateAbility(source, "nlufjh84vm-a2", { reservePayment: payment(2) });
        expect(counters()).toBe(count - 2);
        expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(true);
        expect(p.zone("main-deck")).toEqual(deck);
        expect(p.zone("hand")).toHaveLength(hand - 2);
        passEffectsStack(game);
        expect(p.zone("main-deck")).toEqual(deck.slice(1));
        expect(p.zone("hand")).toHaveLength(hand - 1);
        const rested = game.state;
        expect(() =>
          p.activateAbility(source, "nlufjh84vm-a2", { reservePayment: payment(2) }),
        ).toThrow();
        expect(game.state).toEqual(rested);
        if (count === 4) {
          advanceToMain(game, q.id);
          advanceToMain(game, p.id);
          expect(counters()).toBe(2);
          expect(game.state.objects[source.objectId]!.states.has("rested")).toBe(false);
          const nextDeck = p.zone("main-deck");
          p.activateAbility(source, "nlufjh84vm-a2", { reservePayment: payment(2) });
          passEffectsStack(game);
          expect(counters()).toBe(0);
          expect(p.zone("main-deck")).toEqual(nextDeck.slice(1));
        }
      });
});
