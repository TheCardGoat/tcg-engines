import { FabPresentationTestProvider } from "./presentation-test-provider";
// @vitest-environment jsdom
import type { AnimationPlanV2 } from "@tcg/protocol/animations";
import type { FabMoveLog, FabMoveLogMessage } from "@tcg/flesh-and-blood-engine/simulator";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import {
  cleanup,
  fireEvent,
  render as testingLibraryRender,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import type { ReactElement } from "react";

import { FleshAndBloodSimulatorProviders } from "./App";
import {
  buildFabActivity,
  buildFabMatchActions,
  FleshAndBloodSidebar,
  toFabParticipant,
} from "./FleshAndBloodSidebar";
import { FleshAndBloodTabletop } from "./FleshAndBloodTabletop";
import { projectFabLogEntries } from "./log-projection";
import { createOpeningFixtureState } from "./fixtures";
import { installBrowserShims } from "../../testing/browser-shims";

function render(ui: ReactElement) {
  return testingLibraryRender(ui, { wrapper: FabPresentationTestProvider });
}

describe("Flesh and Blood shared match sidebar", () => {
  // These interaction fixtures start after the common route readiness boundary.
  beforeEach(() => {
    installBrowserShims();
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 1440,
    });
  });

  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("projects compact participant identity and priority without duplicating board metrics", () => {
    const state = createOpeningFixtureState();
    const opponentClock = <span>2:25</span>;
    const opponent = toFabParticipant({
      snapshot: {
        playerId: "player-2",
        life: state.life["player-2"] ?? 0,
        resourcePoints: state.resourcePoints["player-2"] ?? 0,
        actionPoints: state.actionPoints["player-2"] ?? 0,
        heroName: "Hala, Bladesaint of the Vow",
        clock: opponentClock,
      },
      role: "opponent",
      state: { ...state, activePlayerId: "player-1", priorityPlayerId: "player-1" },
      viewerId: "player-1",
    });
    const self = toFabParticipant({
      snapshot: {
        playerId: "player-1",
        life: state.life["player-1"] ?? 0,
        resourcePoints: state.resourcePoints["player-1"] ?? 0,
        actionPoints: state.actionPoints["player-1"] ?? 0,
      },
      role: "self",
      state: { ...state, activePlayerId: "player-1", priorityPlayerId: "player-1" },
      viewerId: "player-1",
    });

    expect(opponent.role).toBe("opponent");
    expect(opponent.shortLabel).toBe("OP");
    expect(opponent.showAvatar).toBe(false);
    expect(opponent.priority).toBe(false);
    expect(opponent.metrics).toBeUndefined();
    expect(opponent.clock).toBe(opponentClock);
    render(<>{opponent.meta}</>);
    expect(screen.getByText("Hala, Bladesaint of the Vow")).not.toBeNull();
    expect(screen.queryByText("2:25")).toBeNull();
    cleanup();

    expect(self.role).toBe("self");
    expect(self.shortLabel).toBe("YOU");
    expect(self.showAvatar).toBe(false);
    expect(self.active).toBe(true);
    expect(self.priority).toBe(true);
    expect(self.status).toBeUndefined();
    render(<>{self.meta}</>);
    expect(screen.queryByText(/Started (first|second)/)).toBeNull();
    expect(self.metrics).toBeUndefined();
  });

  it.each(["player-1", "player-2"])(
    "omits starting order from participant bands after turns change for %s",
    (viewerId) => {
      const opponentId = viewerId === "player-1" ? "player-2" : "player-1";
      const state = {
        ...createOpeningFixtureState(),
        firstTurnPlayerId: "player-1",
        activePlayerId: "player-2",
        priorityPlayerId: "player-2",
        turnNumber: 2,
      };
      render(
        <FleshAndBloodSimulatorProviders>
          <FleshAndBloodTabletop state={state} viewerId={viewerId} readOnly />
        </FleshAndBloodSimulatorProviders>,
      );
      expect(
        within(screen.getByTestId("fab-sidebar-self")).queryByText(
          viewerId === "player-1" ? "Started first" : "Started second",
        ),
      ).toBeNull();
      expect(
        within(screen.getByTestId("fab-sidebar-opponent")).queryByText(
          opponentId === "player-1" ? "Started first" : "Started second",
        ),
      ).toBeNull();
    },
  );

  it("places page-owned actions in the activity log and defaults the dock when idle", () => {
    const state = createOpeningFixtureState();
    const activity = buildFabActivity({
      state,
      viewerId: "player-1",
      opponentId: "player-2",
      status: "Synced",
      sidebarExtra: <div data-testid="extra-fixture">Fixture notes</div>,
      pageOwnedActions: (
        <button type="button" data-testid="page-pass">
          Pass
        </button>
      ),
    });
    expect(activity.logLabel).toBe("Actions");
    expect(activity.secondaryLabel).toBe("More");
    expect(activity.secondary).not.toBeUndefined();

    const idleDock = buildFabMatchActions({
      disabled: false,
    });
    expect("controls" in idleDock).toBe(true);

    const defaultDock = buildFabMatchActions({
      onConcede: () => {},
      disabled: false,
    });
    expect("controls" in defaultDock).toBe(true);
    expect(defaultDock.danger).not.toBeUndefined();
  });

  it("mounts the shared event log panel when projected entries are supplied", () => {
    const state = createOpeningFixtureState();
    const attack = (cardName: string): FabMoveLogMessage => ({
      key: "flesh-and-blood.attack",
      values: { actorId: "player-1", cardName, targetName: "player-2" },
      defaultMessage: "attack",
    });
    const hit = (cardName: string, damage: number): FabMoveLogMessage => ({
      key: "flesh-and-blood.combat.hit",
      values: { cardName, targetName: "player-2", damage },
      defaultMessage: "hit",
    });
    const chainClose: FabMoveLogMessage = {
      key: "flesh-and-blood.combat.chain-close",
      defaultMessage: "The combat chain closed.",
    };
    const moveLog: FabMoveLog = {
      commandId: "test-command",
      moveType: "answer-decision",
      playerId: "player-1",
      timestamp: 1_700_000_000_000,
      sequence: 0,
      turnNumber: 1,
      public: [
        attack("Romping Chair"),
        hit("Romping Chair", 4),
        chainClose,
        attack("Trench of Sunken Fortunes"),
        hit("Trench of Sunken Fortunes", 3),
        chainClose,
        {
          key: "flesh-and-blood.play",
          values: { actorId: "player-1", cardName: "Snatch" },
          defaultMessage: "player-1 played Snatch.",
        },
      ],
    };
    const entries = projectFabLogEntries([moveLog], {
      viewerId: "player-1",
      seatIds: ["player-1", "player-2"],
    });

    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={state}
          viewerId="player-1"
          readOnly={false}
          onAction={vi.fn()}
          eventLog={entries}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    // The default activity log tab renders the shared panel fed by the
    // projection, replacing the idle placeholder.
    const panel = screen.getByTestId("event-log");
    expect(panel.getAttribute("data-count")).toBe("7");
    expect(panel.textContent).toContain("You played Snatch.");
    expect(screen.queryByText("Match events and practice actions appear here.")).toBeNull();

    // The older combat chain collapses to its stamped one-line summary while
    // the latest section in the turn stays expanded with its rows.
    const sectionRows = Array.from(panel.querySelectorAll('[data-testid="event-log-section"]'));
    expect(sectionRows).toHaveLength(2);
    const collapsedChain = sectionRows[0] as HTMLElement;
    expect(
      collapsedChain.querySelector('button[aria-expanded="false"]')?.getAttribute("aria-expanded"),
    ).toBe("false");
    expect(collapsedChain.closest('[data-collapsed="true"]')).not.toBeNull();
    expect(collapsedChain.textContent).toContain("4 damage");
    const expandedChain = sectionRows[1] as HTMLElement;
    expect(
      expandedChain.querySelector('button[aria-expanded="true"]')?.getAttribute("aria-expanded"),
    ).toBe("true");
    expect(expandedChain.closest('[data-collapsed="true"]')).toBeNull();
    expect(expandedChain.textContent).toContain("Trench of Sunken Fortunes → Opponent");

    const activity = buildFabActivity({
      state,
      viewerId: "player-1",
      opponentId: "player-2",
      status: "Synced",
      pageOwnedActions: null,
    });
    expect(activity.logLabel).toBe("Status");
  });

  it("renders the shared anatomy with only Undo, Pass priority and confirmed Concede", async () => {
    const state = {
      ...createOpeningFixtureState(),
      activePlayerId: "player-1",
      priorityPlayerId: "player-1",
    };
    const onAction = vi.fn();

    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={state}
          viewerId="player-1"
          readOnly={false}
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const sidebar = screen.getByTestId("fab-sidebar");
    expect(sidebar.tagName).toBe("ASIDE");
    expect(sidebar.getAttribute("data-has-automation")).toBe("false");
    expect(sidebar.getAttribute("data-compact-participants")).toBe("true");

    // Shared hierarchy: opponent → activity → match actions → self
    const children = Array.from(sidebar.children);
    expect(children).toHaveLength(4);
    expect(children[0]?.getAttribute("data-role")).toBe("opponent");
    expect(children[0]?.getAttribute("data-testid")).toBe("fab-sidebar-opponent");
    expect(children[1]?.getAttribute("aria-label")).toBe("Match activity");
    expect(children[2]?.getAttribute("aria-label")).toBe("Match actions");
    expect(children[3]?.getAttribute("data-role")).toBe("self");
    expect(children[3]?.getAttribute("data-testid")).toBe("fab-sidebar-self");

    const opponentBand = screen.getByTestId("fab-sidebar-opponent");
    expect(opponentBand.getAttribute("data-has-metrics")).toBe("false");
    expect(within(opponentBand).queryByLabelText("Opponent resources")).toBeNull();
    expect(opponentBand.textContent).not.toContain(String(state.life["player-2"]));

    const selfBand = screen.getByTestId("fab-sidebar-self");
    expect(selfBand.getAttribute("data-priority")).toBe("true");
    expect(selfBand.getAttribute("data-has-metrics")).toBe("false");
    expect(within(selfBand).queryByLabelText("Your resources")).toBeNull();
    expect(selfBand.textContent).not.toContain(String(state.life["player-1"]));
    expect(within(selfBand).queryByText("Priority")).toBeNull();

    expect(screen.queryByTestId("fab-sidebar-status")).toBeNull();
    expect(screen.queryByText("Synced")).toBeNull();

    expect(screen.queryByTestId("fab-action-draw")).toBeNull();
    expect(screen.queryByTestId("fab-action-end-turn")).toBeNull();
    expect(within(sidebar).getByLabelText("Space bar").querySelector("svg")).not.toBeNull();
    const undo = screen.getByTestId("fab-action-undo") as HTMLButtonElement;
    const concede = screen.getByTestId("fab-action-concede") as HTMLButtonElement;
    expect(undo.disabled).toBe(true);
    expect(undo.title).toMatch(/practice matches/i);
    expect(concede.disabled).toBe(false);

    const refreshedConcede = screen.getByTestId("fab-action-concede") as HTMLButtonElement;
    expect(refreshedConcede.disabled).toBe(false);
    fireEvent.click(refreshedConcede);
    const concedeDialog = await screen.findByRole("dialog", { name: "Concede match?" });
    expect(concedeDialog.textContent).toContain("cannot be undone");
    expect(onAction).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "end_game", reason: "concession" }),
    );
    fireEvent.click(within(concedeDialog).getByRole("button", { name: "Keep playing" }));
    await waitFor(() => {
      expect(screen.queryByRole("dialog", { name: "Concede match?" })).toBeNull();
    });
    expect(onAction).not.toHaveBeenCalledWith(
      expect.objectContaining({ type: "end_game", reason: "concession" }),
    );
    fireEvent.click(screen.getByTestId("fab-action-concede"));
    const reopenedConcedeDialog = await screen.findByRole("dialog", { name: "Concede match?" });
    fireEvent.click(
      within(reopenedConcedeDialog).getByRole("button", {
        name: "Concede",
      }),
    );
    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ type: "end_game", winnerId: "player-2", reason: "concession" }),
    );
  });

  it("bypasses dock confirmation when the page owns the confirmation dialog", () => {
    const onAction = vi.fn();
    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={createOpeningFixtureState()}
          viewerId="player-1"
          confirmConcede={false}
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    fireEvent.click(screen.getByTestId("fab-action-concede"));

    expect(onAction).toHaveBeenCalledWith(
      expect.objectContaining({ type: "end_game", winnerId: "player-2", reason: "concession" }),
    );
    expect(screen.queryByRole("dialog", { name: "Concede match?" })).toBeNull();
  });

  it("keeps animation gating stable across an equivalent authoritative reprojection", async () => {
    const state = createOpeningFixtureState();
    const onAction = vi.fn();
    const plan: AnimationPlanV2 = {
      id: "fab:test:first-command",
      version: 2,
      steps: [
        {
          id: "fab:test:first-command:move",
          type: "entityTransfer",
          entity: { kind: "entity", id: "fab-test-card" },
          from: { kind: "zone", id: "hand" },
          to: { kind: "zone", id: "stack" },
          sourceFace: "public",
          destinationFace: "public",
        },
      ],
    };
    const view = render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:equivalent-reprojection"
          state={state}
          animationVersion={0}
          viewerId="player-1"
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );
    const commandState = { ...state, turnNumber: state.turnNumber + 1 };
    const transition = {
      version: 1,
      correlationId: "fab:test:first-command",
      plan,
      mode: "enqueue" as const,
    };

    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:equivalent-reprojection"
          state={commandState}
          animationVersion={1}
          animationTransition={transition}
          viewerId="player-1"
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );
    const concedeDisabled = (screen.getByTestId("fab-action-concede") as HTMLButtonElement)
      .disabled;

    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:equivalent-reprojection"
          state={{ ...commandState }}
          animationVersion={1}
          animationTransition={transition}
          viewerId="player-1"
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );
    expect((screen.getByTestId("fab-action-concede") as HTMLButtonElement).disabled).toBe(
      concedeDisabled,
    );
  });

  it("does not expose presentation-only match actions without a local action owner", () => {
    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop state={createOpeningFixtureState()} viewerId="player-1" />
      </FleshAndBloodSimulatorProviders>,
    );

    expect(screen.queryByTestId("fab-action-draw")).toBeNull();
    expect(screen.queryByTestId("fab-action-end-turn")).toBeNull();
    expect((screen.getByTestId("fab-action-concede") as HTMLButtonElement).disabled).toBe(true);
  });

  it("lands a same-version authoritative update after a local presentation action", () => {
    const state = createOpeningFixtureState();
    const onAction = vi.fn();
    const view = render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:authoritative-recovery"
          state={state}
          animationVersion={0}
          viewerId="player-1"
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    fireEvent.click(screen.getByTestId("fab-action-concede"));
    fireEvent.click(screen.getByTestId("fab-concede-confirm"));
    expect(onAction).toHaveBeenCalledWith(expect.objectContaining({ type: "end_game" }));
    const serverState = {
      ...state,
      life: { ...state.life, "player-1": (state.life["player-1"] ?? 0) - 1 },
    };
    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:authoritative-recovery"
          state={serverState}
          animationVersion={1}
          animationTransition={{
            version: 1,
            correlationId: "fab:test:server-update",
            plan: null,
            mode: "enqueue",
          }}
          viewerId="player-1"
          onAction={onAction}
        />
      </FleshAndBloodSimulatorProviders>,
    );

    expect(screen.getByTestId("fab-player-bottom").getAttribute("data-life")).toBe("19");
  });

  it("does not consume an engine version for a same-version presentation reprojection", () => {
    const state = createOpeningFixtureState();
    const view = render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:same-version-reprojection"
          state={state}
          animationVersion={0}
          viewerId="player-1"
        />
      </FleshAndBloodSimulatorProviders>,
    );

    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:same-version-reprojection"
          state={{ ...state }}
          animationVersion={0}
          viewerId="player-1"
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const commandState = {
      ...state,
      life: { ...state.life, "player-1": (state.life["player-1"] ?? 0) - 1 },
    };
    view.rerender(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          sessionKey="fab:test:same-version-reprojection"
          state={commandState}
          animationVersion={1}
          animationTransition={{
            version: 1,
            correlationId: "fab:test:first-engine-command",
            plan: null,
            mode: "enqueue",
          }}
          viewerId="player-1"
        />
      </FleshAndBloodSimulatorProviders>,
    );

    expect(screen.getByTestId("fab-player-bottom").getAttribute("data-life")).toBe("19");
  });

  it("surfaces page-owned matchActions and sidebarExtra through the shared shell", () => {
    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={createOpeningFixtureState()}
          viewerId="player-1"
          readOnly
          sidebarExtra={<div data-testid="fab-fixture-description">Opening hand fixture</div>}
          matchActions={
            <div className="fab-actions" data-testid="fab-match-actions">
              <button type="button" data-testid="fab-action-pass">
                Pass priority
              </button>
            </div>
          }
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const sidebar = screen.getByTestId("fab-sidebar");
    expect(sidebar.tagName).toBe("ASIDE");

    // Page actions live in the flexible activity band, not a FAB-only tree.
    expect(screen.getByTestId("fab-sidebar-page-actions")).not.toBeNull();
    expect(screen.getByTestId("fab-action-pass")).not.toBeNull();
    const pass = screen.getByTestId("fab-action-pass-priority") as HTMLButtonElement;
    expect(pass.disabled).toBe(true);
    expect((screen.getByTestId("fab-quick-pass") as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByTestId("fab-quick-undo") as HTMLButtonElement).disabled).toBe(true);

    fireEvent.click(screen.getByRole("tab", { name: "More" }));
    expect(screen.getByTestId("fab-fixture-description").textContent).toBe("Opening hand fixture");
  });

  it("keeps Pass and Undo visible while their enabled state follows legality", () => {
    const onUndo = vi.fn();
    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={createOpeningFixtureState()}
          viewerId="player-1"
          onUndo={onUndo}
          canUndo
        />
      </FleshAndBloodSimulatorProviders>,
    );

    const quickUndo = screen.getByTestId("fab-quick-undo") as HTMLButtonElement;
    const quickPass = screen.getByTestId("fab-quick-pass") as HTMLButtonElement;
    expect(quickUndo.disabled).toBe(false);
    expect(quickPass.disabled).toBe(true);
    expect((screen.getByTestId("fab-action-undo") as HTMLButtonElement).disabled).toBe(false);
    expect((screen.getByTestId("fab-action-pass-priority") as HTMLButtonElement).disabled).toBe(
      true,
    );
    fireEvent.click(quickUndo);
    expect(onUndo).toHaveBeenCalledOnce();
  });

  it("keeps the shared contracts in a compact mobile match center", async () => {
    Object.defineProperty(window, "innerWidth", {
      configurable: true,
      writable: true,
      value: 390,
    });

    const openingState = createOpeningFixtureState();
    render(
      <FleshAndBloodSimulatorProviders>
        <FleshAndBloodTabletop
          state={{
            ...openingState,
            activePlayerId: "player-2",
            actionPoints: { ...openingState.actionPoints, "player-2": 1 },
          }}
          viewerId="player-1"
          readOnly={false}
          forceMobileLayout
          matchActions={
            <button type="button" data-testid="drawer-legal-pass">
              Pass priority
            </button>
          }
        />
      </FleshAndBloodSimulatorProviders>,
    );

    expect(screen.getByTestId("fab-tabletop").getAttribute("data-fab-layout")).toBe("mobile");
    expect(screen.getByTestId("fab-mobile-top-rail")).not.toBeNull();
    expect(screen.getByTestId("fab-mobile-bottom-rail")).not.toBeNull();
    expect(
      screen.getByTestId("fab-mobile-bottom-rail").querySelector(".fab-mobile-priority"),
    ).toBeNull();
    const opponentAssets = screen.getByRole("group", { name: "Opponent assets" });
    expect(opponentAssets.querySelector('[data-asset="action-points"]')).not.toBeNull();
    expect(screen.getByLabelText("Open match panel")).not.toBeNull();
    expect(screen.queryByLabelText("Open match history")).toBeNull();

    fireEvent.click(screen.getByLabelText("Open match menu"));
    const drawer = await screen.findByRole("dialog", {
      name: "Flesh and Blood match center",
    });
    expect(within(drawer).getByTestId("fab-mobile-match-panel")).not.toBeNull();
    expect(within(drawer).queryByTestId("fab-sidebar")).toBeNull();
    expect(within(drawer).queryByTestId("fab-practice-activity")).toBeNull();
    expect(within(drawer).queryByTestId("fab-practice-quick-take-control")).toBeNull();
    expect(within(drawer).queryByRole("tab", { name: "Lab" })).toBeNull();
    expect(within(drawer).getByTestId("drawer-legal-pass")).not.toBeNull();
    fireEvent.click(within(drawer).getByText("Seats"));
    expect(within(drawer).getByTestId("fab-sidebar-opponent")).not.toBeNull();
    expect(within(drawer).getByTestId("fab-sidebar-self")).not.toBeNull();
  });

  it("renders FleshAndBloodSidebar adapter props without the full tabletop shell", () => {
    const state = createOpeningFixtureState();
    render(
      <FleshAndBloodSidebar
        state={state}
        viewerId="player-1"
        opponentId="player-2"
        self={{
          playerId: "player-1",
          life: 40,
          resourcePoints: 1,
          actionPoints: 1,
        }}
        opponent={{
          playerId: "player-2",
          life: 35,
          resourcePoints: 0,
          actionPoints: 0,
        }}
        status="Synced"
        onConcede={() => {}}
      />,
    );

    expect(screen.getByTestId("fab-sidebar").tagName).toBe("ASIDE");
    expect(screen.getByTestId("fab-sidebar").getAttribute("data-compact-participants")).toBe(
      "true",
    );
    expect(screen.getByTestId("fab-sidebar-opponent").textContent).not.toContain("35");
    expect(screen.getByTestId("fab-sidebar-self").textContent).not.toContain("40");
    expect((screen.getByTestId("fab-action-undo") as HTMLButtonElement).disabled).toBe(true);
    expect(screen.queryByTestId("fab-action-draw")).toBeNull();
    expect(screen.queryByTestId("fab-action-end-turn")).toBeNull();
    expect(screen.getByTestId("fab-action-concede")).not.toBeNull();
  });

  it("replaces gameplay actions with one summary action after the game", () => {
    const state = createOpeningFixtureState();
    const onOpenGameSummary = vi.fn();
    render(
      <FleshAndBloodSidebar
        state={{ ...state, terminal: true }}
        viewerId="player-1"
        opponentId="player-2"
        self={{ playerId: "player-1", life: 0, resourcePoints: 0, actionPoints: 0 }}
        opponent={{ playerId: "player-2", life: 12, resourcePoints: 0, actionPoints: 0 }}
        status="Game complete"
        onConcede={() => {}}
        onPassPriority={() => {}}
        onUndo={() => {}}
        onOpenGameSummary={onOpenGameSummary}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "View game summary" }));

    expect(onOpenGameSummary).toHaveBeenCalledOnce();
    expect(screen.queryByTestId("fab-action-undo")).toBeNull();
    expect(screen.queryByTestId("fab-action-pass-priority")).toBeNull();
    expect(screen.queryByTestId("fab-action-concede")).toBeNull();
  });

  it("replaces gameplay actions with one return action for spectators", () => {
    const state = createOpeningFixtureState();
    render(
      <FleshAndBloodSidebar
        state={state}
        viewerId="player-1"
        opponentId="player-2"
        self={{ playerId: "player-1", life: 40, resourcePoints: 0, actionPoints: 0 }}
        opponent={{ playerId: "player-2", life: 40, resourcePoints: 0, actionPoints: 0 }}
        status="Spectating"
        spectatorReturnHref="/flesh-and-blood/matchmaking?mode=ranked"
        onConcede={() => {}}
        onPassPriority={() => {}}
        onUndo={() => {}}
      />,
    );

    expect(screen.getByRole("link", { name: "Back to matchmaking" }).getAttribute("href")).toBe(
      "/flesh-and-blood/matchmaking?mode=ranked",
    );
    expect(screen.queryByTestId("fab-action-undo")).toBeNull();
    expect(screen.queryByTestId("fab-action-pass-priority")).toBeNull();
    expect(screen.queryByTestId("fab-action-concede")).toBeNull();
  });
});
