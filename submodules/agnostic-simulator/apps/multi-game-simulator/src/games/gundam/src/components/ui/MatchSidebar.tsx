import type { ReactNode } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { useHintsEnabled } from "../../lib/use-hints-enabled.ts";
import { Button } from "../primitives/index.ts";
import type { LogItem, LogTurn, MatchInfo, PlayerInfo } from "./types.ts";
import { UndoButton } from "./UndoButton.tsx";
import { PlayerTimer } from "./PlayerTimer.tsx";

const CLIP_DIAMOND = "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)";
const CLIP_TRIANGLE_DOWN = "polygon(50% 0, 100% 100%, 0 100%)";

type CurrentTurn = "opponent" | "self";

export interface MatchSidebarProps {
  readonly matchInfo: MatchInfo;
  readonly players: readonly [PlayerInfo, PlayerInfo];
  readonly currentTurn: CurrentTurn;
  /** Which seat currently holds priority (fast signal, distinct from turn). */
  readonly priorityHolder?: CurrentTurn;
  readonly log: readonly LogTurn[];
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly onConcede: () => void;
  readonly onCollapse?: () => void;
  /**
   * Optional panel rendered just above the `BATTLE DATA` meta block.
   * Used for the vs-AI control panel on fixtures that attach a bot;
   * `null`/undefined for regular matches. Component-agnostic so the
   * sidebar stays a dumb presentational shell.
   */
  readonly aboveBattleData?: ReactNode;
}

