import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { autumnSTouchBlue } from "./autumn-s-touch.ts";
import { swiftwaterSloopRed } from "./swiftwater-sloop.ts";

describe("Swiftwater Sloop family AAA", () => {
  it("happy: High Tide with 2 blues in pitch grants go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [swiftwaterSloopRed],
        pitch: [nimblismBlue, autumnSTouchBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(swiftwaterSloopRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(6);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: without 2 blues in pitch this has no go again", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [swiftwaterSloopRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(swiftwaterSloopRed);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(0);
  });
});
