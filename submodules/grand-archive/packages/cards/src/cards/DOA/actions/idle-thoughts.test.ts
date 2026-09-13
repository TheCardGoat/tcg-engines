import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { idleThoughts } from "./idle-thoughts.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
/** @covers rWhFC8XBaH-a1 */
describe("Idle Thoughts lets its controller order only the available top four cards", () => {
  for (const count of [0, 1, 2, 4, 5])
    it(`deck count=${count}`, () => {
      const champion = createClassBonusTestChampion(idleThoughts, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          playerOne: {
            champion,
            zones: {
              hand: [idleThoughts, woodlandSquirrels],
              "main-deck": Array.from({ length: count }, () => woodlandSquirrels),
            },
          },
          playerTwo: { champion, zones: { "main-deck": [woodlandSquirrels] } },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        top = deck.slice(0, 4).map((c) => c.objectId),
        order = [...top].reverse(),
        opponent = q.zone("main-deck");
      p.activate(idleThoughts, {
        reservePayment: [
          { kind: "card", cardId: p.card(woodlandSquirrels, { zone: "hand" }).objectId },
        ],
      });
      passEffectsStack(game);
      if (count > 1) {
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-choice",
          playerId: p.id,
          selection: { ordered: true },
        });
        const before = game.state;
        for (const bad of [
          [q.card(champion).objectId, ...order.slice(1)],
          order.slice(1),
          [order[0]!, order[0]!, ...order.slice(2)],
          ...(count > 4 ? [[deck[4]!.objectId, ...order.slice(1)]] : []),
        ]) {
          expect(() => answerDecision(game, "resolve-effect-choice", bad)).toThrow();
          expect(game.state).toEqual(before);
        }
        const decision = game.state.decision;
        if (decision?.kind !== "resolve-effect-choice") throw new Error("Expected order choice");
        expect(() =>
          q.execute({
            move: "answer-decision",
            decisionId: decision.id,
            stateVersion: decision.stateVersion,
            answer: order,
          }),
        ).toThrow();
        answerDecision(game, "resolve-effect-choice", order);
        passEffectsStack(game);
      }
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual([
        ...order,
        ...deck.slice(4).map((c) => c.objectId),
      ]);
      expect(q.zone("main-deck")).toEqual(opponent);
      expect(p.zone("hand")).toHaveLength(0);
      expect(p.card(idleThoughts, { zone: "graveyard" })).toBeDefined();
    });
});
