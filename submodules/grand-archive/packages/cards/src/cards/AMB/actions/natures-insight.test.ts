import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { naturesInsight } from "./natures-insight.ts";

/** @covers 3bS1Y9OQrF-a1 */
describe("Nature's Insight — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: naturesInsight, discount: 2 });
});

/** @covers 3bS1Y9OQrF-a2 */
describe("Nature's Insight — preserve a memory card and X deck cards", () => {
  it("uses the revealed memory card's reserve cost as X and preserves that many deck cards", () => {
    const champion = createClassBonusTestChampion(naturesInsight, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [naturesInsight, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          memory: [giantTortoise],
          "main-deck": Array.from({ length: 5 }, () => woodlandSquirrels),
        },
      },
      playerTwo: { champion, zones: { memory: [giantTortoise] } },
    });
    const player = game.player("player-one");
    const revealed = player.card(giantTortoise, { zone: "memory" });
    player.activate(naturesInsight, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    const beforeInvalid = game.state;
    expect(() =>
      answerDecision(game, "resolve-effect-choice", [
        game.player("player-two").card(giantTortoise, { zone: "memory" }).objectId,
      ]),
    ).toThrow();
    expect(game.state).toEqual(beforeInvalid);
    const deck = player.zone("main-deck");
    answerDecision(game, "resolve-effect-choice", [revealed.objectId]);
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(game.state.stack).toHaveLength(0);
    expect(game.state.objects[revealed.objectId]!.zone).toBe("material-deck");
    expect(game.state.objects[revealed.objectId]!.states.has("preserved")).toBe(true);
    for (const card of deck.slice(0, 4)) {
      expect(game.state.objects[card.objectId]!.zone).toBe("material-deck");
      expect(game.state.objects[card.objectId]!.states.has("preserved")).toBe(true);
    }
    expect(player.zone("main-deck")).toEqual(deck.slice(4));
  });
});

import { favorableWinds } from "../../DOA/actions/favorable-winds.ts";
/** @covers 3bS1Y9OQrF-a2 */
describe("Nature's Insight — preserve the selected memory card without reopening its choice", () => {
  for (const matching of [false, true])
    for (const entry of [
      { card: woodlandSquirrels, cost: 0 },
      { card: favorableWinds, cost: 1 },
      { card: giantTortoise, cost: 4 },
    ])
      for (const length of [0, 1, 3, 6])
        it(`matching=${matching}, selected=${entry.card.slug}, deck=${length}`, () => {
          const champion = createClassBonusTestChampion(
            naturesInsight,
            matching,
            "activation-discount",
          );
          const game = GrandArchiveTestEngine.startFixture({
            playerOne: {
              champion,
              zones: {
                hand: [
                  naturesInsight,
                  favorableWinds,
                  ...Array.from({ length: 5 }, () => woodlandSquirrels),
                ],
                memory: [woodlandSquirrels, favorableWinds, giantTortoise],
                "main-deck": Array.from({ length }, () => woodlandSquirrels),
              },
            },
            playerTwo: {
              champion,
              zones: { memory: [giantTortoise], "main-deck": [woodlandSquirrels] },
            },
          });
          const p = game.player("player-one"),
            q = game.player("player-two");
          const selected = p.card(entry.card, { zone: "memory" });
          const source = p.card(naturesInsight, { zone: "hand" });
          const deck = p.zone("main-deck");
          const cost = matching ? 3 : 5;
          const payment = p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, cost)
            .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
          p.activate(source, { reservePayment: payment });
          passEffectsStack(game);
          const memory = p.zone("memory");
          const before = game.state;
          for (const bad of [
            [],
            [selected.objectId, selected.objectId],
            [p.card(favorableWinds, { zone: "hand" }).objectId],
            [q.zone("memory")[0]!.objectId],
            [source.objectId],
            ...deck.slice(0, 1).map((c) => [c.objectId]),
          ]) {
            expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
            expect(game.state).toEqual(before);
          }
          answerDecision(game, "resolve-effect-choice", [selected.objectId]);
          passEffectsStack(game);
          expect(game.state.objects[selected.objectId]?.zone).toBe("material-deck");
          const preserved = [selected, ...deck.slice(0, entry.cost)];
          if (game.state.decision?.kind === "resolve-effect-choice") {
            expect(game.state.decision.selection.id).toBe("deck-cards");
            answerDecision(
              game,
              "resolve-effect-choice",
              deck.slice(0, entry.cost).map((c) => c.objectId),
            );
            passEffectsStack(game);
          }
          expect(game.state.decision).toBeNull();
          expect(game.state.stack).toHaveLength(0);
          expect(p.zone("material-deck").map((c) => c.objectId)).toEqual(
            preserved.map((c) => c.objectId),
          );
          for (const card of preserved) {
            expect(game.state.objects[card.objectId]?.states.has("preserved")).toBe(true);
            expect(game.state.objects[card.objectId]?.facing).toBe("face-up");
          }
          const opponentView = q.view().players.find((player) => player.id === p.id)!.zones[
            "material-deck"
          ];
          if (opponentView.visibility !== "hidden")
            throw new Error("Material deck must remain a private zone");
          expect(opponentView.revealedObjects.map((card) => card.id)).toEqual(
            preserved.map((card) => card.objectId),
          );
          expect(p.zone("memory").map((c) => c.objectId)).toEqual(
            memory.filter((c) => c.objectId !== selected.objectId).map((c) => c.objectId),
          );
          expect(p.zone("main-deck")).toEqual(deck.slice(entry.cost));
          expect(
            game.state.eventHistory
              .filter((e) => e.type === "card-revealed")
              .map((e) => e.objectId),
          ).toEqual(preserved.map((c) => c.objectId));
          expect(p.zone("graveyard")).toEqual([source]);
          expect(q.zone("memory")).toHaveLength(1);
          expect(q.zone("main-deck")).toHaveLength(1);
          expect(game.state.winnerIds).toEqual([]);
        });
});
