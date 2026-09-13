import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
} from "@tcg/flesh-and-blood-engine/testing";
import { kano } from "../heroes/kano.ts";
import { dash } from "../heroes/dash.ts";
import { volzarTheLightningRod } from "./volzar-the-lightning-rod.ts";

describe("Volzar, the Lightning Rod (OSC002) AAA", () => {
  it("happy: the staff seats in weapon1", () => {
    const game = FabTestEngine.start(
      { hero: kano, weapon1: [volzarTheLightningRod], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expectFabCard(game.as(kano), volzarTheLightningRod).toBeIn("weapon1");
  });

  it("boundary: Bravo cannot activate Kano's staff", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], deck: 6 },
      { hero: kano, weapon1: [volzarTheLightningRod], hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    expect(() => game.as(dash).activate(volzarTheLightningRod)).toThrow();
    expectFabCard(game.as(kano), volzarTheLightningRod).toBeIn("weapon1");
  });
});
