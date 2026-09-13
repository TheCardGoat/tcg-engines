import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { classBonusLeveledChampion } from "../../../testing/class-bonus-level.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { naturesAppeal } from "./natures-appeal.ts";

/** @covers oj0oh7pjoq-a1 */
describe("Nature's Appeal — reveal LV cards", () => {
  it("puts one revealed card into hand and another into the material deck preserved", () => {
    const { starter, lineage } = classBonusLeveledChampion(naturesAppeal, true, 2);
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion: starter,
        lineage,
        zones: {
          hand: [naturesAppeal, woodlandSquirrels, woodlandSquirrels],
          "main-deck": [giantTortoise, woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion: starter },
    });
    const player = game.player("player-one");
    const revealed = player.zone("main-deck").slice(0, 2);
    player.activate(naturesAppeal, {
      reservePayment: player
        .cards(woodlandSquirrels, { zone: "hand" })
        .map((card) => ({ kind: "card" as const, cardId: card.objectId })),
    });
    passEffectsStack(game);
    const toHand = revealed[0]!;
    const toMaterial = revealed[1]!;
    if (game.state.decision?.kind === "resolve-effect-choice") {
      answerDecision(game, "resolve-effect-choice", [toHand.objectId]);
      passEffectsStack(game);
    }
    if (game.state.decision?.kind === "resolve-effect-choice") {
      const beforeInvalid = game.state;
      expect(() => answerDecision(game, "resolve-effect-choice", [toHand.objectId])).toThrow();
      expect(game.state).toEqual(beforeInvalid);
      answerDecision(game, "resolve-effect-choice", [toMaterial.objectId]);
    }
    passEffectsStack(game);
    expect(game.state.objects[toHand.objectId]!.zone).toBe("hand");
    expect(game.state.objects[toMaterial.objectId]!.zone).toBe("material-deck");
    expect(game.state.objects[toMaterial.objectId]!.states.has("preserved")).toBe(true);
  });
});
