// @vitest-environment jsdom
import { afterEach, describe, expect, it } from "vite-plus/test";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { loadSetupDefaultOpponentKeeps } from "../../game/fixtures/setup-default-opponent-keeps.ts";
import { loadMainPhaseDemo } from "../../game/fixtures/main-phase-demo.ts";
import { loadDiscardLimitDemo } from "../../game/fixtures/discard-limit-demo.ts";
import { loadMultiTurnDemo } from "../../game/fixtures/multi-turn-demo.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

afterEach(() => {
  Object.defineProperty(window, "innerWidth", { configurable: true, value: 1024 });
});

describe("Mobile primary action availability", () => {
  it("waits when an attack hands priority to the opponent", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const user = userEvent.setup();
    renderSimulator(loadMainPhaseDemo);
    expect(screen.getByTestId("primary-action")).toHaveProperty("disabled", false);
    await user.click(screen.getByRole("button", { name: /Guncannon actions; drag to attack/i }));
    const menu = await screen.findByTestId("card-context-menu");
    fireEvent.click(within(menu).getByText("Attack player", { exact: true }).closest("button")!);
    await waitFor(() => {
      expect(screen.getByTestId("primary-action")).toHaveProperty("disabled", true);
      expect(screen.getByTestId("primary-action").textContent).toMatch(/waiting/i);
    });
  });

  it("waits through setup and enables passing only when the main phase begins", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const user = userEvent.setup();
    renderSimulator(loadSetupDefaultOpponentKeeps);

    expect(screen.getByTestId("primary-action")).toHaveProperty("disabled", true);
    expect(screen.getByTestId("primary-action").textContent).toMatch(/waiting/i);
    await user.click(screen.getByRole("button", { name: /i go first/i }));
    expect(screen.getByTestId("primary-action")).toHaveProperty("disabled", true);
    await user.click(await screen.findByRole("button", { name: /keep hand/i }));
    const pass = await screen.findByRole("button", { name: /^pass turn$/i });
    expect(pass).toHaveProperty("disabled", false);
  });

  it("opens a required hand-limit discard from the primary action", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const user = userEvent.setup();
    renderSimulator(loadDiscardLimitDemo);

    const discard = screen.getByRole("button", { name: "DISCARD 2" });
    expect(discard).toHaveProperty("disabled", false);
    await user.click(discard);

    const prompt = screen.getByLabelText("Current action");
    expect(prompt.textContent).toContain("Choose 2 cards to discard.");
    expect(prompt.textContent).not.toContain("SELECTED");
  });

  it("confirms before passing while another turn action is available", async () => {
    Object.defineProperty(window, "innerWidth", { configurable: true, value: 390 });
    const user = userEvent.setup();
    renderSimulator(loadMultiTurnDemo);

    await user.click(screen.getByRole("button", { name: /^pass turn$/i }));

    expect(screen.getByRole("dialog", { name: "Actions still available" })).not.toBeNull();
    expect(screen.getByRole("button", { name: /keep playing/i })).not.toBeNull();
    expect(screen.getByTestId("confirm-pass-turn")).not.toBeNull();
  });
});
