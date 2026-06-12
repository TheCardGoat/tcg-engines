import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { spoilerKerryEurodyneTheLastRockerboy } from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import { expectEqual } from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("unitKerryEurodyneTheLastRockerboy fixture behavior", () => {
  test("Kerry Eurodyne - max-value gig ability draws two in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitKerryEurodyneTheLastRockerboy",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const kerry = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        spoilerKerryEurodyneTheLastRockerboy.id,
      );
      const abilityCandidates = await pom.getMoveCandidateIds(CYBERPUNK_P1, "activateAbility");
      if (!abilityCandidates.includes(`${kerry.instanceId}:0`)) {
        throw new Error("Expected Kerry's activated ability to be visible.");
      }

      const handBefore = await pom.getHandSize(CYBERPUNK_P1);
      const deckBefore = await pom.getDeckSize(CYBERPUNK_P1);

      await pom.activateAbility(kerry.instanceId, 0, CYBERPUNK_P1);

      await pom.expectFieldCardSpent(CYBERPUNK_P1, kerry.instanceId, true);
      await pom.expectHandSize(CYBERPUNK_P1, handBefore + 2);
      expectEqual("Kerry deck after draw", await pom.getDeckSize(CYBERPUNK_P1), deckBefore - 2);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
