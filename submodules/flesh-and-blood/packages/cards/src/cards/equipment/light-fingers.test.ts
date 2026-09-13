import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { gold } from "../tokens/gold.ts";
import { snatchRed } from "../actions/snatch.ts";
import { scurvStowaway } from "../heroes/scurv-stowaway.ts";
import { lightFingers } from "./light-fingers.ts";

describe("Light Fingers (SEA184) AAA", () => {
  it("happy: a Thief defending steals the attacking hero's Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], arena: [gold], actionPoints: 1, deck: 6 },
      { hero: scurvStowaway, arms: [lightFingers], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Scurv = game.as(scurvStowaway);

    Dash.attackWith(snatchRed);
    Scurv.defendWith(lightFingers);
    game.helpers.resolveUntilIdle();

    expectFabCard(Scurv, gold).toBeIn("arena");
    expectFabCard(Scurv, lightFingers).toBeIn("graveyard");
  });

  it("boundary: a non-Thief defender does not steal the Gold", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], arena: [gold], actionPoints: 1, deck: 6 },
      { hero: bravo, arms: [lightFingers], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.attackWith(snatchRed);
    Bravo.defendWith(lightFingers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, gold).toBeIn("arena");
    expectFabCard(Bravo, lightFingers).toBeIn("graveyard");
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: scurvStowaway, arms: [lightFingers], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Scurv = game.as(scurvStowaway);

    game.as(dash).attackWith(snatchRed);
    Scurv.defendWith(lightFingers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Scurv, lightFingers).toBeIn("graveyard");
  });
});
