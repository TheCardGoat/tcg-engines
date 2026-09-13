import { describe, expect, it } from "vitest";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  expectFabCard,
  expectFabPlayer,
} from "@tcg/flesh-and-blood-engine/testing";
import { oscilio } from "../heroes/oscilio.ts";
import { dash } from "../heroes/dash.ts";
import { enionSurgeRed } from "./enion-surge.ts";

describe("Enion Surge (OMN112) AAA", () => {
  it("happy: deals 3 arcane; tapping the hero creates a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [enionSurgeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(enionSurgeRed, { target: Oscilio.id });
    game.passBoth();
    if (game.pendingDecision()?.kind === "boolean") Oscilio.chooseBoolean(true);
    game.helpers.resolveUntilIdle({ optionalBoolean: true });

    expectFabPlayer(Oscilio).toHaveLife(15);
    expect(Oscilio.zone("arena")).toContain("token:lightning-flow");
    expectFabCard(Oscilio, oscilio).toBeTapped();
    expectFabCard(Oscilio, enionSurgeRed).toBeIn("graveyard");
  });

  it("boundary: declining the tap does not create a Lightning Flow token", () => {
    const game = FabTestEngine.start(
      {
        hero: oscilio,
        hand: [enionSurgeRed],
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, life: 20, deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Oscilio = game.as(oscilio);

    Oscilio.play(enionSurgeRed, { target: Oscilio.id });
    game.passBoth();
    if (game.pendingDecision()?.kind === "boolean") Oscilio.chooseBoolean(false);
    game.helpers.resolveUntilIdle({ optionalBoolean: false });

    expectFabPlayer(Oscilio).toHaveLife(15);
    expect(Oscilio.zone("arena")).not.toContain("token:lightning-flow");
    expectFabCard(Oscilio, oscilio).toBeReady();
  });
});
