import { describe, test, vi } from "vite-plus/test";
import {
  boxToppersRetailCards,
  theHeistRetailStarterDeckCards,
  welcomeToNightCityRetailCards,
} from "@tcg/cyberpunk-cards";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { CYBERPUNK_P1 } from "../../cyberpunk-simulator-pom";
import { expectEqual } from "../../fixture-behaviors/cyberpunk-fixture-behavior";
import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

const retailCards = [
  ...boxToppersRetailCards,
  ...theHeistRetailStarterDeckCards,
  ...welcomeToNightCityRetailCards,
];
const mountedRetailCards = [
  ...retailCards.filter((card) => card.type !== "legend"),
  ...retailCards.filter((card) => card.type === "legend").slice(0, 3),
];

describe("retailCardCatalog fixture", () => {
  test("hydrates every official retail card in the simulator", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "retailCardCatalog" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

      expectEqual("official retail card count", retailCards.length, 34);
      await pom.expectTrashSize(
        CYBERPUNK_P1,
        retailCards.filter((card) => card.type !== "legend").length,
      );

      for (const card of mountedRetailCards) {
        await pom.getCardInZoneByDefinitionId(
          card.type === "legend" ? "legendArea" : "trash",
          CYBERPUNK_P1,
          card.id,
        );
      }
    } finally {
      view.unmount();
    }
  });
});
