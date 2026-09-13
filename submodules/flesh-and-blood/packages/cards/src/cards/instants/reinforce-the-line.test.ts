import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectFabUnplayable,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { reinforceTheLineBlue } from "./reinforce-the-line.ts";

describe("Reinforce the Line family AAA", () => {
  it("happy: defending Snatch gets the blue printing's +2 defense", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [snatchRed, reinforceTheLineBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);
    Dash.pass();
    Bravo.play(reinforceTheLineBlue, {
      targetInstanceId: Bravo.ref(snatchRed).instanceId,
    });
    game.passBoth();

    expectFabCard(Bravo, snatchRed).toHaveDefense(4);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: a defending non-attack action is not a legal target", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, reinforceTheLineBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(nimblismBlue);
    Dash.pass();

    expectFabUnplayable(() =>
      Bravo.play(reinforceTheLineBlue, {
        targetInstanceId: Bravo.ref(nimblismBlue).instanceId,
      }),
    );
    expectFabCard(Bravo, nimblismBlue).toHaveDefense(2);
    expectFabCard(Bravo, reinforceTheLineBlue).toBeIn("hand");
  });

  it("timing: a later defending Snatch after combat is unbuffed", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      { hero: bravo, hand: [snatchRed, snatchRed, reinforceTheLineBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);
    Dash.pass();
    const firstBlock = Bravo.cardIn("combatChain", snatchRed);
    Bravo.play(reinforceTheLineBlue, { targetInstanceId: firstBlock.instanceId });
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(snatchRed);

    expectFabCard(Bravo, Bravo.cardIn("combatChain", snatchRed)).toHaveDefense(2);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Bravo).toHaveLife(18);
  });
});
