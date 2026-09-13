import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { adaptiveAlphaMold } from "./adaptive-alpha-mold.ts";

describe("Adaptive Alpha Mold (SUP253) AAA", () => {
  it("happy: Battleworn d1 — first defend stays seated with a −1{d} counter", () => {
    const game = FabTestEngine.start(
      { hero: bravo, hand: [snatchRed], actionPoints: 1, deck: 6 },
      { hero: dash, life: 20, chest: [adaptiveAlphaMold], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).attackWith(snatchRed);
    Dash.defendWith(adaptiveAlphaMold);
    game.helpers.resolveRestOfCombat();

    expectFabCard(Dash, adaptiveAlphaMold).toBeIn("chest");
    expectFabCard(Dash, adaptiveAlphaMold).toHaveDefenseCounters(-1);
    expectFabPlayer(Dash).toHaveLife(17);
  });

  it("boundary: Modular lets the unprinted Base start seated in head", () => {
    const game = FabTestEngine.start(
      { hero: dash, head: [adaptiveAlphaMold], deck: 6 },
      { hero: bravo, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    expectFabCard(Dash, adaptiveAlphaMold).toBeIn("head");
    expectFabCard(Dash, adaptiveAlphaMold).toHaveKeyword("battleworn");
    expectFabCard(Dash, adaptiveAlphaMold).toHaveKeyword("modular");
  });

  it("happy: Action - 0 re-equips this to another equipment zone", () => {
    const game = FabTestEngine.start(
      { hero: bravo, chest: [adaptiveAlphaMold], actionPoints: 1, deck: 6 },
      { hero: dash, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(adaptiveAlphaMold, { equipToZone: "head" });
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, adaptiveAlphaMold).toBeIn("head");
    expect(Bravo.zone("chest")).not.toContain(adaptiveAlphaMold.canonicalId);
  });
});
