import { describe, expect, it } from "vitest";
import {
  expectCombat,
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { helmOfTheArknight } from "../equipment/helm-of-the-arknight.ts";
import { prism } from "../heroes/prism.ts";
import { ironrotGauntlet } from "../equipment/ironrot-gauntlet.ts";
import { nimblismBlue } from "./nimblism.ts";
import { snatchRed } from "./snatch.ts";
import { erodeAuthorityRed } from "./erode-authority.ts";

describe("Erode Authority (OMN044) AAA", () => {
  it("happy: Dominate rejects two from hand and a 2{d} block Fragments −2{p}", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [erodeAuthorityRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        life: 20,
        hand: [snatchRed, nimblismBlue],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Prism = game.as(prism);
    const Dash = game.as(dash);

    Prism.playAttack(erodeAuthorityRed);
    expectCombat(game).toBeAtStep("defend").toHaveKeyword("dominate").toHaveKeyword("fragment");
    expect(Dash.expectBlockRejected([snatchRed, nimblismBlue]).errorCode).toBe("dominate");

    Dash.defendWith(nimblismBlue);
    expectCombat(game).toHaveAttackPower(5);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(17);
    expectFabCard(Prism, erodeAuthorityRed).toBeIn("graveyard");
  });

  it("boundary: a 1{d} defender does not Fragment", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [erodeAuthorityRed],
        resourcePoints: 3,
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

    game.as(prism).playAttack(erodeAuthorityRed);
    expectCombat(game).toHaveAttackPower(7);
    Dash.defendWith(ironrotGauntlet);
    expectCombat(game).toHaveAttackPower(7);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(14);
  });

  it("timing: two 2{d} defenders Fragment twice", () => {
    const game = FabTestEngine.start(
      {
        hero: prism,
        hand: [erodeAuthorityRed],
        resourcePoints: 3,
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

    game.as(prism).playAttack(erodeAuthorityRed);
    Dash.defendWith(nimblismBlue, helmOfTheArknight);
    expectCombat(game).toHaveAttackPower(3);
    game.closeCombat();

    expectFabPlayer(Dash).toHaveLife(20);
  });
});
