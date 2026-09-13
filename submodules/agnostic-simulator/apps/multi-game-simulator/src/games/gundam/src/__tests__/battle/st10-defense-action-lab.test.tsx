// @vitest-environment jsdom
import { screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";

import { loadSt10DefenseActionLab } from "../../game/fixtures/st10-defense-action-lab.ts";
import { renderSimulator } from "../../test/renderSimulator.tsx";

describe("Battle · ST10 defense Action lab", () => {
  it("presents the authored attack and the Blocker branch in player-readable terms", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10DefenseActionLab);

    expect(screen.getByText("Attacked direct with Guncannon.", { exact: true })).toBeTruthy();
    expect(screen.getByTestId("primary-action").textContent).toContain("SKIP BLOCK");
    // Skip Block is the explicit skip control; a single click on a legal
    // Blocker activates <Blocker> without a second menu pick.
    expect(screen.getByTestId("primary-action").getAttribute("title") ?? "").toMatch(
      /Skip without blocking/i,
    );

    await user.click(
      screen.getByRole("button", {
        name: /Graze Duel Type, action available/i,
      }),
    );
    expect(screen.queryByTestId("card-context-menu")).toBeNull();

    await waitFor(() => {
      expect(
        screen.getByText("Blocked Guncannon with Graze Duel Type.", { exact: true }),
      ).toBeTruthy();
      expect(screen.getByTestId("primary-action").textContent).toContain("PASS ACTION");
    });
    expect(screen.getByRole("listitem", { name: "Diffuse Beam Cannon (cost 1)" })).toBeTruthy();
  });

  it("offers the no-block Action Step without hiding Diffuse Beam Cannon", async () => {
    const user = userEvent.setup();
    renderSimulator(loadSt10DefenseActionLab);

    await user.click(screen.getByTestId("primary-action"));

    await waitFor(() => {
      expect(screen.getByText("You did not block.", { exact: true })).toBeTruthy();
      expect(screen.getByTestId("primary-action").textContent).toContain("PASS ACTION");
    });
    expect(screen.getByRole("listitem", { name: "Diffuse Beam Cannon (cost 1)" })).toBeTruthy();
  });
});
