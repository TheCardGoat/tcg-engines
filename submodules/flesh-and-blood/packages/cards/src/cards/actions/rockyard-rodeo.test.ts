import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine } from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { anothos } from "../weapons/anothos.ts";
import { tuffnut } from "../heroes/tuffnut.ts";
import { rockyardRodeoBlue } from "./rockyard-rodeo.ts";

describe("Rockyard Rodeo (PEN322) AAA", () => {
  it("happy: power equals the highest base {p} of weapons you control", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [rockyardRodeoBlue],
        weapon1: [anothos],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(bravo).attackWith(rockyardRodeoBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: with no weapons, this attacks for 0", () => {
    const game = FabTestEngine.start(
      {
        hero: tuffnut,
        hand: [rockyardRodeoBlue],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(tuffnut).attackWith(rockyardRodeoBlue);
    expect(game.combat()?.activeLink?.attackPower).toBe(0);
  });
});
