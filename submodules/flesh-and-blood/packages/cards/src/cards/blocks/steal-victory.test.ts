import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  fabToken,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { stealVictoryBlue } from "./steal-victory.ts";

describe("Steal Victory (SUP069) AAA", () => {
  it("happy: defending steals an aura token the attacking hero controls", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [fabToken("spectral-shield")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [stealVictoryBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(stealVictoryBlue);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("spectral-shield", 1);
    expectFabPlayer(Dash).toHaveTokenCount("spectral-shield", 0);
    expectFabCard(Bravo, stealVictoryBlue).toBeIn("combatChain");
  });

  it("boundary: defending with no attacking-hero aura token still blocks for 3{d}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [stealVictoryBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(stealVictoryBlue);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Bravo, stealVictoryBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: stolen aura returns at end of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [snatchRed],
        arena: [fabToken("spectral-shield")],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [stealVictoryBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(stealVictoryBlue);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveTokenCount("spectral-shield", 1);
    game.closeCombat({ ordering: "listed" });
    // Pin: until-end-of-turn steal reverts when the chain closes.
    expectFabPlayer(Bravo).toHaveTokenCount("spectral-shield", 0);
  });
});
