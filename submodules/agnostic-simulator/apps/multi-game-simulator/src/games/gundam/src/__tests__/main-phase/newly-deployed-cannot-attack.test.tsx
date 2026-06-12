// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsById } from "../../test/queries.ts";
import { loadNewlyDeployedCannotAttackDemo } from "../../game/fixtures/newly-deployed-cannot-attack-demo.ts";

/**
 * RTL port of `e2e/main-phase/newly-deployed-cannot-attack.spec.ts`.
 * Rule 3-2-6-3: a non-Link Unit deployed this turn cannot attack.
 * Click on the freshly-deployed unit must be a no-op — no targeting
 * overlay, no Confirm prompt.
 */
describe("Main-phase · Non-Link unit can't attack the turn it deploys", () => {
  it("deploy + click unit on board does not open the attack overlay", async () => {
    const user = userEvent.setup();
    renderSimulator(loadNewlyDeployedCannotAttackDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const rxId = hand.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(rxId).toBeTruthy();

    await user.click(screen.getByText(/Actions \/ Log/i));
    const paymentCandidate = document.querySelector<HTMLElement>(
      "[data-testid^='interaction-payment:action:deployUnit:']",
    );
    const entityCandidate = document.querySelector<HTMLElement>(
      "[data-testid^='interaction-candidate:action:deployUnit:']",
    );
    const selectable = paymentCandidate ?? entityCandidate;

    // Deploy through the shared interaction surface.
    if (selectable) await user.click(selectable);
    await user.click(screen.getByTestId("interaction-submit:action:deployUnit"));

    // Unit lands on the battle area.
    await waitFor(() => {
      expect(findCardsById(rxId!).length).toBeGreaterThanOrEqual(1);
    });
    await user.click(screen.getByText(/Actions \/ Log/i));

    // Attack targeting overlay shouldn't already be open.
    expect(screen.queryByText(/select target/i)).toBeNull();

    // Click the newly-deployed unit.
    const rxOnBoard = findCardsById(rxId!)[0]!;
    await user.click(rxOnBoard);

    // Flush microtasks and confirm the attack-targeting overlay did not
    // open and no confirm prompt appeared. `AttackTargetingOverlay` renders
    // a "SELECT TARGET" banner, which is the overlay-specific signal
    // (a plain Confirm-button check alone could miss a targeting-overlay
    // regression since the overlay isn't a confirm step).
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.queryByText(/select target/i)).toBeNull();
    expect(screen.queryByRole("button", { name: /^confirm$/i })).toBeNull();

    // Unit still on the board.
    expect(findCardsById(rxId!)).toHaveLength(1);
  });
});
