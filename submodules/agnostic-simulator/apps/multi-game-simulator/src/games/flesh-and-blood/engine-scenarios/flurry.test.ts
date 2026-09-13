import { dorintheaIronsong } from "@tcg/flesh-and-blood-cards/cards/heroes/dorinthea-ironsong";
import { dash } from "@tcg/flesh-and-blood-cards/cards/heroes/dash";
import { flurry } from "@tcg/flesh-and-blood-cards/cards/tokens/flurry";
import { durendal } from "@tcg/flesh-and-blood-cards/cards/weapons/durendal";
import { FabTestEngine, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";
import { presentRuntime } from "../projection";
import { getFabEngineScenario } from "./index";

describe("FAB Flurry visual · leftover Durendal attack after a miss", () => {
  it("keeps one Durendal activation after a blocked swing because Flurry set the limit to two", () => {
    const scenario = getFabEngineScenario("flurry-durendal-blocked-remaining");
    const match = scenario?.boot();
    if (!scenario || !match) {
      throw new Error("Missing Flurry leftover-attack visual scenario.");
    }

    const game = FabTestEngine.fromRuntime(match.runtime);
    const Dori = game.as(dorintheaIronsong);
    const Dash = game.as(dash);
    const presentation = presentRuntime(match.runtime, match.player1Id);
    const durendalInstanceId = Object.values(presentation.cards).find(
      (card) => card.cardId === durendal.canonicalId,
    )?.id;
    if (!durendalInstanceId) throw new Error("Expected Durendal on the board.");

    expect(match.engine.renderedPlayerNarrative(match.player1Id)).toContain(
      "Flurry was destroyed.",
    );
    expect(match.engine.renderedPlayerNarrative(match.player1Id)).toContain(
      "Flurry let Durendal attack twice this turn.",
    );
    expect(
      match.engine
        .renderedPlayerNarrative(match.player1Id)
        .some((line) => line.includes("Dorinthea Ironsong let Durendal")),
    ).toBe(false);
    expect(game.combat()?.open ?? false).toBe(false);
    expectFabPlayer(Dori).toHaveAP(0);
    expectFabPlayer(Dori).toHaveTokenCount("flurry", 0);
    expect(Dori.zone("arena")).not.toContain(flurry.canonicalId);
    expectFabPlayer(Dash).toHaveLife(20);

    expect(presentation.attackActivationsByInstanceId?.[durendalInstanceId]).toEqual({
      controllerId: match.player1Id,
      total: 2,
      used: 1,
      remaining: 1,
    });
    expect(game.getState().activationLimitModifiers).toEqual([
      expect.objectContaining({
        operation: "set-total",
        count: 2,
      }),
    ]);
    expect(
      game
        .getState()
        .activationLimitModifiers.some((modifier) => modifier.operation === "additional"),
    ).toBe(false);
  });
});
