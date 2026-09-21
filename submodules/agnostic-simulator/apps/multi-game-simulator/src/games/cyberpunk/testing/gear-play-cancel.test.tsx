import { fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { welcomeToNightCityRetailMantisBlades } from "@tcg/cyberpunk-cards";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../animation", async () => {
  const actual = await vi.importActual<typeof import("../animation")>("../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { ensureJsdomAnimationSupport } from "./fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "./render-cyberpunk-simulator";
import { CYBERPUNK_P1 } from "./cyberpunk-simulator-pom";

describe("cancelling a Gear play", () => {
  test("returns to the action state without moving the card or spending Eddies", async () => {
    ensureJsdomAnimationSupport();
    const user = userEvent.setup();
    const view = renderCyberpunkSimulatorScenario({
      scenarioId: "gearAttachToGoSoloLegend",
    });
    const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

    try {
      await pom.waitForReady();
      const gear = await pom.getCardInZoneByDefinitionId(
        "hand",
        CYBERPUNK_P1,
        welcomeToNightCityRetailMantisBlades.id,
      );

      const handCard = view.container.querySelector(
        `[data-testid="hand-zone"][data-side="player"] [data-card-id="${gear.instanceId}"]`,
      );
      expect(handCard).not.toBeNull();
      fireEvent.click(handCard!);

      const playAction = document.body.querySelector(
        `[data-testid="card-context-menu"] [data-action-id="playCard:${gear.instanceId}"]`,
      );
      expect(playAction).not.toBeNull();
      fireEvent.click(playAction!);

      const cancel = await waitFor(() => {
        const button = view.container.querySelector<HTMLButtonElement>(
          '[data-testid="prompt-cancel-selection"]',
        );
        expect(button).not.toBeNull();
        return button!;
      });
      expect(window.getComputedStyle(cancel).pointerEvents).toBe("auto");

      await user.click(cancel);

      await waitFor(() => {
        expect(
          view.container.querySelector('[data-testid="prompt-cancel-selection"]'),
        ).toBeNull();
        expect(view.container.querySelector('[data-testid="resolving-program"]')).toBeNull();
      });
      await pom.expectHandSize(CYBERPUNK_P1, 1);
      await pom.expectEddies(CYBERPUNK_P1, 3);
    } finally {
      view.unmount();
    }
  });
});
