// @vitest-environment jsdom

import {
  cleanup,
  fireEvent,
  render as renderTestingLibrary,
  screen,
  waitFor,
} from "@testing-library/react";
import { HeadlessMantineProvider } from "@mantine/core";
import type { PropsWithChildren, ReactNode } from "react";
import { MemoryRouter } from "react-router";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import InteractionPromptFixturesPage from "./InteractionPromptFixturesPage";

function MantineTestWrapper({ children }: PropsWithChildren) {
  return <HeadlessMantineProvider>{children}</HeadlessMantineProvider>;
}

function render(element: ReactNode) {
  return renderTestingLibrary(element, { wrapper: MantineTestWrapper });
}

vi.stubGlobal(
  "ResizeObserver",
  class {
    observe() {}
    unobserve() {}
    disconnect() {}
  },
);

afterEach(cleanup);

describe("InteractionPromptFixturesPage", () => {
  test("renders the requested prompt family and lets its drawer state be exercised", async () => {
    render(
      <MemoryRouter
        initialEntries={["/simulator-ui-fixtures/interaction-prompt?state=drawer-target"]}
      >
        <InteractionPromptFixturesPage />
      </MemoryRouter>,
    );

    await waitFor(() =>
      expect(screen.getByRole("main").getAttribute("data-fixture-state")).toBe("drawer-target"),
    );
    expect(screen.getByRole("heading", { name: "Drawer target" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Choose card" }));
    expect(screen.getByRole("dialog", { name: "Available choices" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Fyendal's Spring Tunic" })).toBeTruthy();
  });

  test("renders every prompt family in the vertical comparison view", () => {
    render(
      <MemoryRouter initialEntries={["/simulator-ui-fixtures/interaction-prompt?state=all"]}>
        <InteractionPromptFixturesPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("main").getAttribute("data-fixture-state")).toBe("all");
    expect(screen.getByRole("region", { name: "All interactive prompt fixtures" })).toBeTruthy();
    expect(screen.getAllByRole("heading", { name: "Drawer target" })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { name: "Direct ordering" })).toHaveLength(1);
    expect(screen.getAllByTestId("interaction-resolution-prompt")).toHaveLength(14);
  });

  test("renders a selected target state with reversible selection controls", () => {
    render(
      <MemoryRouter
        initialEntries={["/simulator-ui-fixtures/interaction-prompt?state=selected-target"]}
      >
        <InteractionPromptFixturesPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText("Current selections")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Remove Fyendal's Spring Tunic" })).toBeTruthy();
    expect(
      screen.getByRole("status", { name: "Selection progress — 1 of 2 selected." }),
    ).toBeTruthy();
  });

  test("lets players inspect the authored source card from the prompt title", () => {
    render(
      <MemoryRouter
        initialEntries={["/simulator-ui-fixtures/interaction-prompt?state=source-inspection"]}
      >
        <InteractionPromptFixturesPage />
      </MemoryRouter>,
    );

    const inspectionTrigger = screen.getByRole("button", {
      name: "Inspect Fyendal's Spring Tunic",
    });
    fireEvent.click(inspectionTrigger);
    expect(
      screen.getByRole("complementary", { name: "Fyendal's Spring Tunic card preview" }),
    ).toBeTruthy();
    expect(screen.getByText("Generic Equipment - Chest")).toBeTruthy();
    const closeButton = screen.getByRole("button", { name: "Close card preview" });
    expect(document.activeElement).toBe(closeButton);

    fireEvent.keyDown(closeButton, { key: "Escape" });
    expect(screen.queryByRole("complementary")).toBeNull();
    expect(document.activeElement).toBe(inspectionTrigger);
  });

  test("renders the authored card details expanded in its dedicated fixture", () => {
    render(
      <MemoryRouter
        initialEntries={["/simulator-ui-fixtures/interaction-prompt?state=expanded-details"]}
      >
        <InteractionPromptFixturesPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Prompt controls" }));
    expect(screen.getByRole("button", { name: /Hide details/ })).toBeTruthy();
    expect(screen.getByText(/At the start of your turn/)).toBeTruthy();
    expect(screen.getByText(/Remove 3 energy counters from this/)).toBeTruthy();
    expect(screen.getByText(/Blade Break/)).toBeTruthy();
  });
});
