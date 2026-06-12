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

    await user.click(within(hand).getByRole("listitem", { name: /Unit 01/i }));
    await user.click(within(hand).getByRole("listitem", { name: /Unit 02/i }));

    await waitFor(() => {
      expect(within(hand).queryAllByRole("listitem")).toHaveLength(10);
    });
    expect(within(hand).queryByRole("listitem", { name: /Unit 01/i })).toBeNull();
    expect(within(hand).queryByRole("listitem", { name: /Unit 02/i })).toBeNull();
  });

  it("cancelling the discard prompt leaves the hand at 12", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDiscardLimitDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(12);

    await user.click(within(hand).getByRole("listitem", { name: /Unit 01/i }));
    await user.click(await screen.findByRole("button", { name: /^cancel$/i }));

    // Hand unchanged.
    expect(within(hand).getAllByRole("listitem")).toHaveLength(12);
  });
});