export function MatchSidebar({
  matchInfo,
  players,
  currentTurn,
  priorityHolder,
  log,
  onUndo,
  canUndo,
  onConcede,
  onCollapse,
  aboveBattleData,
}: MatchSidebarProps) {
  return (
    <aside
      className="w-full md:w-[272px] flex-shrink-0 border-r border-hud-border flex flex-col overflow-hidden h-full relative"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,254,.98))",
      }}
    >
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] pointer-events-none"
        style={{
          background:
            "repeating-linear-gradient(180deg, rgba(45,107,255,.4) 0 8px, transparent 8px 14px)",
        }}
      />
      <HeaderBlock matchInfo={matchInfo} onCollapse={onCollapse} />
      <PlayerHeader
        player={players[0]}
        isTurn={currentTurn === "opponent"}
        hasPriority={priorityHolder === "opponent"}
        who="HOSTILE"
      />
      {aboveBattleData}
      <MatchMetaBlock matchInfo={matchInfo} />
      <EventLog log={log} />
      <FooterActions
        onUndo={onUndo}
        canUndo={canUndo}
        onConcede={onConcede}
        playerClock={players[1].clock}
        isTurn={currentTurn === "self"}
      />
      <PlayerHeader
        player={players[1]}
        isTurn={currentTurn === "self"}
        hasPriority={priorityHolder === "self"}
        who="PILOT"
      />
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
    <div
      className="flex items-center gap-2.5 py-3 pr-hud-sm pl-hud-md border-b border-hud-border"
      style={{
        background: "linear-gradient(90deg, rgba(30,73,199,.12), transparent)",
      }}
    >
      <div
        className="font-display w-[34px] h-[34px] grid place-items-center text-hud-accent text-base font-black clip-hud-6"
        style={{
          background: "linear-gradient(135deg,#1e49c7 0%, #1c4cd1 100%)",
          border: "1px solid rgba(45,107,255,.5)",
          boxShadow: "inset 0 0 8px rgba(45,107,255,.2)",
        }}
      >
        G
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-display text-sm text-hud-text font-extrabold tracking-hud-display">
          {m["sim.sidebar.brand.name"]()}
        </div>
        <div className="font-mono text-hud-xs text-hud-accent font-semibold mt-px tracking-hud-label">
          {m["sim.sidebar.brand.sortie"]({ format: matchInfo.format.toUpperCase() })}
        </div>
      </div>
      <Button
        title={m["sim.sidebar.system.title"]()}
        variant="outline"
        size="icon"
        className="font-mono clip-hud-5 w-[26px] h-[26px] text-hud-info border-hud-info/30 bg-hud-info/25 text-hud-lg"
      >
        ⚙
      </Button>
      {onCollapse ? (
        <Button
          title={m["sim.sidebar.rail.closeLabel"]()}
          aria-label={m["sim.sidebar.rail.closeLabel"]()}
          variant="outline"
          size="icon"
          onClick={onCollapse}
          className="font-mono clip-hud-5 w-[26px] h-[26px] text-hud-info border-hud-info/30 bg-hud-info/15 text-hud-md"
        >
          ◁
        </Button>
      ) : null}
    </div>
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
  const turnGlow = isYou ? "rgba(45,107,255,.55)" : "rgba(255,45,122,.55)";
  // PILOT chip lives at the foot of the sidebar — give it a top border so it
  // reads as its own section above the player_one rail, matching the HOSTILE
  // chip's visual weight at the top.
  const edgeClass = isYou ? "border-t border-hud-border" : "border-b border-hud-border";

  return (
    <div
      className={`flex items-center gap-2.5 py-2.5 pr-hud-sm pl-hud-md ${edgeClass} relative`}
      style={{
        background: isTurn
          ? isYou
            ? "linear-gradient(90deg, rgba(30,73,199,.22), transparent)"
            : "linear-gradient(90deg, rgba(255,45,122,.18), transparent)"
          : "rgba(248,250,254,.7)",
      }}
    >
      {isTurn && (
        <div
          className="absolute left-0 top-0 bottom-0 w-[3px]"
          style={{
            background: turnColor,
            boxShadow: `0 0 12px ${turnGlow}`,
          }}
        />
      )}
      <div
        className="font-display w-9 h-9 grid place-items-center text-hud-accent text-xs font-black flex-shrink-0 clip-hud-8 tracking-hud-body"
        style={{
          background: isYou
            ? "linear-gradient(135deg,#1e49c7 0%, #1c4cd1 60%, #d7263d 100%)"
            : "linear-gradient(135deg,#c8155a 0%, #2b0509 60%, #1a1a1a 100%)",
          border: "1px solid rgba(45,107,255,.45)",
          boxShadow: isYou
            ? "inset 0 0 10px rgba(76,195,255,.3)"
            : "inset 0 0 10px rgba(255,45,122,.3)",
        }}
      >
        {isYou ? "PL" : "OP"}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span
            className={`${hasPriority ? "gd-blink" : ""} w-[7px] h-[7px]`}
            style={{
              background: hasPriority ? turnColor : "#334155",
              boxShadow: hasPriority ? `0 0 7px ${turnGlow}` : "none",
              clipPath: CLIP_DIAMOND,
            }}
            title={hasPriority ? m["sim.seat.priority.holds"]() : m["sim.seat.priority.waiting"]()}
          />
          <span className="text-xs text-hud-text font-bold whitespace-nowrap overflow-hidden text-ellipsis tracking-hud-body">
            {player.name}
          </span>
          {/* Active-turn pill: filled when this player is on the clock,
           * outline-only "WAITING" when not. Replaces the previous
           * PILOT/HOSTILE side label which duplicated the avatar. */}
          {isTurn ? (
            <span
              className="font-mono ml-auto text-hud-2xs font-extrabold px-[7px] py-[2px] tracking-hud-label clip-hud-3"
              style={{
                color: "#ffffff",
                background: `linear-gradient(180deg, ${turnColor}, ${isYou ? "#1c4cd1" : "#c8155a"})`,
                boxShadow: `0 0 10px ${turnGlow}`,
              }}
            >
              {m["sim.player.turn.active"]()}
            </span>
          ) : (
            <span
              className="font-mono ml-auto text-hud-2xs font-bold px-[7px] py-[2px] tracking-hud-label clip-hud-3"
              style={{
                color: "#94a3b8",
                background: "transparent",
                border: "1px solid rgba(120,140,180,.4)",
              }}
            >
              {m["sim.player.turn.waiting"]()}
            </span>
          )}
        </div>
        <div className="font-mono flex items-center gap-2 mt-1 text-hud-2xs text-hud-text-dim tracking-hud-label">
          <span style={{ color: isTurn ? "#2d6bff" : "#475569" }}>
            T-
            {player.timer ? (
              <PlayerTimer snapshot={player.timer} isOwnClock={player.isOwnClock} compact />
            ) : (
              (player.clock ?? "--")
            )}
          </span>
          <span className="text-[#334155]">//</span>
          <span>
            {m["sim.seat.deck.label"]()} {player.deck ?? 0}
          </span>
          <span className="text-[#334155]">·</span>
          <span>
            {m["sim.seat.discard.label"]()} {player.discard ?? 0}
          </span>
        </div>
      </div>
    </div>
  );
}

