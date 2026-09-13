import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { blossomOfSpring } from "./blossom-of-spring.ts";
import { fabricOfBlossomsBlue } from "../actions/fabric-of-blossoms.ts";
import { silversheenNeedle } from "./silversheen-needle.ts";

describe("Silversheen Needle (LSS009) AAA", () => {
  it("happy: Fabric constructs gain go again while this is seated", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon2: [silversheenNeedle],
        hand: [fabricOfBlossomsBlue],
        inventory: [blossomOfSpring],
        actionPoints: 1,
        deck: 6,
      },
      { hero: bravo, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, silversheenNeedle).toBeIn("weapon2");
    Dash.play(fabricOfBlossomsBlue);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expectFabCard(Dash, fabricOfBlossomsBlue).toHaveKeyword("go-again");
    expectFabPlayer(Dash).toHaveAP(1);
    expectFabCard(Dash, silversheenNeedle).toBeIn("weapon2");
  });

  it("boundary: a Fabric construct has no go again without the needle", () => {
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

    expectFabCard(Dash, fabricOfBlossomsBlue).notToHaveKeyword("go-again");
    expectFabPlayer(Dash).toHaveAP(0);
  });

  it("timing: the Off-Hand stays seated after the Fabric construct resolves", () => {
    const game = FabTestEngine.start(
      {
        hero: dash,
        weapon2: [silversheenNeedle],
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

    expectFabCard(Dash, silversheenNeedle).toBeIn("weapon2");
  });
});
