import type { CSSProperties, ReactNode } from "react";
import type { SimulatorEventLogEntry } from "@tcg/simulator-contract";
import { EventLogPanel } from "@tcg/simulator-ui";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import { PlayerTimer } from "./PlayerTimer.tsx";
import type { LogItem, LogTurn, MatchInfo, PlayerInfo } from "./types.ts";

const CLIP_DIAMOND = "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)";

type CurrentTurn = "opponent" | "self";

export interface MatchSidebarProps {
  readonly matchInfo: MatchInfo;
  readonly players: readonly [PlayerInfo, PlayerInfo];
  readonly currentTurn: CurrentTurn;
  readonly priorityHolder?: CurrentTurn;
  readonly log: readonly LogTurn[];
  readonly eventLogEntries?: readonly SimulatorEventLogEntry[];
  readonly onConcede: () => void;
  readonly onCollapse?: () => void;
  readonly aboveBattleData?: ReactNode;
}

/** Desktop command rail: match context and players bookend a persistent log. */
export function MatchSidebar({
  matchInfo,
  players,
  currentTurn,
  priorityHolder,
  log,
  eventLogEntries,
  onConcede,
  onCollapse,
  aboveBattleData,
}: MatchSidebarProps) {
  return (
    <aside className="gd-dark-surface gd-command-surface relative flex h-full w-full flex-shrink-0 flex-col overflow-visible border-r border-hud-border md:w-[312px]">
      <HeaderBlock matchInfo={matchInfo} onCollapse={onCollapse} />
      <PlayerHeader
        player={players[0]}
        isTurn={currentTurn === "opponent"}
        hasPriority={priorityHolder === "opponent"}
        who="HOSTILE"
      />
      {aboveBattleData}
      <MatchEventLog log={log} eventLogEntries={eventLogEntries} />
      <PlayerHeader
        player={players[1]}
        isTurn={currentTurn === "self"}
        hasPriority={priorityHolder === "self"}
        who="PILOT"
      />
      <FooterActions onConcede={onConcede} />
    </aside>
  );
}

