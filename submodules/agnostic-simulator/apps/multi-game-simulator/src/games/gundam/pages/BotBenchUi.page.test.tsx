// @vitest-environment jsdom
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { describe, expect, it } from "vite-plus/test";
import "../src/test/renderSimulator.tsx";
import { BotBenchUiPage } from "./BotBenchUi.page.tsx";

describe("BotBenchUiPage", () => {
  it("mounts a single contextual Pass control beside the desktop hand", async () => {
    render(
      <MemoryRouter>
        <BotBenchUiPage />
      </MemoryRouter>,
    );
    const controls = await screen.findByTestId("gundam-desktop-hand-controls");
    expect(within(controls).getByTestId("primary-action")).toBeTruthy();
    expect(screen.getAllByTestId("primary-action")).toHaveLength(1);
  });
});
