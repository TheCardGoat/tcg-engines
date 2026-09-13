import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "../heroes/gravy-bones.ts";
import { dash } from "../heroes/dash.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { murderousRabbleBlue } from "./murderous-rabble.ts";

describe("Murderous Rabble (AGB023) AAA", () => {
  it("happy: on attack reveals the top card and gets +X{p} equal to its pitch", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [murderousRabbleBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(murderousRabbleBlue);
    // Printed 0{p} + Nimblism Blue pitch 3.
    expect(game.combat()?.activeLink?.attackPower).toBe(3);
    expect(game.combat()?.activeLink?.keywords).toContain("go-again");
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Gravy, murderousRabbleBlue).toBeIn("graveyard");
    expectFabPlayer(Gravy).toHaveAP(1);
  });

  it("boundary: a pitch-1 top card grants only +1{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [murderousRabbleBlue],
        deck: [snatchRed, snatchRed, snatchRed, snatchRed, snatchRed, snatchRed],
        actionPoints: 1,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    game.as(gravyBones).attackWith(murderousRabbleBlue);
    // Printed 0{p} + Snatch Red pitch 1.
    expect(game.combat()?.activeLink?.attackPower).toBe(1);
  });

  it("timing: go again refunds at chain-link resolution, not on declaration", () => {
    const game = FabTestEngine.start(
      {
        hero: gravyBones,
        hand: [murderousRabbleBlue],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        actionPoints: 1,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Gravy = game.as(gravyBones);

    Gravy.attackWith(murderousRabbleBlue);
    expectFabPlayer(Gravy).toHaveAP(0);
    game.helpers.resolveRestOfCombat();
    expectFabPlayer(Gravy).toHaveAP(1);
  });
});
