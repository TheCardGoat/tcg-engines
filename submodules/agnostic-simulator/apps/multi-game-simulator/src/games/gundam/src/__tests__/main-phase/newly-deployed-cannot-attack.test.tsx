// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
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
    const rxInHand = within(hand).getByRole("listitem", { name: /RX-78-2/i });
    const rxId = rxInHand.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(rxId).toBeTruthy();

    await user.click(rxInHand);

    // Unit lands on the battle area.
    await waitFor(() => {
      expect(findCardsById(rxId!, { excludeWithin: hand }).length).toBeGreaterThanOrEqual(1);
    });

    // Attack targeting overlay shouldn't already be open.
    expect(document.querySelector("[data-testid^='attack-target-']")).toBeNull();

    // Click the newly-deployed unit.
    const rxOnBoard = findCardsById(rxId!, { excludeWithin: hand })[0]!;
    await user.click(rxOnBoard);

    // Flush microtasks and confirm the attack-targeting overlay did not
    // open. The shared TargetingOverlay renders attack-target click
    // regions rather than the old "SELECT TARGET" banner.
    await Promise.resolve();
    await Promise.resolve();
    expect(document.querySelector("[data-testid^='attack-target-']")).toBeNull();
    expect(screen.queryByRole("button", { name: /^confirm$/i })).toBeNull();

    // Unit still on the board.
    expect(findCardsById(rxId!, { excludeWithin: hand })).toHaveLength(1);
  });
});
