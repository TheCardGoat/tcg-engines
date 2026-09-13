import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { pearlAmuletBlue } from "./pearl-amulet.ts";

describe("Pearl Amulet (SEA193) AAA", () => {
  it("happy: destroy this to untap target permanent", () => {
    const gold = fabToken("gold");
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [pearlAmuletBlue, gold],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pearlAmuletBlue);
    game.helpers.resolveUntilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, pearlAmuletBlue).toBeIn("graveyard");
  });

  it("boundary: activating with no other permanent still destroys this", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [pearlAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pearlAmuletBlue);
    game.helpers.resolveUntilIdle();
    expectFabCard(Bravo, pearlAmuletBlue).toBeIn("graveyard");
  });

  it("timing: go again refunds the activation AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [pearlAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pearlAmuletBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
