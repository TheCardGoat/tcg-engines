// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/mulligan-keep.spec.ts`. Viewer keeps their 5-card
 * starting hand; the mulligan prompt closes for them (engine is now
 * waiting on the opponent).
 */
describe("Setup · mulligan · keep", () => {
  it("viewer keeps their starting hand and the mulligan prompt closes", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(screen.getByRole("button", { name: /i go first/i }));

    const mulligan = await screen.findByRole("dialog", { name: /keep or redraw/i });
    const keep = within(mulligan).getByRole("button", { name: /keep hand/i });
    await user.click(keep);

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /keep or redraw/i })).toBeNull();
    });

    const hand = await screen.findByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(5);
  });
});
