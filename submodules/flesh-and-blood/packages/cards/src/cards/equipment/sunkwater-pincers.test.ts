import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sunkwaterPincers } from "./sunkwater-pincers.ts";

describe("Sunkwater Pincers (MPG116) AAA", () => {
  it("happy: defending with a face-up arsenal card draws and grants +1{d} this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [sunkwaterPincers],
        hand: [],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        deck: [brutalAssaultBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, sunkwaterPincers).toHaveKeyword("blade-break");
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(sunkwaterPincers);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expectFabCard(Bravo, brutalAssaultBlue).toBeIn("hand");
    expectFabCard(Bravo, sunkwaterPincers).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: without a face-up arsenal card it stays 0{d} and does not draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [sunkwaterPincers],
        hand: [],
        arsenal: [{ card: nimblismBlue, state: { faceDown: true } }],
        deck: [brutalAssaultBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(sunkwaterPincers);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, nimblismBlue).toBeIn("arsenal");
    expect(Bravo.zone("deck")).toContain(brutalAssaultBlue.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, sunkwaterPincers).toBeIn("graveyard");
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        arms: [sunkwaterPincers],
        hand: [],
        arsenal: [],
        deck: 6,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(sunkwaterPincers);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, sunkwaterPincers).toBeIn("graveyard");
    expect(Bravo.zone("arms")).toHaveLength(0);
  });
});
