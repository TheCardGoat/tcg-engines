// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";

import { TabletopStatementsPanel } from "./TabletopStatementsPanel";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true;

let root: Root | null = null;
let container: HTMLDivElement | null = null;

afterEach(() => {
  act(() => root?.unmount());
  container?.remove();
  root = null;
  container = null;
});

function renderPanel(readOnly = false) {
  const onAction = vi.fn();
  container = document.createElement("div");
  document.body.append(container);
  root = createRoot(container);
  act(() =>
    root?.render(
      <TabletopStatementsPanel
        viewerId="p1"
        readOnly={readOnly}
        onAction={onAction}
        state={{
          statements: [
            {
              id: "s1",
              authorId: "p1",
              text: "Attack declared",
              createdAt: 1,
              acknowledgements: [],
            },
          ],
          spotlightStatementId: "s1",
          activity: [{ id: "a1", actorId: "p2", at: 2, summary: "drew a card" }],
        }}
      />,
    ),
  );
  return onAction;
}

describe("TabletopStatementsPanel", () => {
  test("publishes, replies, acknowledges, spotlights, and withdraws through shared actions", () => {
    const onAction = renderPanel();
    const buttons = () => [...container!.querySelectorAll("button")];

    act(() =>
      buttons()
        .find((button) => button.textContent === "Reply")
        ?.click(),
    );
    expect(document.activeElement).toBe(container!.querySelector("textarea"));
    const textarea = container!.querySelector("textarea")!;
    textarea.value = "Resolved";
    act(() => {
      textarea.form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ type: "publish_statement", text: "Resolved", replyToId: "s1" }),
    );

    act(() =>
      buttons()
        .find((button) => button.textContent === "Acknowledge")
        ?.click(),
    );
    act(() =>
      buttons()
        .find((button) => button.textContent === "Clear spotlight")
        ?.click(),
    );
    act(() =>
      buttons()
        .find((button) => button.textContent === "Withdraw")
        ?.click(),
    );
    expect(onAction.mock.calls.map(([action]) => action.type)).toEqual([
      "publish_statement",
      "acknowledge_statement",
      "spotlight_statement",
      "withdraw_statement",
    ]);
    expect(container!.textContent).toContain("p2: drew a card");
  });

  test("renders replay state without mutation controls", () => {
    const onAction = renderPanel(true);
    expect(container!.querySelector("textarea")).toBeNull();
    expect(container!.querySelector("button")).toBeNull();
    expect(container!.textContent).toContain("Attack declared");
    expect(onAction).not.toHaveBeenCalled();
  });

  test("cancels reply mode before publishing a standalone statement", () => {
    const onAction = renderPanel();
    const buttonWithText = (text: string) =>
      [...container!.querySelectorAll("button")].find((button) => button.textContent === text);

    act(() => buttonWithText("Reply")?.click());
    expect(container!.querySelector("textarea")?.getAttribute("placeholder")).toBe("Write a reply");
    act(() => buttonWithText("Cancel")?.click());
    const textarea = container!.querySelector("textarea")!;
    expect(textarea.getAttribute("placeholder")).toBe("Declare intent, trigger, or resolution");
    textarea.value = "Standalone";
    act(() => {
      textarea.form?.dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    });
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ type: "publish_statement", text: "Standalone" }),
    );
    expect(onAction.mock.calls[0]?.[0]).not.toHaveProperty("replyToId");
  });
});
