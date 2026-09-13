import { FabTestEngine, expectFabPlayer, expectCombat } from "@tcg/flesh-and-blood-engine/testing";
import { gravyBones } from "@tcg/flesh-and-blood-cards/cards/heroes/gravy-bones";
import { restlessCorporalRed } from "@tcg/flesh-and-blood-cards/cards/actions/restless-corporal";
import { scenario as forsakenScenario } from "./usurp-preview/forsaken-strike-yellow";
import { describe, expect, it } from "vitest";
import { USURP_PREVIEW_SCENARIOS } from "./usurp-preview";

describe("Usurp preview QA fixtures", () => {
  it("registers one visual fixture for every currently spoiled IAR card", () => {
    expect(USURP_PREVIEW_SCENARIOS).toHaveLength(183);
  });

  for (const scenario of USURP_PREVIEW_SCENARIOS) {
    it(`${scenario.id} opens its reproducible gameplay moment`, () => {
      const match = scenario.boot();
      expect(match.seed).toBe(scenario.id);
      expect(match.runtime).toBeDefined();
    });
  }
});

it("Forsaken Strike QA presents named reward choices and applies the selected rewards", () => {
  const game = FabTestEngine.fromRuntime(forsakenScenario.boot().runtime);
  const player = game.as(gravyBones);
  player.targetRequired(player.cardIn("arena", restlessCorporalRed));
  player.targetRequired(player.cardIn("hand", restlessCorporalRed));
  const decision = player.expectDecision("option");
  expect(decision.options.map((option) => option.label)).toEqual([
    "Create a Gate to i’Arathael token.",
    "This gets +2{p}.",
    "This gets go again.",
  ]);
  player.chooseOptions(decision.options[0]!.id);
  player.chooseOptions(player.expectDecision("option").options[1]!.id);
  game.advanceUntil({ stopAt: "defend" });
  expectFabPlayer(player).toHaveTokenCount("gate-to-i-arathael", 1);
  expectCombat(game).toHaveAttackPower(5);
});
