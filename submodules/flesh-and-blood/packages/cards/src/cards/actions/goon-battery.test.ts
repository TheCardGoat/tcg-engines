import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { spectralShield } from "../tokens/spectral-shield.ts";
import { goonBatteryBlue } from "./goon-battery.ts";

describe("Goon Battery (SUP104) AAA", () => {
  it("happy: three auras make this 4{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonBatteryBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(goonBatteryBlue);
    expectCombat(game).toHaveAttackPower(4);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });

  it("boundary: two auras keep this at 1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield],
        hand: [goonBatteryBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).playAttack(goonBatteryBlue);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(19);
  });

  it("timing: a miss with three auras does not tap the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [spectralShield, spectralShield, spectralShield],
        hand: [goonBatteryBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [goonBatteryBlue, goonBatteryBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);
    Bravo.playAttack(goonBatteryBlue);
    Dash.defendWith([goonBatteryBlue, goonBatteryBlue]);
    game.closeCombat();
    expectFabPlayer(Dash).toHaveLife(20);
  });
});
