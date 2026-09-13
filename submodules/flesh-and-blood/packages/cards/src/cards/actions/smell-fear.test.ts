import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { rhinar } from "../heroes/rhinar.ts";
import { beastModeRed } from "./beast-mode.ts";
import { nimblismBlue } from "./nimblism.ts";
import { smellFearBlue } from "./smell-fear.ts";
import { smellFearYellow } from "./smell-fear.ts";

describe("Smell Fear (ARR028) AAA", () => {
  it("happy: beating chest intimidates the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearBlue, beastModeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(smellFearBlue, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, beastModeRed).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: skipping beat chest does not intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(rhinar).play(smellFearBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(smellFearBlue);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});

describe("Smell Fear (ARR021) AAA", () => {
  it("happy: beating chest intimidates the opposing hero", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearYellow, beastModeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);
    const Dash = game.as(dash);
    const beastId = Rhinar.findCardInZone("hand", beastModeRed);

    Rhinar.play(smellFearYellow, {
      beatChest: true,
      beatChestInstanceId: beastId,
    });
    game.helpers.resolveUntilIdle();

    expectFabCard(Rhinar, beastModeRed).toBeIn("graveyard");
    expectFabCard(Dash, nimblismBlue).toBeBanished();
  });

  it("boundary: skipping beat chest does not intimidate", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [nimblismBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(rhinar).play(smellFearYellow);
    game.helpers.resolveUntilIdle();

    expectFabCard(Dash, nimblismBlue).toBeIn("hand");
  });

  it("timing: go again refunds the action point", () => {
    const game = FabTestEngine.start(
      {
        hero: rhinar,
        hand: [smellFearYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Rhinar = game.as(rhinar);

    Rhinar.play(smellFearYellow);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Rhinar).toHaveAP(1);
  });
});
