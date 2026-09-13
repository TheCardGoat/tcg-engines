import { describe, expect, it } from "vitest";

import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { startWithShiftingCurrentsNorth } from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { baguaOfCardinalFate } from "./bagua-of-cardinal-fate.ts";

/** @covers jgyx38zpl0-a1 */
describe("Bagua of Cardinal Fate — North buff", () => {
  it("puts a buff counter on a controlled ally facing North and rejects South", () => {
    const game = startWithShiftingCurrentsNorth({
      playerOneZones: {
        field: [woodlandSquirrels],
        hand: [baguaOfCardinalFate, woodlandSquirrels],
      },
    });
    const player = game.player("player-one");
    const ally = player.card(woodlandSquirrels, { zone: "field" });
    const payment = [
      { kind: "card" as const, cardId: player.card(woodlandSquirrels, { zone: "hand" }).objectId },
    ];
    const before = game.state;
    expect(() =>
      player.activate(baguaOfCardinalFate, { modeIds: ["south"], reservePayment: payment }),
    ).toThrow();
    expect(game.state).toEqual(before);
    player.activate(baguaOfCardinalFate, { modeIds: ["north"], reservePayment: payment });
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [ally.objectId]);
    }
    passEffectsStack(game);
    expect(game.state.objects[ally.objectId]!.counters.buff).toBe(1);
  });
});
