import { type CSSProperties, type ReactNode } from "react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import {
  EventLogPanel,
  SimulatorMatchSidebar as SharedMatchSidebar,
  type SimulatorMatchActions,
  type SimulatorMatchAutomation,
  type SimulatorMatchParticipant,
} from "@tcg/simulator-ui";

import type { GundamControlState } from "../../game/index.ts";
import { m } from "../../lib/i18n/messages.ts";
import { CardLinkedText } from "./CardLinkedText.tsx";
import { DeferredGundamChatPanel } from "./DeferredGundamChatPanel.tsx";
import { PlayerTimer } from "./PlayerTimer.tsx";
import type { LogItem, LogTurn, PlayerInfo } from "./types.ts";

export interface MatchSidebarProps {
  readonly players: readonly [PlayerInfo, PlayerInfo];
  readonly controlState: GundamControlState;
  readonly log: readonly LogTurn[];
  readonly eventLogEntries?: readonly SimulatorEventLogEntry[];
  readonly automation?: SimulatorMatchAutomation;
  readonly secondaryActivity?: ReactNode;
  readonly actions: SimulatorMatchActions;
  readonly connectionIndicator?: ReactNode;
  readonly opponentActions?: ReactNode;
  readonly selfActions?: ReactNode;
}

/** Desktop command rail: match context and players bookend a persistent log. */
export function MatchSidebar({
  players,
  controlState,
  log,
  eventLogEntries,
  automation,
  secondaryActivity,
  actions,
  connectionIndicator,
  opponentActions,
  selfActions,
}: MatchSidebarProps) {
  const opponent = {
    ...toParticipant(players[0], "opponent", controlState),
    actions: opponentActions,
  };
  const self = {
    ...toParticipant(players[1], "self", controlState),
    connection: connectionIndicator,
    actions: selfActions,
  };
  return (
    <SharedMatchSidebar
      className="gd-dark-surface gd-command-surface"
      style={gundamSidebarStyle}
      opponent={opponent}
      self={self}
      automation={automation}
      activity={{
        log: <MatchEventLog log={log} eventLogEntries={eventLogEntries} />,
        chat: <DeferredGundamChatPanel />,
        secondary: secondaryActivity,
      }}
      actions={actions}
    />
  );
}

function toParticipant(
  player: PlayerInfo,
  role: "opponent" | "self",
  controlState: GundamControlState,
): SimulatorMatchParticipant {
  const isSelf = role === "self";
  const hasTurn = controlState.turnOwner === role;
  const hasPriority = controlState.kind === "interactive" && controlState.priorityHolder === role;
  return {
    id: player.id ?? player.name,
    role: isSelf ? "self" : "opponent",
    name: player.name,
    shortLabel: isSelf ? "YOU" : "OP",
    active: hasTurn,
    priority: hasPriority,
    status: hasPriority
      ? "PRIORITY"
      : hasTurn
        ? m["sim.player.turn.active"]()
        : m["sim.player.turn.waiting"](),
    clock: player.timer ? (
      <PlayerTimer snapshot={player.timer} isOwnClock={player.isOwnClock} compact />
    ) : (
      (player.clock ?? "—")
    ),
    metrics: [
      { id: "shield", label: "Shields", value: player.shields ?? 0 },
      {
        id: "resource",
        label: "Resource Area",
        value: `${player.resourcesAvailable ?? 0}/${player.resourcesTotal ?? 0}`,
      },
      { id: "deck", label: "Deck Area", value: player.deck ?? 0 },
      { id: "trash", label: "Trash", value: player.discard ?? 0 },
    ],
  };
}

const gundamSidebarStyle = {
  "--board-surface": "var(--color-hud-surface)",
  "--board-surface-soft": "var(--color-hud-surface)",
  "--board-text": "var(--color-hud-text)",
  "--board-muted": "var(--color-hud-text-muted)",
  "--board-border": "var(--color-hud-border)",
  "--game-accent": "var(--color-hud-accent-deep)",
  "--game-friendly": "var(--color-hud-accent-deep)",
  "--game-rival": "var(--color-hud-danger-deep)",
} as CSSProperties;

