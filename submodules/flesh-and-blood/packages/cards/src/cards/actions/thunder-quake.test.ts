import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { bravo } from "../heroes/bravo.ts";
import { dash } from "../heroes/dash.ts";
import { thunderQuakeRed } from "./thunder-quake.ts";

describe("Thunder Quake (EVR024) AAA", () => {
  it("happy: attacks for printed 10 power", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [thunderQuakeRed],
        resourcePoints: 6,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.attackWith(thunderQuakeRed);
    expect(game.combat()?.activeLink?.attackPower).toBe(10);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(game.as(dash)).toHaveLife(10);
    expectFabCard(Bravo, thunderQuakeRed).toBeIn("graveyard");
  });

  it("boundary: cannot be played without paying the 6-resource cost", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [thunderQuakeRed],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expect(() => game.as(bravo).attackWith(thunderQuakeRed)).toThrow();
    expectFabCard(game.as(bravo), thunderQuakeRed).toBeIn("hand");
  });

  it("timing: Heave 3 at end of turn arsenals this and creates 3 Seismic Surges", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [thunderQuakeRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.advanceToDecision(Bravo, "entity-target");
    Bravo.chooseTargets(thunderQuakeRed);

    expectFabCard(Bravo, thunderQuakeRed).toBeIn("arsenal");
    expect(game.objectState(Bravo.cardIn("arsenal", thunderQuakeRed).instanceId).faceDown).not.toBe(
      true,
    );
    expect(Bravo.zone("arena")).toHaveLength(3);
  });
});
