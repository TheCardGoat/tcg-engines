import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { burnBare } from "./burn-bare.ts";

describe("Burn Bare (SEA255) AAA", () => {
  it("boundary: Instant is illegal with no phantasm attack", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [burnBare], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(kano).expectActivationRejected(burnBare);
    expectFabCard(game.as(kano), burnBare).toBeIn("hand");
  });

  it("happy: seating keeps Burn Bare in hand", () => {
    const game = FabTestEngine.start(
      { hero: kano, hand: [burnBare], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(kano), burnBare).toBeIn("hand");
  });
});
