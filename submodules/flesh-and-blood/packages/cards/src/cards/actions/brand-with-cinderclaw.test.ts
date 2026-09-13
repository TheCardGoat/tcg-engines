import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  expectCombat,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { brutalAssaultBlue } from "./brutal-assault.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";

describe("Brand with Cinderclaw (FAI020) AAA", () => {
  it("happy: attacks for 3 and go again refunds the action point", () => {
    const game = FabTestEngine.start(
      { hero: fai, hand: [brandWithCinderclawRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    expectCombat(game).toHaveKeyword("go-again");
    expectCombat(game).toHaveAttackPower(3);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(17);
    expectFabCard(Fai, brandWithCinderclawRed).toBeIn("graveyard");
    expectFabPlayer(Fai).toHaveAP(1);
  });

  it("boundary: a later chain's first attack is not branded Draconic", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.helpers.resolveRestOfCombat();
    expect(game.combat()).toBeNull();

    Fai.attackWith(brutalAssaultBlue);
    expectCombat(game).notToHaveAttackSupertype("Draconic");
  });

  it("timing: next attack this combat chain is Draconic", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    expectCombat(game).toHaveAttackSupertype("Draconic");
    game.advanceCombatTo("resolution");
    Fai.attackWith(brutalAssaultBlue);

    expectCombat(game).toHaveAttackSupertype("Draconic");
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });
});
