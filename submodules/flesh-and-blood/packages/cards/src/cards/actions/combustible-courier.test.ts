import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { zeroToSixtyRed } from "./zero-to-sixty.ts";
import { grindingGearsBlue } from "./grinding-gears.ts";
import { nimblismBlue } from "./nimblism.ts";
import { combustibleCourierRed } from "./combustible-courier.ts";

describe("Combustible Courier family AAA", () => {
  it("happy: a hit gives the next boosted attack this combat chain +3{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [combustibleCourierRed, zeroToSixtyRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 2,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.playAttack(combustibleCourierRed, { boost: true });
    expectCombat(game).toHaveAttackPower(4);
    game.advanceCombatTo("resolution");
    expectFabPlayer(game.as(dash)).toHaveLife(16);

    Bravo.playAttack(zeroToSixtyRed, { boost: true });
    expectCombat(game).toHaveAttackPower(7);
  });

  it("boundary: a miss does not raise the next boosted attack", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [combustibleCourierRed, zeroToSixtyRed],
        deck: [grindingGearsBlue, grindingGearsBlue],
        resourcePoints: 2,
        actionPoints: 2,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.playAttack(combustibleCourierRed, { boost: true });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ ordering: "listed", optionals: "decline" });
    expectFabPlayer(Dash).toHaveLife(20);

    Bravo.playAttack(zeroToSixtyRed, { boost: true });
    expectCombat(game).toHaveAttackPower(4);
  });
});
