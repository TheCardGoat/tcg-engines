import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { blazeFiremind } from "../heroes/blaze-firemind.ts";
import { arakniMarionette } from "../heroes/arakni-marionette.ts";
import { plungeTheProspectBlue } from "../actions/plunge-the-prospect.ts";
import { snatchRed } from "../actions/snatch.ts";
import { volticBoltRed } from "../actions/voltic-bolt.ts";
import { stalkerSSteps } from "./stalker-s-steps.ts";

describe("Stalker's Steps (AAC007) AAA", () => {
  it("happy: destroy this so a stealth attack gains go again", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        legs: [stalkerSSteps],
        hand: [plungeTheProspectBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.attackWith(plungeTheProspectBlue);
    game.advanceCombatTo("reaction");
    Arakni.activate(stalkerSSteps);
    game.passBoth();

    expectCombat(game).toHaveKeyword("go-again");
    expectFabCard(Arakni, stalkerSSteps).toBeIn("graveyard");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Arakni).toHaveAP(1);
  });

  it("boundary: a non-stealth attack cannot be the target", () => {
    const game = FabTestEngine.start(
      {
        hero: arakniMarionette,
        legs: [stalkerSSteps],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Arakni = game.as(arakniMarionette);

    Arakni.attackWith(snatchRed);
    game.advanceCombatTo("reaction");

    Arakni.expectActivationRejected(stalkerSSteps);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Arakni, stalkerSSteps).toBeIn("legs");
  });

  it("timing: Arcane Barrier still prevents 1 of Voltic Bolt", () => {
    const game = FabTestEngine.start(
      { hero: blazeFiremind, hand: [volticBoltRed], resourcePoints: 2, actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, resourcePoints: 1, legs: [stalkerSSteps], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(blazeFiremind).play(volticBoltRed, { target: Dash.id });
    game.passBoth();
    const choice = Dash.expectDecision("option");
    Dash.chooseOptions(choice.options[0]!.id);

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Dash, stalkerSSteps).toBeIn("legs");
  });
});
