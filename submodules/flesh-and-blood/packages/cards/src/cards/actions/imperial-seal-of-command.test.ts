import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crownOfDominion } from "../equipment/crown-of-dominion.ts";
import { cintariSaber } from "../weapons/cintari-saber.ts";
import { sinkBelowRed } from "../defense-reactions/sink-below.ts";
import { nimblismBlue } from "./nimblism.ts";
import { imperialSealOfCommandRed } from "./imperial-seal-of-command.ts";

describe("Imperial Seal of Command (HNT228) AAA", () => {
  it("happy: destroy this so defense reactions cannot be played this turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [imperialSealOfCommandRed],
        weapon1: [cintariSaber],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, hand: [sinkBelowRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    expectFabCard(Dash, imperialSealOfCommandRed).toBeIn("arena");
    Dash.activate(imperialSealOfCommandRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, imperialSealOfCommandRed).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveAP(2);

    Dash.activate(cintariSaber);
    game.passBoth();
    game.advanceCombatTo("reaction");
    Dash.pass();
    expect(() => Bravo.play(sinkBelowRed)).toThrow();
    expectFabCard(Bravo, sinkBelowRed).toBeIn("hand");
  });

  it("boundary: a non-Royal hit does not destroy the defending arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        arena: [imperialSealOfCommandRed],
        weapon1: [cintariSaber],
        actionPoints: 2,
        deck: 6,
      },
      { hero: bravo, arsenal: [nimblismBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.activate(imperialSealOfCommandRed);
    game.helpers.resolveUntilIdle();
    Dash.activate(cintariSaber);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Bravo, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: a Royal next-hit this turn destroys the defending arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [crownOfDominion],
        arena: [imperialSealOfCommandRed],
        weapon1: [cintariSaber],
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, arsenal: [nimblismBlue], hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    Bravo.activate(imperialSealOfCommandRed);
    game.helpers.resolveUntilIdle();
    Bravo.activate(cintariSaber);
    game.passBoth();
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });
});
