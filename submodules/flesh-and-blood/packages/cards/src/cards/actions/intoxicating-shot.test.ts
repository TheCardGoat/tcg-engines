import { describe, it } from "vitest";
import {
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { deathDealer } from "../shared/test-recipients.ts";
import { riptide } from "../heroes/riptide.ts";
import { nimblismBlue } from "./nimblism.ts";
import { wreckerRompBlue } from "./wrecker-romp.ts";
import { intoxicatingShotBlue } from "./intoxicating-shot.ts";

/**
 * Intoxicating Shot (EVO241) — Riptide spec Arrow. Blue cost 0, 4{p}/3{d}.
 * When this hits a hero, they create a Courage and Quicken token.
 */

describe("Intoxicating Shot (EVO241) AAA", () => {
  it("happy: when this hits a hero, they create Courage and Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: intoxicatingShotBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.playAttack(intoxicatingShotBlue, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(16);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("courage", 1);
    expectFabPlayer(game.as(dash)).toHaveTokenCount("quicken", 1);
  });

  it("boundary: a blocked miss does not create Courage or Quicken", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: intoxicatingShotBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue, wreckerRompBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);
    const Dash = game.as(dash);

    Riptide.playAttack(intoxicatingShotBlue, { from: "arsenal" });
    Dash.defendWith(nimblismBlue, wreckerRompBlue);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
    expectFabPlayer(Dash).toHaveTokenCount("courage", 0);
    expectFabPlayer(Dash).toHaveTokenCount("quicken", 0);
  });

  it("timing: the tokens belong to the defending hero, not the attacker", () => {
    const game = FabTestEngine.start(
      {
        hero: riptide,
        weapon1: [deathDealer],
        arsenal: [{ card: intoxicatingShotBlue, state: { faceDown: false } }],
        actionPoints: 1,
        resourcePoints: 0,
        deck: 6,
      },
      { hero: dash, life: 20, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Riptide = game.as(riptide);

    Riptide.playAttack(intoxicatingShotBlue, { from: "arsenal" });
    game.closeCombat();

    expectFabPlayer(Riptide).toHaveTokenCount("courage", 0);
    expectFabPlayer(Riptide).toHaveTokenCount("quicken", 0);
  });
});
