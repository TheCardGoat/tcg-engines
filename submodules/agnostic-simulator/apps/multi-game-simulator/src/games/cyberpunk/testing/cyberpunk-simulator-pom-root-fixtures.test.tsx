import { describe, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { ROOT_FIXTURE_SCENARIO_CASES } from "./root-fixture-scenarios";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "./render-cyberpunk-simulator";

describe("Cyberpunk root fixture POM smoke", () => {
  test.each(ROOT_FIXTURE_SCENARIO_CASES)(
    "$name exposes structural state through jsdom",
    async ({ id }) => {
      const view = renderCyberpunkSimulatorScenario({ scenarioId: id });
      try {
        const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

        await pom.waitForReady();
        await pom.expectStructuralState();
      } finally {
        view.unmount();
      }
    },
  );
});
