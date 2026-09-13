import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { brutalAssaultBlue } from "../shared/test-recipients.ts";
import { nimblismBlue } from "./nimblism.ts";
import { commandRespectRed } from "./command-respect.ts";

/**
 * Command Respect (BET008) — Guardian Attack, 6{p}.
 * Printed: When this hits a hero, if this has {p} greater than its base,
 * destroy a card in their arsenal.
 */

describe("Command Respect family AAA", () => {
  it("happy: above-base hit destroys their arsenal", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      {
        hero: bravo,
        arena: [fabToken("might")],
        hand: [commandRespectRed, nimblismBlue, nimblismBlue],
        resourcePoints: 0,
        actionPoints: 1,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Dash.endTurn();
    game.untilIdle({ ordering: "listed" });
    Bravo.must.pitch(nimblismBlue, nimblismBlue).playAttack(commandRespectRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("graveyard");
  });

  it("boundary: printed-power hit leaves their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        hand: [commandRespectRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arsenal: [nimblismBlue], life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);

    game.as(bravo).playAttack(commandRespectRed);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });

  it("timing: a miss does not destroy their arsenal", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        arena: [fabToken("might")],
        hand: [commandRespectRed],
        resourcePoints: 3,
        actionPoints: 1,
        deck: 6,
      },
      {
        hero: dash,
        hand: [brutalAssaultBlue, brutalAssaultBlue],
        arsenal: [nimblismBlue],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    game.untilIdle({ ordering: "listed" });
    Bravo.playAttack(commandRespectRed);
    Dash.defendWith([brutalAssaultBlue, brutalAssaultBlue]);
    game.closeCombat({ ordering: "listed" });

    expectFabCard(Dash, nimblismBlue).toBeIn("arsenal");
  });
});
