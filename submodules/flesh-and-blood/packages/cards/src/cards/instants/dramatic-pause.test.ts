import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { dramaticPauseRed } from "./dramatic-pause.ts";

describe("Dramatic Pause family AAA", () => {
  it("happy: the red aura makes the defending action block 5", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, dramaticPauseRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith([nimblismBlue]);
    game.pass(Dash.id);
    Bravo.play(dramaticPauseRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("boundary: without the Pause, the 4-power hit carries 2 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith([nimblismBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Bravo).toHaveLife(18);
  });

  it("timing: the suspense aura remains in the arena after resolving", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [nimblismBlue, dramaticPauseRed], life: 20, deck: 6 },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    game.advanceUntil({ stopAt: "defend", entityTargets: "minimum" });
    Bravo.defendWith([nimblismBlue]);
    game.pass(Dash.id);
    Bravo.play(dramaticPauseRed);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum", ordering: "listed" });

    expectFabCard(Bravo, dramaticPauseRed).toBeIn("arena");
  });
});
