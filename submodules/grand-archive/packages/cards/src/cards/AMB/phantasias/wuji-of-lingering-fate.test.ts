import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { answerDecision, advanceToMain, passEffectsStack } from "../../../testing/decisions.ts";
import {
  changeShiftingCurrents,
  startWithShiftingCurrentsNorth,
} from "../../../testing/shifting-currents.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { wujiOfLingeringFate } from "./wuji-of-lingering-fate.ts";

/** @covers 9cef7aknvn-a1 */
describe("Wuji of Lingering Fate — On Enter", () => {
  it("deals 3 to a rested opposing ally and rejects an awake one", () => {
    const { starter } = classBonusLeveledChampion(wujiOfLingeringFate, false, 0);
    const game = GrandArchiveTestEngine.startFixture({
      firstPlayer: "playerTwo",
      playerOne: {
        champion: starter,
        zones: {
          hand: [wujiOfLingeringFate, woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
      playerTwo: {
        champion: starter,
        zones: {
          field: [woodlandSquirrels, woodlandSquirrels],
          "main-deck": Array.from({ length: 8 }, () => woodlandSquirrels),
        },
      },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const allies = opponent.cards(woodlandSquirrels, { zone: "field" });
    opponent.declareAttack(allies[0]!, player.card(starter, { zone: "field" }));
    game.resolveCombatWithoutRetaliation();
    opponent.pass();
    advanceToMain(game, player.id);
    const rested = allies[0]!;
    const awake = allies[1]!;
    const payment = player
      .cards(woodlandSquirrels, { zone: "hand" })
      .slice(0, 2)
      .map((ref) => ({ kind: "card" as const, cardId: ref.objectId }));
    player.activate(wujiOfLingeringFate, { reservePayment: payment });
    player.pass();
    opponent.pass();
    const before = game.state;
    expect(() =>
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-1": [awake.objectId] },
      }),
    ).toThrow();
    expect(game.state).toEqual(before);
    answerDecision(game, "announce-triggered-ability", {
      targets: { "target-1": [rested.objectId] },
    });
    passEffectsStack(game);
    expect(game.state.objects[rested.objectId]!.zone).toBe("graveyard");
  });
});

/** @covers 9cef7aknvn-a2 */
describe("Wuji of Lingering Fate — West to East", () => {
  it("may sacrifice to mill three when currents change West to East", () => {
    const game = startWithShiftingCurrentsNorth({
      playerOneZones: { field: [wujiOfLingeringFate] },
    });
    const player = game.player("player-one");
    const opponent = game.player("player-two");
    const source = player.card(wujiOfLingeringFate, { zone: "field" });
    changeShiftingCurrents(game, "west");
    expect(game.state.objects[source.objectId]!.zone).toBe("field");
    changeShiftingCurrents(game, "east");
    if (game.state.decision?.kind === "announce-triggered-ability") {
      answerDecision(game, "announce-triggered-ability", {
        targets: { "target-player": [opponent.id] },
      });
    }
    passEffectsStack(game);
    if (game.state.decision?.kind === "resolve-optional-effect")
      answerDecision(game, "resolve-optional-effect", true);
    passEffectsStack(game);
    expect(game.state.objects[source.objectId]!.zone).not.toBe("field");
    expect(opponent.zone("graveyard").length).toBeGreaterThanOrEqual(3);
  });
});
