import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { scabskinLeathers } from "../equipment/scabskin-leathers.ts";
import { venombackFabricYellow } from "./venomback-fabric.ts";

describe("Venomback Fabric (LSS018) AAA", () => {
  it("happy: equips Scabskin Leathers from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [venombackFabricYellow],
        inventory: [scabskinLeathers],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(venombackFabricYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, scabskinLeathers).toBeIn("legs");
    expectFabCard(Dash, venombackFabricYellow).toBeIn("arena");
  });

  it("boundary: with no Scabskin Leathers it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [venombackFabricYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(venombackFabricYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, venombackFabricYellow).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [venombackFabricYellow],
        inventory: [scabskinLeathers],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(venombackFabricYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
