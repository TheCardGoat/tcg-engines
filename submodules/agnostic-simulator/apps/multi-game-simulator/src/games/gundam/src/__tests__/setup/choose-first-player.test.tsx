// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/choose-first-player.spec.ts`. Engine parity in
 * `packages/engine/src/gundam/lifecycle/setup/setup-flow.test.ts`.
 */
describe("Setup · choose first player", () => {
  it("prompt is visible on boot and disappears after the viewer picks", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    const prompt = screen.getByRole("dialog", { name: /who goes first/i });
    const goFirst = within(prompt).getByRole("button", { name: /i go first/i });
    await user.click(goFirst);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /who goes first/i })).toBeNull();
    });
  });
});
