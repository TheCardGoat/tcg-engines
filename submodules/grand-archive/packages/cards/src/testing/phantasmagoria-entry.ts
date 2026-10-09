import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import type { GrandArchiveAbilityDefinition, GrandArchiveAnyCard } from "@tcg/grand-archive-types";
import { expect, it } from "vitest";
import { aliceDistortedQueen } from "../cards/PTM/champions/alice-distorted-queen.ts";
import { phantasmagoria } from "../cards/PTM/masteries/phantasmagoria.ts";
import { woodlandSquirrels } from "../cards/DOA/allies/woodland-squirrels.ts";
import { lineageTestChampion } from "./champion-lineage.ts";
import { enableAllTestElements } from "./class-bonus-test-champion.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "./decisions.ts";
export function provePhantasmagoriaEntry(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  regalia = false,
) {
  it("adds one haunt to the controller's existing mastery on entry", () => {
    const starter = lineageTestChampion("Alice", 0),
      alice = enableAllTestElements(aliceDistortedQueen);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [phantasmagoria],
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [alice, ...(regalia ? [card] : [])],
          memory: [woodlandSquirrels],
          hand: [...(regalia ? [] : [card]), woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: lineageTestChampion("Other", 0),
        zones: { "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels) },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    p.materialize(alice);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(2);
    if (regalia) {
      const initialTurn = game.state.turn.number;
      for (let i = 0; i < 100; i++) {
        if (
          game.state.turn.playerId === p.id &&
          game.state.turn.phase === "materialize" &&
          game.state.turn.number !== initialTurn
        )
          break;
        if (game.state.decision?.kind === "resolve-optional-effect") {
          answerDecision(game, "resolve-optional-effect", false);
          continue;
        }
        const wait = game.waitState();
        if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else throw new Error(`Unexpected wait ${wait.kind}`);
      }
      p.materialize(card);
    } else
      p.activate(card, {
        reservePayment: p
          .cards(woodlandSquirrels, { zone: "hand" })
          .slice(0, 2)
          .map((c) => ({ kind: "card" as const, cardId: c.objectId })),
      });
    expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(2);
    passEffectsStack(game);
    expect(game.state.players[p.id]!.mastery?.counters["named:haunt"]).toBe(3);
    expect(game.state.players[q.id]!.mastery).toBeUndefined();
    expect(game.state.objects[p.card(card).objectId]!.counters["named:haunt"] ?? 0).toBe(0);
  });
}
