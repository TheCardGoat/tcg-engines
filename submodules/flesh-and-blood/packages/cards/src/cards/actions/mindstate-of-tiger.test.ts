import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { iraCrimsonHaze } from "../heroes/ira-crimson-haze.ts";
import { mindstateOfTigerBlue } from "./mindstate-of-tiger.ts";

function tigerCount(zone: readonly string[]): number {
  return zone.filter((id) => id.startsWith("token:crouching-tiger")).length;
}

describe("Mindstate of Tiger (DYN048) AAA", () => {
  it("happy: start of your turn destroys this then creates a Crouching Tiger in hand", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], life: 20, deck: 6 },
      {
        hero: iraCrimsonHaze,
        arena: [mindstateOfTigerBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    game.as(dash).endTurn();
    game.untilIdle();

    expectFabCard(Ira, mindstateOfTigerBlue).toBeIn("graveyard");
    expect(tigerCount(Ira.zone("hand"))).toBe(1);
  });

  it("boundary: does not create a Crouching Tiger before your start of turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arena: [mindstateOfTigerBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    expectFabCard(Ira, mindstateOfTigerBlue).toBeIn("arena");
    expect(tigerCount(Ira.zone("hand"))).toBe(0);
  });

  it("timing: does not fire at the start of the opponent's turn", () => {
    const game = FabTestEngine.start(
      {
        hero: iraCrimsonHaze,
        arena: [mindstateOfTigerBlue],
        hand: [],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Ira = game.as(iraCrimsonHaze);

    Ira.endTurn();
    game.untilIdle();
    expectFabCard(Ira, mindstateOfTigerBlue).toBeIn("arena");
    expect(tigerCount(Ira.zone("hand"))).toBe(0);
  });
});
