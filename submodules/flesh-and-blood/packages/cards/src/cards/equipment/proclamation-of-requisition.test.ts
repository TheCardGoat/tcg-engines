import { describe, it } from "vitest";
import {
  expectFabCard,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { cerebellumProcessorBlue } from "../actions/cerebellum-processor.ts";
import { dash } from "../heroes/dash.ts";
import { snatchRed } from "../actions/snatch.ts";
import { bravo } from "../heroes/bravo.ts";
import { proclamationOfRequisition } from "./proclamation-of-requisition.ts";

/**
 * Proclamation of Requisition (JDG003) — Adjudicator Equipment Off-Hand.
 *
 * Printed: Action - Discard a red card, destroy this: Each opponent chooses
 * an item or landmark they control. Gain control of the chosen permanents.
 */

describe("Proclamation of Requisition (JDG003) AAA", () => {
  it("happy: discard a red card and destroy this to steal the chosen item", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfRequisition],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [cerebellumProcessorBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(proclamationOfRequisition);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, proclamationOfRequisition).toBeIn("graveyard");
    expectFabCard(Bravo, cerebellumProcessorBlue).toBeIn("arena");
  });

  it("boundary: without a red card to discard the action is unpayable", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfRequisition],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], arena: [cerebellumProcessorBlue], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    game.as(bravo).expectActivationRejected(proclamationOfRequisition);
  });

  it("timing: with no opposing item or landmark the activation still destroys this", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        weapon2: [proclamationOfRequisition],
        hand: [snatchRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.activate(proclamationOfRequisition);
    game.untilIdle({ entityTargets: "minimum" });

    expectFabCard(Bravo, proclamationOfRequisition).toBeIn("graveyard");
  });
});
