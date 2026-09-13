import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { slitheringShadowpedeRed } from "../actions/slithering-shadowpede.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { blasmophetTheInsatiableHunger } from "./blasmophet-the-insatiable-hunger.ts";

describe("Blasmophet, the Insatiable Hunger (IAR221) AAA", () => {
  it("happy: at each end phase this is destroyed if you have not banished a blood-debt card", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger],
        hand: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline" });
    expect(Bravo.zone("arena")).not.toContain(blasmophetTheInsatiableHunger.canonicalId);
  });

  it("boundary: declining the hand-banish still destroys this without a blood-debt banish", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger],
        hand: [slitheringShadowpedeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle({ optionals: "decline" });
    expectFabCard(Bravo, slitheringShadowpedeRed).toBeIn("hand");
    expect(Bravo.zone("arena")).not.toContain(blasmophetTheInsatiableHunger.canonicalId);
  });

  it("timing: the opponent's end phase also evaluates the destroy clause", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).endTurn();
    game.untilIdle({ optionals: "decline" });
    expect(Bravo.zone("arena")).not.toContain(blasmophetTheInsatiableHunger.canonicalId);
    expectFabPlayer(Bravo).toHaveLife(20);
  });

  it("UST notes: banishing a blood-debt card during the end-phase optional still saves this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [blasmophetTheInsatiableHunger],
        hand: [slitheringShadowpedeRed],
        life: 20,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.endTurn();
    game.untilIdle({ optionals: "accept" });

    expectFabCard(Bravo, slitheringShadowpedeRed).toBeBanished();
    expect(Bravo.zone("arena")).toContain(blasmophetTheInsatiableHunger.canonicalId);
  });
});
