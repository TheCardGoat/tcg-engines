import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { lungingPressBlue } from "../attack-reactions/lunging-press.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { doubleTroubleRed } from "./double-trouble.ts";

describe("Double Trouble (MST112) AAA", () => {
  it("happy: stealth attack deals printed 3", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [doubleTroubleRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(doubleTroubleRed);
    expectCombat(game).toHaveAttackPower(3);
    expectCombat(game).toHaveKeyword("stealth");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: a miss does not banish the top of their deck", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [doubleTroubleRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, nimblismBlue],
        deckTop: [snatchRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    Arakni.attackWith(doubleTroubleRed);
    game.advanceCombatTo("defend");
    Dash.defendWith([nimblismBlue, nimblismBlue]);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expect(Dash.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: 2+ attack reactions this chain link grant +2{p} and hit-banish 2", () => {
    const game = FabTestEngine.start(
      {
        hero: arakni,
        hand: [doubleTroubleRed, lungingPressBlue, lungingPressBlue],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [],
        deckTop: [snatchRed, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakni);
    const Dash = game.as(dash);

    const presses = Arakni.cardsIn("hand", lungingPressBlue);
    Arakni.playAttack(doubleTroubleRed);
    game.advanceCombatTo("reaction");
    Arakni.must.playReaction(presses[0]!);
    game.passBoth();
    Arakni.must.playReaction(presses[1]!);
    game.passBoth();

    expectCombat(game).toHaveAttackPower(7);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Dash).toHaveLife(13);
    expectFabCard(Dash, snatchRed).toBeBanished();
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });
});
