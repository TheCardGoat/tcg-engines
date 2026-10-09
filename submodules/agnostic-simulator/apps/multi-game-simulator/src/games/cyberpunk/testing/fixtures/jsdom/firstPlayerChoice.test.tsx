import { within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { PlayerId } from "@tcg/cyberpunk-engine";
import { describe, expect, test, vi } from "vite-plus/test";

vi.mock("../../../animation", async () => {
  const actual = await vi.importActual<typeof import("../../../animation")>("../../../animation");
  return { ...actual, SoundPlayer: () => null };
});

import { ensureJsdomAnimationSupport } from "../../fixture-behaviors/run-cyberpunk-fixture-behavior-jsdom";
import {
  createTestingLibraryCyberpunkSimulatorPom,
  renderCyberpunkSimulatorScenario,
} from "../../render-cyberpunk-simulator";

describe("first-player choice", () => {
  for (const goFirst of [true, false]) {
    test(`shows no modal and resolves Go ${goFirst ? "first" : "second"} from the board prompt`, async () => {
      ensureJsdomAnimationSupport();
      const user = userEvent.setup();
      const view = renderCyberpunkSimulatorScenario({ scenarioId: "firstPlayerChoice" });
      const pom = createTestingLibraryCyberpunkSimulatorPom(view.container);

      try {
        await pom.waitForReady();
        const banner = view.container.querySelector<HTMLElement>(
          '[data-testid="prompt-banner"][data-state="choose-first-player"]',
        );
        expect(banner).not.toBeNull();
        expect(document.body.querySelector('[data-testid="choice-modal-sheet"]')).toBeNull();

        await user.click(
          within(banner!).getByRole("button", { name: goFirst ? "Go first" : "Go second" }),
        );

        await pom.expectLastDispatch({ type: "resolveFirstPlayer", as: "p1" as PlayerId, goFirst });
        expect(
          view.container.querySelector(
            '[data-testid="prompt-banner"][data-state="choose-first-player"]',
          ),
        ).toBeNull();
      } finally {
        view.unmount();
      }
    });
  }
});
