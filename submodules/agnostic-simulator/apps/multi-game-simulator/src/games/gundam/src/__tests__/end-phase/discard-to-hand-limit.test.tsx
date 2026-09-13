// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadDiscardLimitDemo } from "../../game/fixtures/discard-limit-demo.ts";

/**
 * RTL port of `e2e/end-phase/discard-to-hand-limit.spec.ts`. Rule 7-6-5-1:
 * at end-phase/hand-step, if the hand exceeds 10 cards, the viewer must
 * discard `handSize - 10` cards.
 */
describe("End-phase · Discard to hand limit", () => {
  it("selecting 2 hand cards trims the hand from 12 to 10", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDiscardLimitDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(12);

    await user.click(within(hand).getByRole("listitem", { name: /^GM /i }));
    expect(screen.getByText("Choose 2 cards to discard.")).toBeTruthy();
    expect(screen.getByRole("button", { name: /^confirm$/i }).hasAttribute("disabled")).toBe(true);
    expect(screen.queryByText(/ACTION REJECTED/)).toBeNull();
    expect(screen.queryByText(/player_one_ST/)).toBeNull();
    await user.click(within(hand).getByRole("listitem", { name: /Demi Trainer/i }));
    await user.click(screen.getByRole("button", { name: /^confirm$/i }));

    await waitFor(() => {
      expect(within(hand).queryAllByRole("listitem")).toHaveLength(10);
    });
    expect(within(hand).queryByRole("listitem", { name: /^GM /i })).toBeNull();
    expect(within(hand).queryByRole("listitem", { name: /Demi Trainer/i })).toBeNull();
  });

  it("cancelling the discard prompt leaves the hand at 12", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDiscardLimitDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(12);

    await user.click(within(hand).getByRole("listitem", { name: /^GM /i }));
    await user.click(await screen.findByRole("button", { name: /^cancel$/i }));

    // Hand unchanged.
    expect(within(hand).getAllByRole("listitem")).toHaveLength(12);
  });
});