function MatchMetaBlock({ matchInfo }: { readonly matchInfo: MatchInfo }) {
  return (
    <div className="pt-2.5 pb-3 pr-hud-sm pl-hud-md border-b border-hud-border">
      <div className="font-mono text-hud-xs font-bold text-hud-accent mb-2 flex items-center gap-1.5 tracking-hud-label">
        <span className="w-1.5 h-1.5 bg-hud-accent" style={{ clipPath: CLIP_TRIANGLE_DOWN }} />
        {m["sim.sidebar.meta.heading"]()}
      </div>
      <div className="grid gap-1">
        <MetaRow label={m["sim.sidebar.meta.turn"]()} value={`#${matchInfo.turn}`} />
        <MetaRow label={m["sim.sidebar.meta.phase"]()} value={matchInfo.phase} />
        <MetaRow label={m["sim.sidebar.meta.opsMode"]()} value={matchInfo.mode} />
        <MetaRow label={m["sim.sidebar.meta.format"]()} value={matchInfo.format} />
      </div>
    </div>
  );
}

function MetaRow({ label, value }: { readonly label: string; readonly value: string }) {
  return (
    <div className="font-mono flex justify-between items-center text-hud-md py-0.5">
      <span className="text-[#475569] text-hud-xs tracking-hud-label">{label}</span>
      <span className="text-hud-info font-bold [text-shadow:0_0_6px_rgba(76,195,255,.35)]">
        {value}
      </span>
    </div>
  );
}

function EventLog({ log }: { readonly log: readonly LogTurn[] }) {
  return (
    <div
      role="log"
      aria-label={m["sim.sidebar.log.regionLabel"]()}
      aria-live="polite"
      className="flex-1 overflow-y-auto py-2.5 pr-hud-sm pl-hud-md min-h-0"
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="font-mono text-hud-xs text-hud-accent font-bold flex items-center gap-1.5 tracking-hud-label">
          <span className="w-1.5 h-1.5 bg-hud-accent" style={{ clipPath: CLIP_TRIANGLE_DOWN }} />
          {m["sim.sidebar.log.heading"]()}
        </span>
        <span
          className="font-mono ml-auto text-hud-xs text-hud-info font-bold px-[7px] py-[2px] tracking-hud-display"
          style={{
            background: "rgba(30,73,199,.2)",
            border: "1px solid rgba(76,195,255,.3)",
          }}
        >
          {m["sim.sidebar.log.cycleCount"]({ count: log.length })}
        </span>
      </div>

      {log.map((t, i) => (
        <div key={i}>
          <div
            className="font-display text-center py-[5px] my-2.5 mb-2 text-hud-sm text-hud-accent font-extrabold tracking-hud-wide clip-hud-tag-l"
            style={{
              border: "1px solid rgba(45,107,255,.35)",
              background:
                "linear-gradient(90deg, transparent, rgba(45,107,255,.08) 50%, transparent)",
            }}
          >
            {m["sim.sidebar.log.cycleHeader"]({ turn: String(t.turn).padStart(2, "0") })}
          </div>
          {t.groups.map((g, gi) => (
            <LogGroup key={gi} who={g.who} items={g.items} />
          ))}
        </div>
      ))}
    </div>
  );
}