export function MatchEventLog({
  log,
  eventLogEntries,
}: {
  readonly log: readonly LogTurn[];
  readonly eventLogEntries?: readonly SimulatorEventLogEntry[];
}) {
  if (eventLogEntries && eventLogEntries.length > 0) {
    return (
      <section
        className="flex min-h-0 flex-1 flex-col overflow-hidden bg-white/70 px-3 py-2.5"
        style={sharedEventLogStyle}
      >
        <EventLogPanel
          embedded
          entries={eventLogEntries}
          renderMessage={(entry) => (
            <CardLinkedText
              message={entry.message}
              cardRefs={entry.cardRefs}
              referenceKey={entry.id}
            />
          )}
          turnExpansion="latest"
        />
      </section>
    );
  }

  return (
    <div
      role="log"
      aria-label={m["sim.sidebar.log.regionLabel"]()}
      aria-live="polite"
      className="min-h-0 flex-1 overflow-y-auto bg-white/70 px-3 py-2.5"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-hud-sm font-extrabold uppercase tracking-[.14em] text-hud-text">
          Battle log
        </span>
        <span className="h-px flex-1 bg-hud-line" />
        <span className="rounded-sm bg-hud-deep/60 px-1.5 py-0.5 text-hud-2xs font-bold text-hud-text-muted">
          {m["sim.sidebar.log.cycleCount"]({ count: log.length })}
        </span>
      </div>

      {log.length === 0 ? (
        <p className="py-6 text-center text-hud-sm font-semibold text-hud-text-muted">
          Match events will appear here.
        </p>
      ) : null}
      {log.map((turn) => (
        <div key={`turn-${turn.turn}`}>
          <div className="my-2 border-y border-hud-border/35 bg-hud-accent/5 py-1 text-center text-hud-xs font-bold uppercase tracking-[.12em] text-hud-accent-deep">
            {m["sim.sidebar.log.cycleHeader"]({ turn: String(turn.turn).padStart(2, "0") })}
          </div>
          {turn.groups.map((group, index) => (
            <LogGroup key={`${turn.turn}-${group.who}-${index}`} {...group} />
          ))}
        </div>
      ))}
    </div>
  );
}

const sharedEventLogStyle = {
  "--board-text": "var(--color-hud-text)",
  "--board-muted": "var(--color-hud-text-dim)",
  "--game-accent": "var(--color-hud-accent)",
  "--log-border": "color-mix(in srgb, var(--color-hud-accent) 22%, transparent)",
  "--log-bg": "color-mix(in srgb, var(--color-hud-surface-raised) 72%, transparent)",
  "--log-bg-gradient": "color-mix(in srgb, var(--color-hud-accent) 8%, transparent)",
  "--log-entry-hover-bg": "color-mix(in srgb, var(--color-hud-accent) 7%, transparent)",
  "--log-entry-highlight-bg": "color-mix(in srgb, var(--color-hud-accent) 12%, transparent)",
  "--log-focus": "color-mix(in srgb, var(--color-hud-accent) 45%, transparent)",
  "--log-speaker-player": "color-mix(in srgb, var(--color-hud-info) 95%, transparent)",
  "--log-speaker-opponent": "color-mix(in srgb, var(--color-hud-danger) 90%, transparent)",
  "--log-speaker-system": "color-mix(in srgb, var(--color-hud-accent-deep) 80%, transparent)",
  "--log-tag-active-bg": "color-mix(in srgb, var(--color-hud-accent) 12%, transparent)",
  "--log-tag-active-border": "color-mix(in srgb, var(--color-hud-accent) 55%, transparent)",
  "--log-tag-active-text": "var(--color-hud-accent-deep)",
  "--log-tag-border": "color-mix(in srgb, var(--color-hud-accent) 22%, transparent)",
  "--log-tag-hover-bg": "color-mix(in srgb, var(--color-hud-accent) 6%, transparent)",
  "--log-tag-move": "color-mix(in srgb, var(--color-hud-accent-deep) 75%, transparent)",
  "--log-tag-combat": "color-mix(in srgb, var(--color-hud-danger) 80%, transparent)",
  "--log-tag-ability": "color-mix(in srgb, var(--color-hud-info) 85%, transparent)",
  "--log-tag-system": "color-mix(in srgb, var(--color-hud-text-muted) 75%, transparent)",
  "--log-turn-line": "color-mix(in srgb, var(--color-hud-accent) 20%, transparent)",
  "--log-turn-text": "color-mix(in srgb, var(--color-hud-accent-deep) 62%, transparent)",
  "--log-turn-text-hover": "color-mix(in srgb, var(--color-hud-accent-deep) 88%, transparent)",
} as CSSProperties;

function LogGroup({ who, items }: LogItem) {
  const isYou = who === "YOU";
  return (
    <div className="mb-2 rounded-sm border border-hud-border/30 bg-white/75 px-2 py-1.5">
      <div
        className="mb-1 text-hud-2xs font-bold uppercase tracking-[.1em]"
        style={{ color: isYou ? "var(--color-hud-accent-deep)" : "var(--color-hud-danger-deep)" }}
      >
        {isYou ? m["sim.sidebar.log.pilotTag"]() : m["sim.sidebar.log.hostileTag"]()}
      </div>
      {items.map((item, index) => (
        <div key={index} className="mb-0.5 text-xs font-medium leading-[1.4] text-hud-text-muted">
          {item}
        </div>
      ))}
    </div>
  );
}
