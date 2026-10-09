import { describe, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailFloorIt,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailSwordwiseHuscle,
  welcomeToNightCityRetailHanakoArasakaInAGildedCage,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { buildPlayerPrompt } from "@tcg/cyberpunk-engine";
import { expectEqual } from "@cyberpunk/testing/fixture-behaviors/cyberpunk-fixture-behavior";
import {
  expectExcludes,
  expectIncludes,
  getZoneDefinitionIds,
} from "@cyberpunk/testing/fixture-behaviors/cyberpunk-unit-fixture-helpers";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("Hanako Arasaka (Retail) jsdom happy path", () => {
  test("hanako Arasaka (Retail) - play trigger keeps top-deck cost matches", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "unitHanakoArasakaInAGildedCageRetail",
    });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();
      await pom.expectStructuralState();
      const hanako = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailHanakoArasakaInAGildedCage.id,
      );

      expectEqual("Hanako initial deck size", await pom.getDeckSize(CYBERPUNK_P1), 40);
      await pom.playCardFromHand(hanako.instanceId, CYBERPUNK_P1);

      // The keep-cost-matches reveal now pends as a scry; move the eligible
      // cost matches to hand explicitly (the rest bottom-deck as remainder).
      // Eligibility is computed on the player-safe prompt view.
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "scry");
      const matches = await pom.harness.evalEngine((engine) => {
        const prompt = buildPlayerPrompt(engine.getState(), CYBERPUNK_P1);
        const choice = prompt.choice;
        if (!choice || choice.type !== "scry") return [] as string[];
        const handDestination = choice.payload.destinations.find(
          (destination) => destination.zone === "hand",
        );
        return (handDestination?.eligibleCardIds ?? []).map((id) => String(id));
      });
      await pom.harness.dispatchEngine((engine) =>
        engine.resolveScryTo("hand", matches, { as: CYBERPUNK_P1 }),
      );

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      await pom.expectFieldSize(CYBERPUNK_P1, 2);
      await pom.expectHandSize(CYBERPUNK_P1, 2);
      await pom.expectTrashSize(CYBERPUNK_P1, 0);
      // The two cost-3 matches moved to hand; the rest of the reveal
      // bottom-decks as the scry remainder.
      expectEqual("Hanako deck after search", await pom.getDeckSize(CYBERPUNK_P1), 38);
      await pom.expectEddies(CYBERPUNK_P1, 0);

      const handDefinitions = await getZoneDefinitionIds(pom, "hand", CYBERPUNK_P1);
      expectIncludes(
        "Hanako hand definitions",
        handDefinitions,
        welcomeToNightCityRetailSwordwiseHuscle.id,
      );
      expectIncludes(
        "Hanako hand definitions",
        handDefinitions,
        welcomeToNightCityRetailMoxInciters.id,
      );
      expectExcludes(
        "Hanako hand definitions",
        handDefinitions,
        welcomeToNightCityRetailFloorIt.id,
      );
      expectExcludes(
        "Hanako hand definitions",
        handDefinitions,
        welcomeToNightCityRetailSecondhandBombus.id,
      );

      await pom.expectStructuralState();
    } finally {
      view.unmount();
    }
  });
});
