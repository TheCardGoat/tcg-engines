// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadMultiTurnDemo } from "../../game/fixtures/multi-turn-demo.ts";

/**
 * RTL port of `e2e/turn-cycle/multi-turn-exhaust-ready.spec.ts`.
 * Full round-trip: viewer deploys, passes turn, opponent bot auto-
 * ends its turn, viewer lands in turn 2 with resources readied +1
 * and a freshly drawn card.
 *
 * The bots in `multi-turn-demo` run on `setTimeout`, so the test
 * relies on real timers + generous `waitFor` timeouts rather than
 * fake-timer orchestration (which deadlocks against the engine
 * adapter's `queueMicrotask` subscriber loop — see
 * `submit-error-toast.test.tsx`).
 */
describe("Turn-cycle · Multi-turn exhaust → ready", () => {
  it("deploy → pass turn → opponent auto-ends → viewer turn 2 shows fresh resource + drawn card", async () => {
    const user = userEvent.setup();
    renderSimulator(loadMultiTurnDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(1);

    const resources = screen.getByRole("region", { name: /your resource area/i });
    const resourceCards = () => within(resources).queryAllByRole("listitem");
    const readyResources = () =>
      resourceCards().filter((card) => card.getAttribute("data-card-states")?.includes("ready"));
    const restedResources = () =>
      resourceCards().filter((card) => card.getAttribute("data-card-states")?.includes("rested"));
    expect(resourceCards()).toHaveLength(3);
    expect(readyResources()).toHaveLength(3);

    // Deploy the cost-1 RX-78-2 (hand 1 → 0, resources 03/03 → 02/03).
    // deployUnit auto-submits on click — no confirm step.
    await user.click(within(hand).getByRole("listitem", { name: /RX-78-2/i }));

    await waitFor(() => {
      expect(resourceCards()).toHaveLength(3);
      expect(readyResources()).toHaveLength(2);
      expect(restedResources()).toHaveLength(1);
      expect(within(hand).queryAllByRole("listitem")).toHaveLength(0);
    });

    // End viewer turn 1. The opponent bot auto-pass-turns through its
    // own turn, and control returns to the viewer. Query by the stable
    // primary-action testid — the unified PriorityActionButton's
    // accessible name is phase-dependent.
    const primary = screen.getByTestId("primary-action") as HTMLButtonElement;
    await user.click(primary);

    // Control returned to the viewer — the primary action button goes
    // disabled while the opponent is active and re-enables only when
    // `activePlayer` flips back. Assert this explicitly so a "bot
    // never ended its turn" regression fails here rather than via a
    // silent resource/hand mismatch downstream.
    await waitFor(
      () => {
        expect((screen.getByTestId("primary-action") as HTMLButtonElement).disabled).toBe(false);
      },
      { timeout: 15_000 },
    );

    // Turn 2: draw-phase adds +1 card, resource-phase adds +1 resource
    // on top of the 3 carried over, and active-step readies them all
    // → 04/04.
    await waitFor(
      () => {
        expect(resourceCards()).toHaveLength(4);
        expect(readyResources()).toHaveLength(4);
        expect(within(hand).getAllByRole("listitem")).toHaveLength(1);
      },
      { timeout: 15_000 },
    );
  }, 20_000);
});
