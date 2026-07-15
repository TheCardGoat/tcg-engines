import { describe, test } from "vite-plus/test";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

const LEGEND_QA_SCENARIOS = [
  "legendQaPromosAndV",
  "legendQaArasakaPressure",
  "legendQaBlueSetup",
  "legendQaReactionTools",
  "legendQaGearTempo",
  "legendQaLateGameThreats",
  "legendQaVStreetkidAndPrintParity",
  "legendQaEmbracingPowerPrints",
] as const;

describe("Legend QA grouped visual fixtures", () => {
  test.each(LEGEND_QA_SCENARIOS)("%s renders a valid simulator board", async (scenarioId) => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
