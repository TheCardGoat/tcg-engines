import type { InteractionSubmission } from "@tcg/protocol";
import type { SimulatorSeat } from "@tcg/simulator-contract";
import {
  SimulatorMatchSidebar,
  SimulatorViewportShell,
  type SimulatorActivityTab,
  type SimulatorMatchAutomation,
  type SimulatorMatchActivity,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";
import { Button, Tooltip } from "@mantine/core";
import { Flag, History, Menu, RotateCcw, StepForward } from "lucide-react";
import { useState, useEffect, useRef, type ReactNode } from "react";

import "./grand-archive.css";
import type { GrandArchiveHarnessFixture } from "./fixtureProjection";
import { createGrandArchiveSidebarActivity } from "./GrandArchiveSidebarActivity";
import { useGrandArchiveDialogFocus } from "./dialog-focus";
import { GrandArchiveHands } from "./GrandArchiveHands";
import {
  GrandArchiveInteractionLayer,
  useGrandArchiveInteractionWorkspace,
} from "./GrandArchiveInteractionLayer";

interface GrandArchiveTabletopProps {
  readonly onSubmitProtocolInteraction?: (submission: InteractionSubmission) => boolean;
  readonly fixture: GrandArchiveHarnessFixture;
  readonly fixtures?: readonly GrandArchiveHarnessFixture[];
  readonly onSelectFixture?: (fixtureId: string) => void;
  readonly automation?: SimulatorMatchAutomation;
  readonly chat?: ReactNode;
  readonly historyAccessory?: ReactNode;
  readonly errorMessage?: string;
  readonly canUndo?: boolean;
  readonly canConcede?: boolean;
  readonly onUndo?: () => void;
  readonly confirmConcede?: boolean;
}

function GrandArchiveSidebar({
  fixture,
  activity,
  automation,
  canUndo,
  canConcede = true,
  onUndo,
  onBeginAction,
}: {
  readonly fixture: GrandArchiveHarnessFixture;
  readonly activity: SimulatorMatchActivity;
  readonly automation?: SimulatorMatchAutomation;
  readonly canUndo?: boolean;
  readonly canConcede?: boolean;
  readonly onUndo?: () => void;
  readonly onBeginAction?: (actionId: string) => void;
}) {
  const workspace = useGrandArchiveInteractionWorkspace();
  const opponentSeat = fixture.table.seats.find((seat) => seat.perspective === "top");
  const selfSeat = fixture.table.seats.find((seat) => seat.perspective === "bottom");
  if (!opponentSeat || !selfSeat) {
    throw new Error("Grand Archive sidebar requires opposed player seats.");
  }

  const passInteraction = fixture.interactions.find(
    (interaction) =>
      interaction.input.kind === "action" &&
      (interaction.movePreview.command === "pass" ||
        interaction.movePreview.command === "skip-materialization") &&
      fixture.interactionView?.actions.some(
        (action) => action.id === interaction.id && action.enabled,
      ),
  );
  const concedeInteraction = fixture.interactions.find(
    (interaction) =>
      interaction.input.kind === "action" && interaction.movePreview.command === "concede",
  );

  const undoReason = workspace.active
    ? "Finish or cancel the current action before undoing."
    : !onUndo
      ? "Undo is available only in practice matches."
      : !canUndo
        ? "No undoable move available"
        : undefined;
  const passLabel =
    passInteraction?.movePreview.command === "skip-materialization"
      ? "Skip materialization"
      : "Pass Opportunity";
  const passReason = workspace.active
    ? "Finish or cancel the current action before passing."
    : !onBeginAction || !passInteraction
      ? "There is no legal pass available right now."
      : undefined;
  const concedeReason = workspace.active
    ? "Finish or cancel the current action before conceding."
    : !onBeginAction || !canConcede || !concedeInteraction
      ? "Concede is unavailable in this match."
      : undefined;

  return (
    <SimulatorMatchSidebar
      className="ga-match-sidebar"
      data-testid="grand-archive-sidebar"
      opponent={toGrandArchiveParticipant(fixture, opponentSeat, "opponent")}
      self={toGrandArchiveParticipant(fixture, selfSeat, "self")}
      activity={activity}
      activityLabel="Grand Archive match activity"
      automation={automation}
      actions={{
        className: "ga-match-action-dock",
        controls: (
          <div className="ga-match-dock-controls">
            <GrandArchiveActionSlot label={"Undo"} reason={undoReason}>
              <Button
                variant="default"
                disabled={Boolean(undoReason)}
                aria-label={
                  undoReason ? `Undo unavailable. ${undoReason}` : "Undo last accepted move"
                }
                leftSection={<RotateCcw size={16} aria-hidden="true" />}
                onClick={onUndo}
              >
                Undo
              </Button>
            </GrandArchiveActionSlot>
            <GrandArchiveActionSlot label={passLabel} reason={passReason}>
              <Button
                className="ga-match-pass"
                styles={{
                  label: { whiteSpace: "normal", lineHeight: 1.2 },
                  section: { marginInlineEnd: 6 },
                }}
                disabled={Boolean(passReason)}
                aria-label={passLabel}
                leftSection={<StepForward size={16} aria-hidden="true" />}
                onClick={() => passInteraction && onBeginAction?.(passInteraction.id)}
              >
                {passLabel}
              </Button>
            </GrandArchiveActionSlot>
          </div>
        ),
        danger: (
          <GrandArchiveActionSlot label="Concede" reason={concedeReason}>
            <Button
              variant="subtle"
              className="ga-match-concede"
              data-danger="true"
              disabled={Boolean(concedeReason)}
              leftSection={<Flag size={15} aria-hidden="true" />}
              onClick={() => concedeInteraction && onBeginAction?.(concedeInteraction.id)}
            >
              Concede
            </Button>
          </GrandArchiveActionSlot>
        ),
      }}
    />
  );
}

function GrandArchiveActionSlot({
  label,
  reason,
  children,
}: {
  readonly label: string;
  readonly reason?: string;
  readonly children: ReactNode;
}) {
  return (
    <Tooltip label={reason ?? label} withArrow events={{ hover: true, focus: true, touch: true }}>
      <span
        className="ga-match-action-slot"
        role={reason ? "group" : undefined}
        aria-label={reason ? `${label} unavailable` : undefined}
        tabIndex={reason ? 0 : undefined}
      >
        {children}
      </span>
    </Tooltip>
  );
}

function toGrandArchiveParticipant(
  fixture: GrandArchiveHarnessFixture,
  seat: SimulatorSeat,
  role: "opponent" | "self",
): SimulatorMatchParticipant {
  const actingPlayerId = "playerId" in fixture.waitState ? fixture.waitState.playerId : undefined;
  const active = actingPlayerId === seat.id;
  const champion = fixture.entities.find(
    (entity) => entity.kind === "leader" && entity.ownerId === seat.id && entity.face === "public",
  );
  const technicalSeatLabel = /^p\d+$/i.test(seat.label);
  const playerName =
    seat.role === "agent"
      ? "Practice opponent"
      : technicalSeatLabel
        ? role === "self"
          ? "You"
          : "Opponent"
        : seat.label;
  return {
    id: seat.id,
    role,
    name: playerName,
    shortLabel: role === "self" ? "YOU" : "OP",
    active,
    priority: active,
    status: active
      ? fixture.waitState.kind === "opportunity"
        ? "Opportunity"
        : fixture.waitState.kind === "pregame-action"
          ? "Pregame"
          : fixture.waitState.kind === "materialization-choice"
            ? "Materialize"
            : "Decision"
      : fixture.waitState.kind === "resolving"
        ? "Resolving"
        : fixture.waitState.kind === "game-over"
          ? "Finished"
          : "Waiting",
    connection: seat.connectionStatus ? (
      <span role="status">
        {seat.connectionStatus === "online"
          ? "Online"
          : seat.connectionStatus === "offline"
            ? "Offline"
            : seat.connectionStatus}
      </span>
    ) : undefined,
    meta: champion?.title ?? (role === "self" ? "You" : "Opponent"),
    clock: seat.timerMs === undefined ? undefined : formatGrandArchiveTimer(seat.timerMs),
  };
}

function formatGrandArchiveTimer(timerMs: number): string {
  const seconds = Math.max(0, Math.floor(timerMs / 1000));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
}

export function GrandArchiveTabletop(props: GrandArchiveTabletopProps) {
  return (
    <GrandArchiveInteractionLayer
      fixture={props.fixture}
      onSubmit={props.onSubmitProtocolInteraction}
      errorMessage={props.errorMessage}
    >
      <GrandArchiveTabletopContent {...props} />
    </GrandArchiveInteractionLayer>
  );
}

function GrandArchiveTabletopContent(props: GrandArchiveTabletopProps) {
  const workspace = useGrandArchiveInteractionWorkspace();
  const { fixture } = props;
  const [actionSerial, setActionSerial] = useState(0);
  const [activeTab, setActiveTab] = useState<SimulatorActivityTab>("combined");
  const [pendingConcede, setPendingConcede] = useState<string | null>(null);
  const concedeDialogRef = useGrandArchiveDialogFocus<HTMLElement>(pendingConcede !== null, () =>
    setPendingConcede(null),
  );
  const beginAction = props.onSubmitProtocolInteraction
    ? (interactionId: string) => {
        setActionSerial((serial) => serial + 1);
        const interaction = fixture.interactions.find(
          (candidate) => candidate.id === interactionId,
        );
        if ((props.confirmConcede ?? true) && interaction?.movePreview.command === "concede") {
          setPendingConcede(interactionId);
          return;
        }
        workspace.beginAction(interactionId);
      }
    : undefined;
  const activity = createGrandArchiveSidebarActivity({
    fixture,
    ...(props.fixtures ? { fixtures: props.fixtures } : {}),
    ...(props.onSelectFixture ? { onSelectFixture: props.onSelectFixture } : {}),
    ...(props.chat ? { chat: props.chat } : {}),
    ...(props.historyAccessory ? { historyAccessory: props.historyAccessory } : {}),
    ...(props.errorMessage ? { errorMessage: props.errorMessage } : {}),
    onBeginAction: workspace.active ? undefined : beginAction,
    activeTab,
    onActiveTabChange: setActiveTab,
  });
  const sidebar = (
    <GrandArchiveSidebar
      fixture={fixture}
      activity={activity}
      automation={props.automation}
      canUndo={props.canUndo}
      canConcede={props.canConcede}
      onUndo={props.onUndo}
      onBeginAction={beginAction}
    />
  );
  const board = (
    <div className="ga-tabletop" data-testid="grand-archive-tabletop">
      <div className="ga-board">
        {!props.onSubmitProtocolInteraction ? (
          <span className="ga-read-only" role="status">
            Read-only fixture · Inspect cards and zones
          </span>
        ) : null}
        <GrandArchiveHands
          onSubmitProtocolInteraction={props.onSubmitProtocolInteraction}
          fixture={fixture}
          canUndo={props.canUndo}
          onUndo={props.onUndo}
        />
      </div>
    </div>
  );

  return (
    <>
      <SimulatorViewportShell
        data-game="grand-archive"
        data-theme="dark"
        sidebar={sidebar}
        mobilePanel={sidebar}
        sidebarLabel="Grand Archive match activity"
        mobilePanelLabel="Grand Archive match activity"
        mobileTopRail={({ openSidebar, closeSidebar }) => (
          <div className="ga-mobile-rail ga-mobile-rail-top">
            <GrandArchiveMobileActionFocus serial={actionSerial} closeSidebar={closeSidebar} />
            <div>
              <strong>{fixture.table.status.phase}</strong>
              <span>Turn {fixture.table.status.turn}</span>
            </div>
            <button type="button" onClick={openSidebar} aria-label="Open match activity">
              <Menu aria-hidden="true" size={20} />
            </button>
          </div>
        )}
        mobileBottomRail={({ openSidebar }) => (
          <div className="ga-mobile-rail ga-mobile-rail-bottom">
            <button
              type="button"
              onClick={openSidebar}
              aria-label="Actions & history"
              title="Actions & history"
            >
              <History aria-hidden="true" size={17} />
            </button>
          </div>
        )}
        tabletop={board}
      />
      {pendingConcede ? (
        <div className="ga-concede-backdrop" role="presentation">
          <section
            ref={concedeDialogRef}
            className="ga-concede-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="ga-concede-title"
            tabIndex={-1}
          >
            <p>Irreversible action</p>
            <h2 id="ga-concede-title">Concede this match?</h2>
            <span>This immediately ends the game as a loss and cannot be undone.</span>
            <div>
              <button type="button" onClick={() => setPendingConcede(null)} data-dialog-autofocus>
                Keep playing
              </button>
              <button
                type="button"
                data-danger="true"
                data-testid="ga-concede-confirm"
                onClick={() => {
                  workspace.beginAction(pendingConcede);
                  setPendingConcede(null);
                }}
              >
                Concede match
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </>
  );
}

function GrandArchiveMobileActionFocus({
  serial,
  closeSidebar,
}: {
  readonly serial: number;
  readonly closeSidebar: () => void;
}) {
  const previous = useRef(serial);
  useEffect(() => {
    if (previous.current === serial) return;
    previous.current = serial;
    closeSidebar();
  }, [serial, closeSidebar]);
  return null;
}
