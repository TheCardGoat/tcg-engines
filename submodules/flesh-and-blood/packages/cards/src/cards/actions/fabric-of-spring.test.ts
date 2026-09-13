import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { fyendalSSpringTunic } from "../equipment/fyendal-s-spring-tunic.ts";
import { fabricOfSpringYellow } from "./fabric-of-spring.ts";

describe("Fabric of Spring (LSS011) AAA", () => {
  it("happy: equips Fyendal's Spring Tunic from inventory and stays as a construct", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfSpringYellow],
        inventory: [fyendalSSpringTunic],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfSpringYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, fyendalSSpringTunic).toBeIn("chest");
    expectFabCard(Dash, fabricOfSpringYellow).toBeIn("arena");
  });

  it("boundary: with no Fyendal's Spring Tunic it is negated to the graveyard", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [fabricOfSpringYellow], actionPoints: 1, deck: 6 },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfSpringYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Dash, fabricOfSpringYellow).toBeIn("graveyard");
  });

  it("timing: playing the construct spends the Action AP", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        hand: [fabricOfSpringYellow],
        inventory: [fyendalSSpringTunic],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    Dash.play(fabricOfSpringYellow);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });
    expectFabPlayer(Dash).toHaveAP(0);
  });
});
