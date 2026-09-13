import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { heartyBlockRed } from "./hearty-block.ts";

/**
 * Hearty Block (HVY181) — Guardian / Warrior Block, 3{d}.
 * Printed: when this defends, if you control a Vigor token, gain 1{h}.
 */

describe("Hearty Block (HVY181) AAA", () => {
  it("happy: defending while you control Vigor gains 1{h}", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [heartyBlockRed],
        arena: [fabToken("vigor")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(heartyBlockRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(20);
    expectFabCard(Bravo, heartyBlockRed).toBeIn("graveyard");
  });

  it("boundary: defending without Vigor does not gain life", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [heartyBlockRed],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(heartyBlockRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
  });

  it("timing: Vigor start-of-turn destroy still counts if it remains on the chain's defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], deck: 6 },
      {
        hero: bravo,
        hand: [heartyBlockRed],
        arena: [fabToken("might")],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith(heartyBlockRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(19);
  });
});
