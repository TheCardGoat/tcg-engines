// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { findCardsById } from "../../test/queries.ts";
import { loadDeployUnitDemo } from "../../game/fixtures/deploy-unit-demo.ts";

/**
 * RTL port of `e2e/main-phase/deploy-unit.spec.ts`.
 * Click a hand unit → Confirm → unit on the battle area + resource exhausts.
 *
 * Uses the purpose-built `deploy-unit-demo` fixture rather than
 * `main-phase-demo` (which is a visual playground and explicitly
 * documented as unsuitable for engine-correctness tests).
 */
describe("Main-phase · Deploy Unit", () => {
  it("clicking a hand unit deploys it and exhausts its cost", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDeployUnitDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const handItems = () => within(hand).queryAllByRole("listitem");
    expect(handItems()).toHaveLength(1);

    const rx782 = within(hand).getByRole("listitem", { name: /RX-78-2/i });
    const rx782Id = rx782.querySelector<HTMLElement>("[data-card-id]")?.dataset.cardId;
    expect(rx782Id).toBeTruthy();
    await user.click(rx782);

    await waitFor(() => {
      expect(handItems()).toHaveLength(0);
      expect(within(hand).queryByRole("listitem", { name: /RX-78-2/i })).toBeNull();
    });

    const onBattleArea = findCardsById(rx782Id!, { excludeWithin: hand });
    expect(onBattleArea.length).toBeGreaterThanOrEqual(1);

    const resources = screen.getByRole("region", { name: /your resource area/i });
    await waitFor(() => {
      expect(resources.textContent ?? "").toMatch(/02\s*\/\s*03/);
    });
  });
});