function LogGroup({ who, items }: LogItem) {
  const isYou = who === "YOU";
  const color = isYou ? "#4cc3ff" : "#d7263d";
  const glow = isYou ? "rgba(76,195,255,.4)" : "rgba(255,45,122,.4)";
  return (
    <div
      className="mb-2 pl-2.5"
      style={{
        borderLeft: `2px solid ${color}`,
        boxShadow: `-1px 0 6px ${glow}`,
      }}
    >
      <div
        className="font-mono text-hud-xs font-bold mb-[3px] tracking-hud-label"
        style={{ color }}
      >
        {isYou ? m["sim.sidebar.log.pilotTag"]() : m["sim.sidebar.log.hostileTag"]()}
      </div>
      {items.map((it, i) => (
        <div
          key={i}
          className="font-body text-xs text-hud-text-muted mb-[2px] font-medium leading-[1.45]"
        >
          {it}
        </div>
      ))}
    </div>
  );
}

interface FooterActionsProps {
  readonly onUndo: () => void;
  readonly canUndo: boolean;
  readonly onConcede: () => void;
  readonly playerClock: string | number | undefined;
  readonly isTurn: boolean;
}

function FooterActions({ onUndo, canUndo, onConcede, playerClock, isTurn }: FooterActionsProps) {
  return (
    <div
      className="py-2.5 pr-3 pl-4 border-t border-hud-border flex flex-col gap-2"
      style={{
        background: "linear-gradient(180deg, rgba(248,250,254,.2), rgba(248,250,254,.8))",
      }}
    >
      <div
        className="relative flex items-center justify-between py-2.5 px-hud-sm clip-hud-10"
        style={{
          background: "rgba(10,31,92,.35)",
          border: "1px solid rgba(76,195,255,.3)",
        }}
      >
        <span className="font-mono text-hud-xs text-hud-info font-bold tracking-hud-label">
          {m["sim.sidebar.footer.pilotClock"]()}
        </span>
        <span
          className="font-display text-lg font-extrabold tracking-hud-display"
          style={{
            color: isTurn ? "#2d6bff" : "#4cc3ff",
            textShadow: isTurn ? "0 0 12px rgba(45,107,255,.55)" : "0 0 6px rgba(76,195,255,.35)",
          }}
        >
          {playerClock}
        </span>
      </div>

      <div className="flex gap-1.5">
        <UndoButton onUndo={onUndo} canUndo={canUndo} className="flex-1" />
        <Button
          onClick={onConcede}
          variant="danger"
          size="md"
          className="flex-1 clip-hud-6 tracking-hud-label"
        >
          {m["sim.sidebar.footer.concede"]()}
        </Button>
      </div>

      <HintsToggle />
    </div>
  );
}

function HintsToggle() {
  const { enabled, toggle } = useHintsEnabled();
  return (
    <button
      type="button"
      title={m["sim.seat.hints.title"]()}
      onClick={toggle}
      className="font-mono px-hud-sm py-1 flex items-center justify-between gap-2 text-hud-2xs font-bold tracking-hud-label clip-hud-5"
      style={{
        color: enabled ? "#4cc3ff" : "#475569",
        background: enabled ? "rgba(76,195,255,.12)" : "rgba(248,250,254,.6)",
        border: enabled ? "1px solid rgba(76,195,255,.4)" : "1px solid rgba(255,255,255,.1)",
      }}
    >
      <span>⚡ {m["sim.seat.hints.label"]()}</span>
      <span>{enabled ? m["sim.seat.hints.on"]() : m["sim.seat.hints.off"]()}</span>
    </button>
  );
}
