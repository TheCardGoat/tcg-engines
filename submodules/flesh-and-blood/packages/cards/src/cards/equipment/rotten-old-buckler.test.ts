import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectCombat,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { snatchRed } from "../actions/snatch.ts";
import { rottenOldBuckler } from "./rotten-old-buckler.ts";

describe("Rotten Old Buckler (ELE204) AAA", () => {
  it("happy: defending with this 1{d} Off-Hand destroys it when the chain closes", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rottenOldBuckler],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    expectFabCard(Bravo, rottenOldBuckler).toHaveKeyword("blade-break");
    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rottenOldBuckler);
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, rottenOldBuckler).toBeIn("graveyard");
  });

  it("boundary: this stays equipped in weapon2 when it does not defend", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rottenOldBuckler],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith();
    game.untilIdle({ optionals: "decline" });

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, rottenOldBuckler).toBeIn("weapon2");
  });

  it("timing: Blade Break destroys this at chain close, not when it is declared as a defender", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        weapon2: [rottenOldBuckler],
        hand: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).playAttack(snatchRed);
    Bravo.defendWith(rottenOldBuckler);

    expectCombat(game).toBeOpen();
    expectFabCard(Bravo, rottenOldBuckler).toBeIn("combatChain");

    game.closeCombat({ optionals: "decline" });

    expectCombat(game).toBeClosed();
    expectFabCard(Bravo, rottenOldBuckler).toBeIn("graveyard");
  });
});
