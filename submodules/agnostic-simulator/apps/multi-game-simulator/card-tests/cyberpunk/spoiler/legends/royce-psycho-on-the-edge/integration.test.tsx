import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { spoilerRoycePsychoOnTheEdge } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("legendRoycePsychoOnTheEdge fixture behavior", () => {
  test("Royce - Psycho on the Edge - gear-scaled GO SOLO in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "legendRoycePsychoOnTheEdge" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const royce = await pom.getCardInZoneByDefinitionId(
        "legendArea",
        CYBERPUNK_P1,
        spoilerRoycePsychoOnTheEdge.id,
      );

      const legendView = await pom.getCardView(royce.instanceId, CYBERPUNK_P1);
      expectEqual("Royce legend effective power before GO SOLO", legendView.effectivePower, 13);
      expectEqual("Royce legend attached gear count", legendView.attachedGearIds.length, 2);

      await pom.goSolo(royce.instanceId, CYBERPUNK_P1);

      await pom.expectEddies(CYBERPUNK_P1, 2);
      await pom.expectFieldCardSpent(CYBERPUNK_P1, royce.instanceId, false);
      await pom.expectFieldCardAttachedGearCount(CYBERPUNK_P1, royce.instanceId, 2);
      await pom.expectFieldCardEffectivePower(CYBERPUNK_P1, royce.instanceId, 13);
      await pom.expectFieldCardGrantedRule(CYBERPUNK_P1, royce.instanceId, "goSolo", true);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
