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
    importance: options.importance,
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
    const writeText = vi.fn(async (_text: string) => undefined);
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

  test("copies the built-in readable log without projected JSON", async () => {
    const writeText = vi.fn(async (_text: string) => undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel entries={[entry("one", "p1", "First player action.")]} readableCopy />,
      ),
    );
    await openEventLogOptions();

    const copyButton = document.body.querySelector('[aria-label="Copy readable event log"]');
    await act(async () => {
      copyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(writeText).toHaveBeenCalledWith(
      "# Event log\nTurn 1 2026-07-07T00:00:00.000Z P1 Main [move]: First player action.",
    );
    expect(String(writeText.mock.calls[0]?.[0])).not.toContain("Projected entries");
  });

  test("keeps event-log options reachable when the title is hidden", async () => {
    const writeText = vi.fn(async (_text: string) => undefined);
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
          embedded
          showHeader={false}
          entries={[entry("one", "p1", "First player action.")]}
          copyText="readable payload"
        />,
      ),
    );

    await openEventLogOptions();
    const copyButton = document.body.querySelector('[aria-label="Copy readable event log"]');
    expect(copyButton).toBeInstanceOf(HTMLButtonElement);
    await act(async () => {
      copyButton?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(writeText).toHaveBeenCalledWith("readable payload");
  });

  test("places event-log options in a shell-owned header when provided", () => {
    const controlsContainer = document.createElement("div");
    controlsContainer.setAttribute("data-testid", "shell-controls");
    document.body.append(controlsContainer);
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);

    act(() =>
      activeRoot?.render(
        <EventLogPanel
          embedded
          showHeader={false}
          controlsContainer={controlsContainer}
          entries={[entry("one", "p1", "First player action.")]}
        />,
      ),
    );

    expect(controlsContainer.querySelector('[aria-label="Event log options"]')).toBeInstanceOf(
      HTMLButtonElement,
    );
    controlsContainer.remove();
  });

  test("copies caller-provided raw text separately from readable text", async () => {
    const writeText = vi.fn(async (_text: string) => undefined);
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

    const renderedEntries = document.body.querySelectorAll(`.${classes.entry}`);
    const secondEntry = Array.from(renderedEntries).find((row) =>
      row.textContent?.includes("Second player action."),
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

  test("omits phase metadata when the projection has no meaningful phase", () => {
    renderPanel([entry("one", "p1", "You played a card.", { phase: "" })]);

    expect(document.body.querySelector(`.${classes.turnMeta}`)).toBeNull();
    expect(document.body.querySelector(`.${classes.phaseHeader}`)).toBeNull();
    expect(document.body.textContent).not.toContain("Phase");
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

    expect(
      document.body.querySelector('[role="dialog"][aria-label="Event log options"]'),
    ).toBeNull();
    expect(document.body.querySelector('[data-testid="event-log-chat-message"]')).toBeNull();
    expect(document.body.textContent).not.toContain("Good luck!");

    await openEventLogOptions();
    const reopenedChatFilter = Array.from(document.body.querySelectorAll("button")).find((button) =>
      button.textContent?.includes("Chat"),
    );
    await act(async () => {
      reopenedChatFilter?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
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

  test("renders every section fully by default with no collapse controls", () => {
    renderPanel([
      entry("a1", "p1", "Attacked with Romping Chair.", {
        tags: ["combat"],
        section: {
          id: "fab-combat-1-1",
          label: "Romping Chair → Bravo",
          tone: "fight",
          summary: "Chain: Romping Chair → Bravo · hit 1 · 4 damage",
        },
      }),
      entry("a2", "p1", "Romping Chair hit Bravo for 4.", {
        tags: ["combat"],
        section: {
          id: "fab-combat-1-1",
          label: "Romping Chair → Bravo",
          tone: "fight",
          summary: "Chain: Romping Chair → Bravo · hit 1 · 4 damage",
        },
      }),
    ]);

    expect(document.body.querySelector('[data-testid="event-log-section"]')).toBeNull();
    expect(
      document.body.querySelectorAll(`.${classes.sectionEntries} .${classes.entry}`),
    ).toHaveLength(2);
    expect(document.body.textContent).toContain("Romping Chair hit Bravo for 4.");
  });

  test("locates only references that are currently represented on the board", async () => {
    const onHighlightEntity = vi.fn();
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          entries={[
            entry("present", "p1", "You played Snatch.", {
              entityIds: ["snatch-instance"],
              cardRefs: [
                {
                  name: "Snatch",
                  entityId: "snatch-instance",
                  definitionId: "snatch-definition",
                },
              ],
            }),
            entry("gone", "p2", "Opponent revealed Nimblism.", {
              entityIds: ["nimblism-instance"],
              cardRefs: [
                {
                  name: "Nimblism",
                  entityId: "nimblism-instance",
                  definitionId: "nimblism-definition",
                },
              ],
            }),
          ]}
          availableEntityIds={["snatch-instance"]}
          onHighlightEntity={onHighlightEntity}
        />,
      ),
    );

    const locate = document.body.querySelector('[aria-label="Show card on board"]');
    expect(locate).toBeInstanceOf(HTMLButtonElement);
    expect(document.body.textContent).toContain("Not currently on board");

    await act(async () => {
      locate?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onHighlightEntity).toHaveBeenCalledWith(["snatch-instance"]);
  });

  test("honors collapsed-by-default sections even when they are the latest section", () => {
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          sectionExpansion="latest"
          renderSectionLabel={(section) => <button type="button">Preview {section.label}</button>}
          entries={[
            entry("clash-outcome", "p1", "You revealed Snatch; Opponent revealed Snatch.", {
              tags: ["combat"],
              section: {
                id: "clash-1",
                label: "Clash",
                tone: "comparison",
                summary: "No winner · Snatch 4 power vs Snatch 4 power",
                collapsedByDefault: true,
              },
            }),
            entry("clash-result", undefined, "No player won the clash.", {
              tags: ["combat"],
              section: {
                id: "clash-1",
                label: "Clash",
                tone: "comparison",
                summary: "No winner · Snatch 4 power vs Snatch 4 power",
                collapsedByDefault: true,
              },
            }),
          ]}
        />,
      ),
    );

    const collapsed = document.body.querySelector(
      '[data-testid="event-log-section"][data-expanded="false"]',
    );
    expect(collapsed?.textContent).toContain("No winner · Snatch 4 power vs Snatch 4 power");
    expect(document.body.textContent).not.toContain("You revealed Snatch");
    expect(document.body.querySelector("button button")).toBeNull();
    expect(collapsed?.querySelectorAll("button")).toHaveLength(2);
  });

  test("renders an interrupted parent section once with its child section nested in sequence", async () => {
    const activity = {
      id: "activity-1",
      label: "Clash Sequence Lab",
      tone: "effect",
      summary: "Clash Sequence Lab · 2 events",
    };
    const clash = {
      id: "clash-1",
      parent: activity,
      label: "Clash",
      tone: "comparison",
      summary: "You won · Alpha Rampage 9 power vs Snatch 4 power",
      collapsedByDefault: true,
    };
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          sectionExpansion="latest"
          entries={[
            entry("played", "p1", "You played Clash Sequence Lab.", { section: activity }),
            entry("revealed", "p1", "You revealed Alpha Rampage.", {
              tags: ["combat"],
              section: clash,
            }),
            entry("won", "p1", "You won the clash.", {
              tags: ["combat"],
              section: clash,
            }),
            entry("moved", "p1", "You moved Alpha Rampage to the graveyard.", {
              section: activity,
            }),
          ]}
        />,
      ),
    );

    expect(document.body.querySelectorAll('[data-section-depth="0"]')).toHaveLength(1);
    expect(document.body.querySelectorAll('[data-section-depth="1"]')).toHaveLength(1);
    expect(document.body.textContent).toContain("You played Clash Sequence Lab.");
    expect(document.body.textContent).toContain("You moved Alpha Rampage to the graveyard.");
    expect(document.body.textContent).toContain(
      "You won · Alpha Rampage 9 power vs Snatch 4 power",
    );
    expect(document.body.textContent).not.toContain("You revealed Alpha Rampage.");

    await act(async () => {
      document.body
        .querySelector('[aria-label="Expand Clash"]')
        ?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.textContent).toContain("You revealed Alpha Rampage.");
    expect(document.body.querySelectorAll('[data-section-depth="0"]')).toHaveLength(1);
  });

  test("materializes an embedded stack parent and reuses resumed layer groups", () => {
    const stack = {
      id: "stack-1",
      label: "Stack · 2 layers",
      meta: "Resolved",
      tone: "stack",
      summary: "2 layers resolved",
    };
    const firstLayer = {
      id: "layer-1",
      parent: stack,
      actorSeatId: "player",
      label: "Layer 1 · First Instant",
      meta: "Resolves last",
      tone: "stack-layer",
    };
    const secondLayer = {
      id: "layer-2",
      parent: stack,
      actorSeatId: "opponent",
      label: "Layer 2 · Second Instant",
      meta: "Response · resolves first",
      tone: "stack-layer",
    };
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          sectionExpansion="latest"
          seatLabels={{ player: "You", opponent: "Practice bot" }}
          entries={[
            entry("first-play", "p1", "You played First Instant.", { section: firstLayer }),
            entry("second-play", "p1", "You played Second Instant.", { section: secondLayer }),
            entry("first-resolve", "p1", "First Instant resolved.", { section: firstLayer }),
          ]}
        />,
      ),
    );

    expect(document.body.querySelectorAll('[data-section-depth="0"]')).toHaveLength(1);
    expect(document.body.querySelectorAll('[data-section-depth="1"]')).toHaveLength(2);
    expect(document.body.textContent).toContain("Stack · 2 layers");
    expect(document.body.textContent).toContain("Resolved");
    expect(document.body.textContent?.match(/Layer 1 · First Instant/g)).toHaveLength(1);
    expect(document.body.textContent).toContain("First Instant resolved.");
    const actorMarkers = [...document.body.querySelectorAll("[data-section-actor]")];
    expect(actorMarkers.map((marker) => marker.textContent)).toEqual(["Y", "O"]);
    expect(actorMarkers.map((marker) => marker.getAttribute("aria-label"))).toEqual([
      "Played by You",
      "Played by Practice bot",
    ]);
  });

  test("collapses older sections to one summary row while the latest stays expanded", async () => {
    const closedChain = {
      id: "fab-combat-1-1",
      label: "Romping Chair → Bravo",
      tone: "fight",
      summary: "Chain: Romping Chair → Bravo · hit 1 · 4 damage",
    };
    const openChain = { id: "fab-combat-1-2", label: "Trench → Bravo", tone: "fight" };
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          sectionExpansion="latest"
          entries={[
            entry("a1", "p1", "Attacked Bravo with Romping Chair.", {
              tags: ["combat"],
              section: closedChain,
            }),
            entry("a2", "p1", "Romping Chair hit Bravo for 4.", {
              tags: ["combat"],
              section: closedChain,
            }),
            entry("b1", "p1", "Attacked Bravo with Trench.", {
              tags: ["combat"],
              section: openChain,
            }),
          ]}
        />,
      ),
    );

    const collapsed = document.body.querySelector(
      '[data-testid="event-log-section"][data-expanded="false"]',
    );
    const expanded = document.body.querySelector(
      '[data-testid="event-log-section"][data-expanded="true"]',
    );

    // The collapsed group renders exactly one summary row: its rows are
    // removed from the DOM, not hidden.
    expect(collapsed).toBeInstanceOf(HTMLElement);
    expect(collapsed?.textContent).toContain("Chain: Romping Chair → Bravo · hit 1 · 4 damage");
    const compactCount = collapsed?.querySelector('[data-entry-count="2"]');
    expect(compactCount?.textContent).toBe("2");
    expect(compactCount?.getAttribute("aria-label")).toBe("2 entries");
    expect(compactCount?.closest(`.${classes.sectionToggleButton}`)).toBe(
      compactCount?.parentElement,
    );
    expect(document.body.textContent).not.toContain("Romping Chair hit Bravo for 4.");

    // The latest section of the turn stays fully rendered.
    expect(expanded).toBeInstanceOf(HTMLElement);
    expect(document.body.textContent).toContain("Attacked Bravo with Trench.");

    await act(async () => {
      collapsed?.querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(document.body.textContent).toContain("Romping Chair hit Bravo for 4.");
    expect(
      document.body.querySelector('[data-testid="event-log-section"][data-expanded="false"]'),
    ).toBeNull();
  });

  test("keeps always-scrolling logs anchored after a reader scrolls upward", async () => {
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    const first = entry("first", "p1", "First action.");
    act(() => activeRoot?.render(<EventLogPanel entries={[first]} autoScroll="always" />));

    const scroller = document.body.querySelector('[role="log"]') as HTMLDivElement;
    Object.defineProperties(scroller, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 240 },
      scrollTop: { configurable: true, value: 0, writable: true },
    });
    scroller.dispatchEvent(new Event("scroll", { bubbles: true }));

    await act(async () => {
      activeRoot?.render(
        <EventLogPanel
          entries={[first, entry("second", "p2", "Response action.")]}
          autoScroll="always"
        />,
      );
    });

    expect(scroller.scrollTop).toBe(240);
  });

  test("does not scroll away when a reader expands a section in an always-scrolling log", async () => {
    const section = {
      id: "older-stack",
      label: "Stack · 2 layers",
      tone: "stack" as const,
      collapsedByDefault: true,
    };
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          entries={[
            entry("first", "p1", "Played Snatch.", { section }),
            entry("second", "p2", "Responded with an instant.", { section }),
          ]}
          autoScroll="always"
          sectionExpansion="latest"
        />,
      ),
    );

    const scroller = document.body.querySelector('[role="log"]') as HTMLDivElement;
    Object.defineProperties(scroller, {
      clientHeight: { configurable: true, value: 100 },
      scrollHeight: { configurable: true, value: 500 },
      scrollTop: { configurable: true, value: 24, writable: true },
    });
    scroller.dispatchEvent(new Event("scroll", { bubbles: true }));
    const toggle = document.body.querySelector(
      '[data-testid="event-log-section"] button',
    ) as HTMLButtonElement;

    await act(async () => {
      toggle.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(scroller.scrollTop).toBe(24);
    expect(
      document.body
        .querySelector('[data-testid="event-log-section"]')
        ?.getAttribute("data-expanded"),
    ).toBe("true");
  });

  test("overrides speaker labels through seatLabels without changing defaults", () => {
    activeContainer = document.createElement("div");
    document.body.append(activeContainer);
    activeRoot = createRoot(activeContainer);
    act(() =>
      activeRoot?.render(
        <EventLogPanel
          seatLabels={{ player: "Me", opponent: "Practice bot" }}
          entries={[
            entry("one", "p1", "Played a unit."),
            entry("two", "p2", "Activated an ability."),
          ]}
        />,
      ),
    );

    expect(document.body.querySelector('[aria-label="Me, move"]')).toBeInstanceOf(HTMLElement);
    expect(document.body.querySelector('[aria-label="Practice bot, move"]')).toBeInstanceOf(
      HTMLElement,
    );
    expect(document.body.querySelector('[aria-label="You, move"]')).toBeNull();
    expect(document.body.querySelector('[aria-label="Rival, move"]')).toBeNull();
  });
});