function HeaderBlock({
  matchInfo,
  onCollapse,
}: {
  readonly matchInfo: MatchInfo;
  readonly onCollapse?: () => void;
}) {
  return (
    <header className="flex items-center gap-3 border-b border-hud-border bg-white px-3 py-3">
      <div
        className="grid h-9 w-9 flex-shrink-0 place-items-center rounded-sm bg-hud-accent-deep text-sm font-black text-white"
        style={{ boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18)" }}
      >
        G
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-extrabold tracking-[.06em] text-hud-text">
          {m["sim.sidebar.brand.name"]()}
        </div>
        <div className="mt-0.5 truncate text-[9px] font-semibold uppercase tracking-[.14em] text-hud-text-dim">
          {m["sim.sidebar.brand.sortie"]({ format: matchInfo.format.toUpperCase() })}
        </div>
      </div>
      <div className="rounded-sm border border-hud-border/60 bg-hud-deep/45 px-2 py-1 text-right">
        <div className="text-[9px] font-bold uppercase tracking-[.1em] text-hud-accent-deep">
          Turn {matchInfo.turn}
        </div>
        <div className="max-w-[82px] truncate text-[9px] font-semibold text-hud-text-muted">
          {matchInfo.phase}
        </div>
      </div>
      {onCollapse ? (
        <Button
          title={m["sim.sidebar.rail.closeLabel"]()}
          aria-label={m["sim.sidebar.rail.closeLabel"]()}
          variant="outline"
          size="icon"
          onClick={onCollapse}
          className="h-8 w-8 rounded-sm border-hud-border/60 bg-white text-hud-accent-deep"
        >
          ◁
        </Button>
      ) : null}
    </header>
  );
}

interface PlayerHeaderProps {
  readonly player: PlayerInfo;
  readonly isTurn: boolean;
  readonly hasPriority: boolean;
  readonly who: "HOSTILE" | "PILOT";
}

function PlayerHeader({ player, isTurn, hasPriority, who }: PlayerHeaderProps) {
  const isYou = who === "PILOT";
  const turnColor = isYou ? "#2d6bff" : "#ff2d7a";

  return (
    <section
      aria-label={`${player.name} match status`}
      className="border-b border-hud-border/55 px-3 py-2.5"
      style={{
        background: isTurn
          ? isYou
            ? "rgba(45,107,255,.07)"
            : "rgba(255,45,122,.06)"
          : "oklch(0.225 0.03 262 / .82)",
      }}
    >
      <div className="flex min-w-0 items-center gap-2">
        <div
          className="grid h-8 w-8 flex-shrink-0 place-items-center rounded-full text-[9px] font-black text-white"
          style={{ background: isYou ? "#1c4cd1" : "#c8155a" }}
        >
          {isYou ? "YOU" : "OP"}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-1.5">
            <span
              className={`${hasPriority ? "gd-blink" : ""} h-[7px] w-[7px] flex-shrink-0`}
              style={{
                background: hasPriority ? turnColor : "#94a3b8",
                clipPath: CLIP_DIAMOND,
              }}
              title={
                hasPriority ? m["sim.seat.priority.holds"]() : m["sim.seat.priority.waiting"]()
              }
            />
            <span className="truncate text-xs font-bold text-hud-text">{player.name}</span>
            <span
              className="ml-auto flex-shrink-0 rounded-sm border px-2 py-0.5 text-[8px] font-extrabold uppercase tracking-[.1em]"
              style={{
                color: isTurn ? "white" : "#64748b",
                background: isTurn ? turnColor : "transparent",
                borderColor: isTurn ? turnColor : "rgba(120,140,180,.35)",
              }}
            >
              {isTurn ? m["sim.player.turn.active"]() : m["sim.player.turn.waiting"]()}
            </span>
          </div>
          <div className="mt-0.5 text-[10px] font-semibold tabular-nums text-hud-text-muted">
            {player.timer ? (
              <PlayerTimer snapshot={player.timer} isOwnClock={player.isOwnClock} compact />
            ) : (
              (player.clock ?? "--")
            )}
          </div>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-4 gap-1" aria-label={`${player.name} resources`}>
        <PlayerMetric label="Shield" value={player.shields ?? 0} />
        <PlayerMetric
          label="Resource"
          value={`${player.resourcesAvailable ?? 0}/${player.resourcesTotal ?? 0}`}
        />
        <PlayerMetric label="Deck" value={player.deck ?? 0} />
        <PlayerMetric label="Scrap" value={player.discard ?? 0} />
      </div>
    </section>
  );
}

function PlayerMetric({
  label,
  value,
}: {
  readonly label: string;
  readonly value: string | number;
}) {
  return (
    <div className="rounded-sm border border-hud-border/45 bg-white/85 px-1 py-1 text-center">
      <div className="truncate text-[7px] font-bold uppercase tracking-[.06em] text-hud-text-faint">
        {label}
      </div>
      <div className="mt-0.5 text-[10px] font-extrabold tabular-nums text-hud-text">{value}</div>
    </div>
  );
}

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
        className="flex min-h-0 flex-1 flex-col overflow-hidden border-y border-hud-border/45 bg-white/70 px-3 py-2.5"
        style={sharedEventLogStyle}
      >
        <div className="min-h-0 flex-1 overflow-hidden">
          <EventLogPanel embedded entries={eventLogEntries} turnExpansion="latest" />
        </div>
      </section>
    );
  }

  return (
    <div
      role="log"
      aria-label={m["sim.sidebar.log.regionLabel"]()}
      aria-live="polite"
      className="min-h-0 flex-1 overflow-y-auto border-y border-hud-border/45 bg-white/70 px-3 py-2.5"
    >
      <div className="mb-2 flex items-center gap-2">
        <span className="text-[10px] font-extrabold uppercase tracking-[.14em] text-hud-text">
          Battle log
        </span>
        <span className="h-px flex-1 bg-hud-line" />
        <span className="rounded-sm bg-hud-deep/60 px-1.5 py-0.5 text-[8px] font-bold text-hud-text-muted">
          {m["sim.sidebar.log.cycleCount"]({ count: log.length })}
        </span>
      </div>

      {log.length === 0 ? (
        <p className="py-6 text-center text-[10px] font-semibold text-hud-text-faint">
          Match events will appear here.
        </p>
      ) : null}
      {log.map((turn) => (
        <div key={`turn-${turn.turn}`}>
          <div className="my-2 border-y border-hud-border/35 bg-hud-accent/5 py-1 text-center text-[9px] font-bold uppercase tracking-[.12em] text-hud-accent-deep">
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
        className="mb-1 text-[8px] font-bold uppercase tracking-[.1em]"
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

function FooterActions({ onConcede }: { readonly onConcede: () => void }) {
  return (
    <div className="border-t border-hud-border bg-white px-3 py-2">
      <Button
        onClick={onConcede}
        variant="danger"
        size="sm"
        className="w-full rounded-sm text-[9px] font-bold uppercase tracking-[.12em]"
      >
        {m["sim.sidebar.footer.concede"]()}
      </Button>
    </div>
  );
}
