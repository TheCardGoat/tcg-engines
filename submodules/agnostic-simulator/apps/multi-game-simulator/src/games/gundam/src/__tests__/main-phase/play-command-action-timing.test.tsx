// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadActionOnlyCommandDemo } from "../../game/fixtures/action-only-command-demo.ts";

/**
 * RTL port of `e2e/main-phase/play-command-action-timing.spec.ts`.
 * Rule 3-4-5: an 【Action】-only command in main-phase isn't in
 * `playCommand.selectableCardIds`, so clicking the hand card is a
 * no-op — no confirm prompt opens, card stays in hand.
 */
describe("Main-phase · Action-only command · timing gate", () => {
  it("clicking an action-only command in main-phase is a no-op", async () => {
    const user = userEvent.setup();
    renderSimulator(loadActionOnlyCommandDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const tactical = within(hand).getByRole("listitem", { name: /Tactical Draw/i });

    // No confirm prompt at boot. `{ hidden: true }` so a present-but-
    // hidden (e.g. aria-hidden) prompt would still be detected.
    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();

    await user.click(tactical);

    // Flush microtasks to rule out an async prompt opening.
    await Promise.resolve();
    await Promise.resolve();

    expect(screen.queryByRole("button", { name: /^confirm$/i, hidden: true })).toBeNull();
    expect(within(hand).getByRole("listitem", { name: /Tactical Draw/i })).toBeDefined();
    expect(within(hand).getAllByRole("listitem")).toHaveLength(1);
  });
});
