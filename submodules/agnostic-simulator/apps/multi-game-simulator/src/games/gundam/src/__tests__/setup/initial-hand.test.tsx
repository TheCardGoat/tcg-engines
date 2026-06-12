// @vitest-environment jsdom
import { describe, expect, it } from "vite-plus/test";
import { screen, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { renderSimulator } from "../../test/renderSimulator.tsx";
import { loadSetupDefault } from "../../game/fixtures/setup-default.ts";

/**
 * RTL port of `e2e/setup/initial-hand.spec.ts`. Engine parity assertion
 * lives in `packages/engine/src/gundam/lifecycle/setup/setup-flow.test.ts`.
 */
describe("Setup · initial hand", () => {
  it("viewer's hand shows 5 cards after choosing first player", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSetupDefault);

    const chooseFirst = screen.getByRole("dialog", { name: /who goes first/i });
    await user.click(within(chooseFirst).getByRole("button", { name: /i go first/i }));

    const hand = await screen.findByRole("list", { name: /your hand/i });
    expect(within(hand).getAllByRole("listitem")).toHaveLength(5);
  });
});
