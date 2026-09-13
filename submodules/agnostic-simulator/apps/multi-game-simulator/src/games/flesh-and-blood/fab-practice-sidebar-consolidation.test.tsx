// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import {
  renderFabSimulatorScenario,
  type FabSimulatorRender,
} from "./testing/render-fab-simulator";
import {
  FabPracticeSidebarActivity,
  type FabPracticeDecisionSnapshot,
  type FabPracticeTelemetryEntry,
} from "./FabPracticeSidebarActivity";

function openPracticeTab(name: "History" | "Now" | "Lab"): HTMLElement {
  fireEvent.click(screen.getByRole("tab", { name }));
  return screen.getByRole("tabpanel", { name });
}

function openPracticeLab(): HTMLElement {
  openPracticeTab("Lab");
  return screen.getByTestId("fab-practice-lab");
}

function openPracticeChat(): HTMLInputElement {
  expect(screen.queryByLabelText("Local practice chat")).toBeNull();
  const toggle = screen.getByRole("button", { name: "Open local practice chat" });
  expect(toggle.getAttribute("aria-expanded")).toBe("false");
  fireEvent.click(toggle);
  expect(screen.getByRole("button", { name: "Close local practice chat" })).not.toBeNull();
  return screen.getByLabelText("Local practice chat") as HTMLInputElement;
}

function openDebugPayload(testId: string): HTMLElement {
  const payload = screen.getByTestId(testId);
  const summary = payload.querySelector(":scope > summary");
  if (!(summary instanceof HTMLElement)) throw new Error(`Debug summary is missing for ${testId}.`);
  fireEvent.click(summary);
  return payload;
}

