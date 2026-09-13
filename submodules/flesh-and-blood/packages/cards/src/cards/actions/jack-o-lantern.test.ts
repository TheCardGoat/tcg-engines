import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { chane } from "../heroes/chane.ts";
import { snatchRed } from "./snatch.ts";
import { nimblismBlue } from "./nimblism.ts";
import { jackOLanternRed } from "./jack-o-lantern.ts";
import { jackOLanternBlue } from "./jack-o-lantern.ts";

describe("Jack-o'-lantern (LGS176) AAA", () => {
  it("happy: banishing a red top card creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [jackOLanternRed],
        actionPoints: 1,
        deckTop: [snatchRed],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(jackOLanternRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Chane, snatchRed).toBeBanished();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1);
    expectFabCard(Chane, jackOLanternRed).toBeIn("graveyard");
  });

  it("boundary: banishing a non-red top card creates no Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [jackOLanternRed],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);
    const Dash = game.as(dash);

    Chane.play(jackOLanternRed);
    game.helpers.resolveUntilIdle();

    expectFabCard(Chane, nimblismBlue).toBeBanished();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 0);
    expectFabPlayer(Dash).toHaveTokenCount("runechant", 0);
  });

  it("timing: printed 2{d} still defends an opposing attack", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: chane,
        hand: [jackOLanternRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Chane = game.as(chane);

    Dash.playAttack(snatchRed);
    game.advanceCombatTo("defend");
    Chane.defendWith(jackOLanternRed);
    game.closeCombat({ optionals: "decline" });

    expectFabPlayer(Chane).toHaveLife(18);
    expectFabCard(Chane, jackOLanternRed).toBeIn("graveyard");
  });

  it("happy: banishing a blue top card creates a Runechant", () => {
    const game = FabTestEngine.start(
      {
        hero: chane,
        hand: [jackOLanternBlue],
        actionPoints: 1,
        deckTop: [nimblismBlue],
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Chane = game.as(chane);

    Chane.play(jackOLanternBlue);
    game.untilIdle();

    expectFabCard(Chane, nimblismBlue).toBeBanished();
    expectFabPlayer(Chane).toHaveTokenCount("runechant", 1);
    expectFabCard(Chane, jackOLanternBlue).toBeIn("graveyard");
  });
});
