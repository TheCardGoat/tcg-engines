import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { chronowarp } from "./chronowarp.ts";
import { trainingSword } from "../../AMB/weapons/training-sword.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";

/** @covers n2wtz6ql0a-a1 */
describe("Chronowarp — permanent time distortion for both players", () => {
  for (const copies of [0, 1, 2])
    it(`observes four turns after ${copies} resolved copies`, () => {
      const champion = createClassBonusTestChampion(chronowarp, false, "activation-discount");
      const game = GrandArchiveTestEngine.startFixture({
        playerOne: {
          champion,
          zones: {
            hand: [chronowarp, chronowarp, ...Array.from({ length: 8 }, () => woodlandSquirrels)],
            "material-deck": [trainingSword],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
        playerTwo: {
          champion,
          zones: {
            "material-deck": [trainingSword],
            "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
          },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      advanceToMain(game, q.id);
      q.pass();
      const before = game.state;
      expect(() =>
        p.activate(p.cards(chronowarp, { zone: "hand" })[0]!, {
          reservePayment: p
            .cards(woodlandSquirrels, { zone: "hand" })
            .slice(0, 4)
            .map((c) => ({ kind: "card", cardId: c.objectId })),
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      advanceToMain(game, p.id);
      for (let i = 0; i < copies; i++) {
        const card = p.cards(chronowarp, { zone: "hand" })[0]!;
        const payment = p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 4)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
        const unpaid = game.state;
        expect(() => p.activate(card, { reservePayment: payment.slice(0, 3) })).toThrow();
        expect(game.state).toEqual(unpaid);
        p.activate(card, { reservePayment: payment });
        expect(p.cards(chronowarp, { zone: "graveyard" })).toHaveLength(i);
        passEffectsStack(game);
        expect(p.cards(chronowarp, { zone: "graveyard" })).toHaveLength(i + 1);
      }
      const firstTurn = game.state.turn.number;
      const decks = [p.zone("main-deck").length, q.zone("main-deck").length];
      const materializations: { player: string; turn: number; afterMain: boolean }[] = [];
      const mains = new Set<number>([firstTurn]);
      for (let step = 0; step < 256; step++) {
        const turn = game.state.turn;
        if (turn.number === firstTurn + 4 && turn.phase === "main") break;
        if (turn.phase === "main") mains.add(turn.number);
        const wait = game.waitState();
        if (wait.kind === "materialization-choice") {
          materializations.push({
            player: wait.playerId,
            turn: turn.number - firstTurn,
            afterMain: mains.has(turn.number),
          });
          const actor = game.player(wait.playerId);
          const sword = actor.cards(trainingSword, { zone: "material-deck" })[0];
          if (sword) {
            actor.materialize(sword);
            passEffectsStack(game);
            expect(actor.cards(trainingSword, { zone: "field" })).toHaveLength(1);
          } else actor.execute({ move: "skip-materialization" });
        } else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      expect(p.zone("main-deck")).toHaveLength(decks[0]! - 2);
      expect(q.zone("main-deck")).toHaveLength(decks[1]! - 2);
      expect(game.state.turn.number).toBe(firstTurn + 4);
      expect(game.state.turn.phase).toBe("main");
      expect(materializations).toEqual(
        copies === 0
          ? [
              { player: q.id, turn: 1, afterMain: false },
              { player: p.id, turn: 2, afterMain: false },
              { player: q.id, turn: 3, afterMain: false },
              { player: p.id, turn: 4, afterMain: false },
            ]
          : [
              { player: p.id, turn: 0, afterMain: true },
              { player: q.id, turn: 1, afterMain: true },
              { player: p.id, turn: 2, afterMain: true },
              { player: q.id, turn: 3, afterMain: true },
            ],
      );
      expect(p.cards(trainingSword, { zone: "field" })).toHaveLength(1);
      expect(q.cards(trainingSword, { zone: "field" })).toHaveLength(1);
    });
});
