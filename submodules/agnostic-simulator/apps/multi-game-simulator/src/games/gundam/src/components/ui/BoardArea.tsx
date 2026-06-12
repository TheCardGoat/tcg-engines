import { m } from "../../lib/i18n/messages.ts";
import { GameCard } from "./GameCard.tsx";
import type { GameCardData } from "./types.ts";

export interface OpponentResourceArea {
  readonly deck: number;
  readonly lore: number;
}

export interface BoardAreaProps {
  readonly opponentResourceArea: OpponentResourceArea;
  readonly opponentHand: number;
  readonly opponentPlay: readonly GameCardData[];
  readonly selfPlay: readonly GameCardData[];
  readonly selfResourceAreaCount: number;
}

export function BoardArea({
  opponentResourceArea,
  opponentHand,
  opponentPlay,
  selfPlay,
}: BoardAreaProps) {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[linear-gradient(180deg,#1e3a5f_0%,#1a3252_100%)]">
      <div className="flex items-center px-3 py-1.5 border-b border-white/5 gap-2 min-h-[68px]">
        <CardBack count={opponentResourceArea.deck} label={`${opponentResourceArea.lore}/1`} />
        <div className="flex-1 flex gap-1 justify-center">
          {Array.from({ length: opponentHand }).map((_, i) => (
            <CardBack key={i} small />
          ))}
        </div>
        <div className="flex gap-1">
          <CardBack small />
          <div className="w-6 h-9 border border-dashed border-white/15 rounded" />
        </div>
      </div>

      <div className="flex-1 px-5 py-3 flex items-center gap-2.5 border-b border-white/5 min-h-[120px]">
        <div
          className="text-hud-xs tracking-[.2em] text-white/25"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {m["sim.board.oppPlay"]()}
        </div>
        <div className="flex-1 flex gap-2 justify-center">
          {opponentPlay.map((c, i) => (
            <GameCard key={c.id ?? i} {...c} size="micro" />
          ))}
        </div>
      </div>

      <div className="px-3 py-[3px] bg-[rgba(2,6,23,.5)] border-b border-white/5">
        <span className="text-hud-sm tracking-[.1em] text-hud-text-dim font-semibold">
          {m["sim.board.lore"]()}
        </span>
      </div>

      <div className="px-3 py-[3px] bg-[rgba(2,6,23,.5)] border-b border-[rgba(34,211,238,.2)] flex items-center gap-2">
        <span className="text-hud-sm tracking-[.1em] text-white font-semibold">
          {m["sim.board.lore"]()}
        </span>
        <span className="bg-[rgba(251,191,36,.2)] text-[#fcd34d] px-1.5 py-[1px] rounded-sm text-hud-xs font-semibold tracking-[.1em]">
          {m["sim.board.turn"]()}
        </span>
      </div>

      <div className="flex-1 px-5 py-3 flex items-center gap-2.5 min-h-[120px]">
        <div
          className="text-hud-xs tracking-[.2em] text-white/25"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          {m["sim.board.youPlay"]()}
        </div>
        <div className="flex-1 flex gap-2 justify-center">
          {selfPlay.map((c, i) => (
            <GameCard key={c.id ?? i} {...c} size="micro" />
          ))}
        </div>
      </div>

      <div className="flex items-center px-3 py-1.5 border-t border-white/5 gap-2 min-h-[58px]">
        <div className="flex items-center gap-1">
          <span className="text-hud-xs text-hud-text-dim">1/1</span>
          <div className="flex gap-[2px]">
            <div className="w-[22px] h-8 border border-dashed border-white/15 rounded-sm grid place-items-center text-hud-text-faint text-xs">
              +
            </div>
            <CardBack small resourceArea />
          </div>
        </div>
        <div className="flex-1" />
        <div className="flex gap-1">
          <CardBack small resourceArea />
          <div className="w-[22px] h-8 border border-white/15 rounded-sm bg-hud-surface-raised/40" />
        </div>
      </div>
    </div>
  );
}

interface CardBackProps {
  readonly small?: boolean;
  readonly count?: number;
  readonly label?: string;
  readonly resourceArea?: boolean;
}

export function CardBack({ small, count, label, resourceArea }: CardBackProps) {
  const w = small ? 26 : 34;
  const h = small ? 38 : 50;
  return (
    <div
      className="relative flex-shrink-0 grid place-items-center rounded border border-[rgba(211,186,132,.4)] shadow-[0_2px_4px_rgba(0,0,0,.4)]"
      style={{
        width: w,
        height: h,
        background: resourceArea
          ? "linear-gradient(135deg,#5b3b8a,#2d1a4a)"
          : "linear-gradient(135deg,#3b2668,#1a0f33)",
      }}
    >
      <div
        className="rounded-full shadow-[inset_0_0_4px_rgba(0,0,0,.5)]"
        style={{
          width: w * 0.5,
          height: w * 0.5,
          background: "radial-gradient(circle,#d3ba84,#8b6f3a)",
        }}
      />
      {count != null && (
        <span className="absolute -top-[2px] -left-[2px] bg-hud-surface text-[#d3ba84] text-[8px] px-[3px] py-[1px] rounded-sm border border-[rgba(211,186,132,.3)]">
          {label}
        </span>
      )}
    </div>
  );
}
