import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { azalea } from "../heroes/azalea.ts";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { infectingShotRed } from "./infecting-shot.ts";

describe("Infecting Shot (AZL009) AAA", () => {
  it("happy: an aim counter raises power and a hit creates Bloodrot Pox under the defending hero", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: infectingShotRed, state: { faceDown: false, aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).playAttack(infectingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(6);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(14);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 1);
    expectFabPlayer(game.as(azalea)).toHaveTokenCount("bloodrot-pox", 0);
  });

  it("boundary: without an aim counter this stays printed 5{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: infectingShotRed, state: { faceDown: false } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(azalea).playAttack(infectingShotRed, { from: "arsenal" });
    expectCombat(game).toHaveAttackPower(5);
  });

  it("timing: a miss creates no Bloodrot Pox", () => {
    const game = FabTestEngine.start(
      {
        hero: azalea,
        weapon1: [deathDealer],
        arsenal: [{ card: infectingShotRed, state: { faceDown: false, aimCounters: 1 } }],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue, nimblismBlue, nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(azalea).playAttack(infectingShotRed, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, nimblismBlue, nimblismBlue);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("bloodrot-pox", 0);
  });
});
