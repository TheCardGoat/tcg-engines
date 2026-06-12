import { describe, test, vi } from "vite-plus/test";

vi.mock("@cyberpunk-simulator/animation", async () => {
  const actual = await vi.importActual<typeof import("@cyberpunk-simulator/animation")>(
    "@cyberpunk-simulator/animation",
  );
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "@cyberpunk-simulator/testing/cyberpunk-simulator-pom";
import {
  expectDefined,
  expectEqual,
} from "@cyberpunk-simulator/testing/fixture-behaviors/cyberpunk-fixture-behavior";

import { ensureJsdomAnimationSupport } from "@cyberpunk-simulator/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";

import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk-simulator/testing/render-cyberpunk-simulator";

describe("progRebootOpticsEmptyField fixture behavior", () => {
  test("Reboot Optics - no friendly units in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progRebootOpticsEmptyField" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      await pom.expectFieldSize(CYBERPUNK_P1, 0);
      const program = expectDefined(
        "Reboot Optics in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      expectEqual(
        "Reboot Optics empty-field eligible count",
        (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
        0,
      );
      await pom.expectFieldSize(CYBERPUNK_P1, 0);
      await pom.expectHandSize(CYBERPUNK_P1, 0);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
