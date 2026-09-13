// @vitest-environment jsdom
import { MantineProvider } from "@mantine/core";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { installBrowserShims } from "../../testing/browser-shims";
import { SimulatorSidebarTip, SimulatorSidebarTips } from "./SimulatorSidebarTips";
import { SimulatorParticipantConnectionStatus } from "./SimulatorParticipantActions";

function Tips() {
  return (
    <MantineProvider>
      <SimulatorSidebarTips>
        <SimulatorSidebarTip id="priority">
          <button>Priority settings</button>
        </SimulatorSidebarTip>
        <SimulatorSidebarTip id="support">
          <button>Your menu</button>
        </SimulatorSidebarTip>
        <SimulatorSidebarTip id="opponent">
          <button>Opponent menu</button>
        </SimulatorSidebarTip>
      </SimulatorSidebarTips>
    </MantineProvider>
  );
}

beforeEach(() => {
  installBrowserShims();
  localStorage.clear();
  // Floating UI hides detached/off-screen anchors. jsdom has no layout, so
  // supply a visible target and clipping viewport instead of disabling it.
  vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(
    new DOMRect(20, 20, 120, 32),
  );
  vi.spyOn(document.documentElement, "clientWidth", "get").mockReturnValue(1024);
  vi.spyOn(document.documentElement, "clientHeight", "get").mockReturnValue(768);
});
afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("sidebar discovery", () => {
  it("shows one tip at a time and remembers completion after remount", async () => {
    const view = render(<Tips />);
    expect(await screen.findByText("Choose when to pause")).toBeTruthy();
    expect(screen.queryByText("Keep the table welcoming")).toBeNull();
    fireEvent.click(await screen.findByRole("button", { name: "Next tip" }));
    expect(await screen.findByText("Help improve your next match")).toBeTruthy();
    fireEvent.click(await screen.findByRole("button", { name: "Next tip" }));
    expect(await screen.findByText("Keep the table welcoming")).toBeTruthy();
    fireEvent.click(await screen.findByRole("button", { name: "Got it" }));
    view.unmount();
    render(<Tips />);
    expect(screen.queryByRole("button", { name: "Next tip" })).toBeNull();
    expect(screen.getByRole("button", { name: "Priority settings" })).toBeTruthy();
  });

  it("remembers Skip tips and preserves usable controls", async () => {
    const view = render(<Tips />);
    fireEvent.click(await screen.findByRole("button", { name: "Skip tips" }));
    view.unmount();
    render(<Tips />);
    expect(screen.queryByText("Choose when to pause")).toBeNull();
    expect(screen.getByRole("button", { name: "Opponent menu" })).toBeTruthy();
  });

  it("can dismiss when local storage is unavailable", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("Blocked");
    });
    render(<Tips />);
    fireEvent.click(await screen.findByRole("button", { name: "Skip tips" }));
    await waitFor(() => expect(screen.queryByText("Choose when to pause")).toBeNull());
  });

  it.each(["connected", "disconnected", "reconnecting", "unknown"] as const)(
    "explains %s connectivity on click without relying on color",
    async (status) => {
      render(
        <MantineProvider>
          <SimulatorParticipantConnectionStatus displayName="Rival" status={status} />
        </MantineProvider>,
      );
      const trigger = screen.getByRole("button");
      fireEvent.click(trigger);
      expect(await screen.findByText(trigger.getAttribute("aria-label")!)).toBeTruthy();
    },
  );
});
