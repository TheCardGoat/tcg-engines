import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { fai } from "../heroes/fai.ts";
import { dash } from "../heroes/dash.ts";
import { brandWithCinderclawRed } from "./brand-with-cinderclaw.ts";
import { kunaiOfRetribution } from "../weapons/kunai-of-retribution.ts";
import { silverTalonsRed } from "./silver-talons.ts";

describe("Silver Talons (CIN019) AAA", () => {
  it("happy: when this attacks as Draconic, a dagger deals 1 and is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, silverTalonsRed],
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(silverTalonsRed);
    expectCombat(game).toHaveAttackSupertype("Draconic");
    game.closeCombat({ optionals: "accept", entityTargets: "minimum" });

    expectFabPlayer(game.as(dash)).toHaveLife(13);
    expectFabCard(Fai, kunaiOfRetribution).toBeIn("weapon1");
  });

  it("boundary: without being Draconic the dagger stays equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [silverTalonsRed],
        weapon1: [kunaiOfRetribution],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.playAttack(silverTalonsRed);
    expectCombat(game).notToHaveAttackSupertype("Draconic");
    expectFabCard(Fai, kunaiOfRetribution).toBeIn("weapon1");
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: declining the dagger strike leaves the dagger equipped", () => {
    const game = FabTestEngine.start(
      {
        hero: fai,
        hand: [brandWithCinderclawRed, silverTalonsRed],
        weapon1: [kunaiOfRetribution],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Fai = game.as(fai);

    Fai.attackWith(brandWithCinderclawRed);
    game.advanceCombatTo("resolution");
    Fai.playAttack(silverTalonsRed);
    game.closeCombat({ optionals: "decline" });

    expectFabCard(Fai, kunaiOfRetribution).toBeIn("weapon1");
  });
});
