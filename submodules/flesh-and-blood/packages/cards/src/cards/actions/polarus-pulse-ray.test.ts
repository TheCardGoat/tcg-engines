import { describe, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { helmOfTheArknight } from "../equipment/helm-of-the-arknight.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { nimblismBlue } from "./nimblism.ts";
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { polarusPulseRayRed } from "./polarus-pulse-ray.ts";

describe("Polarus Pulse Ray (AZS011) AAA", () => {
  it("happy: a 2{d} block Fragments −2{p} and deals 1 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [polarusPulseRayRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.playAttack(polarusPulseRayRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("fragment").toHaveAttackPower(7);

    Dash.defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(16);
    expectFabCard(Zyggy, polarusPulseRayRed).toBeIn("graveyard");
  });

  it("boundary: a 1{d} defender does not Fragment and deals no arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [polarusPulseRayRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        arms: [ironrotGauntlet],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(zyggyStarlight).playAttack(polarusPulseRayRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: two 2{d} defenders Fragment twice and deal 2 arcane", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [polarusPulseRayRed],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        head: [helmOfTheArknight],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(zyggyStarlight).playAttack(polarusPulseRayRed);
    Dash.defendWith(nimblismBlue, helmOfTheArknight);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Dash).toHaveLife(18);
  });
});
