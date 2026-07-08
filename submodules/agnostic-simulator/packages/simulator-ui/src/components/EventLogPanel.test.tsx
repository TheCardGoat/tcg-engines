// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, test } from "vite-plus/test";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";

import { EventLogPanel } from "./EventLogPanel";
import classes from "./EventLogPanel.module.css";

let activeRoot: Root | null = null;
let activeContainer: HTMLDivElement | null = null;

afterEach(() => {
  if (activeRoot) {
    act(() => activeRoot?.unmount());
  }
  activeContainer?.remove();
  activeRoot = null;
  activeContainer = null;
});

function renderPanel(entries: SimulatorEventLogEntry[]): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(<EventLogPanel entries={entries} />));
  return activeContainer;
}

function entry(id: string, seatId: string, message: string): SimulatorEventLogEntry {
  return {
    id,
    turn: 1,
    phase: "Main",
    seatId,
    timestamp: "2026-07-07T00:00:00.000Z",
    message,
    tags: ["move"],
  };
}

describe("EventLogPanel", () => {
  test("keeps consecutive non-sectioned entries grouped by speaker", () => {
    renderPanel([
      entry("one", "p1", "First player action."),
      entry("two", "p1", "Second player action."),
    ]);

    const renderedEntries = document.body.querySelectorAll("button");
    const secondEntry = Array.from(renderedEntries).find((button) =>
      button.textContent?.includes("Second player action."),
    );

    expect(secondEntry).toBeDefined();
    expect(secondEntry?.classList.contains(classes.entryGrouped ?? "")).toBe(true);
  });
});
