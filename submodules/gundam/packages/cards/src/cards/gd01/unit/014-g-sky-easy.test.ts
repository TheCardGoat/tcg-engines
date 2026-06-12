import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  createMockUnit,
  markAsLinkUnit,
  expectSuccess,
  expectFailure,
  getDamageCounter,
} from "@tcg/gundam-engine";
import type { PlayerId } from "@tcg/gundam-engine";
import { gd01GSkyEasy014 } from "./014-g-sky-easy.ts";

describe("G-Sky Easy (GD01-014)", () => {
  it("【During Link】【Activate·Action】recoverHP fires when linked", () => {
    const friendly = createMockUnit({ ap: 2, hp: 4, level: 2 });

    const engine = GundamTestEngine.create(
      { play: [gd01GSkyEasy014, friendly], deck: 5 },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const gSkyId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd01GSkyEasy014.cardNumber,
    )!;
    const friendlyId = engine
      .asPlayer(PLAYER_ONE)
      .getCardsInZone("battleArea")
      .find((id) => id !== gSkyId)!;

    // Seed 2 damage on the friendly so recoverHP has something to heal.
    engine.getG().damage[friendlyId] = 2;

    // Link the G-Sky Easy so the duringLink gate is satisfied.
    markAsLinkUnit(engine, gSkyId);

    // Move to action-step of end-phase so activate:action is legal.
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    expectSuccess(
      engine.asPlayer(PLAYER_ONE).activateAbility(gSkyId, 0, { targets: [friendlyId] }),
    );

    // Should have recovered 1 HP → damage goes from 2 to 1.
    expect(getDamageCounter(engine, friendlyId)).toBe(1);
  });

  it("ability does NOT fire when not linked (duringLink activation gate)", () => {
    const friendly = createMockUnit({ ap: 2, hp: 4, level: 2 });

    const engine = GundamTestEngine.create(
      { play: [gd01GSkyEasy014, friendly], deck: 5 },
      { deck: 5 },
    );
    const rt = engine.getRuntime();
    const gSkyId = rt.getInstanceIdByDefinition(
      PLAYER_ONE as PlayerId,
      gd01GSkyEasy014.cardNumber,
    )!;
    const friendlyId = engine
      .asPlayer(PLAYER_ONE)
      .getCardsInZone("battleArea")
      .find((id) => id !== gSkyId)!;

    // Seed 2 damage on the friendly so recoverHP would have something to heal.
    engine.getG().damage[friendlyId] = 2;

    // Do NOT link the G-Sky Easy — the duringLink gate should block activation.
    engine.setPhase("end-phase");
    engine.setStep("action-step");

    const result = engine
      .asPlayer(PLAYER_ONE)
      .activateAbility(gSkyId, 0, { targets: [friendlyId] });

    // Should be rejected because the unit is not linked.
    expectFailure(result);

    // Damage should remain unchanged.
    expect(getDamageCounter(engine, friendlyId)).toBe(2);
  });
});
