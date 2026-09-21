// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { renderFabSimulatorScenario } from "./testing/render-fab-simulator";

// Owns the playtest regression behind "Undo/Pass is temporarily unavailable":
// the local bot loop's think-timer wait used to hold the whole practice page
// in `pending`, disabling every match control — including on the player's own
// priority — for as long as the bot seat kept legal commands. The wait is
// status-only now, so the temporary lock must never appear, no matter how many
// bot steps and turn transitions roll by. Motion is suppressed for this suite
// so animation playback cannot mask the regression.
const motionGlobal = globalThis as typeof globalThis & {
  __TCG_TEST_DISABLE_SIMULATOR_MOTION__?: boolean;
};
const originalMotionSetting = motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__;

function declineAnyOptionalPrompt(): void {
  // Arsenal-style optional prompts ("Choose none") and optional effect
  // prompts ("Decline") must be answered so the match keeps rolling.
  const declineButton = Array.from(
    document.querySelectorAll<HTMLButtonElement>("button:not([disabled])"),
  ).find((button) => /^(choose none|decline)$/i.test(button.textContent?.trim() ?? ""));
  declineButton?.click();
}

afterEach(() => {
  cleanup();
  window.sessionStorage.removeItem("fab-practice:active-match:v1");
  motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = originalMotionSetting;
});

describe("practice player controls under bot auto-run", () => {
  it("never reports controls temporarily unavailable while the bot think-timer waits", async () => {
    motionGlobal.__TCG_TEST_DISABLE_SIMULATOR_MOTION__ = true;
    const { pom } = renderFabSimulatorScenario({ scenarioId: "undo-decline-danse-macabre" });
    await screen.findByTestId("fab-practice-page", {}, { timeout: 15_000 });
    await pom.waitForReady();

    // Keep the match rolling for several turns: pass whenever the player has
    // priority and decline optional prompts, so the bot keeps stepping on its
    // own pacing. Every command the bot submits used to lock the page.
    const deadline = Date.now() + 6_000;
    let observations = 0;
    let playerPasses = 0;
    while (Date.now() < deadline) {
      if (await pom.canPass()) {
        try {
          await pom.clickPass();
          playerPasses += 1;
        } catch {
          // The control can disappear between the legality check and the
          // click as the state advances; the next cycle re-checks.
        }
      } else {
        declineAnyOptionalPrompt();
      }
      for (const node of screen.queryAllByTestId("fab-quick-pass")) {
        const reason = (node as HTMLButtonElement).getAttribute("aria-label") ?? "";
        expect(reason, "quick pass must never report the temporary control lock").not.toContain(
          "temporarily unavailable",
        );
        observations += 1;
      }
      await new Promise((resolve) => setTimeout(resolve, 120));
    }
    expect(observations).toBeGreaterThan(10);
    expect(playerPasses).toBeGreaterThan(0);
  }, 30_000);
});
