import { act, fireEvent, waitFor } from "@testing-library/react";
import { describe, expect, test } from "vite-plus/test";
import {
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailSecondhandBombus,
  welcomeToNightCityRetailTheHeist,
} from "@tcg/cyberpunk-cards";
import { CYBERPUNK_P1 } from "@cyberpunk/testing/cyberpunk-simulator-pom";
import { ensureJsdomAnimationSupport } from "@cyberpunk/testing/fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "@cyberpunk/testing/render-cyberpunk-simulator";

describe("The Heist free Gear play", () => {
  test("chooses Gear, confirms free play, chooses host, then resolves", async () => {
    ensureJsdomAnimationSupport();
    const view = renderCyberpunkSimulatorScenario({ scenarioId: "progTheHeistFreePlay" });
    try {
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);
      await pom.waitForReady();

      const theHeist = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailTheHeist.id,
      );
      const host = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailSecondhandBombus.id,
      );

      await pom.playCardFromHand(theHeist.instanceId, CYBERPUNK_P1);
      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      const gear = await pom.getCardInZoneByDefinitionId(
        "trash",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMantisBlades.id,
      );
      await pom.resolveEffectTarget([gear.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseCardToPlay");
      await waitFor(() => {
        expect(view.container.textContent).toContain("Play Mantis Blades for free?");
        expect(requiredButton(view.container, "prompt-play-selected-card").textContent).toContain(
          "Play for free",
        );
        expect(requiredButton(view.container, "prompt-target-pass").textContent).toContain(
          "Add to hand",
        );
      });

      await act(async () => {
        fireEvent.click(requiredButton(view.container, "prompt-play-selected-card"));
      });

      await pom.expectPendingChoiceType(CYBERPUNK_P1, "chooseTarget");
      await pom.resolveEffectTarget([host.instanceId], CYBERPUNK_P1);

      await pom.expectPendingChoiceType(CYBERPUNK_P1, null);
      const attachedGear = await pom.getCardInZoneByDefinitionId(
        "field",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMantisBlades.id,
      );
      expect(attachedGear.attachedToId).toBe(host.instanceId);
    } finally {
      view.unmount();
    }
  });
});

function requiredButton(container: HTMLElement, testId: string): HTMLButtonElement {
  const button = container.querySelector<HTMLButtonElement>(`[data-testid="${testId}"]`);
  if (!button) throw new Error(`Expected ${testId} button.`);
  return button;
}
