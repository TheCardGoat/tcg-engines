import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blossomOfSpring } from "../equipment/blossom-of-spring.ts";
import { fabricOfBlossomsBlue } from "./fabric-of-blossoms.ts";

describe("Fabric of Blossoms (LSS010) AAA", () => {
  it("happy: equips Blossom of Spring from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfBlossomsBlue],
        inventory: [blossomOfSpring],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfBlossomsBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, blossomOfSpring).toBeIn("chest");
    expectFabCard(Dash, fabricOfBlossomsBlue).toBeIn("arena");
  });

  it("boundary: with no Blossom of Spring it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fabricOfBlossomsBlue], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfBlossomsBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, fabricOfBlossomsBlue).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfBlossomsBlue],
        inventory: [blossomOfSpring],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfBlossomsBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
