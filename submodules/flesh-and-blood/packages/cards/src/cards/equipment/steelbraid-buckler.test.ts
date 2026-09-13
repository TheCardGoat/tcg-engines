import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { steelbraidBuckler } from "./steelbraid-buckler.ts";

describe("Steelbraid Buckler (DYN027) AAA", () => {
  it("happy: defending puts a −1{d} counter and leaves 1{d} seated", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [steelbraidBuckler],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, steelbraidBuckler).toHaveKeyword("temper");
    expectFabCard(Bravo, steelbraidBuckler).toBeIn("weapon2");
    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(steelbraidBuckler);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(18);
    expectFabCard(Bravo, steelbraidBuckler).toBeIn("weapon2");
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(-1);
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefense(1);
  });

  it("boundary: an unused buckler keeps 2{d} and no Temper counter", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [steelbraidBuckler],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith();
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, steelbraidBuckler).toBeIn("weapon2");
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefenseCounters(0);
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefense(2);
  });

  it("timing: a second defend at 1{d} Temper-destroys the buckler", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed, snatchRed], actionPoints: 2, deck: 6 },
      {
        hero: bravo,
        life: 20,
        weapon2: [steelbraidBuckler],
        hand: [],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Bravo = game.as(bravo);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(steelbraidBuckler);
    game.closeCombat();
    expectFabCard(Bravo, steelbraidBuckler).toHaveDefense(1);

    Dash.playAttack(snatchRed);
    Bravo.defendWith(steelbraidBuckler);
    game.closeCombat();

    expectFabPlayer(Bravo).toHaveLife(15);
    expectFabCard(Bravo, steelbraidBuckler).toBeIn("graveyard");
  });
});
