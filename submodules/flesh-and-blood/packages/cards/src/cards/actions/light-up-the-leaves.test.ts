import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { weaveIceRed } from "./weave-ice.ts";
import { lightUpTheLeavesRed } from "./light-up-the-leaves.ts";

describe("Light Up the Leaves (SUP264) AAA", () => {
  it("boundary: Instant is illegal without a second Earth card", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [lightUpTheLeavesRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).expectActivationRejected(lightUpTheLeavesRed);
    expectFabCard(game.as(kano), lightUpTheLeavesRed).toBeIn("hand");
  });

  it("happy: seating keeps Light Up the Leaves in hand", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [lightUpTheLeavesRed, weaveIceRed], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(kano), lightUpTheLeavesRed).toBeIn("hand");
  });
});
