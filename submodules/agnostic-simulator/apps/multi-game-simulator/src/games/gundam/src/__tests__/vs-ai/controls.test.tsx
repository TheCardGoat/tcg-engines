// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

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
 * expandable match panel, so tests open the panel first.
 */
describe("vs-AI · control panel", () => {
  it("is absent on fixtures without a bot", async () => {
    const user = userEvent.setup();
    renderSimulator(loadMainPhaseDemo);
    await user.click(screen.getByRole("button", { name: /open match panel/i }));
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
    await user.click(screen.getByRole("button", { name: /open match panel/i }));
    // `getByRole` already throws if the region isn't found — no extra
    // null assertion needed.
    screen.getByRole("region", { name: /ai opponent controls/i });
  });
});
