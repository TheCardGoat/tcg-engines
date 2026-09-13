import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { diamondAmuletBlue } from "./diamond-amulet.ts";

describe("Diamond Amulet (SEA190) AAA", () => {
  it("happy: Instant destroy this to gain 1 action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [diamondAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(diamondAmuletBlue);
    game.passBoth();

    expectFabCard(Bravo, diamondAmuletBlue).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveAP(2);
  });

  it("boundary: without activation AP stays at 1 and the item remains", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [diamondAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, diamondAmuletBlue).toBeIn("arena");
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("timing: Instant activation does not spend an action point", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [diamondAmuletBlue], actionPoints: 0, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(diamondAmuletBlue);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
