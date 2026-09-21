// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vite-plus/test";

import {
  SimulatorActivityTabs,
  SimulatorMatchActionDock,
  SimulatorMatchSidebar,
  type SimulatorActivityTab,
} from "./SimulatorMatchSidebar";

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

describe("SimulatorMatchSidebar", () => {
  test("renders only the danger action when custom controls are explicitly absent", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchActionDock
          controls={null}
          danger={<button type="button">Concede</button>}
        />,
      ),
    );
    const dock = container.firstElementChild;
    expect(dock).toBeTruthy();
    expect(dock?.children).toHaveLength(1);
    expect(dock?.textContent).toBe("Concede");
    expect(container.querySelector('[data-action="primary"]')).toBeNull();
    expect(container.querySelector('[data-action="controls"]')).toBeNull();
  });
  test("renders game-supplied participant identity actions", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchSidebar
          opponent={{
            id: "opponent",
            role: "opponent",
            name: "Rival",
            shortLabel: "OP",
            actions: <button type="button">Open Rival actions</button>,
          }}
          activity={{ log: <div>Battle log</div> }}
          actions={{
            undo: <button type="button">Undo</button>,
            primary: <button type="button">Pass turn</button>,
            danger: <button type="button">Concede</button>,
          }}
          self={{
            id: "self",
            role: "self",
            name: "You",
            shortLabel: "YOU",
            actions: <button type="button">Open your player actions</button>,
          }}
        />,
      ),
    );

    expect(
      container.querySelector('[aria-label="Opponent match status"] button')?.textContent,
    ).toBe("Open Rival actions");
    expect(container.querySelector('[aria-label="Your match status"] button')?.textContent).toBe(
      "Open your player actions",
    );
  });

  test("renders a status-only participant without synthetic identity chrome", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchSidebar
          opponent={{
            id: "opponent",
            role: "opponent",
            layout: "stacked",
            showAvatar: false,
            status: "Waiting",
            clock: "12:00",
          }}
          activity={{ log: <div>Battle log</div> }}
          actions={{
            undo: <button type="button">Undo</button>,
            primary: <button type="button">Pass turn</button>,
            danger: <button type="button">Concede</button>,
          }}
          self={{
            id: "self",
            role: "self",
            layout: "stacked",
            showAvatar: false,
            status: "Priority",
            clock: "11:54",
          }}
        />,
      ),
    );

    const opponent = container.querySelector('[aria-label="Opponent match status"]')!;
    const self = container.querySelector('[aria-label="Your match status"]')!;
    expect(opponent.textContent).toBe("Waiting12:00");
    expect(self.textContent).toBe("Priority11:54");
    expect(container.querySelectorAll('[data-has-visible-name="false"]')).toHaveLength(2);
    expect(container.querySelectorAll('[data-has-avatar="false"]')).toHaveLength(2);
  });

  test("keeps the shared match anatomy in a stable order", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchSidebar
          opponent={{
            id: "opponent",
            role: "opponent",
            name: "Rival",
            shortLabel: "OP",
          }}
          automation={{
            summary: <span>Bot · Auto</span>,
            details: <button type="button">AI speed</button>,
          }}
          activity={{ log: <div>Battle log</div> }}
          actions={{
            undo: <button type="button">Undo</button>,
            primary: <button type="button">Pass turn</button>,
            danger: <button type="button">Concede</button>,
          }}
          self={{ id: "self", role: "self", name: "You", shortLabel: "YOU" }}
        />,
      ),
    );

    const sidebar = container.querySelector("aside")!;
    expect(Array.from(sidebar.children).map((child) => child.textContent)).toEqual([
      "OPRival",
      "Bot · Auto+",
      "LogBattle log",
      "UndoPass turnConcede",
      "YOUYou",
    ]);
    expect(sidebar.getAttribute("data-has-automation")).toBe("true");
    expect(sidebar.getAttribute("data-compact-participants")).toBe("true");
    expect(sidebar.querySelectorAll('[data-has-metrics="false"]')).toHaveLength(2);
  });

  test("opens automation details without growing the fixed summary row and restores focus", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchSidebar
          opponent={{ id: "opponent", role: "opponent", name: "Rival", shortLabel: "OP" }}
          automation={{
            summary: <span>Bot · Auto</span>,
            details: (
              <>
                <button type="button">Pause bot</button>
                <button type="button">Step bot</button>
              </>
            ),
          }}
          activity={{ log: <div>Battle log</div> }}
          actions={{
            undo: <button type="button">Undo</button>,
            primary: <button type="button">Pass turn</button>,
            danger: <button type="button">Concede</button>,
          }}
          self={{ id: "self", role: "self", name: "You", shortLabel: "YOU" }}
        />,
      ),
    );

    const trigger = container.querySelector<HTMLButtonElement>('[aria-expanded="false"]')!;
    act(() => trigger.click());
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(container.querySelector('[role="dialog"]')?.textContent).toContain("Pause bot");
    expect(document.activeElement?.textContent).toBe("Pause bot");

    const stepBot = Array.from(container.querySelectorAll("button")).find(
      (button) => button.textContent === "Step bot",
    )!;
    stepBot.focus();
    void act(() =>
      stepBot.dispatchEvent(new KeyboardEvent("keydown", { key: "Tab", bubbles: true })),
    );
    expect(document.activeElement?.textContent).toBe("Pause bot");

    void act(() => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" })));
    expect(container.querySelector('[role="dialog"]')).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  test("keeps localized and incomplete participant data accessible", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorMatchSidebar
          dir="rtl"
          opponent={{
            id: "opponent",
            role: "opponent",
            name: "プレイヤー名が非常に長いです 🦾🃏",
            shortLabel: "対",
            status: "等待中",
            clock: "١٢:٣٤",
            metrics: [{ id: "deck", label: "山札デッキ領域", value: "٥٠" }],
          }}
          activity={{ log: <div>لا توجد أحداث بعد</div> }}
          actions={{
            undo: (
              <button type="button" disabled>
                تراجع
              </button>
            ),
            primary: <button type="button">结束回合</button>,
            danger: <button type="button">降参 🏳️</button>,
          }}
          self={{ id: "self", role: "self", name: "You", shortLabel: "YOU" }}
        />,
      ),
    );

    expect(container.querySelector("aside")?.getAttribute("dir")).toBe("rtl");
    expect(container.querySelector("aside")?.getAttribute("data-compact-participants")).toBeNull();
    expect(container.textContent).toContain("プレイヤー名が非常に長いです 🦾🃏");
    expect(container.querySelector('[aria-label="Opponent resources"]')?.textContent).toContain(
      "山札デッキ領域٥٠",
    );
    expect(container.querySelector("button[disabled]")?.textContent).toBe("تراجع");
    expect(container.querySelector('[aria-label="Your match status"]')?.textContent).toBe("YOUYou");
  });

  test("uses one combined activity stream for the All tab", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorActivityTabs
          log={<div>Log content</div>}
          chat={<div>Chat content</div>}
          combined={<div>Combined chronological activity</div>}
        />,
      ),
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[0]?.textContent).toBe("All");
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Combined chronological activity");
    expect(container.textContent).not.toContain("Log content");
    expect(container.textContent).not.toContain("Chat content");
    act(() => tabs[2]?.click());
    expect(tabs[2]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Chat content");
    expect(container.textContent).not.toContain("Log content");

    tabs[2]?.focus();
    void act(() =>
      tabs[2]?.dispatchEvent(new KeyboardEvent("keydown", { key: "Home", bubbles: true })),
    );
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    expect(document.activeElement).toBe(tabs[0]);
  });

  test("keeps controlled activity selection parent-owned for clicks and keyboard navigation", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    const selections: SimulatorActivityTab[] = [];
    const renderControlledTabs = (activeTab: "log" | "chat" | "secondary") =>
      root?.render(
        <SimulatorActivityTabs
          log={<div>Log content</div>}
          chat={<div>Chat content</div>}
          secondary={<div>Settings content</div>}
          activeTab={activeTab}
          onActiveTabChange={(tab) => selections.push(tab)}
        />,
      );

    act(() => renderControlledTabs("log"));

    let tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    act(() => tabs[1]?.click());
    expect(selections).toEqual(["chat"]);
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Log content");
    expect(container.textContent).not.toContain("Chat content");

    act(() => renderControlledTabs("chat"));
    tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Chat content");

    tabs[1]?.focus();
    void act(() =>
      tabs[1]?.dispatchEvent(new KeyboardEvent("keydown", { key: "End", bubbles: true })),
    );
    expect(selections).toEqual(["chat", "secondary"]);
    expect(document.activeElement).toBe(tabs[2]);
    expect(tabs[1]?.getAttribute("aria-selected")).toBe("true");

    act(() => renderControlledTabs("secondary"));
    tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(tabs[2]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Settings content");
  });

  test("does not offer an empty All tab when only chat is provided", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorActivityTabs log={<div>Log content</div>} chat={<div>Chat content</div>} />,
      ),
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    expect(Array.from(tabs).map((tab) => tab.textContent)).toEqual(["Log", "Chat"]);
    expect(tabs[0]?.getAttribute("aria-selected")).toBe("true");
    expect(container.textContent).toContain("Log content");
    expect(container.textContent).not.toContain("Chat content");
  });

  test("keeps secondary tools inside the flexible activity region", () => {
    container = document.createElement("div");
    document.body.append(container);
    root = createRoot(container);
    act(() =>
      root?.render(
        <SimulatorActivityTabs
          log={<div>Log content</div>}
          chat={<div>Chat content</div>}
          secondary={<div>Settings content</div>}
        />,
      ),
    );

    const tabs = container.querySelectorAll<HTMLButtonElement>('[role="tab"]');
    act(() => tabs[2]?.click());
    expect(container.textContent).toContain("Settings content");
    expect(container.textContent).not.toContain("Log content");
  });
});
