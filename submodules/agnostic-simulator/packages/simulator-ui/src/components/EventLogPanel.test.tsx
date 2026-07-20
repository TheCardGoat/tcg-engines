// @vitest-environment jsdom
import { act } from "react";
import { createRoot, hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import { afterEach, describe, expect, test, vi } from "vite-plus/test";
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

function renderPanel(entries: SimulatorEventLogEntry[], copyText?: string): HTMLDivElement {
  activeContainer = document.createElement("div");
  document.body.append(activeContainer);
  activeRoot = createRoot(activeContainer);
  act(() => activeRoot?.render(<EventLogPanel entries={entries} copyText={copyText} />));
  return activeContainer;
}

function entry(
  id: string,
  seatId: string | undefined,
  message: string,
  options: Partial<SimulatorEventLogEntry> = {},
): SimulatorEventLogEntry {
  return {
    id,
    turn: options.turn ?? 1,
    phase: options.phase ?? "Main",
    seatId,
    timestamp: "2026-07-07T00:00:00.000Z",
    message,
    tags: options.tags ?? ["move"],
    entityIds: options.entityIds,
    cardRefs: options.cardRefs,
    section: options.section,
  };
}

async function openEventLogOptions(): Promise<HTMLButtonElement> {
  const optionsButton = document.body.querySelector('[aria-label="Event log options"]');
  expect(optionsButton).toBeInstanceOf(HTMLButtonElement);
  await act(async () => {
    optionsButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
  return optionsButton as HTMLButtonElement;
}

describe("EventLogPanel", () => {
  test("hides the copy action unless debug copy text is provided", () => {
    renderPanel([entry("one", "p1", "First player action.")]);

    expect(document.body.querySelector(`.${classes.copyButton}`)).toBeNull();
  });

  test("copies caller-provided readable text", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    renderPanel([entry("one", "p1", "First player action.")], "raw move log payload");
    await openEventLogOptions();

    const copyButton = document.body.querySelector('[aria-label="Copy readable event log"]');
    expect(copyButton).toBeInstanceOf(HTMLButtonElement);

    await act(async () => {
      copyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(writeText).toHaveBeenCalledWith("raw move log payload");
  });

  test("copies caller-provided raw text separately from readable text", async () => {
    const writeText = vi.fn(async () => undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          entries={[entry("one", "p1", "First player action.")]}
          copyText="readable payload"
          rawCopyText="raw payload"
        />,
      ),
    );

    await openEventLogOptions();

    const rawCopyButton = document.body.querySelector('[aria-label="Copy raw event log"]');
    expect(rawCopyButton).toBeInstanceOf(HTMLButtonElement);

    await act(async () => {
      rawCopyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(writeText).toHaveBeenCalledWith("raw payload");
  });

  test("hydrates the debug copy action without a disabled attribute mismatch", async () => {
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const container = document.createElement("div");
    activeContainer = container;
    container.innerHTML = renderToString(
      <EventLogPanel entries={[]} copyText="empty debug payload" />,
    );
    document.body.append(container);

    await act(async () => {
      activeRoot = hydrateRoot(
        container,
        <EventLogPanel entries={[]} copyText="empty debug payload" />,
      );
      await Promise.resolve();
    });
    await openEventLogOptions();

    const hydrationErrors = errorSpy.mock.calls.filter((args) =>
      args.some(
        (arg) =>
          typeof arg === "string" &&
          (arg.includes("hydration-mismatch") ||
            arg.includes("didn't match the client properties") ||
            arg.includes("did not match")),
      ),
    );
    const copyButton = document.body.querySelector(`.${classes.copyButton}`);

    expect(copyButton).toBeInstanceOf(HTMLButtonElement);
    expect((copyButton as HTMLButtonElement | null)?.disabled).toBe(true);
    expect(hydrationErrors).toEqual([]);

    errorSpy.mockRestore();
  });

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

  test("marks the embedded presentation path and keeps controls in the options menu", async () => {
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          embedded
          entries={[entry("one", "p1", "First player action.")]}
          copyText="debug copy"
        />,
      ),
    );

    const panel = document.body.querySelector('[data-testid="event-log"]');

    expect(panel).toBeInstanceOf(HTMLElement);
    expect(panel?.classList.contains(classes.panelEmbedded ?? "")).toBe(true);
    expect(document.body.querySelector('[aria-label="Copy readable event log"]')).toBeNull();
    expect(document.body.querySelectorAll(`.${classes.filter}`)).toHaveLength(0);
    await openEventLogOptions();
    expect(document.body.querySelector('[aria-label="Copy readable event log"]')).toBeInstanceOf(
      HTMLButtonElement,
    );
    expect(document.body.querySelectorAll(`.${classes.filter}`).length).toBeGreaterThan(0);
  });

  test("renders turn timeline metadata with compact accessible markers and phase dividers", () => {
    renderPanel([
      entry("one", "p1", "Gained D8 gig (4).", { phase: "start" }),
      entry("two", undefined, "Phase changed from start to main.", {
        phase: "main",
        tags: ["system"],
      }),
      entry("three", "p2", "Played Netrunner for 2.", { turn: 2, phase: "main" }),
    ]);

    expect(document.body.textContent).toContain("Turn 1");
    expect(document.body.textContent).toContain("2 entries");
    expect(document.body.textContent).toContain("start / main");
    expect(document.body.querySelector('[aria-label="You, move"]')).toBeInstanceOf(HTMLElement);
    expect(document.body.querySelector('[aria-label="System, system"]')).toBeInstanceOf(
      HTMLElement,
    );
    expect(document.body.querySelector('[aria-label="Rival, move"]')).toBeInstanceOf(HTMLElement);
    expect(document.body.querySelectorAll(`.${classes.phaseHeader}`)).toHaveLength(3);
  });

  test("can keep only the latest turn expanded while preserving explicit turn overrides", async () => {
    const firstTurn = entry("one", "p1", "First turn action.", { turn: 1 });
    const secondTurn = entry("two", "p2", "Second turn action.", { turn: 2 });
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel entries={[firstTurn, secondTurn]} turnExpansion="latest" />,
      ),
    );

    const turnOneButton = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Turn 1"),
    );
    const turnTwoButton = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Turn 2"),
    );

    expect(turnOneButton?.getAttribute("aria-expanded")).toBe("false");
    expect(turnTwoButton?.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.textContent).not.toContain("First turn action.");
    expect(document.body.textContent).toContain("Second turn action.");

    await act(async () => {
      turnOneButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(turnOneButton?.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.textContent).toContain("First turn action.");

    const thirdTurn = entry("three", "p1", "Third turn action.", { turn: 3 });
    act(() =>
      activeRoot?.render(
        <EventLogPanel entries={[firstTurn, secondTurn, thirdTurn]} turnExpansion="latest" />,
      ),
    );

    expect(turnOneButton?.getAttribute("aria-expanded")).toBe("true");
    expect(document.body.textContent).not.toContain("Second turn action.");
    expect(document.body.textContent).toContain("Third turn action.");
  });

  test("renders phase dividers for unsectioned phase changes within one turn", () => {
    renderPanel([
      entry("one", "p1", "Readied all cards.", { phase: "start" }),
      entry("two", undefined, "Phase changed from start to main.", {
        phase: "main",
        tags: ["system"],
      }),
      entry("three", "p1", "Played a unit.", { phase: "main" }),
    ]);

    const phaseHeaders = Array.from(document.body.querySelectorAll(`.${classes.phaseHeader}`)).map(
      (header) => header.textContent,
    );

    expect(phaseHeaders).toEqual(["start", "main"]);
    expect(document.body.textContent).toContain("start / main");
  });

  test("preserves projection order when multiple outcomes share one timestamp", () => {
    const section = { id: "combat-1", label: "Combat", tone: "fight" };
    renderPanel([
      entry("z-pass", "p1", "Both players passed.", { tags: ["combat"], section }),
      entry("a-damage", "p1", "A unit took 2 damage.", { tags: ["combat"], section }),
      entry("m-resolved", "p1", "Combat resolved.", { tags: ["combat"], section }),
    ]);

    const combatGroup = document.body.querySelector('[role="group"][aria-label="Combat"]');
    const messages = Array.from(combatGroup?.querySelectorAll("p") ?? []).map(
      (message) => message.textContent,
    );

    expect(messages).toEqual(["Both players passed.", "A unit took 2 damage.", "Combat resolved."]);
  });

  test("renders chat messages inline with event log rows on the all filter", async () => {
    renderPanel([
      entry("one", "p1", "Played a unit.", {
        timestamp: "2026-07-07T00:00:01.000Z",
      }),
    ]);

    act(() => {
      activeRoot?.render(
        <EventLogPanel
          entries={[
            entry("one", "p1", "Played a unit.", {
              timestamp: "2026-07-07T00:00:01.000Z",
            }),
          ]}
          chatMessages={[
            {
              id: "chat-1",
              senderSide: "opponent",
              senderLabel: "Rival",
              text: "Good luck!",
              timestamp: "2026-07-07T00:00:02.000Z",
            },
          ]}
        />,
      );
    });

    expect(document.body.querySelector('[data-testid="event-log-chat-message"]')).toBeInstanceOf(
      HTMLElement,
    );
    expect(document.body.textContent).toContain("Rival");
    expect(document.body.textContent).toContain("Good luck!");
    expect(document.body.querySelector(`.${classes.controlsSummary}`)).toBeNull();

    await openEventLogOptions();
    expect(document.body.querySelector(`.${classes.controlsSummary}`)?.textContent).toBe(
      "1 entry, 1 message",
    );
    const chatFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Chat"),
    );
    expect(chatFilter?.textContent).toContain("1");

    const moveFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Move"),
    );
    await act(async () => {
      moveFilter?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.querySelector('[data-testid="event-log-chat-message"]')).toBeNull();
    expect(document.body.textContent).not.toContain("Good luck!");

    await act(async () => {
      chatFilter?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.querySelector('[data-testid="event-log-chat-message"]')).toBeInstanceOf(
      HTMLElement,
    );
    expect(document.body.textContent).toContain("Good luck!");
    expect(document.body.textContent).not.toContain("Played a unit.");
  });

  test("shows an explicit empty state for the chat-only filter", async () => {
    renderPanel([entry("one", "p1", "Played a unit.", { tags: ["move"] })]);

    await openEventLogOptions();

    const chatFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Chat"),
    );
    expect(chatFilter?.textContent).toContain("0");

    await act(async () => {
      chatFilter?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.textContent).toContain("No chat messages yet.");
    expect(document.body.textContent).not.toContain("Played a unit.");
  });

  test("shows filter counts and preserves the filtered empty state", async () => {
    renderPanel([
      entry("one", "p1", "Played a unit.", { tags: ["move"] }),
      entry("two", "p2", "Resolved a trigger.", { tags: ["ability"] }),
    ]);

    await openEventLogOptions();

    const abilityFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Ability"),
    );
    expect(abilityFilter?.textContent).toContain("1");

    const combatFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Combat"),
    );
    expect(combatFilter?.textContent).toContain("0");

    await act(async () => {
      combatFilter?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.textContent).toContain("No events match the current filter.");
  });

  test("renders combat sections as grouped bands with semantic entries", () => {
    renderPanel([
      entry("attack", "p1", "Runner attacked the rival.", {
        tags: ["combat"],
        section: { id: "attack", label: "Attack", tone: "attack" },
      }),
      entry("react", "p2", "Passed react step.", {
        tags: ["combat"],
        section: { id: "react", label: "React", tone: "react" },
      }),
    ]);

    const sectionGroups = document.body.querySelectorAll(`.${classes.sectionGroup}`);
    const combatMarkers = document.body.querySelectorAll('[aria-label$=", combat"]');

    expect(sectionGroups).toHaveLength(2);
    expect(sectionGroups[0]?.getAttribute("data-section-tone")).toBe("attack");
    expect(document.body.textContent).toContain("Attack");
    expect(document.body.textContent).toContain("React");
    expect(combatMarkers).toHaveLength(2);
  });
});
