/**
 * AAA test for trigger:equip.
 * Representative card: Seasoned Saviour (DYN026) — Guardian Off-Hand Equipment.
 * Triggered ability: when you equip Seasoned Saviour, put two −1{d} counters on it.
 * Start-of-game seating emits equip for equipment that listens for that event;
 * the resulting triggered layer is resolved via priority passes.
 */
import { describe, expect, it } from "vitest";
import { FabTestEngine, expectFabCard } from "../../../../index.ts";
import { aurumAegis, bravo, dash } from "../../../fixtures.ts";
import { seasonedSaviour } from "../../../../../../cards/src/cards/equipment/seasoned-saviour.ts";

describe("trigger: equip", () => {
  it("AAA: Seasoned Saviour receives two −1{d} counters when equipped at game start (DYN026)", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [seasonedSaviour], deck: 4 },
      { hero: dash, deck: 4 },
      // Resolve the start-of-game equip trigger by walking priority.
      { autoPassPriority: false, autoPitch: false, pitchStack: "manual" },
    );
    const Bravo = game.as(bravo);
    const id = Bravo.findCardInZone("weapon2", seasonedSaviour);

    // Act — pass priority to resolve the equip-triggered layer.
    for (let i = 0; i < 8; i += 1) {
      if (game.getState().rulesStack.length === 0 && !game.getState().decision) break;
      game.passBoth();
    }

    // Assert — equip event fired at seating; two −1 defense counters applied.
    expectFabCard(Bravo, seasonedSaviour).toBeIn("weapon2");
    expect(game.objectState(id)?.defenseCounterTotal).toBe(-2);
  });

  it("AAA boundary: non-listening Off-Hand does not gain equip counters", () => {
    const game = FabTestEngine.start(
      { hero: bravo, weapon2: [aurumAegis], deck: 4 },
      { hero: dash, deck: 4 },
    );
    const Bravo = game.as(bravo);
    const id = Bravo.findCardInZone("weapon2", aurumAegis);
    expectFabCard(Bravo, aurumAegis).toBeIn("weapon2");
    expect(game.objectState(id)?.defenseCounterTotal ?? 0).toBe(0);
  });
});
