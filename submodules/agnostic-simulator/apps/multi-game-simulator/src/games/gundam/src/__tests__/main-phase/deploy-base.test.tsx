// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadDeployBaseDemo } from "../../game/fixtures/deploy-base-demo.ts";

/**
 * RTL port of `e2e/main-phase/deploy-base.spec.ts`.
 * Click a Base in hand → Base lands in the base section. deployBase
 * has no describeProcedure, so the simulator auto-submits on click.
 */
describe("Main-phase · Deploy Base", () => {
  it("clicking a Base in hand moves it to the base section", async () => {
    const user = userEvent.setup();
    renderSimulator(loadDeployBaseDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    const baseInHand = within(hand).getByRole("listitem", { name: /White Base/i });

    const baseSection = screen.getByRole("region", { name: /your base/i });
    expect(within(baseSection).queryAllByRole("listitem")).toHaveLength(0);

    await user.click(baseInHand);

    await waitFor(() => {
      expect(within(hand).queryByRole("listitem", { name: /White Base/i })).toBeNull();
      expect(within(baseSection).getAllByRole("listitem")).toHaveLength(1);
    });
    expect(within(baseSection).getByRole("listitem", { name: /White Base/i })).not.toBeNull();
  });
});
