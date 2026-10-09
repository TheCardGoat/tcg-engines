// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { afterEach, beforeEach, expect, test, vi } from "vite-plus/test";
import type { ReactNode } from "react";
import { BoardAlert } from "./BoardAlert";
import { RotateGuidance } from "./RotateGuidance";

const media = vi.hoisted(() => ({ matches: false }));

function stubMatchMedia(matches: boolean) {
  media.matches = matches;
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

function renderInBoard(ui: ReactNode) {
  return render(
    <MemoryRouter>
      <div data-testid="cyberpunk-board-v2" data-ui-version="v2">
        {ui}
      </div>
    </MemoryRouter>,
  );
}

beforeEach(() => {
  sessionStorage.clear();
  stubMatchMedia(false);
});

afterEach(() => {
  cleanup();
});

test("RotateGuidance stays hidden when the viewport is not portrait-coarse", () => {
  renderInBoard(<RotateGuidance />);
  expect(screen.queryByTestId("rotate-guidance")).toBeNull();
  expect(screen.queryByTestId("rotate-peek-pill")).toBeNull();
});

test("RotateGuidance shows the floating card with both actions on portrait phones", () => {
  stubMatchMedia(true);
  renderInBoard(<RotateGuidance />);
  expect(screen.getByRole("heading", { name: "Rotate your device" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Return to V1" })).toBeTruthy();
  expect(screen.getByRole("button", { name: "Peek at the board anyway" })).toBeTruthy();
});

test("peeking unhides the board, keeps a way back, and survives a remount", () => {
  stubMatchMedia(true);
  const view = renderInBoard(<RotateGuidance />);
  const boardRoot = view.container.firstElementChild as HTMLElement;

  fireEvent.click(screen.getByRole("button", { name: "Peek at the board anyway" }));
  expect(screen.queryByTestId("rotate-guidance")).toBeNull();
  expect(screen.getByTestId("rotate-peek-pill")).toBeTruthy();
  expect(boardRoot.getAttribute("data-rotate-peek")).toBe("true");
  expect(sessionStorage.getItem("tcg:cyberpunk:ui-v2-rotate-peek")).toBe("peeked");

  // Remount (orientation flip back to portrait) keeps the peek choice.
  cleanup();
  const remount = renderInBoard(<RotateGuidance />);
  expect(screen.queryByTestId("rotate-guidance")).toBeNull();
  expect(screen.getByTestId("rotate-peek-pill")).toBeTruthy();

  fireEvent.click(screen.getByTestId("rotate-peek-pill"));
  expect(screen.getByTestId("rotate-guidance")).toBeTruthy();
  expect(
    (remount.container.firstElementChild as HTMLElement).getAttribute("data-rotate-peek"),
  ).toBeNull();
  expect(sessionStorage.getItem("tcg:cyberpunk:ui-v2-rotate-peek")).toBeNull();
});

test("BoardAlert shows severity, message and action, and dismisses", () => {
  renderInBoard(
    <BoardAlert
      id="context"
      severity="error"
      role="alert"
      icon={<span>!</span>}
      message="The 3D board lost its connection."
      action={
        <button type="button" onClick={() => {}}>
          Return to V1
        </button>
      }
    />,
  );
  const alert = screen.getByTestId("board-alert-context");
  expect(alert.getAttribute("role")).toBe("alert");
  expect(alert.getAttribute("data-severity")).toBe("error");
  expect(screen.getByText("The 3D board lost its connection.")).toBeTruthy();
  expect(screen.getByRole("button", { name: "Return to V1" })).toBeTruthy();

  fireEvent.click(screen.getByRole("button", { name: "Dismiss notice" }));
  expect(screen.queryByTestId("board-alert-context")).toBeNull();
});
