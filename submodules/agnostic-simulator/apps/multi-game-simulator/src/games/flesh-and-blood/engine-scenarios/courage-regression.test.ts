import { headJabBlue } from "@tcg/flesh-and-blood-cards/cards/actions/head-jab";
import { olympia } from "@tcg/flesh-and-blood-cards/cards/heroes/olympia";
import { FabTestEngine, expectCombat, expectFabPlayer } from "@tcg/flesh-and-blood-engine/testing";
import { describe, expect, it } from "vitest";
import { presentRuntime } from "../projection";
import { getFabEngineScenario } from "./index";

describe("FAB Courage visual regression", () => {
  it("consumes both tokens for the current attack and includes both creations in history", () => {
    const scenario = getFabEngineScenario("courage-consumption-and-logs");
    const match = scenario?.boot();
    if (!scenario || !match) throw new Error("Missing Courage consumption visual scenario.");

    const game = FabTestEngine.fromRuntime(match.runtime);
    const Olympia = game.as(olympia);
    const presentation = presentRuntime(match.runtime, match.player1Id);
    const courageEffects = presentation.activeEffects.filter(
      (effect) => effect.sourceLabel === "Courage",
    );

    expectFabPlayer(Olympia).toHaveTokenCount("courage", 0);
    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(5);
    expect(courageEffects).toHaveLength(2);
    expect(courageEffects).toEqual(
      expect.arrayContaining([expect.objectContaining({ label: "Power +1", status: "applying" })]),
    );
    expect(
      match.engine
        .renderedPlayerNarrative(match.player1Id)
        .filter((line) => line === "You created Courage."),
    ).toHaveLength(2);
  });

  it("does not carry either Courage bonus into the next attack", () => {
    const match = getFabEngineScenario("courage-consumption-and-logs")?.boot();
    if (!match) throw new Error("Missing Courage consumption visual scenario.");

    const game = FabTestEngine.fromRuntime(match.runtime);
    const Olympia = game.as(olympia);
    game.closeCombat({ optionals: "decline", ordering: "listed" });
    Olympia.must.playAttack(headJabBlue);
    game.advanceUntil({ stopAt: "defend", ordering: "listed" });

    expectCombat(game).toBeAtStep("defend").toHaveAttackPower(1);
    expectFabPlayer(Olympia).toHaveTokenCount("courage", 0);
    expect(
      presentRuntime(match.runtime, match.player1Id).activeEffects.filter(
        (effect) => effect.sourceLabel === "Courage",
      ),
    ).toHaveLength(0);
  });
});
