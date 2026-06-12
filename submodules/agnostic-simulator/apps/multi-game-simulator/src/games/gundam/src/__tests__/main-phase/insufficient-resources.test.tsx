// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadInsufficientResourcesDemo } from "../../game/fixtures/insufficient-resources-demo.ts";

/**
 * RTL port of `e2e/main-phase/insufficient-resources.spec.ts`.
 * A cost-3 / level-3 hand card with only two ready resources must not
 * open the confirm prompt, stays in hand, and doesn't land on the board.
 */
describe("Main-phase · Deploy blocked · insufficient resources", () => {
  it("a cost-3 unit with only 2 ready resources cannot be started from hand", async () => {
    const user = userEvent.setup();
    renderSimulator(loadInsufficientResourcesDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const gp01 = within(hand).getByRole("listitem", { name: /Gundam GP01/i });

    expect(within(hand).getAllByRole("listitem")).toHaveLength(1);

    // No confirm prompt at boot.
    expect(screen.queryByRole("button", { name: /^confirm$/i })).toBeNull();

    // Click is a no-op — enumerateCandidates rejected the card.
    await user.click(gp01);

    // Microtask tick to rule out an async prompt opening.
    await Promise.resolve();
    await Promise.resolve();
    expect(screen.queryByRole("button", { name: /^confirm$/i })).toBeNull();

    // Hand still holds the card; its instance hasn't moved out of the hand.
    const gp01Item = within(hand).queryByRole("listitem", { name: /Gundam GP01/i });
    expect(gp01Item).not.toBeNull();
    const gp01Id = gp01Item?.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(gp01Id).toBeTruthy();

    // `data-card-id` also appears on the CardHoverPreview (aria-hidden)
    // and Comms-log CardLinks (role="log") — filter those along with the
    // hand, then assert the card never made it to the battle area.
    const onBattleArea = [
      ...document.querySelectorAll<HTMLElement>(`[data-card-id="${gp01Id}"]`),
    ].filter((el) => {
      if (hand.contains(el)) return false;
      if (el.closest("[aria-hidden='true']")) return false;
      if (el.closest("[role='log']")) return false;
      if (el.tagName === "BUTTON") return false;
      return true;
    });
    expect(onBattleArea).toHaveLength(0);
  });
});
