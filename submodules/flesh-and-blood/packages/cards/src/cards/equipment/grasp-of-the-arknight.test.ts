import { describe, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
  fabToken,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { viserai } from "../heroes/viserai.ts";
import { graspOfTheArknight } from "./grasp-of-the-arknight.ts";

describe("Grasp of the Arknight (ARC078) AAA", () => {
  it("happy: 2{r} creates a Runechant token", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [graspOfTheArknight],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(graspOfTheArknight);
    game.helpers.resolveUntilIdle();

    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Viserai).toHaveResourceCount(0);
    expectFabCard(Viserai, graspOfTheArknight).toBeIn("arms");
  });

  it("boundary: with 1 existing Runechant, 2{r} cannot pay the 3{r} tax", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [graspOfTheArknight],
        arena: [fabToken("runechant")],
        hand: [],
        actionPoints: 1,
        resourcePoints: 2,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.expectActivationRejected(graspOfTheArknight);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
    expectFabPlayer(Viserai).toHaveResourceCount(2);
  });

  it("timing: once per turn — a second activate is illegal", () => {
    const game = FabTestEngine.start(
      {
        hero: viserai,
        arms: [graspOfTheArknight],
        hand: [],
        actionPoints: 2,
        resourcePoints: 4,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Viserai = game.as(viserai);

    Viserai.activate(graspOfTheArknight);
    game.helpers.resolveUntilIdle();
    Viserai.expectActivationRejected(graspOfTheArknight);
    expectFabPlayer(Viserai).toHaveTokenCount("runechant", 1);
  });
});
