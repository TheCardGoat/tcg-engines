import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { kayoStrongArm } from "../heroes/kayo-strong-arm.ts";
import { snatchRed } from "../actions/snatch.ts";
import { notSoMightyBlue } from "./not-so-mighty.ts";

describe("Not So Mighty (SUP062) AAA", () => {
  it("happy: defending a Reviled attack destroys their Might and creates Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [snatchRed],
        arena: [fabToken("might")],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoMightyBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Kayo = game.as(kayoStrongArm);

    Kayo.attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoMightyBlue);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabPlayer(Kayo).toHaveTokenCount("might", 0);
    expectFabPlayer(Dash).toHaveTokenCount("toughness", 1);
  });

  it("boundary: defending a non-Reviled attack does not destroy Might", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [snatchRed],
        arena: [fabToken("might")],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoMightyBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoMightyBlue);
    game.untilIdle();

    expectFabPlayer(game.as(bravo)).toHaveTokenCount("might", 1);
    expectFabPlayer(Dash).toHaveTokenCount("toughness", 0);
    expectFabCard(Dash, notSoMightyBlue).toBeIn("graveyard");
  });

  it("boundary: defending a Reviled attack with no Might does not create Toughness", () => {
    const game = FabTestEngine.start(
      {
        hero: kayoStrongArm,
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [notSoMightyBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(kayoStrongArm).attackWith(snatchRed);
    game.advanceCombatTo("defend");
    Dash.defendWith(notSoMightyBlue);
    game.untilIdle();

    expectFabPlayer(Dash).toHaveTokenCount("toughness", 0);
  });
});
