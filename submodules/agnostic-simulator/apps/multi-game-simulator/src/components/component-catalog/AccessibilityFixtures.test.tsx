import { act, cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vite-plus/test";
import { AccessibilityAnnouncer, CardFace, KeyboardNavigator } from "@tcg/simulator-ui";
import type { SimulatorEntity } from "@tcg/simulator-contract";

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});
test("announces supplied messages with the requested priority and repeats a new event", () => {
  vi.useFakeTimers();
  const { rerender } = render(
    <AccessibilityAnnouncer message="Card selected" announcementId={1} />,
  );
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(screen.getByRole("status").textContent).toBe("Card selected");
  rerender(
    <AccessibilityAnnouncer message="Card selected" announcementId={2} priority="assertive" />,
  );
  expect(screen.getByRole("status").textContent).toBe("");
  act(() => {
    vi.advanceTimersByTime(50);
  });
  expect(screen.getByRole("alert").textContent).toBe("Card selected");
  act(() => {
    vi.advanceTimersByTime(2000);
  });
  expect(screen.getByRole("alert").textContent).toBe("Card selected");
});
test("keyboard navigation starts from the focused card and skips visual wrappers", () => {
  const activate = vi.fn();
  render(
    <KeyboardNavigator loop onActivate={activate}>
      <button data-sim-entity-id="first">
        First<div data-sim-entity-id="visual">Card art</div>
      </button>
      <button data-sim-entity-id="second">Second</button>
    </KeyboardNavigator>,
  );
  const first = screen.getByRole("button", { name: "First Card art" });
  const second = screen.getByRole("button", { name: "Second" });
  act(() => first.focus());
  fireEvent.keyDown(first, { key: "ArrowRight" });
  expect(document.activeElement).toBe(second);
  fireEvent.keyDown(second, { key: "Enter" });
  expect(activate).toHaveBeenCalledWith("second");
  fireEvent.keyDown(second, { key: "ArrowRight" });
  expect(document.activeElement).toBe(first);
});
test("passive card artwork has no focus target and navigation names the actual focused node", () => {
  const card: SimulatorEntity = {
    id: "card",
    ownerId: "player",
    face: "public",
    kind: "card",
    title: "Card",
    subtitle: "",
    states: [],
    stats: [],
    traits: [],
  };
  render(
    <KeyboardNavigator>
      <button id="keyboard-card" data-sim-entity-id="card" aria-label="Inspect">
        <CardFace entity={card} as="div" />
      </button>
    </KeyboardNavigator>,
  );
  const artwork = screen.getByTestId("card");
  expect(artwork.hasAttribute("tabindex")).toBe(false);
  fireEvent.focus(screen.getByRole("button", { name: "Inspect" }));
  expect(screen.getByRole("application").getAttribute("aria-activedescendant")).toBe(
    "keyboard-card",
  );
});
