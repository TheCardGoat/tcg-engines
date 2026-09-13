import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { snatchRed } from "./snatch.ts";
import { saltwaterSwellRed } from "./saltwater-swell.ts";

describe("Saltwater Swell family AAA", () => {
  it("happy: revealing a blue card pitches it", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [saltwaterSwellRed],
        deck: [brutalAssaultBlue],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(saltwaterSwellRed);
    game.passBoth();
    expectFabCard(Gravy, brutalAssaultBlue).toBeIn("pitch");
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
  });

  it("boundary: revealing a non-blue card leaves it on top of the deck", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [saltwaterSwellRed],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(saltwaterSwellRed);
    game.passBoth();
    expect(Gravy.zone("deck")).toContain(snatchRed.canonicalId);
  });

  it("timing: go again refunds the action point after the chain closes", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [saltwaterSwellRed],
        deck: [snatchRed],
        resourcePoints: 1,
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(saltwaterSwellRed);
    expectFabPlayer(Gravy).toHaveAP(0);
    game.helpers.resolveUntilIdle();
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(1);
  });
});
