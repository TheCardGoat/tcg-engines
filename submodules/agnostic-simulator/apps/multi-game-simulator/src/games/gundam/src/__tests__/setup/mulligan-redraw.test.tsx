// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/mulligan-redraw.spec.ts`. Asserts that the set of
 * rendered card ids changes after Redraw — otherwise a `wantsRedraw:false`
 * regression would pass with just a count check.
 */
describe("Setup · mulligan · redraw", () => {
  it("viewer redraws their starting hand and the mulligan prompt closes", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    await user.click(screen.getByRole("button", { name: /i go first/i }));

    const mulligan = await screen.findByRole("dialog", { name: /keep or redraw/i });

    const hand = screen.getByRole("list", { name: /your hand/i });
    const snapshot = () =>
      [...hand.querySelectorAll<HTMLElement>('[role="listitem"][data-card-id]')]
        .map((el) => el.dataset.cardId ?? "")
        .filter(Boolean);

    const beforeIds = snapshot();
    expect(beforeIds).toHaveLength(5);

    await user.click(within(mulligan).getByRole("button", { name: /redraw hand/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: /keep or redraw/i })).toBeNull();
    });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(5);

    const afterIds = snapshot();
    expect(afterIds).toHaveLength(5);
    expect(new Set(afterIds)).not.toEqual(new Set(beforeIds));
  });
});
