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
import { bladeDance } from "./blade-dance.ts";

/**
 * Blade Dance (MPW134) — Warrior Token - Aura.
 * Printed: "When you activate a weapon attack, destroy this and the attack
 * gets go again."
 */
describe("Blade Dance (MPW134) AAA", () => {
  it("happy: activating Anothos destroys the Blade Dance and the weapon attack gets go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bladeDance],
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
    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabPlayer(Bravo).toHaveTokenCount("blade-dance", 0);
    expect(Bravo.zone("arena")).not.toContain(bladeDance.canonicalId);
  });

  it("boundary: playing an attack action card neither destroys the Blade Dance nor grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [bladeDance],
        hand: [brutalAssaultBlue],
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(brutalAssaultBlue);
    expectCombat(game).notToHaveKeyword("go-again");
    expectFabCard(Bravo, bladeDance).toBeIn("arena");
    game.as(dash).defendWith();
    game.closeCombat({ optionals: "decline", ordering: "listed" });

    expectCombat(game).toBeClosed();
    expectFabPlayer(Bravo).toHaveAP(0);
    expectFabCard(Bravo, bladeDance).toBeIn("arena");
  });
});
