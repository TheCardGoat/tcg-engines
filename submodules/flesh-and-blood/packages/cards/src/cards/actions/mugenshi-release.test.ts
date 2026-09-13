import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { katsu } from "../heroes/katsu.ts";
import { whelmingGustwaveRed } from "./whelming-gustwave.ts";
import { lordOfWindBlue } from "./lord-of-wind.ts";
import { mugenshiReleaseYellow } from "./mugenshi-release.ts";

describe("Mugenshi: RELEASE (WTR083) AAA", () => {
  it("happy: after Whelming Gustwave this is 5{p} and searches Lord of Wind", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [whelmingGustwaveRed, mugenshiReleaseYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deckTop: [lordOfWindBlue],
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    Katsu.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(mugenshiReleaseYellow);
    expectCombat(game).toHaveAttackPower(5);
    game.helpers.resolveUntilIdle({ entityTargets: "maximum", optionals: "decline" });
    expectFabCard(Katsu, lordOfWindBlue).toBeIn("hand");
  });

  it("boundary: without Whelming Gustwave this stays 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [mugenshiReleaseYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(katsu).playAttack(mugenshiReleaseYellow);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("timing: combo go again refunds AP after Gustwave", () => {
    const game = FabTestEngine.start(
      {
        hero: katsu,
        hand: [whelmingGustwaveRed, mugenshiReleaseYellow],
        resourcePoints: 1,
        actionPoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Katsu = game.as(katsu);
    Katsu.playAttack(whelmingGustwaveRed);
    game.advanceCombatTo("resolution");
    Katsu.playAttack(mugenshiReleaseYellow);
    game.closeCombat({ optionals: "decline", entityTargets: "minimum" });
    expectFabPlayer(Katsu).toHaveAP(1);
  });
});
