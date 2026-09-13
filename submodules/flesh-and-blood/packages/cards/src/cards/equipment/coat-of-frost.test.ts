import { describe, it } from "vitest";
import {
  expectFabCard,
  expectFabPlayer,
  FAB_MANUAL_HARNESS,
  FabTestEngine,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { bravo } from "../heroes/bravo.ts";
import { coatOfFrost } from "./coat-of-frost.ts";

/**
 * Coat of Frost (ELE145) — Ice Chest d0.
 *
 * Printed: Action - Destroy Coat of Frost: Create a Frostbite token under
 * target hero's control. Go again
 */

describe("Coat of Frost (ELE145) AAA", () => {
  it("happy: destroying this puts a Frostbite under the targeted hero", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const Dash = game.as(dash);

    Bravo.exec({
      move: "activate",
      payload: { instanceId: Bravo.ref(coatOfFrost).instanceId },
    });
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const objects = game.getState().objects;
      const dashInstance = decision.candidates.find(
        (c) => objects[c.instanceId]?.canonicalId === dash.canonicalId,
      )?.instanceId;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: [dashInstance ?? decision.candidates[0]!.instanceId],
          },
        },
      });
    }
    game.passBoth();

    expectFabCard(Bravo, coatOfFrost).toBeIn("graveyard");
    expectFabPlayer(Dash).toHaveTokenCount("frostbite", 1);
    expectFabPlayer(Bravo).toHaveAP(1);
  });

  it("boundary: the Action is illegal with 0 action points", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        hand: [],
        actionPoints: 0,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);

    Bravo.expectActivationRejected(coatOfFrost);
    expectFabCard(Bravo, coatOfFrost).toBeIn("chest");
    expectFabPlayer(game.as(dash)).toHaveTokenCount("frostbite", 0);
  });

  it("timing: go again refunds the Action AP after destroy-self", () => {
    const game = FabTestEngine.start(
      {
        hero: bravo,
        chest: [coatOfFrost],
        hand: [],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Bravo = game.as(bravo);
    const _Dash = game.as(dash);

    Bravo.exec({
      move: "activate",
      payload: { instanceId: Bravo.ref(coatOfFrost).instanceId },
    });
    const decision = game.getState().decision;
    if (decision?.kind === "entity-target") {
      const objects = game.getState().objects;
      const bravoInstance = decision.candidates.find(
        (c) => objects[c.instanceId]?.canonicalId === bravo.canonicalId,
      )?.instanceId;
      game.exec({
        move: "answer-decision",
        actorId: decision.actorId,
        payload: {
          decisionId: decision.decisionId,
          stateVersion: decision.stateVersion,
          answer: {
            kind: "entity-target",
            instanceIds: [bravoInstance ?? decision.candidates[0]!.instanceId],
          },
        },
      });
    }
    game.passBoth();

    expectFabPlayer(Bravo).toHaveAP(1);
    expectFabCard(Bravo, coatOfFrost).toBeIn("graveyard");
  });
});
