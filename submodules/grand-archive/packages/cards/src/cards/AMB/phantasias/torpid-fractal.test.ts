import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { advanceToMain, answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
import { torpidFractal } from "./torpid-fractal.ts";

/** @covers h9u9584zpn-a1 */
describe("Torpid Fractal — On Enter rest", () => {
  it("rests a 2-power ally and keeps it rested through the next wake-up", () => {
    const { starter } = classBonusLeveledChampion(torpidFractal, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        zones: {
          hand: [torpidFractal, ...Array.from({ length: 4 }, () => woodlandSquirrels)],
        },
      },
      playerTwo: {
        champion: starter,
        zones: {
          field: [woodlandSquirrels, ferventBeastmaster],
          "main-deck": Array.from({ length: 6 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const squirrel = opponent.card(woodlandSquirrels, { zone: "field" });
    const gardener = opponent.card(ferventBeastmaster, { zone: "field" });
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    player.activate(torpidFractal, { reservePayment: payment });
    player.pass();
    opponent.pass();
    if (game.state.decision?.kind === "announce-triggered-ability") {
      const before = game.state;
      expect(() =>
        answerDecision(game, "announce-triggered-ability", {
          targets: { "target-1": [gardener.objectId] },
        }),
      ).toThrow();
      expect(game.state).toEqual(before);
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [squirrel.objectId] },
      });
    }
    passEffectsStack(game);
    expect(game.state.objects[squirrel.objectId]!.states.has("rested")).toBe(true);
    advanceToMain(game, opponent.id);
    expect(game.state.objects[squirrel.objectId]!.states.has("rested")).toBe(true);
  });
});
