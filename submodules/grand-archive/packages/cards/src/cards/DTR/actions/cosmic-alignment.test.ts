import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { cosmicAlignment } from "./cosmic-alignment.ts";
import { astralShard } from "../tokens/astral-shard.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers b2buhbediq-a1 */
describe("Cosmic Alignment — replace only the next owned Glimpse this turn", () => {
  for (const mode of ["immediate", "opponent", "expiry"] as const)
    it(`handles ${mode} before the next controlled Glimpse and then consumes the replacement`, () => {
      const champion = createClassBonusTestChampion(cosmicAlignment, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [astralShard, astralShard],
            hand: [cosmicAlignment, ...Array.from({ length: 6 }, () => woodlandSquirrels)],
            "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            field: [astralShard],
            "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        deck = p.zone("main-deck"),
        shards = p.cards(astralShard);
      const payment = p
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      const before = game.state;
      expect(() => p.activate(cosmicAlignment, { reservePayment: payment.slice(1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(cosmicAlignment, { reservePayment: payment });
      passEffectsStack(game);
      expect(p.zone("hand")).toHaveLength(0);
      expect(p.zone("main-deck")).toEqual(deck);
      const finishGlimpse = (playerId: string, ids: readonly string[]) => {
        expect(game.state.decision).toMatchObject({
          kind: "resolve-glimpse",
          playerId,
          cardIds: ids,
        });
        answerDecision(game, "resolve-glimpse", { kind: "reorder", top: ids, bottom: [] });
        passEffectsStack(game);
      };
      if (mode === "opponent") {
        p.pass();
        const opposingDeck = q.zone("main-deck");
        q.activateAbility(q.card(astralShard), "eP07Xxscuq-a1");
        passEffectsStack(game);
        finishGlimpse(
          q.id,
          opposingDeck.slice(0, 2).map((c) => c.objectId),
        );
        expect(q.zone("hand")).toHaveLength(0);
        expect(q.zone("main-deck")).toEqual(opposingDeck);
      }
      if (mode === "expiry") {
        advanceToMain(game, q.id);
        q.pass();
      }
      p.activateAbility(shards[0]!, "eP07Xxscuq-a1");
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      if (mode === "expiry")
        finishGlimpse(
          p.id,
          deck.slice(0, 2).map((c) => c.objectId),
        );
      else expect(game.state.decision).toBeNull();
      expect(p.zone("hand")).toEqual(mode === "expiry" ? [] : deck.slice(0, 2));
      expect(p.zone("main-deck")).toEqual(mode === "expiry" ? deck : deck.slice(2));
      if (mode === "expiry") q.pass();
      const remaining = p.zone("main-deck");
      p.activateAbility(shards[1]!, "eP07Xxscuq-a1");
      passEffectsStack(game);
      finishGlimpse(
        p.id,
        remaining.slice(0, 2).map((c) => c.objectId),
      );
      expect(p.zone("main-deck")).toEqual(remaining);
      expect(p.zone("hand")).toHaveLength(mode === "expiry" ? 0 : 2);
      expect(p.zone("memory")).toHaveLength(6);
    });
});

/** @covers b2buhbediq-a1 */
describe("Cosmic Alignment — competing replacements", () => {
  for (const chosen of [0, 1])
    it(`resumes ordered replacement ${chosen} without opening a Glimpse prompt`, () => {
      const champion = createClassBonusTestChampion(cosmicAlignment, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            field: [astralShard, astralShard, astralShard],
            hand: [
              cosmicAlignment,
              cosmicAlignment,
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: { champion },
      });
      const p = game.player("player-one"),
        deck = p.zone("main-deck"),
        shards = p.cards(astralShard);
      for (const card of p.cards(cosmicAlignment)) {
        p.activate(card, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 6)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        });
        passEffectsStack(game);
      }
      for (let n = 0; n < 2; n++) {
        p.activateAbility(shards[n]!, "eP07Xxscuq-a1");
        passEffectsStack(game);
        if (n === 0) {
          const decision = game.state.decision;
          if (decision?.kind !== "choose-replacement")
            throw new Error("Expected replacement order");
          expect(decision.mode).toBe("order");
          expect(decision.candidateIds).toHaveLength(2);
          answerDecision(game, "choose-replacement", decision.candidateIds[chosen]!);
          passEffectsStack(game);
        }
        expect(game.state.decision).toBeNull();
        expect(p.zone("hand")).toEqual(deck.slice(0, 2 * (n + 1)));
      }
      p.activateAbility(shards[2]!, "eP07Xxscuq-a1");
      passEffectsStack(game);
      expect(game.state.decision).toMatchObject({
        kind: "resolve-glimpse",
        cardIds: deck.slice(4, 6).map((c) => c.objectId),
      });
      answerDecision(game, "resolve-glimpse", {
        kind: "reorder",
        top: deck.slice(4, 6).map((c) => c.objectId),
        bottom: [],
      });
      passEffectsStack(game);
      expect(p.zone("hand")).toEqual(deck.slice(0, 4));
      expect(p.zone("main-deck")).toEqual(deck.slice(4));
    });
});
