import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { quietRefraction } from "./quiet-refraction.ts";
import { fracturedMemories } from "../../P25/masteries/fractured-memories.ts";
import { merlinMemoriteVassal } from "../../PTM/champions/merlin-memorite-vassal.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { enableAllTestElements } from "../../../testing/class-bonus-test-champion.ts";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
/** @covers 4vZN8JlY2k-a1
 * @covers 4vZN8JlY2k-a2
 */
describe("Quiet Refraction", () => {
  it("draws on entry and adds mastery sheen on entry and own level-up only", () => {
    const starter = lineageTestChampion("Merlin", 0),
      merlin = enableAllTestElements(merlinMemoriteVassal),
      next = lineageTestChampion("Merlin", 2),
      opponent = lineageTestChampion("Opponent", 0),
      opponentNext = lineageTestChampion("Opponent", 1);
    const game = GrandArchiveTestEngine.startFixture({
      definitions: [fracturedMemories],
      phase: "materialize",
      playerOne: {
        champion: starter,
        zones: {
          "material-deck": [merlin, next],
          memory: [woodlandSquirrels],
          hand: [quietRefraction, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: opponent,
        zones: {
          "material-deck": [opponentNext],
          memory: [woodlandSquirrels],
          "main-deck": Array.from({ length: 4 }, () => woodlandSquirrels),
        },
      },
    });
    const p = game.player("player-one"),
      q = game.player("player-two");
    p.materialize(merlin);
    passEffectsStack(game);
    answerDecision(game, "resolve-optional-effect", false);
    passEffectsStack(game);
    advanceToMain(game, p.id);
    const drawn = p.zone("main-deck")[0]!;
    p.activate(quietRefraction, {
      reservePayment: p
        .cards(woodlandSquirrels, { zone: "hand" })
        .slice(0, 2)
        .map((ref) => ({ kind: "card" as const, cardId: ref.objectId })),
    });
    passEffectsStack(game);
    expect(p.zone("memory")).toContainEqual(drawn);
    expect(p.zone("memory")).toHaveLength(3);
    expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(2);
    const materialize = (playerId: string) => {
      for (let step = 0; step < 128; step++) {
        const wait = game.waitState();
        if (wait.kind === "materialization-choice" && wait.playerId === playerId) return;
        if (wait.kind === "opportunity") game.player(wait.playerId).pass();
        else if (wait.kind === "materialization-choice")
          game.player(wait.playerId).execute({ move: "skip-materialization" });
        else throw new Error(`Unexpected ${wait.kind}`);
      }
      throw new Error("Failed to reach materialization");
    };
    materialize(q.id);
    q.materialize(opponentNext);
    passEffectsStack(game);
    expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(2);
    materialize(p.id);
    p.materialize(next);
    passEffectsStack(game);
    expect(game.state.players[p.id]!.mastery?.counters["named:sheen"]).toBe(4);
    expect(game.state.players[q.id]!.mastery).toBeUndefined();
  });
});
