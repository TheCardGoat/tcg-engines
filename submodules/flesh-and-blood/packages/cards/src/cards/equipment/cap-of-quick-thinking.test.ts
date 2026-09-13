import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { nimblismBlue } from "../actions/nimblism.ts";
import { snatchRed } from "../actions/snatch.ts";
import { sigilOfSolaceRed } from "../instants/sigil-of-solace.ts";
import { capOfQuickThinking } from "./cap-of-quick-thinking.ts";

describe("Cap of Quick Thinking (AST003) AAA", () => {
  it("happy: destroy this, discard an Instant to prevent 1 and draw", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed],
        deck: [nimblismBlue, nimblismBlue, nimblismBlue, nimblismBlue],
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    expectFabCard(Bravo, capOfQuickThinking).toBeIn("graveyard");

    for (let i = 0; i < 12; i += 1) {
      const wait = game.waitState();
      if (wait.kind === "decision" && wait.decision.kind === "option") break;
      if (wait.kind === "priority") game.pass(wait.playerId);
    }
    const choice = Bravo.expectDecision("option");
    Bravo.chooseOptions(choice.options[0]!.id);
    Bravo.chooseTargets(sigilOfSolaceRed);
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(17);
    expectFabCard(Bravo, sigilOfSolaceRed).toBeIn("graveyard");
    expectFabPlayer(Bravo).toHaveHandCount(1);
  });

  it("boundary: no Instant in hand takes the full 4 damage", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [nimblismBlue],
        deck: 4,
        life: 20,
      },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    game.as(dash).attackWith(snatchRed);
    Bravo.defendWith([]);
    game.as(dash).pass();
    Bravo.activate(capOfQuickThinking);
    game.passBoth();
    game.helpers.resolveRestOfCombat();

    expectFabPlayer(Bravo).toHaveLife(16);
    expectFabCard(Bravo, nimblismBlue).toBeIn("hand");
  });

  it("timing: destroy-self is paid even if no damage is dealt", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        head: [capOfQuickThinking],
        hand: [sigilOfSolaceRed],
        actionPoints: 1,
        deck: 4,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(capOfQuickThinking);
    game.helpers.resolveUntilIdle();

    expectFabCard(Bravo, capOfQuickThinking).toBeIn("graveyard");
  });
});
