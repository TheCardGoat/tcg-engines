import { describe, expect, it } from "vitest";
import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";

import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { fireball } from "../../DOA/actions/fireball.ts";
import { thunderclap } from "./thunderclap.ts";
import { igniteFate } from "./ignite-fate.ts";
import { setAblaze } from "./set-ablaze.ts";
import { absolvingFlames } from "./absolving-flames.ts";

/** @covers 3fbpyhm271-a1 */
describe("Absolving Flames — Draw a card", () => {
  proveDrawCardResolution({ card: absolvingFlames });
});

/** @covers 3fbpyhm271-a2 */
describe("Absolving Flames — optional Class Bonus fire banish", () => {
  it("banishes four fire cards then draws, and can be declined", () => {
    const champion = createClassBonusTestChampion(absolvingFlames, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [absolvingFlames, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [fireball, thunderclap, igniteFate, setAblaze, woodlandSquirrels],
          "main-deck": [woodlandSquirrels, woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(absolvingFlames, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    expect(game.state.decision?.kind).toBe("resolve-optional-effect");
    const fire = [fireball, thunderclap, igniteFate, setAblaze].map((card) =>
      player.card(card, { zone: "graveyard" }),
    );
    const deck = player.zone("main-deck");
    answerDecision(game, "resolve-optional-effect", true);
    if (game.state.decision?.kind === "resolve-effect-choice") {
      const beforeInvalid = game.state;
      expect(() =>
        answerDecision(game, "resolve-effect-choice", [
          player.card(woodlandSquirrels, { zone: "graveyard" }).objectId,
          fire[0]!.objectId,
          fire[1]!.objectId,
          fire[2]!.objectId,
        ]),
      ).toThrow();
      expect(game.state).toEqual(beforeInvalid);
      answerDecision(
        game,
        "resolve-effect-choice",
        fire.map((card) => card.objectId),
      );
    }
    passEffectsStack(game);
    for (const card of fire) expect(game.state.objects[card.objectId]!.zone).toBe("banishment");
    expect(player.zone("hand")).toContainEqual(deck[0]);
  });

  it("does not offer the banish when Class Bonus is disabled", () => {
    const champion = createClassBonusTestChampion(absolvingFlames, false, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          hand: [absolvingFlames, woodlandSquirrels, woodlandSquirrels, woodlandSquirrels],
          graveyard: [fireball, thunderclap, igniteFate, setAblaze],
          "main-deck": [woodlandSquirrels],
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activate(absolvingFlames, {
      reservePayment: player.cards(woodlandSquirrels, { zone: "hand" }).map((card) => ({
        kind: "card" as const,
        cardId: card.objectId,
      })),
    });
    passEffectsStack(game);
    expect(game.state.decision).toBeNull();
    expect(player.cards(fireball, { zone: "graveyard" })).toHaveLength(1);
  });
});
