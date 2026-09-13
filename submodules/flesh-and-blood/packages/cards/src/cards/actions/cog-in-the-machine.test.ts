import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { dash } from "../heroes/dash.ts";
import { puffin } from "../heroes/puffin.ts";
import { cogInTheMachineRed } from "./cog-in-the-machine.ts";

describe("Cog in the Machine (SEA013) AAA", () => {
  it("happy: creates 2 Golden Cog tokens", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [cogInTheMachineRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(cogInTheMachineRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expect(Puffin.zone("arena").filter((id) => id === "token:golden-cog")).toHaveLength(2);
    expectFabCard(Puffin, cogInTheMachineRed).toBeIn("graveyard");
  });

  it("boundary: declining to tap a cog leaves this in the graveyard", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [cogInTheMachineRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(cogInTheMachineRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabCard(Puffin, cogInTheMachineRed).toBeIn("graveyard");
    expect(Puffin.zone("deck")).not.toContain(cogInTheMachineRed.canonicalId);
  });

  it("timing: tapping a cog puts this on the bottom of its owner's deck", () => {
    const game = FabTestEngine.start(
      {
        hero: puffin,
        hand: [cogInTheMachineRed],
        resourcePoints: 1,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Puffin = game.as(puffin);

    Puffin.play(cogInTheMachineRed);
    game.helpers.resolveUntilIdle({ optionalBoolean: true, entityTargets: "minimum" });

    expect(Puffin.zone("deck")).toContain(cogInTheMachineRed.canonicalId);
    expect(Puffin.zone("graveyard")).not.toContain(cogInTheMachineRed.canonicalId);
    expectFabPlayer(Puffin).toHaveAP(0);
  });
});
