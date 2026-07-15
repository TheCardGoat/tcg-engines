// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefaultOpponentKeeps } from "../../game/fixtures/setup-default-opponent-keeps.ts";

/**
 * RTL port of `e2e/setup/main-phase.spec.ts`. After the viewer keeps and
 * the opponent auto-keeps, the engine lands in main-phase and the Pass
 * Turn button is live for the viewer.
 */
describe("Setup · lands in main-phase", () => {
  it("setup prompts are gone and the PASS TURN button is live for the viewer", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefaultOpponentKeeps);

    await user.click(screen.getByRole("button", { name: /i go first/i }));
    await user.click(await screen.findByRole("button", { name: /keep hand/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /who goes first/i })).toBeNull();
      expect(screen.queryByRole("dialog", { name: /keep or redraw/i })).toBeNull();
    });

    const passTurn = await screen.findByRole("button", { name: /pass turn/i });
    expect((passTurn as HTMLButtonElement).disabled).toBe(false);
  });
});
