import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { crownOfDominion } from "./crown-of-dominion.ts";

describe("Crown of Dominion (DYN234) AAA", () => {
  it("happy: seating creates a Gold token and the hero is Royal", () => {
    const game = FabTestEngine.start(
      { hero: bravo, head: [crownOfDominion], hand: [], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Bravo.zone("arena")).toContain("token:gold");
    expectFabCard(Bravo, crownOfDominion).toBeIn("head");
  });

  it("boundary: without the crown there is no Gold token", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [], deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    game.helpers.resolveUntilIdle();

    expect(Bravo.zone("arena")).toHaveLength(0);
  });
});
