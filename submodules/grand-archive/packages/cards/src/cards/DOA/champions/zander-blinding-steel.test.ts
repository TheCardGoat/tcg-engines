import { describe } from "vitest";
import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { zanderBlindingSteel } from "./zander-blinding-steel.ts";

/** @covers UAF6Nr7GUE-a1 */
describe("Zander, Blinding Steel \u2014 UAF6Nr7GUE-a1", () => {
  proveChampionLineage({
    card: zanderBlindingSteel,
    lineageName: "Zander",
    level: 3,
    memoryCost: 3,
  });
});

import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { expect, it } from "vitest";
import { lineageTestChampion } from "../../../testing/champion-lineage.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../allies/woodland-squirrels.ts";
import { uncoverThePlot } from "../actions/uncover-the-plot.ts";
/** @covers UAF6Nr7GUE-a2 */
describe("Zander Blinding Steel optionally reveals all own memory and reserves once per revealed Luxem", () => {
  for (const accept of [false, true])
    for (const luxem of [0, 1, 3])
      for (const handCount of [0, 2, 4])
        it(`reveal=${accept}, Luxem=${luxem}, opposing hand=${handCount}`, () => {
          const starter = lineageTestChampion("Zander", 0),
            game = GrandArchiveTestEngine.startFixture({
              phase: "materialize",
              playerOne: {
                champion: starter,
                lineage: [
                  lineageTestChampion("Zander", 1),
                  lineageTestChampion("Zander", 2),
                  zanderBlindingSteel,
                ],
                zones: {
                  hand: [woodlandSquirrels],
                  memory: [
                    woodlandSquirrels,
                    ...Array.from({ length: luxem }, () => uncoverThePlot),
                  ],
                  "main-deck": [woodlandSquirrels],
                },
              },
              playerTwo: {
                champion: starter,
                zones: {
                  hand: Array.from({ length: handCount }, () => woodlandSquirrels),
                  memory: [uncoverThePlot],
                  "main-deck": [woodlandSquirrels],
                },
              },
            });
          const p = game.player("player-one"),
            q = game.player("player-two"),
            memory = p.zone("memory"),
            opponentMemory = q.zone("memory"),
            hand = q.zone("hand"),
            chosen = hand.slice(0, accept ? Math.min(luxem, handCount) : 0);
          p.execute({ move: "skip-materialization" });
          for (let step = 0; step < 64; step++) {
            if (
              game.state.stack.some(
                (item) => item.kind === "triggered-ability" && item.ability.id === "UAF6Nr7GUE-a2",
              )
            )
              break;
            const wait = game.waitState();
            if (wait.kind !== "opportunity") throw new Error(`Unexpected ${wait.kind}`);
            game.player(wait.playerId).pass();
          }
          passEffectsStack(game);
          answerDecision(game, "resolve-optional-effect", accept);
          for (const card of chosen) {
            passEffectsStack(game);
            expect(game.state.decision).toMatchObject({
              kind: "resolve-effect-choice",
              playerId: q.id,
            });
            const before = game.state;
            expect(() =>
              answerDecision(game, "resolve-effect-choice", [
                p.card(woodlandSquirrels, { zone: "hand" }).objectId,
              ]),
            ).toThrow();
            expect(game.state).toEqual(before);
            answerDecision(game, "resolve-effect-choice", [card.objectId]);
          }
          passEffectsStack(game);
          expect(game.state.decision).toBeNull();
          expect(p.zone("memory")).toEqual(memory);
          expect(q.zone("hand")).toEqual(hand.slice(chosen.length));
          expect(q.zone("memory")).toEqual([...opponentMemory, ...chosen]);
          expect(
            game.state.eventHistory
              .filter((e) => e.type === "card-revealed")
              .map((e) => e.objectId),
          ).toEqual(accept ? memory.map((c) => c.objectId) : []);
        });
});
