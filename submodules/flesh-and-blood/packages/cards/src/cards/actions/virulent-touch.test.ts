import { describe, it } from "vitest";
import { expectFabPlayer, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { virulentTouchRed } from "./virulent-touch.ts";

/**
 * Virulent Touch (ARA014) — Assassin/Ranger Action-Attack, cost 0, 4{p}/2{d}.
 *
 * Printed: "Virulent Touch can't be played from hand. When this chain link
 * resolves, if Virulent Touch is defended by a card from hand, create a
 * Bloodrot Pox token under the defending hero's control."
 *
 * Not an Arrow — play from arsenal; no bow required.
 */

describe("Virulent Touch (ARA014) AAA", () => {
  it("happy: arsenal play defended from hand creates Bloodrot Pox under the defender", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [virulentTouchRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], life: 20, deck: 6 },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(virulentTouchRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
  });

  it("timing: undefended (no hand defender) creates no Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        arsenal: [virulentTouchRed],
        hand: [],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
    );
    const Azalea = game.as(azalea);
    const Dash = game.as(dash);

    Azalea.playAttack(virulentTouchRed, { from: "arsenal" });
    Dash.defendWith();
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
  });
});
