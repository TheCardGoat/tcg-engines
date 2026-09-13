// @vitest-environment jsdom
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import { loadAttackTriggerDrawDemo } from "../../game/fixtures/attack-trigger-draw-demo.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

describe("Main-phase · damaged Attack trigger", () => {
  it("draws through the visible attack interaction without offering manual activation", async () => {
    const user = userEvent.setup();
    renderSimulator(loadAttackTriggerDrawDemo);

    const hand = screen.getByRole("list", { name: /your hand/i });
    expect(within(hand).queryAllByRole("listitem")).toHaveLength(0);
    expect(screen.getByLabelText("This card has taken 1 damage.")).toBeTruthy();

    await user.click(
      screen.getByRole("button", {
        name: /Gundam Barbatos 1st Form actions; drag to attack/i,
      }),
    );
    const menu = await screen.findByTestId("card-context-menu");
    expect(within(menu).queryByText("Activate Effect", { exact: true })).toBeNull();

    fireEvent.click(within(menu).getByText("Attack a Unit", { exact: true }).closest("button")!);
    await user.click(await screen.findByRole("button", { name: "Attack Gouf" }));

    await waitFor(() => expect(within(hand).getAllByRole("listitem")).toHaveLength(1), {
      timeout: 5_000,
    });
  });
});
