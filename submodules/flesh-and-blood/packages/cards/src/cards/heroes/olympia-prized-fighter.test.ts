import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "./dash.ts";
import { wageVigorBlue } from "../actions/wage-vigor.ts";
import { snatchRed } from "../actions/snatch.ts";
import { olympiaPrizedFighter } from "./olympia-prized-fighter.ts";

describe("Olympia, Prized Fighter (HVY092) AAA", () => {
  it("happy: the first wager your attack wins creates a Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympiaPrizedFighter);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.accept();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 1);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 1);
  });

  it("boundary: declining the wager creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [wageVigorBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympiaPrizedFighter);

    Olympia.playAttack(wageVigorBlue, { stopAt: "on-attack" });
    Olympia.decline();
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
    expectFabPlayer(Olympia).toHaveTokenCount("vigor", 0);
  });

  it("timing: an attack that never wagers creates no Gold", () => {
    const game = FabTestEngine.start(
      {
        hero: olympiaPrizedFighter,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Olympia = game.as(olympiaPrizedFighter);

    Olympia.playAttack(snatchRed);
    game.closeCombat({ ordering: "listed" });
    expectFabPlayer(Olympia).toHaveTokenCount("gold", 0);
  });
});
