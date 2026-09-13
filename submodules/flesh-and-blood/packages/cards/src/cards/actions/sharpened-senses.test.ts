import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dorinthea } from "../heroes/dorinthea.ts";
import { dash } from "../heroes/dash.ts";
import { dawnblade } from "../weapons/dawnblade.ts";
import { sharpenedSensesYellow } from "./sharpened-senses.ts";

describe("Sharpened Senses (HNT118) AAA", () => {
  it("happy: weapon attacks get +1{p} while this is in the arena", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [sharpenedSensesYellow],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(sharpenedSensesYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dori, sharpenedSensesYellow).toBeIn("arena");
    expectFabPlayer(Dori).toHaveAP(1);

    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
  });

  it("boundary: at the beginning of the end phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [sharpenedSensesYellow],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(sharpenedSensesYellow);
    game.helpers.resolveUntilIdle();
    expectFabCard(Dori, sharpenedSensesYellow).toBeIn("arena");

    Dori.endTurn();
    game.helpers.resolveUntilIdle();
    expectFabCard(Dori, sharpenedSensesYellow).toBeIn("graveyard");
  });

  it("timing: a 4-power weapon attack does not gain go again from twice-base", () => {
    const game = FabTestEngine.start(
      {
        hero: dorinthea,
        hand: [sharpenedSensesYellow],
        weapon1: [dawnblade],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dori = game.as(dorinthea);

    Dori.play(sharpenedSensesYellow);
    game.helpers.resolveUntilIdle();
    Dori.activate(dawnblade);
    game.passBoth();
    expect(game.combat()?.activeLink?.attackPower).toBe(4);
    expect(game.combat()?.activeLink?.keywords ?? []).not.toContain("go-again");
  });
});
