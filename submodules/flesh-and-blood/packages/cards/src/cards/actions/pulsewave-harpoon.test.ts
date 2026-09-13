import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { snatchRed } from "./snatch.ts";
import { lightningPressRed } from "../instants/lightning-press.ts";
import { pulsewaveHarpoonRed } from "./pulsewave-harpoon.ts";

// Not migrated to the intent verbs: Pulsewave's boost-driven "opponent reveals
// X, chooses an action with {d}≤X, adds it as a defender" forces the OPPONENT
// to choose (Bravo.chooseTargets), which the controller-oriented intent verbs
// (decline/accept/choose/target) don't express, and the flow advances to the
// "resolution" step for which the intent API has no stop. Retained on legacy.
describe("Pulsewave Harpoon (DYN090) AAA", () => {
  it("happy: after boosting this combat chain, adds a revealed action with {d}≤X as a defender", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, pulsewaveHarpoonRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    // play() leaves combat on the Attack Step so Pulsewave add-defending is
    // distinguishable from a later Defend-Step hand block.
    Dash.play(pulsewaveHarpoonRed, { boost: true, target: Bravo.id });
    game.passBoth();
    game.passBoth();
    Bravo.chooseTargets(snatchRed);
    Bravo.chooseTargets(snatchRed);
    game.passBoth();

    expectFabCard(Bravo, snatchRed).toBeIn("combatChain");
    expect(game.combat()?.open).toBe(true);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: a revealed non-action is not added as a defending card", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [zeroToSixtyRed, pulsewaveHarpoonRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [lightningPressRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(zeroToSixtyRed, { boost: true });
    game.advanceCombatTo("resolution");
    Dash.play(pulsewaveHarpoonRed, { boost: true, target: Bravo.id });
    game.passBoth();
    game.passBoth();

    expectFabCard(Bravo, lightningPressRed).toBeIn("hand");
  });

  it("timing: boosting this attack itself is a legal additional cost and still opens combat", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [pulsewaveHarpoonRed],
        deck: [grindingGearsBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: bravo, hand: [snatchRed], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.attackWith(pulsewaveHarpoonRed, { boost: true });
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.open).toBe(true);
  });
});
