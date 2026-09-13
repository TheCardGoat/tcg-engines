import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { pounamuAmuletBlue } from "./pounamu-amulet.ts";

describe("Pounamu Amulet (SEA195) AAA", () => {
  it("happy: destroy this to gain 2{h}", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [pounamuAmuletBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pounamuAmuletBlue);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(22);
    expectFabCard(Bravo, pounamuAmuletBlue).toBeIn("graveyard");
  });

  it("boundary: only the controller gains the life", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [pounamuAmuletBlue], actionPoints: 1, life: 20, deck: 6 },
      { hero: dash, hand: [], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pounamuAmuletBlue);
    game.passBoth();

    expectFabPlayer(Bravo).toHaveLife(22);
    expectFabPlayer(game.as(dash)).toHaveLife(20);
  });

  it("timing: go again refunds the activation AP", () => {
    const game = FabTestEngine.start(
      { hero: bravo, arena: [pounamuAmuletBlue], actionPoints: 1, deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(pounamuAmuletBlue);
    game.passBoth();
    expectFabPlayer(Bravo).toHaveAP(1);
    expect(game.combat()).toBeNull();
  });
});
