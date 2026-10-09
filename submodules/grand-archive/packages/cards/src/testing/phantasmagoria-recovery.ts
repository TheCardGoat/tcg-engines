import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { aliceDistortedQueen } from "../cards/PTM/champions/alice-distorted-queen.ts";
import { phantasmagoria } from "../cards/PTM/masteries/phantasmagoria.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { sparkAlight } from "../cards/DOA/actions/spark-alight.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { advanceToMain, passEffectsStack } from "./decisions.ts";

export function provePhantasmagoriaRecovery(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  cost: number,
  recovery: number,
  counters: number,
) {
  for (const ephemerate of [false, true]) {
    it(`recovers and adds haunt to the mastery from ${ephemerate ? "graveyard" : "hand"}`, () => {
      const starter = lineageTestChampion("Alice", 0);
      const alice = enableAllTestElements(aliceDistortedQueen);
      const game = GrandArchiveTestEngine.startFixture({
        definitions: [phantasmagoria],
        phase: "materialize",
        playerOne: {
          champion: starter,
          zones: {
            "material-deck": [alice],
            memory: [woodlandSquirrels],
            hand: [
              ...(ephemerate ? [] : [card]),
              sparkAlight,
              sparkAlight,
              sparkAlight,
              ...Array.from({ length: 12 }, () => woodlandSquirrels),
            ],
            graveyard: ephemerate ? [card] : [],
            "main-deck": [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: {
          champion: lineageTestChampion("Opponent", 0),
          zones: { "main-deck": [woodlandSquirrels, woodlandSquirrels] },
        },
      });
      const p = game.player("player-one"),
        q = game.player("player-two");
      const pay = (n: number) =>
        p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, n)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId }));
      p.materialize(alice);
      passEffectsStack(game);
      advanceToMain(game, p.id);
      const hero = p.card(starter);
      expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(2);
      expect(game.state.objects[hero.objectId]!.counters["named:haunt"] ?? 0).toBe(0);
      for (const spark of p.cards(sparkAlight, { zone: "hand" })) {
        p.activate(spark, { reservePayment: pay(2), targets: { "target-1": [hero.objectId] } });
        passEffectsStack(game);
      }
      expect(game.state.objects[hero.objectId]!.damage).toBe(6);
      const source = p.card(card),
        options = { activationMethod: ephemerate ? ("ephemerate" as const) : undefined };
      const before = game.state;
      expect(() => p.activate(source, { ...options, reservePayment: pay(cost - 1) })).toThrow();
      expect(game.state).toEqual(before);
      p.activate(source, { ...options, reservePayment: pay(cost) });
      expect(game.state.objects[source.objectId]!.states.has("ephemeral")).toBe(ephemerate);
      expect(game.state.objects[hero.objectId]!.damage).toBe(6);
      passEffectsStack(game);
      expect(game.state.objects[hero.objectId]!.damage).toBe(6 - recovery);
      expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(2 + counters);
      expect(game.state.players[q.id]!.mastery).toBeUndefined();
      expect(game.state.objects[source.objectId]!.zone).toBe(
        ephemerate ? "banishment" : "graveyard",
      );
    });
  }
  it("rejects Ephemerate without Alice, even when the opponent is Alice", () => {
    const champion = enableAllTestElements(lineageTestChampion("Other", 0));
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: { graveyard: [card], hand: Array.from({ length: cost }, () => woodlandSquirrels) },
      },
      playerTwo: { champion: lineageTestChampion("Alice", 0) },
    });
    const p = game.player("player-one"),
      before = game.state;
    expect(() =>
      p.activate(card, {
        activationMethod: "ephemerate",
        reservePayment: p
          .cards(woodlandSquirrels)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
  });
}
