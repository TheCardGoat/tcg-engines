// @vitest-environment jsdom
import { cleanup, fireEvent, render } from "@testing-library/react";
import { afterEach, describe, expect, test, vi } from "vitest";

import { OpponentDisconnectOverlay } from "./OpponentDisconnectOverlay";

afterEach(() => {
  cleanup();
});

describe("OpponentDisconnectOverlay", () => {
  test("does not treat missing rival presence as disconnected", () => {
    const view = render(<OpponentDisconnectOverlay variant="opponent" />);

    expect(view.queryByText("Opponent disconnected")).toBeNull();
  });

  test("renders when rival presence is explicitly disconnected", () => {
    const view = render(
      <OpponentDisconnectOverlay
        variant="opponent"
        connection={{ status: "disconnected", disconnectedAt: new Date().toISOString() }}
      />,
    );

    expect(view.getByText("Opponent disconnected")).toBeTruthy();
  });

  test("does not render timeout helper while the opponent clock is still live", () => {
    const view = render(
      <OpponentDisconnectOverlay
        variant="opponent"
        connection={{ status: "connected", connected: true }}
        claimAvailable
        onClaimDrop={vi.fn()}
      />,
    );

    expect(view.queryByText("Opponent time expired")).toBeNull();
  });

  test("renders timeout helper when the opponent clock expired", () => {
    const view = render(
      <OpponentDisconnectOverlay
        variant="opponent"
        connection={{ status: "connected", connected: true }}
        claimAvailable
        timeoutExpired
        onClaimDrop={vi.fn()}
      />,
    );

    expect(view.getByText("Opponent time expired")).toBeTruthy();
    expect(view.getByText("Drop Opponent")).toBeTruthy();
  });

  test("allows the timeout helper to be minimized and expanded", () => {
    const view = render(
      <OpponentDisconnectOverlay
        variant="opponent"
        connection={{ status: "connected", connected: true }}
        claimAvailable
        timeoutExpired
        onClaimDrop={vi.fn()}
      />,
    );

    fireEvent.click(view.getByLabelText("Minimize"));
    expect(view.queryByText("Opponent time expired")).toBeNull();
    expect(view.getByText("Time expired")).toBeTruthy();
    expect(
      view
        .getByLabelText("Opponent time expired - expand options")
        .hasAttribute("data-mobile-field-overlay"),
    ).toBe(true);

    fireEvent.click(view.getByLabelText("Opponent time expired - expand options"));
    expect(view.getByText("Opponent time expired")).toBeTruthy();
  });

  test("requires confirmation before dropping a timed-out opponent", () => {
    const onClaimDrop = vi.fn();
    const view = render(
      <OpponentDisconnectOverlay
        variant="opponent"
        connection={{ status: "connected", connected: true }}
        claimAvailable
        timeoutExpired
        onClaimDrop={onClaimDrop}
      />,
    );

    fireEvent.click(view.getByText("Drop Opponent"));
    expect(onClaimDrop).not.toHaveBeenCalled();

    fireEvent.click(view.getByText("Confirm Drop"));
    expect(onClaimDrop).toHaveBeenCalledTimes(1);
  });

  test("does not treat missing self presence as a lost connection", () => {
    const view = render(<OpponentDisconnectOverlay variant="self" />);

    expect(view.queryByText("Connection lost")).toBeNull();
  });
});
