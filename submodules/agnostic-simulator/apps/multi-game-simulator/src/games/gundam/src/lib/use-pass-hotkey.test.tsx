// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vite-plus/test";

import { usePassHotkey } from "./use-pass-hotkey.ts";

afterEach(cleanup);

function HotkeyHarness({
  enabled = true,
  onPass,
}: {
  readonly enabled?: boolean;
  readonly onPass: () => void;
}) {
  usePassHotkey(enabled, onPass);
  return (
    <div>
      <input aria-label="Chat message" />
      <button type="button">Another control</button>
      <div data-testid="board-card" tabIndex={0} onKeyDown={(event) => event.preventDefault()} />
    </div>
  );
}

describe("usePassHotkey", () => {
  it("passes once when Space is pressed from the board", () => {
    const onPass = vi.fn();
    render(<HotkeyHarness onPass={onPass} />);

    fireEvent.keyDown(window, { key: " ", code: "Space" });
    fireEvent.keyDown(window, { key: " ", code: "Space", repeat: true });
    fireEvent.keyDown(window, { key: " ", code: "Space", ctrlKey: true });

    expect(onPass).toHaveBeenCalledTimes(1);
  });

  it("does not pass while typing in chat or using another interactive control", () => {
    const onPass = vi.fn();
    render(<HotkeyHarness onPass={onPass} />);

    fireEvent.keyDown(screen.getByRole("textbox", { name: "Chat message" }), {
      key: " ",
      code: "Space",
    });
    fireEvent.keyDown(screen.getByRole("button", { name: "Another control" }), {
      key: " ",
      code: "Space",
    });
    fireEvent.keyDown(screen.getByTestId("board-card"), { key: " ", code: "Space" });

    expect(onPass).not.toHaveBeenCalled();
  });

  it("does nothing when no pass move is enabled", () => {
    const onPass = vi.fn();
    render(<HotkeyHarness enabled={false} onPass={onPass} />);

    fireEvent.keyDown(window, { key: " ", code: "Space" });

    expect(onPass).not.toHaveBeenCalled();
  });
});
