// @vitest-environment jsdom

import { MantineProvider } from "@mantine/core";
import { Notifications, notifications } from "@mantine/notifications";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vite-plus/test";

import { theme } from "../theme";
import {
  hidePendingMoveRecoveryNotification,
  PendingMoveRecoveryMessage,
  showPendingMoveRecoveryNotification,
} from "./pendingMoveFeedback";

afterEach(() => {
  notifications.clean();
  cleanup();
  vi.unstubAllGlobals();
});

describe("pending move recovery feedback", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn((query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        addListener: vi.fn(),
        removeListener: vi.fn(),
        dispatchEvent: vi.fn(),
      })),
    );
  });

  test("offers a working browser refresh action", () => {
    const onReload = vi.fn();
    render(
      <MantineProvider theme={theme} env="test">
        <PendingMoveRecoveryMessage onReload={onReload} />
      </MantineProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Refresh browser" }));

    expect(onReload).toHaveBeenCalledOnce();
  });

  test("keeps one persistent warning visible until synchronization recovers", async () => {
    render(
      <MantineProvider theme={theme} env="test">
        <Notifications position="top-right" />
      </MantineProvider>,
    );

    act(() => {
      showPendingMoveRecoveryNotification();
      showPendingMoveRecoveryNotification();
    });

    expect(await screen.findByText("Game synchronization delayed")).toBeTruthy();
    expect(screen.getAllByRole("button", { name: "Refresh browser" })).toHaveLength(1);

    act(() => hidePendingMoveRecoveryNotification());
    await waitFor(() => expect(screen.queryByText("Game synchronization delayed")).toBeNull());
  });
});
