import type { GrandArchivePantheonPlayerSetup } from "@tcg/grand-archive-engine/runtime";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import { lesserBoonOfApollo } from "../boons/lesser-boon-of-apollo.ts";
import { greaterBoonOfHorses } from "../boons/greater-boon-of-horses.ts";
import { pantheonBarrier } from "../tokens/pantheon-barrier.ts";
import { surpriseReveal } from "./surprise-reveal.ts";

/** @covers pi3DyYU6Sa-a1 @covers pi3DyYU6Sa-a2 */
describe("Surprise Reveal — Pantheon reveal, favor, and class draw", () => {
  for (const matching of [false, true])
    for (const prepared of [false, true]) {
      it(`reveals only the targeted opponent, class=${matching}, opposing memory=${prepared}`, () => {
        const champion = createClassBonusTestChampion(
          surpriseReveal,
          matching,
          "activation-discount",
        );
        const player = (id: string): GrandArchivePantheonPlayerSetup => ({
          id,
          name: id,
          startingChampionDefinitionId: champion.canonicalId,
          mainDeck: [{ definitionId: surpriseReveal.canonicalId, count: 30 }],
          materialDeck: [{ definitionId: champion.canonicalId, count: 1 }],
          pantheon: {
            lesserBoonDefinitionId: lesserBoonOfApollo.canonicalId,
            greaterBoonDefinitionId: greaterBoonOfHorses.canonicalId,
            barrierDefinitionId: pantheonBarrier.canonicalId,
          },
        });
        const game = GrandArchiveTestEngine.start(
          [champion, surpriseReveal, lesserBoonOfApollo, greaterBoonOfHorses, pantheonBarrier],
          {
            mode: "pantheon",
            randomSeed: 43,
            firstPlayerId: "player-two",
            players: [player("player-one"), player("player-two"), player("player-three")],
          },
          { validateDeckConstruction: false, skipPregameForTests: true },
        );
        const p = game.player("player-one"),
          q = game.player("player-two"),
          r = game.player("player-three");
        advanceToMain(game, q.id);
        for (let turn = 0; turn < 3; turn++) advanceToMain(game, q.id, game.state.turn.number);
        if (prepared) {
          const cards = q.zone("hand");
          q.activate(cards[0]!, {
            targets: { "target-opponent": [r.id] },
            reservePayment: cards.slice(1, 3).map((c) => ({ kind: "card", cardId: c.objectId })),
          });
          passEffectsStack(game);
          expect(game.state.players[q.id]!.states["crowds-favor"]).toBe(true);
        }
        q.pass();
        r.pass();
        const cards = p.zone("hand"),
          deck = p.zone("main-deck"),
          hand = q.zone("hand"),
          memory = q.zone("memory"),
          thirdHand = r.zone("hand");
        const payment = cards
          .slice(1, 3)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const before = game.state;
        expect(() =>
          p.activate(cards[0]!, {
            targets: { "target-opponent": [p.id] },
            reservePayment: payment,
          }),
        ).toThrow();
        expect(game.state).toEqual(before);
        p.activate(cards[0]!, { targets: { "target-opponent": [q.id] }, reservePayment: payment });
        const historyStart = game.state.eventHistory.length,
          remainingHand = p.zone("hand");
        expect(p.zone("main-deck")).toEqual(deck);
        passEffectsStack(game);
        expect(game.state.decision).toBeNull();
        expect(p.zone("hand")).toEqual(matching ? [...remainingHand, deck[0]!] : remainingHand);
        expect(p.zone("main-deck")).toEqual(matching ? deck.slice(1) : deck);
        expect(q.zone("hand")).toEqual(hand);
        expect(q.zone("memory")).toEqual(memory);
        expect(r.zone("hand")).toEqual(thirdHand);
        const reveals = game.state.eventHistory
          .slice(historyStart)
          .filter((e) => e.type === "card-revealed");
        expect(reveals.map((e) => e.objectId).sort()).toEqual(
          [...hand, ...memory].map((c) => c.objectId).sort(),
        );
        expect(game.state.players[p.id]!.states["crowds-favor"]).toBe(true);
        expect(game.state.players[q.id]!.states["crowds-favor"] ?? false).toBe(false);
        expect(game.state.players[r.id]!.states["crowds-favor"] ?? false).toBe(false);
      });
    }
});
