import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { regalInquisition } from "./regal-inquisition.ts";
import { reckoningsWake } from "./reckonings-wake.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers KVbuQJyWsU-a1 */
describe("Regal Inquisition — inspect and replace opposing cards", () => {
  it("cannot be activated during the opponent's main phase", () => {
    const champion = createClassBonusTestChampion(reckoningsWake, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion,
        zones: { hand: [regalInquisition, woodlandSquirrels, woodlandSquirrels] },
      },
      playerTwo: { champion },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    q.pass();
    const before = game.state;
    expect(() =>
      p.activate(regalInquisition, {
        targets: { "target-opponent": [q.id] },
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
  for (const [selection, deckSize] of [
    ["none", 6],
    ["hand", 6],
    ["memory", 6],
    ["mixed", 6],
    ["all", 6],
    ["all", 2],
    ["all", 0],
    ["empty", 0],
  ] as const)
    it(`${selection}, deck=${deckSize}`, () => {
      const champion = createClassBonusTestChampion(reckoningsWake, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [regalInquisition, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
            graveyard: [woodlandSquirrels],
            field: [woodlandSquirrels],
          },
        },
        playerTwo: {
          champion,
          zones: {
            hand: selection === "empty" ? [] : [woodlandSquirrels, woodlandSquirrels],
            memory: selection === "empty" ? [] : [woodlandSquirrels, woodlandSquirrels],
            "main-deck": Array.from({ length: deckSize }, () => woodlandSquirrels),
            graveyard: [woodlandSquirrels],
            field: [woodlandSquirrels],
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const hand = q.zone("hand").map((c) => c.objectId);
      const memory = q.zone("memory").map((c) => c.objectId);
      const deck = q.zone("main-deck").map((c) => c.objectId);
      const chosen =
        selection === "all"
          ? [...hand, ...memory]
          : selection === "hand"
            ? hand
            : selection === "memory"
              ? memory
              : selection === "mixed"
                ? [hand[0]!, memory[0]!]
                : [];
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      for (const target of [p.id, q.card(champion).objectId]) {
        const before = game.state;
        expect(() =>
          p.activate(regalInquisition, {
            targets: { "target-opponent": [target] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
      }
      const before = game.state;
      expect(() =>
        p.activate(regalInquisition, {
          targets: { "target-opponent": [q.id] },
          reservePayment: payment.slice(0, 1),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      p.activate(regalInquisition, {
        targets: { "target-opponent": [q.id] },
        reservePayment: payment,
      });
      expect(p.zone("memory")).toHaveLength(2);
      expect(game.state.eventHistory.filter((e) => e.type === "cards-looked-at")).toHaveLength(0);
      passEffectsStack(game);
      const looks = game.state.eventHistory.filter((e) => e.type === "cards-looked-at");
      expect(looks).toHaveLength(selection === "empty" ? 0 : 1);
      if (looks.length)
        expect(looks[0]).toMatchObject({
          playerId: p.id,
          actorId: p.id,
          objectIds: [...hand, ...memory],
        });
      if (game.state.decision) {
        expect(game.state.decision.playerId).toBe(p.id);
        for (const invalid of [
          [p.zone("hand")[0]!.objectId],
          [p.zone("memory")[0]!.objectId],
          [q.zone("graveyard")[0]!.objectId],
          [q.zone("field")[0]!.objectId],
          ...(hand.length ? [[hand[0]!, hand[0]!]] : []),
          ...(deck.length ? [[deck[0]!]] : []),
        ]) {
          const snapshot = game.state;
          expect(() => answerDecision(game, "resolve-effect-choice", invalid)).toThrow();
          expect(game.state).toEqual(snapshot);
        }
        answerDecision(game, "resolve-effect-choice", chosen);
      }
      passEffectsStack(game);
      expect(game.state.decision).toBeFalsy();
      expect(game.state.stack).toHaveLength(0);
      const replacement = deck.slice(0, chosen.length);
      expect(q.zone("hand").map((c) => c.objectId)).toEqual([
        ...hand.filter((id) => !chosen.includes(id)),
        ...replacement,
      ]);
      expect(q.zone("memory").map((c) => c.objectId)).toEqual(
        memory.filter((id) => !chosen.includes(id)),
      );
      expect(q.zone("main-deck").map((c) => c.objectId)).toEqual(deck.slice(replacement.length));
      for (const id of chosen) expect(game.state.objects[id]!.zone).toBe("graveyard");
      expect(q.zone("graveyard")).toHaveLength(1 + chosen.length);
      expect(
        game.state.eventHistory.filter((e) => e.type === "card-revealed").map((e) => e.objectId),
      ).toEqual(replacement);
      expect(p.cards(regalInquisition, { zone: "graveyard" })).toHaveLength(1);
      expect(p.zone("hand")).toHaveLength(1);
    });
});
