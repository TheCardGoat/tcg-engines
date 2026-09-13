import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { arakni } from "../heroes/arakni.ts";
import { plungeTheProspectRed } from "./plunge-the-prospect.ts";

/**
 * Plunge the Prospect (HNT041) — "If this is attacking a marked hero, this
 * gets +1{p}." Printed 3{p}.
 */

describe("Plunge the Prospect family AAA", () => {
  it("happy: attacking a marked hero is 4{p}", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [plungeTheProspectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], marked: true, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(arakni).playAttack(plungeTheProspectRed);
    expectCombat(game).toHaveAttackPower(4);
  });

  it("boundary: attacking an unmarked hero stays printed 3{p}", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [plungeTheProspectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(arakni).playAttack(plungeTheProspectRed);
    expectCombat(game).toHaveAttackPower(3);
  });

  it("timing: marked +1{p} flows into combat damage", () => {
    const game = FabTestEngine.start(
      { hero: arakni, hand: [plungeTheProspectRed], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], marked: true, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(arakni).playAttack(plungeTheProspectRed);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(game.as(dash)).toHaveLife(16);
  });
});
