import { GrandArchiveTestEngine } from "@tcg/grand-archive-engine/testing";
import { describe, expect, it } from "vitest";

import { createClassBonusTestChampion } from "../../../testing/class-bonus-test-champion.ts";
import { answerDecision, passEffectsStack } from "../../../testing/decisions.ts";
import { woodlandSquirrels } from "../../DOA/allies/woodland-squirrels.ts";
import { astraSight } from "../actions/astra-sight.ts";
import { cometfall } from "../actions/cometfall.ts";
import { theElysianAstrolabe } from "./the-elysian-astrolabe.ts";

/** @covers 4nmxqsm4o9-a2 */
describe("The Elysian Astrolabe — final twelve-card materialization", () => {
  for (const startingSize of [11, 12]) {
    it(`${startingSize === 12 ? "allows" : "forbids"} materializing the final card from a starting deck of ${startingSize}`, () => {
      const champion = createClassBonusTestChampion(
        theElysianAstrolabe,
        true,
        "activation-discount",
      );
      const game = GrandArchiveTestEngine.startFixture({
        phase: "materialize",
        playerOne: {
          champion,
          zones: {
            "material-deck": [theElysianAstrolabe],
            graveyard: Array.from({ length: startingSize - 2 }, () => theElysianAstrolabe),
            memory: [woodlandSquirrels, woodlandSquirrels],
          },
        },
        playerTwo: { champion },
      });
      const player = game.player("player-one");
      if (startingSize === 12) {
        player.materialize(theElysianAstrolabe);
        expect(player.cards(theElysianAstrolabe, { zone: "effects-stack" })).toHaveLength(1);
      } else {
        const before = game.state;
        expect(() => player.materialize(theElysianAstrolabe)).toThrow();
        expect(game.state).toEqual(before);
      }
    });
  }
});

/** @covers 4nmxqsm4o9-a3 */
describe("The Elysian Astrolabe — free Starcalling", () => {
  it("replaces one Starcalling cost with zero and Glimpses five afterward", () => {
    const champion = createClassBonusTestChampion(theElysianAstrolabe, true, "activation-discount");
    const game = GrandArchiveTestEngine.startFixture({
      playerOne: {
        champion,
        zones: {
          field: [theElysianAstrolabe],
          hand: [astraSight],
          "main-deck": Array.from({ length: 7 }, () => cometfall),
        },
      },
      playerTwo: { champion },
    });
    const player = game.player("player-one");
    player.activateAbility(theElysianAstrolabe, "4nmxqsm4o9-a3");
    passEffectsStack(game);
    player.activate(astraSight);
    passEffectsStack(game);
    const firstGlimpse = game.state.decision;
    if (firstGlimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse");
    const calledId = firstGlimpse.cardIds[0]!;
    answerDecision(game, "resolve-glimpse", {
      kind: "starcall",
      cardId: calledId,
      bottom: firstGlimpse.cardIds.filter((id) => id !== calledId),
      costOptionIndex: 1,
    });
    expect(game.state.objects[calledId]!.activationStates.has("starcalled")).toBe(true);
    passEffectsStack(game);
    const bonusGlimpse = game.state.decision;
    if (bonusGlimpse?.kind !== "resolve-glimpse") throw new Error("Expected Glimpse 5");
    expect(bonusGlimpse.cardIds).toHaveLength(5);
  });
});
