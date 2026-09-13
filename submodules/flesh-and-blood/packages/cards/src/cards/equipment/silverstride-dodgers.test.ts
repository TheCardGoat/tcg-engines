import { describe, it } from "vitest";
import { FabTestEngine, expectFabCard } from "@tcg/flesh-and-blood-engine/testing";
import { boltyn } from "../heroes/boltyn.ts";
import { dash } from "../heroes/dash.ts";
import { flurry } from "../tokens/flurry.ts";
import { silverstrideDodgers } from "./silverstride-dodgers.ts";

/**
 * Silverstride Dodgers — Warrior Legs d1, Temper.
 *
 * Printed: "If you control a Flurry token, this gets +1{d}. Temper"
 */

describe("Silverstride Dodgers (AHA006) AAA", () => {
  it("happy: controlling a Flurry token gives this +1{d}", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, legs: [silverstrideDodgers], arena: [flurry], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    expectFabCard(Boltyn, silverstrideDodgers).toBeIn("legs");
    expectFabCard(Boltyn, silverstrideDodgers).toHaveDefense(2); // 1 + 1
  });

  it("boundary: with no Flurry token the printed 1{d} stands", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, legs: [silverstrideDodgers], hand: [], deck: 6 },
      { hero: dash, hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    expectFabCard(Boltyn, silverstrideDodgers).toHaveDefense(1);
  });

  it("timing: a Flurry token controlled by the opponent grants nothing", () => {
    const game = FabTestEngine.start(
      { hero: boltyn, legs: [silverstrideDodgers], hand: [], deck: 6 },
      { hero: dash, arena: [flurry], hand: [], deck: 6 },
    );
    const Boltyn = game.as(boltyn);

    expectFabCard(Boltyn, silverstrideDodgers).toHaveDefense(1);
  });
});
