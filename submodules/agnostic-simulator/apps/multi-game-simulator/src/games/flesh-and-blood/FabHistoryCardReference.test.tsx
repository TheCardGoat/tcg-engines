// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { FabCardPreviewContext } from "./FabCardPreviewContext";
import { FabHistoryCardReference } from "./FabHistoryCardReference";
import { FabPresentationTestProvider } from "./presentation-test-provider";

afterEach(cleanup);

beforeEach(() => {
  window.matchMedia = () =>
    ({
      matches: true,
      media: "(any-hover: hover)",
      onchange: null,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      addListener: () => undefined,
      removeListener: () => undefined,
      dispatchEvent: () => false,
    }) satisfies MediaQueryList;
});

describe("inline FAB history card references", () => {
  it("preserves mouse and keyboard preview actions and each printed pitch variant", () => {
    const setHover = vi.fn();
    const clearHover = vi.fn();
    const pin = vi.fn();
    const hide = vi.fn();
    render(
      <FabPresentationTestProvider>
        <FabCardPreviewContext.Provider value={{ setHover, clearHover, pin, hide }}>
          {[1, 2, 3, undefined].map((pitchValue) => (
            <FabHistoryCardReference
              key={pitchValue ?? "equipment"}
              name={`Card ${pitchValue ?? "equipment"}`}
              definition={{
                name: "Card",
                cardType: pitchValue ? "Action" : "Equipment",
                pitchValue,
              }}
            />
          ))}
        </FabCardPreviewContext.Provider>
      </FabPresentationTestProvider>,
    );
    const references = screen.getAllByRole("button");
    expect(references.map((reference) => reference.getAttribute("data-fab-pitch"))).toEqual([
      "1",
      "2",
      "3",
      "none",
    ]);
    const reference = references[0]!;
    expect(reference.tabIndex).toBe(0);
    fireEvent.click(reference);
    fireEvent.keyDown(reference, { key: "Enter" });
    fireEvent.keyDown(reference, { key: " " });
    expect(pin).toHaveBeenCalledTimes(3);
    fireEvent.mouseEnter(reference);
    fireEvent.mouseLeave(reference);
    fireEvent.focus(reference);
    fireEvent.blur(reference);
    expect(setHover).toHaveBeenCalledTimes(2);
    expect(clearHover).toHaveBeenCalledTimes(2);
  });
});
