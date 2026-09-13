import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "./snatch.ts";
import { byTheBookBlue } from "./by-the-book.ts";

describe("By the Book (PEN289) AAA", () => {
  it("happy: with less life than the other hero this plays as an Instant during combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [byTheBookBlue],
        life: 10,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    expect(() => Bravo.play(byTheBookBlue)).toThrow(/Only the player with priority/);
    expectFabCard(Bravo, byTheBookBlue).toBeIn("hand");
  });

  it("boundary: with equal life this is not an Instant during combat", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        hand: [byTheBookBlue],
        life: 20,
        deck: 6,
      },
      { ...FAB_MANUAL_HARNESS, firstPlayer: dash },
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed, { stopAt: "defend" });
    expect(() => Bravo.play(byTheBookBlue)).toThrow();
    expectFabCard(Bravo, byTheBookBlue).toBeIn("hand");
  });

  it("timing: at the beginning of your action phase this is destroyed", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [byTheBookBlue],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expect(() => {
      Bravo.play(byTheBookBlue);
      game.untilIdle();
    }).toThrow(/continuous duration is not yet canonical/);
    expectFabCard(Bravo, byTheBookBlue).toBeIn("stack");
  });
});
