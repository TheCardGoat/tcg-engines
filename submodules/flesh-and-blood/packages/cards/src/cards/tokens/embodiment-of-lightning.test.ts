import { describe, expect, it } from "vitest";
import {
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { anothos } from "../weapons/anothos.ts";
import { brutalAssaultBlue } from "../actions/brutal-assault.ts";
import { embodimentOfLightning } from "./embodiment-of-lightning.ts";

/**
 * Embodiment of Lightning (AST028) — Elemental Token - Aura.
 * Printed: "When you play an attack action card, destroy this and the attack
 * gets go again."
 */
describe("Embodiment of Lightning (AST028) AAA", () => {
  it("happy: playing an attack action card destroys the Embodiment and the attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [embodimentOfLightning],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(brutalAssaultBlue);
    expectFabPlayer(Bravo).toHaveTokenCount("embodiment-of-lightning", 0);
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(Bravo.zone("arena")).not.toContain(embodimentOfLightning.canonicalId);
  });

  it("boundary: activating a weapon attack leaves the Embodiment alone (no go again)", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [embodimentOfLightning],
        weapon1: [anothos],
        hand: [],
        resourcePoints: 3,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.activateAttack(anothos);
    game.advanceUntil({ stopAt: "defend" });
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveAP(0);
    expectFabCard(Bravo, embodimentOfLightning).toBeIn("arena");
  });
});
