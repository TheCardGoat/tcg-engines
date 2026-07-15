// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/mulligan-opponent-first.spec.ts`. Engine rule:
 * `alterHand` rotates the active player, so when the viewer hands
 * priority to the opponent, the interactive Keep/Redraw prompt must be
 * suppressed and a waiting status must be shown instead.
 */
describe("Setup · mulligan · opponent first", () => {
  it("viewer sees a waiting state (not Keep/Redraw) when the opponent is first to mulligan", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(screen.getByRole("button", { name: /opponent goes first/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /keep or redraw/i })).toBeNull();
    });

    const waiting = await screen.findByRole("status", { name: /waiting for opponent/i });
    expect(waiting).not.toBeNull();
  });
});