describe("FAB local-practice sidebar consolidation", () => {
  let session: FabSimulatorRender | null = null;

  afterEach(() => {
    session?.unmount();
    session = null;
    cleanup();
    vi.restoreAllMocks();
  });

  it("keeps history dominant and records chat, semantic logs, and copyable snapshots", async () => {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open" });
    await session.pom.waitForReady();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const activity = screen.getByTestId("fab-practice-activity");
    expect(screen.getByRole("tab", { name: "History", selected: true })).not.toBeNull();
    expect(screen.queryByTestId("fab-practice-now")).toBeNull();
    expect(screen.queryByTestId("fab-practice-lab")).toBeNull();
    expect(within(activity).getByRole("region", { name: "Match history" })).not.toBeNull();
    expect(within(activity).queryByRole("heading", { name: "Match history" })).toBeNull();
    expect(within(activity).queryByRole("button", { name: "All" })).toBeNull();
    expect(within(activity).queryByRole("button", { name: "Yours" })).toBeNull();

    openPracticeTab("Now");
    const now = screen.getByTestId("fab-practice-now");
    expect(within(now).getByText("Your priority")).not.toBeNull();
    expect(now.textContent).not.toMatch(/Synced|Saving/);
    openPracticeTab("History");

    await session.pom.as("player-1").play("Snatch", { target: "player-2" });
    openPracticeTab("History");

    const gameLog = screen.getByTestId("fab-practice-game-log");
    await waitFor(() => {
      expect(within(gameLog).getAllByText(/Snatch/).length).toBeGreaterThan(0);
      expect(gameLog.textContent).toContain("You played Snatch");
      expect(gameLog.textContent).toContain("You attacked Practice bot with Snatch");
    });
    expect(gameLog.textContent).not.toContain("entered the arena");
    expect(gameLog.textContent).not.toContain("player-1");
    expect(screen.queryByRole("button", { name: "Event log options" })).toBeNull();

    fireEvent.change(openPracticeChat(), {
      target: { value: "Ready for the next chain link." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send local practice message" }));
    const chatTranscript = screen.getByLabelText("Local practice chat messages");
    expect(chatTranscript.textContent).toContain("You");
    expect(chatTranscript.textContent).toContain("Ready for the next chain link.");
    expect(gameLog.textContent).toContain("You");
    expect(gameLog.textContent).not.toContain("Ready for the next chain link.");

    openPracticeTab("Now");
    openPracticeTab("History");

    openPracticeLab();
    expect(screen.getByText("Local match configuration")).not.toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Event log options" }));
    fireEvent.click(screen.getByRole("button", { name: "Copy raw event log" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(String(writeText.mock.calls[0]?.[0])).toContain('"moveLogs"');
    const decisions = screen.getByTestId("fab-practice-decision-log");
    expect(decisions.textContent).toContain("Accepted");
    expect(decisions.textContent).toContain("player controlled");
    expect(decisions.textContent).toMatch(/#1.*state/s);

    const statePayload = openDebugPayload("fab-debug-state");
    fireEvent.click(within(statePayload).getByRole("button", { name: "Copy engine state" }));
    const interactionPayload = openDebugPayload("fab-debug-interaction");
    fireEvent.click(
      within(interactionPayload).getByRole("button", { name: "Copy interaction view" }),
    );
    const snapshotPayload = openDebugPayload("fab-debug-snapshot-state");
    fireEvent.click(
      within(snapshotPayload).getByRole("button", { name: /Copy state after command \d+/i }),
    );

    await vi.waitFor(() => expect(writeText).toHaveBeenCalledTimes(4));
    expect(String(writeText.mock.calls[1]?.[0])).toContain('"schemaVersion"');
    expect(String(writeText.mock.calls[3]?.[0])).toContain('"schemaVersion"');
  }, 15_000);

  it("opens a card preview from a semantic history reference", async () => {
    session = renderFabSimulatorScenario({ scenarioId: "dual-target-open" });
    await session.pom.waitForReady();

    await session.pom.as("player-1").play("Snatch", { target: "player-2" });
    openPracticeTab("History");

    const logCardReference = await waitFor(() => {
      const reference = screen
        .getAllByTestId("fab-practice-game-log")
        .flatMap((log) => [...log.querySelectorAll<HTMLElement>(".fab-card-name-reference")])
        .find((reference) => reference.textContent === "Snatch");
      expect(reference).toBeDefined();
      return reference!;
    });
    fireEvent.click(logCardReference);

    expect(screen.getByTestId("fab-card-preview").textContent).toContain("Snatch");
  });

  it("hands over the opponent seat, pauses automation, and restores bot operation", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "dual-target-open",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();

    const playSurface = screen.getByTestId("fab-practice-page");
    const originalHandLabel = screen.getByTestId("fab-hand-bottom").getAttribute("aria-label");
    expect(playSurface.getAttribute("data-controlled-player")).toBe("player-1");

    const quickTakeover = screen.getByTestId("fab-practice-quick-take-control");
    expect(quickTakeover.textContent).toBe("Take over");
    fireEvent.click(quickTakeover);

    await vi.waitFor(() => {
      expect(playSurface.getAttribute("data-controlled-player")).toBe("player-2");
    });
    expect(screen.getByTestId("fab-hand-bottom").getAttribute("aria-label")).not.toBe(
      originalHandLabel,
    );
    expect(screen.getByTestId("fab-practice-quick-take-control").textContent).toBe("Release");
    openPracticeTab("Now");
    expect(screen.getByTestId("fab-practice-now").textContent).toContain(
      "Controlling opponent · bot paused",
    );
    expect(screen.getByTestId("fab-practice-now").textContent).toContain("Other seat has priority");
    expect(screen.getByTestId("fab-sidebar-self").textContent).toContain("Practice bot");
    expect(
      screen.getByRole("button", { name: "Practice opponent controls" }).textContent,
    ).toContain("You control bot");
    expect(screen.getByTestId("fab-sidebar-opponent").textContent).toContain("You");
    expect(screen.getByTestId("fab-sidebar-opponent").textContent).toContain("Your seat · waiting");

    openPracticeTab("History");
    openPracticeChat();
    expect(screen.getByLabelText("Local practice chat").getAttribute("placeholder")).toBe(
      "Message as You",
    );
    fireEvent.change(screen.getByLabelText("Local practice chat"), {
      target: { value: "Human message while controlling the bot seat." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Send local practice message" }));
    await vi.waitFor(() => {
      expect(
        within(screen.getByRole("list", { name: "Local practice chat messages" })).getByText("You"),
      ).not.toBeNull();
    });
    const chatMessages = screen.getByRole("list", { name: "Local practice chat messages" });
    expect(chatMessages.querySelector('[data-message-kind="chat"]')).not.toBeNull();
    expect(chatMessages.textContent).toContain("Human message while controlling the bot seat.");
    expect(screen.queryByRole("button", { name: "Yours" })).toBeNull();

    fireEvent.click(screen.getByTestId("fab-practice-quick-take-control"));
    await vi.waitFor(() => {
      expect(playSurface.getAttribute("data-controlled-player")).toBe("player-1");
    });
    expect(screen.getByTestId("fab-hand-bottom").getAttribute("aria-label")).toBe(
      originalHandLabel,
    );
    expect(screen.getByTestId("fab-practice-quick-take-control").textContent).toBe("Take over");
    expect(screen.getByTestId("fab-sidebar-self").textContent).toContain("You");
    expect(screen.getByTestId("fab-sidebar-opponent").textContent).toContain("Practice bot");

    await session.pom.as("player-1").play("Snatch", { target: "player-2" });
    const chainPass = await screen.findByTestId("fab-chain-pass-priority");
    fireEvent.click(chainPass);
    openPracticeLab();
    await vi.waitFor(
      () => {
        const automated = screen
          .getByTestId("fab-practice-decision-log")
          .querySelectorAll('[data-source="bot"]');
        expect(automated.length).toBeGreaterThan(0);
      },
      { timeout: 5_000 },
    );

    const entries = Array.from(
      screen.getByTestId("fab-practice-decision-log").querySelectorAll("[data-source]"),
    );
    expect(entries[0]?.getAttribute("data-source")).toBe("player");
    expect(entries.some((entry) => entry.getAttribute("data-source") === "bot")).toBe(true);
    expect(entries.map((entry) => entry.textContent).join(" ")).toContain("Practice bot");

    openPracticeTab("History");
    const chronologicalEvents = Array.from(
      screen.getByTestId("fab-practice-game-log").querySelectorAll("li[data-kind]"),
    ).map((entry) => entry.textContent ?? "");
    const playerEventIndex = chronologicalEvents.findIndex((event) => event.includes("Snatch"));
    expect(playerEventIndex).toBeGreaterThanOrEqual(0);

    fireEvent.click(screen.getByRole("button", { name: "Practice opponent controls" }));
    fireEvent.click(screen.getByTestId("ai-take-control"));
    openPracticeLab();
    expect(screen.getByTestId("fab-practice-decision-log").textContent).toContain("Practice bot");
  }, 30_000);

  it("matches Cyberpunk bot pacing, speed, strategy, and one-step controls", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "dual-target-open",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();

    expect(screen.getByTestId("fab-practice-quick-take-control").textContent).toBe("Take over");
    expect(screen.getByTestId("fab-practice-quick-pause")).not.toBeNull();
    expect(screen.queryByTestId("fab-practice-quick-next")).toBeNull();
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();

    fireEvent.click(screen.getByTestId("fab-practice-quick-pause"));
    expect(screen.getByTestId("fab-practice-quick-next")).not.toBeNull();
    expect(screen.getByTestId("fab-practice-quick-play")).not.toBeNull();
    expect(
      screen.getByRole("button", { name: "Practice opponent controls" }).textContent,
    ).toContain("Paused · step");

    fireEvent.click(screen.getByRole("button", { name: "Practice opponent controls" }));
    const panel = await screen.findByTestId("ai-control-panel");
    expect(panel.getAttribute("data-mode")).toBe("step");
    expect(panel.getAttribute("data-speed")).toBe("balanced");
    expect(screen.getByTestId("ai-strategy")).not.toBeNull();
    expect(screen.getByTestId("ai-speed-fast")).not.toBeNull();
    expect(screen.getByTestId("ai-speed-balanced")).not.toBeNull();
    expect(screen.getByTestId("ai-speed-slow")).not.toBeNull();
    expect(screen.getByTestId("ai-mode-auto")).not.toBeNull();
    expect(screen.getByTestId("ai-mode-step")).not.toBeNull();

    fireEvent.click(screen.getByTestId("ai-speed-slow"));
    expect(screen.getByTestId("ai-control-panel").getAttribute("data-speed")).toBe("slow");
    fireEvent.change(screen.getByTestId("ai-strategy"), {
      target: { value: "defend-only" },
    });
    expect(screen.getByTestId("ai-control-panel").getAttribute("data-strategy-id")).toBe(
      "defend-only",
    );
    fireEvent.change(screen.getByTestId("ai-strategy"), {
      target: { value: "pass-only" },
    });
    expect(screen.getByTestId("ai-control-panel").getAttribute("data-strategy-id")).toBe(
      "pass-only",
    );
    fireEvent.click(screen.getByRole("button", { name: "Practice opponent controls" }));
    expect(screen.queryByTestId("ai-control-panel")).toBeNull();

    await session.pom.as("player-1").play("Snatch", { target: "player-2" });
    await session.pom.as("player-1").pass();
    await vi.waitFor(() => {
      expect((screen.getByTestId("fab-practice-quick-next") as HTMLButtonElement).disabled).toBe(
        false,
      );
    });
    openPracticeLab();
    expect(
      screen.getByTestId("fab-practice-decision-log").querySelectorAll('[data-source="bot"]')
        .length,
    ).toBe(0);

    fireEvent.click(screen.getByTestId("fab-practice-quick-next"));
    await vi.waitFor(() => {
      expect(
        screen.getByTestId("fab-practice-decision-log").querySelectorAll('[data-source="bot"]')
          .length,
      ).toBeGreaterThan(0);
    });

    fireEvent.click(screen.getByTestId("fab-practice-quick-play"));
    expect(screen.getByTestId("fab-practice-quick-pause")).not.toBeNull();
    expect(screen.queryByTestId("fab-practice-quick-next")).toBeNull();
  });

  it("keeps contextual actions on the rail and the same features in the mobile match center", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "dual-target-open",
      layout: "mobile",
      search: "ai=off",
    });
    await session.pom.waitForReady();

    expect(screen.getByTestId("fab-chain-pass-priority")).not.toBeNull();
    fireEvent.click(screen.getByTestId("fab-chain-play-activate"));
    const drawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    expect(within(drawer).getByRole("tab", { name: "Now", selected: true })).not.toBeNull();
    expect(within(drawer).getByTestId("fab-mobile-match-panel")).not.toBeNull();
    const pass = within(drawer).getByTestId("fab-action-pass-priority") as HTMLButtonElement;
    expect(pass.disabled).toBe(false);
    expect(screen.queryByTestId("fab-quick-pass")).toBeNull();

    fireEvent.click(pass);
    openPracticeLab();
    expect(screen.getByTestId("fab-practice-decision-log").textContent).toContain("Pass");
  });

  it("keeps takeover, private information, legal ownership, and raw copying intact on mobile", async () => {
    session = renderFabSimulatorScenario({
      scenarioId: "opening",
      layout: "mobile",
      search: "ai=pass-only",
    });
    await session.pom.waitForReady();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    const playSurface = screen.getByTestId("fab-practice-page");
    const playerHandNames = within(screen.getByTestId("fab-hand-bottom"))
      .getAllByTestId("card")
      .map((card) => card.getAttribute("aria-label"));
    expect(playerHandNames.length).toBeGreaterThan(0);
    expect(screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-controlled-seat")).toBe(
      "human",
    );

    fireEvent.click(screen.getByLabelText("Open match menu"));
    const drawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    fireEvent.click(within(drawer).getByTestId("fab-practice-quick-take-control"));

    await vi.waitFor(() => {
      expect(playSurface.getAttribute("data-controlled-player")).toBe("player-2");
    });
    expect(screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-controlled-seat")).toBe(
      "bot",
    );
    expect(screen.getByTestId("fab-mobile-top-rail").textContent).toContain("You");
    expect(screen.getByTestId("fab-mobile-top-rail").textContent).toContain("Your seat");
    const botHandNames = within(screen.getByTestId("fab-hand-bottom"))
      .getAllByTestId("card")
      .map((card) => card.getAttribute("aria-label"));
    expect(botHandNames.length).toBeGreaterThan(0);
    expect(botHandNames).not.toEqual(playerHandNames);

    fireEvent.click(screen.getByLabelText("Open match menu"));
    const currentDrawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    fireEvent.click(within(currentDrawer).getByRole("tab", { name: "Lab" }));
    await screen.findByTestId("fab-debug-state");
    const statePayload = openDebugPayload("fab-debug-state");
    fireEvent.click(within(statePayload).getByRole("button", { name: "Copy engine state" }));
    await vi.waitFor(() => expect(writeText).toHaveBeenCalledOnce());
    expect(String(writeText.mock.calls[0]?.[0])).toContain('"schemaVersion"');

    fireEvent.click(within(currentDrawer).getByRole("button", { name: "Close" }));
    expect(
      screen.getByTestId("fab-mobile-bottom-rail").querySelector(".fab-mobile-priority"),
    ).toBeNull();
    expect(screen.getByTestId("fab-mobile-bottom-rail").textContent).toContain("Waiting");
    expect(screen.queryByTestId("fab-chain-pass-priority")).toBeNull();
    expect(screen.queryByTestId("fab-chain-play-activate")).toBeNull();

    fireEvent.click(screen.getByLabelText("Open match menu"));
    const reopenedDrawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    fireEvent.click(within(reopenedDrawer).getByTestId("fab-practice-quick-take-control"));
    await vi.waitFor(() => {
      expect(playSurface.getAttribute("data-controlled-player")).toBe("player-1");
    });
    expect(
      within(screen.getByTestId("fab-hand-bottom"))
        .getAllByTestId("card")
        .map((card) => card.getAttribute("aria-label")),
    ).toEqual(playerHandNames);
    expect(screen.getByTestId("fab-mobile-bottom-rail").getAttribute("data-controlled-seat")).toBe(
      "human",
    );
    fireEvent.click(screen.getByLabelText("Open match menu"));
    const restoredDrawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    expect(within(restoredDrawer).getByTestId("fab-practice-quick-take-control").textContent).toBe(
      "Take over",
    );

    fireEvent.click(within(restoredDrawer).getByRole("button", { name: "Close" }));
    expect(screen.getByTestId("fab-chain-pass-priority")).not.toBeNull();
    expect(screen.getByTestId("fab-chain-play-activate")).not.toBeNull();
    fireEvent.click(screen.getByTestId("fab-chain-pass-priority"));
    fireEvent.click(screen.getByLabelText("Open match menu"));
    fireEvent.click(await screen.findByRole("tab", { name: "Lab" }));
    await vi.waitFor(() => {
      expect(
        screen.getByTestId("fab-practice-decision-log").querySelectorAll('[data-source="bot"]')
          .length,
      ).toBeGreaterThan(0);
    });
  });

  it("keeps a pending choice visible and records explicit completed-decision data", () => {
    const completedDecision: FabPracticeDecisionSnapshot = {
      decisionId: "decision-order-triggers",
      actorId: "player-1",
      kind: "ordering",
      label: "Order simultaneous triggers",
    };
    const pendingDecision: FabPracticeDecisionSnapshot = {
      decisionId: "decision-target-aura",
      actorId: "player-1",
      kind: "entity-target",
      label: "Choose an opposing Aura",
    };
    const entry: FabPracticeTelemetryEntry = {
      id: 1,
      source: "player",
      actorId: "player-1",
      controllerId: "player-1",
      interactionActorId: "player-1",
      commandLabel: "Order simultaneous triggers",
      move: "order-triggers",
      result: "accepted",
      recordedAt: Date.now(),
      turnNumber: 1,
      stateId: 18,
      moveLogs: [],
      decisionBefore: completedDecision,
      completedDecision,
      pendingDecision,
      getRawState: () => '{"stateId":18}',
      getRawInteraction: () => '{"actorId":"player-1"}',
    };
    render(
      <FabPracticeSidebarActivity
        actions={<button type="button">Resolve choice</button>}
        telemetry={[entry]}
        humanPlayerId="player-1"
        controlledPlayerId="player-1"
        botPlayerId="player-2"
        turnNumber={1}
        pendingDecision={pendingDecision}
        now={{
          title: "Choose an opposing Aura",
          detail: "Complete the current decision to continue the rules procedure.",
          context: "Turn 1 · Damage step · your decision",
          sessionLabel: "Local fixture",
          controlLabel: "Your seat · bot off",
          tone: "ready",
        }}
        disclosure="Rules-light local combat practice."
        session={{
          mode: "Local fixture",
          playerDeck: "Bravo sample",
          botDeck: "Kayo sample",
          botStrategy: "Pass only",
          seed: "sidebar-test",
        }}
        getRawState={() => "{}"}
        getRawInteraction={() => "{}"}
      />,
    );

    openPracticeTab("Now");
    expect(screen.getByTestId("fab-practice-pending-decision").textContent).toContain(
      "Choose an opposing Aura",
    );
    openPracticeLab();
    const decisions = screen.getByTestId("fab-practice-decision-log");
    expect(decisions.textContent).toContain("Completed: Order simultaneous triggers");
    expect(decisions.textContent).toContain("Opened: Choose an opposing Aura");
    expect(decisions.textContent).toContain("Accepted");
  });

  it("refreshes open live payloads and selected command snapshots", async () => {
    let liveState = '{"stateId":1}';
    const getRawState = () => liveState;
    const entry = (id: number): FabPracticeTelemetryEntry => ({
      id,
      source: "player",
      actorId: "player-1",
      controllerId: "player-1",
      interactionActorId: "player-1",
      commandLabel: `Command ${id}`,
      move: "pass",
      result: "accepted",
      recordedAt: id,
      turnNumber: 1,
      stateId: id,
      moveLogs: [],
      decisionBefore: null,
      completedDecision: null,
      pendingDecision: null,
      getRawState: () => `{"snapshot":${id}}`,
      getRawInteraction: () => `{"interaction":${id}}`,
    });
    const telemetry = [entry(1), entry(2)];
    const renderActivity = (debugRevision: number) => (
      <FabPracticeSidebarActivity
        actions={null}
        telemetry={telemetry}
        humanPlayerId="player-1"
        controlledPlayerId="player-1"
        botPlayerId="player-2"
        turnNumber={1}
        pendingDecision={null}
        now={{
          title: "Your priority",
          detail: "Choose a legal action.",
          context: "Turn 1 · Action phase",
          sessionLabel: "Local fixture",
          controlLabel: "Your seat · bot off",
          tone: "ready",
        }}
        disclosure="Rules-light local combat practice."
        session={{ mode: "Local fixture", botStrategy: "Off", seed: "debug-refresh" }}
        debugRevision={debugRevision}
        getRawState={getRawState}
        getRawInteraction={() => "{}"}
      />
    );
    const view = render(renderActivity(1));

    openPracticeLab();
    const livePayload = openDebugPayload("fab-debug-state");
    fireEvent(livePayload, new Event("toggle"));
    await vi.waitFor(() => {
      expect(livePayload.querySelector("pre")?.textContent).toBe('{"stateId":1}');
    });

    liveState = '{"stateId":2}';
    view.rerender(renderActivity(2));
    await vi.waitFor(() => {
      expect(livePayload.querySelector("pre")?.textContent).toBe('{"stateId":2}');
    });

    const snapshotPayload = openDebugPayload("fab-debug-snapshot-state");
    fireEvent(snapshotPayload, new Event("toggle"));
    await vi.waitFor(() => {
      expect(snapshotPayload.querySelector("pre")?.textContent).toBe('{"snapshot":2}');
    });
    fireEvent.change(screen.getByLabelText("Accepted command snapshot"), {
      target: { value: "1" },
    });
    await vi.waitFor(() => {
      expect(snapshotPayload.querySelector("pre")?.textContent).toBe('{"snapshot":1}');
    });
  });
});
