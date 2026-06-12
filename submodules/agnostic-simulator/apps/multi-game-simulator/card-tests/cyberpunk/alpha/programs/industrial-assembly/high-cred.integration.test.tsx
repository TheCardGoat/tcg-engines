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

describe("progIndustrialAssemblyHighCred fixture behavior", () => {
  test("Industrial Assembly - 7+ Street Cred triggers draw in jsdom", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progIndustrialAssemblyHighCred" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();

      const targetGig = expectDefined(
        "Industrial Assembly high-credit d8",
        (await pom.getGigDice(CYBERPUNK_P1)).find((die) => die.dieType === "d8"),
      );
      expectEqual("initial high-credit Street Cred", await pom.getStreetCred(CYBERPUNK_P1), 9);
      const program = expectDefined(
        "Industrial Assembly in hand",
        (await pom.getCardsInZone("hand", CYBERPUNK_P1))[0],
      );

      await pom.playCardFromHand(program.instanceId, CYBERPUNK_P1);
      expectEqual(
        "Industrial Assembly high-credit eligible count",
        (await pom.getEligibleTargetIds(CYBERPUNK_P1)).length,
        3,
      );

      await pom.resolveEffectTarget([targetGig.id], CYBERPUNK_P1);

      await pom.expectGigValue(targetGig.id, 5);
      expectEqual(
        "Street Cred after high-credit assembly",
        await pom.getStreetCred(CYBERPUNK_P1),
        13,
      );
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectTrashSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 1);

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
