// @vitest-environment jsdom
import { describe, expect, it, vi } from "vite-plus/test";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID } from "@tcg/gundam-engine";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadVsAiDemo } from "../../game/fixtures/vs-ai-demo.ts";
import { loadMainPhaseDemo } from "../../game/fixtures/main-phase-demo.ts";

/**
 * RTL port of `e2e/vs-ai/controls.spec.ts` — the "renders on vs-ai
 * fixtures, absent on non-AI fixtures" case. The pause-mode flow
 * depends on bot timer scheduling and is a separate (flakier)
 * scenario, deferred to its own port.
 *
 * The control panel mounts only when `DevRuntime.bot` is set — see
 * the `VsAiProvider` gate in `SimulatorApp.tsx`. It lives inside the
 * desktop match panel, which is visible by default.
 */
describe("vs-AI · control panel", () => {
  it("is absent on fixtures without a bot", async () => {
    renderSimulator(loadMainPhaseDemo);
    // `{ hidden: true }` catches a "present but hidden" regression
    // too — `queryByRole` with the default accessibility filter would
    // miss a panel that's rendered but, say, `aria-hidden`.
    expect(
      screen.queryByRole("region", {
        name: /ai opponent controls/i,
        hidden: true,
      }),
    ).toBeNull();
  });

  it("renders on vs-ai-demo", async () => {
    const user = userEvent.setup();
    renderSimulator(loadVsAiDemo);
    await user.click(screen.getByRole("button", { name: "Bot controls" }));
    screen.getByRole("region", { name: /ai opponent controls/i });
  });

  it("starts with the promoted strategy and lets visual testers change it", async () => {
    const user = userEvent.setup();
    renderSimulator(loadVsAiDemo);
    await user.click(screen.getByRole("button", { name: "Bot controls" }));

    const strategy = screen.getByRole("combobox", {
      name: "AI strategy",
    }) as HTMLSelectElement;
    expect(strategy.options.length).toBeGreaterThan(1);
    expect(strategy.value).toBe(DEFAULT_GUNDAM_AUTOMATED_ACTION_STRATEGY_ID);

    await user.selectOptions(strategy, "tempo");
    expect(strategy.value).toBe("tempo");
    expect(screen.getByText(/Bot · tempo/i)).toBeTruthy();
  });

  it("exposes Lorcana-style animation speed in match tools", async () => {
    const user = userEvent.setup();
    renderSimulator(loadVsAiDemo);
    await user.click(screen.getByRole("tab", { name: "More" }));

    const animationSpeed = screen.getByLabelText("Animation speed") as HTMLSelectElement;
    expect(animationSpeed.value).toBe("normal");
    await user.selectOptions(animationSpeed, "slow");
    expect(animationSpeed.value).toBe("slow");
  });

  it("offers local diagnostic tools and forwards a restart request", async () => {
    const user = userEvent.setup();
    const onRestartScenario = vi.fn();
    renderSimulator(loadVsAiDemo, { onRestartScenario });
    await user.click(screen.getByRole("button", { name: "Bot controls" }));
    await user.click(screen.getByText("Tools"));

    expect(screen.getByTestId("ai-log-snapshot")).toBeTruthy();
    expect((screen.getByTestId("ai-log-clear") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId("ai-reset-scenario") as HTMLButtonElement).disabled).toBe(false);

    await user.click(screen.getByTestId("ai-reset-scenario"));
    expect(onRestartScenario).toHaveBeenCalledOnce();
  });
});
