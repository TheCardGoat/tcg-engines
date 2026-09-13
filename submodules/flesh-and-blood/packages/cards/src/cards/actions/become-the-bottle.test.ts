import { describe, expect, it } from "vitest";
import {
  expectFabCard,
  expectWait,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { crouchingTiger } from "./crouching-tiger.ts";
import { snatchRed } from "./snatch.ts";
import { becomeTheBottleRed } from "./become-the-bottle.ts";

describe("Become the Bottle (PEN037) AAA", () => {
  it("happy: choosing a previous chain-link card gives this that card's name", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [crouchingTiger, becomeTheBottleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(crouchingTiger);
    game.advanceUntil({ stopAt: "resolution", ordering: "listed" });
    Katsu.playAttack(becomeTheBottleRed, { stopAt: "on-attack" });
    expectWait(game).toHaveDecision("entity-target");
    Katsu.targetRequired(crouchingTiger, { identity: "source" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Katsu, becomeTheBottleRed).toHaveName("Crouching Tiger");
    game.helpers.expectLog("flesh-and-blood.gain-name", {
      cardName: "Become The Bottle",
      gainedName: "Crouching Tiger",
    });
    expect(game.renderedPlayerNarrative(Katsu.id)).toContain(
      "Become The Bottle gained the name Crouching Tiger from Become The Bottle.",
    );
  });

  it("boundary: with no previous link, choosing itself preserves its printed name", () => {
    const game = FabTestEngine.start(
      { hero: katsu, hand: [becomeTheBottleRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);

    Katsu.playAttack(becomeTheBottleRed, { stopAt: "on-attack" });
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectFabCard(Katsu, becomeTheBottleRed).toBeIn("combatChain");
    expectFabCard(Katsu, becomeTheBottleRed).toHaveName("Become The Bottle");
    game.helpers.expectNoPublicLog("flesh-and-blood.gain-name");
  });

  it("timing: cannot be played as an instant during the opponent's combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: katsu, hand: [becomeTheBottleRed], deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    game.as(dash).playAttack(snatchRed);
    game.toReaction();
    expect(() => game.as(katsu).play(becomeTheBottleRed)).toThrow();
    expectFabCard(game.as(katsu), becomeTheBottleRed).toBeIn("hand");
  });
});
