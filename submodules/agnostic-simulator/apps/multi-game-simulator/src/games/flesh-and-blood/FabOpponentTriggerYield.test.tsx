// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { FabOpponentTriggerYieldControl } from "./FabOpponentTriggerYield";
import { FabPriorityAutomationSettings } from "./FabPriorityAutomation";

afterEach(cleanup);

describe("FabOpponentTriggerYieldControl", () => {
  it("keeps preview and yield as sibling actions and confirms before yielding", () => {
    const onConfirm = vi.fn();
    const preview = vi.fn();
    const { container } = render(
      <div>
        <button type="button" onClick={preview}>
          Preview Fyendal&apos;s Spring Tunic
        </button>
        <FabOpponentTriggerYieldControl
          action={{
            sourceInstanceId: "tunic-1",
            cardName: "Fyendal's Spring Tunic",
            onConfirm,
          }}
        />
      </div>,
    );

    const buttons = container.querySelectorAll(":scope > div > button");
    expect(buttons).toHaveLength(2);
    fireEvent.click(
      screen.getByRole("button", {
        name: "Always yield priority to opposing triggers from Fyendal's Spring Tunic",
      }),
    );
    expect(onConfirm).not.toHaveBeenCalled();
    expect(screen.getByText(/Pass this priority window and future windows/)).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Always yield" }));
    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(preview).not.toHaveBeenCalled();
  });
});

describe("saved opponent trigger yields", () => {
  it("removes one saved card and explains when the current match cannot update yet", () => {
    const onRemove = vi.fn();
    render(
      <FabPriorityAutomationSettings
        mode="always-hold"
        onSelectMode={() => {}}
        savedOpponentTriggerYields={[
          {
            canonicalId: "RP6pJj9WtwbTT79qdHPkz",
            cardName: "Fyendal's Spring Tunic",
            currentMatchRemovalAvailable: false,
          },
        ]}
        onRemoveOpponentTriggerYield={onRemove}
      />,
    );

    expect(screen.getByText(/this match updates at your next legal priority window/i)).toBeTruthy();
    fireEvent.click(
      screen.getByRole("button", {
        name: "Remove saved trigger yield for Fyendal's Spring Tunic",
      }),
    );
    expect(onRemove).toHaveBeenCalledWith("RP6pJj9WtwbTT79qdHPkz");
  });
});
