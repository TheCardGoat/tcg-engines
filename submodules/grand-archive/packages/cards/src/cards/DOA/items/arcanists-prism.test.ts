import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { arcanistsPrism } from "./arcanists-prism.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
/** @covers dIEAN4J4YS-a1 */
describe("Arcanist's Prism orders all memory on the bottom before drawing the same count", () => {
  for (const count of [0, 1, 3])
    it(`memory count=${count}`, () => {
      const champion = createClassBonusTestChampion(arcanistsPrism, false, "activation-discount"),
        game = GrandArchiveTestEngine.startFixture({
          phase: "materialize",
          playerOne: {
            champion,
            zones: {
              field: [arcanistsPrism],
              memory: Array.from({ length: count }, () => woodlandSquirrels),
              "main-deck": [woodlandSquirrels, woodlandSquirrels],
            },
          },
          playerTwo: {
            champion,
            zones: { memory: [woodlandSquirrels], "main-deck": [woodlandSquirrels] },
          },
        });
      const p = game.player("player-one"),
        q = game.player("player-two"),
        memory = p.zone("memory"),
        deck = p.zone("main-deck"),
        otherMemory = q.zone("memory"),
        order = [...memory].reverse().map((c) => c.objectId);
      p.execute({ move: "skip-materialization" });
      for (let step = 0; step < 64; step++) {
        if (
          game.state.stack.some(
            (item) => item.kind === "triggered-ability" && item.ability.id === "dIEAN4J4YS-a1",
          )
        )
          break;
        const wait = game.waitState();
        if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
        game.player(wait.playerId).pass();
      }
      expect(p.zone("memory")).toEqual(memory);
      expect(p.zone("hand")).toHaveLength(0);
      passEffectsStack(game);
      if (count > 1) {
        const before = game.state;
        expect(game.state.decision).toMatchObject({
          kind: "resolve-effect-choice",
          playerId: p.id,
          selection: { ordered: true },
        });
        expect(() =>
          answerDecision(game, "resolve-effect-choice", [
            otherMemory[0]!.objectId,
            ...order.slice(1),
          ]),
        ).toThrow();
        expect(game.state).toEqual(before);
        expect(() => answerDecision(game, "resolve-effect-choice", order.slice(1))).toThrow();
        expect(game.state).toEqual(before);
        expect(p.zone("hand")).toHaveLength(0);
        answerDecision(game, "resolve-effect-choice", order);
        passEffectsStack(game);
      }
      const arranged = [...deck.map((c) => c.objectId), ...order];
      expect(p.zone("hand").map((c) => c.objectId)).toEqual(arranged.slice(0, count));
      expect(p.zone("main-deck").map((c) => c.objectId)).toEqual(arranged.slice(count));
      expect(p.zone("memory")).toHaveLength(0);
      expect(q.zone("memory")).toEqual(otherMemory);
      expect(game.state.turn.phase).toBe("recollection");
    });
});
