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
import { sunkwaterExoshell } from "./sunkwater-exoshell.ts";

describe("Sunkwater Exoshell (MPG115) AAA", () => {
  it("happy: defending with a face-up arsenal card draws and grants +1{d} this turn", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [sunkwaterExoshell],
        hand: [],
        arsenal: [{ card: nimblismBlue, state: { faceDown: false } }],
        deck: [brutalAssaultBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, sunkwaterExoshell).toHaveKeyword("blade-break");
    game.as(dash).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Bravo.defendWith(sunkwaterExoshell);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expect(Bravo.zone("deck")[0]).toBe(nimblismBlue.canonicalId);
    expectFabCard(Bravo, brutalAssaultBlue).toBeIn("hand");
    expectFabCard(Bravo, sunkwaterExoshell).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveLife(17);
  });

  it("boundary: without a face-up arsenal card it stays 0{d} and does not draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [sunkwaterExoshell],
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
    Bravo.defendWith(sunkwaterExoshell);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, nimblismBlue).toBeIn("arsenal");
    expect(Bravo.zone("deck")).toContain(brutalAssaultBlue.canonicalId);
    expect(Bravo.zone("hand")).not.toContain(brutalAssaultBlue.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, sunkwaterExoshell).toBeIn("graveyard");
  });

  it("timing: Blade Break destroys this after it defends", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        chest: [sunkwaterExoshell],
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
    Bravo.defendWith(sunkwaterExoshell);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Bravo, sunkwaterExoshell).toBeIn("graveyard");
    expect(Bravo.zone("chest")).toHaveLength(0);
  });
});
