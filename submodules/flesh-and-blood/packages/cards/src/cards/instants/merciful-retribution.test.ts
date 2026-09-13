import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { prism } from "../heroes/prism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { mercifulRetributionYellow } from "./merciful-retribution.ts";

describe("Merciful Retribution (MON012) AAA", () => {
  it("happy: Spectra destroys this when it is attacked and deals 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mercifulRetributionYellow, nimblismBlue],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(mercifulRetributionYellow);
    game.untilIdle();
    expectFabCard(Prism, mercifulRetributionYellow).toBeIn("arena");
    Prism.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    Dash.target(mercifulRetributionYellow);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Prism, mercifulRetributionYellow).toBeIn("arena");
    expectFabPlayer(Dash).toHaveLife(20);
  });

  it("boundary: a non-Light token destroy still pings but does not soul the card", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mercifulRetributionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], actionPoints: 1, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.play(mercifulRetributionYellow);
    game.untilIdle();
    Prism.endTurn();
    game.untilIdle();
    Dash.playAttack(snatchRed);
    Dash.target(mercifulRetributionYellow);
    game.closeCombat({ ordering: "listed" });
    expectFabCard(Prism, mercifulRetributionYellow).toBeIn("arena");
  });

  it("timing: playing this spends 4{r} and seats as an aura", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [mercifulRetributionYellow],
        resourcePoints: 4,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);

    Prism.play(mercifulRetributionYellow);
    game.untilIdle();
    expectFabCard(Prism, mercifulRetributionYellow).toBeIn("arena");
    expectFabPlayer(Prism).toHaveAP(1);
  });
});
