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
import { zyggyStarlight } from "../heroes/zyggy-starlight.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { nimblismBlue } from "./nimblism.ts";
import { pulsingCardiaRed } from "./pulsing-cardia.ts";

/**
 * Pulsing Cardia (OMN021) — Lightning Illusionist AAC, cost 0, 5{p}, Fragment.
 *
 * Printed: "Whenever this fragments, gain {r}.\nFragment"
 */

describe("Pulsing Cardia (OMN021) AAA", () => {
  it("happy: a 2{d} block Fragments −2{p} and gains 1{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [pulsingCardiaRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.playAttack(pulsingCardiaRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("fragment").toHaveAttackPower(5);

    Dash.defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();

    expectFabPlayer(Zyggy).toHaveResourceCount(1);
    expectFabCard(Zyggy, pulsingCardiaRed).toBeIn("graveyard");
  });

  it("boundary: a 1{d} defender does not Fragment and RP stays 0", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [pulsingCardiaRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        arms: [ironrotGauntlet],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.playAttack(pulsingCardiaRed);
    expectCombat(game).toHaveAttackPower(5);
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Zyggy).toHaveResourceCount(0);
  });

  it("timing: two 2{d} defenders Fragment twice and gain 2{r}", () => {
    const game = FabTestEngine.start(
      {
        hero: zyggyStarlight,
        hand: [pulsingCardiaRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        head: [helmOfTheArknight],
        hand: [nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Zyggy = game.as(zyggyStarlight);
    const Dash = game.as(dash);

    Zyggy.playAttack(pulsingCardiaRed);
    Dash.defendWith(nimblismBlue, helmOfTheArknight);
    expectCombat(game).toHaveAttackPower(1);
    game.closeCombat({ ordering: "listed" });

    expectFabPlayer(Zyggy).toHaveResourceCount(2);
  });
});
