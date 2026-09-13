import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { onyxAmuletBlue } from "./onyx-amulet.ts";

describe("Onyx Amulet (SEA191) AAA", () => {
  it("happy: destroy this to tap all heroes", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [onyxAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(onyxAmuletBlue);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, onyxAmuletBlue).toBeIn("graveyard");
    expectFabCard(Bravo, bravo).toBeTapped();
    expectFabCard(game.as(dash), dash).toBeTapped();
  });

  it("boundary: without activation heroes stay ready", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [onyxAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );

    expectFabCard(game.as(bravo), bravo).toBeReady();
    expectFabCard(game.as(dash), dash).toBeReady();
  });

  it("timing: go again refunds the activation AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [onyxAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(onyxAmuletBlue);
    game.helpers.resolveUntilIdle();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
