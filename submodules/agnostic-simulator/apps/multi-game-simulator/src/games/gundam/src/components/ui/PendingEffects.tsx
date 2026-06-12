import { useState } from "react";
import type { DragEvent, MouseEvent, ReactNode } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import type { CardColor, PendingEffect } from "./types.ts";
import { GameCard } from "./GameCard.tsx";

const CARD_TINT: Record<CardColor, string> = {
  blue: "#4cc3ff",
  green: "#2ea65a",
  red: "#d7263d",
  white: "#e8ecf1",
  purple: "#c38af5",
};

const CLIP_COST = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

export interface ResolveBarProps {
  readonly effect: PendingEffect | null;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
  readonly onExpand: () => void;
  readonly expanded?: boolean;
  readonly onResolveModal?: () => void;
}

export function ResolveBar({
  effect,
  onAccept,
  onDecline,
  onExpand,
  expanded,
  onResolveModal,
}: ResolveBarProps) {
  if (!effect) return null;
  const tint = (effect.source.color && CARD_TINT[effect.source.color]) || "#2d6bff";

  const primaryLabel = (() => {
    if (effect.kind === "yes-no")
      return effect.acceptLabel || m["sim.pendingEffects.resolveBar.acceptDefault"]();
    if (
      effect.kind === "select-hand" ||
      effect.kind === "select-play" ||
      effect.kind === "select-any"
    )
      return m["sim.pendingEffects.resolveBar.confirm"]();
    if (effect.kind === "scry" || effect.kind === "deck-look")
      return m["sim.pendingEffects.resolveBar.scry"]();
    return m["sim.pendingEffects.resolveBar.confirm"]();
  })();
  const secondaryLabel = effect.declineLabel;
  const needsTarget =
    effect.kind === "select-hand" || effect.kind === "select-play" || effect.kind === "select-any";
  const opensModal = effect.kind === "scry" || effect.kind === "deck-look";
  const isChooseOne = effect.kind === "choose-one";

  if (isChooseOne) {
    return <ChooseOnePromptOverlay effect={effect} tint={tint} onExpand={onExpand} />;
  }

  return (
    <div
      className="font-body fixed left-2 right-2 bottom-[calc(var(--mobile-hand-height)+var(--safe-bottom)+8px)] z-[180] flex items-stretch overflow-hidden clip-hud-14 bg-[linear-gradient(180deg,rgba(255,255,255,.97),rgba(248,250,254,.99))] [animation:gd-fade-in_.2s_ease] md:left-1/2 md:right-auto md:bottom-40 md:-translate-x-1/2 md:max-w-[min(760px,calc(100vw-32px))]"
      style={{
        border: `1px solid ${tint}aa`,
        boxShadow: `0 0 0 1px rgba(45,107,255,.15), 0 0 40px ${tint}55, 0 12px 40px rgba(0,0,0,.6)`,
      }}
    >
      <div
        className="w-1.5 flex-shrink-0"
        style={{
          background: `linear-gradient(180deg, ${tint}, #2d6bff)`,
          boxShadow: `0 0 12px ${tint}`,
        }}
      />

      <div className="pt-2.5 pr-3 pb-2.5 pl-3.5 flex min-w-0 flex-1 items-center">
        <div className="font-display text-sm font-bold leading-snug text-hud-accent-hot tracking-hud-body [text-shadow:0_0_6px_rgba(0,0,0,.45)]">
          {effect.title}
        </div>
      </div>

      <div className="flex flex-shrink-0 items-stretch">
        {!needsTarget && !opensModal && (
          <PillBtn primary tint={tint} data-testid="pending-effect-accept" onClick={onAccept}>
            {primaryLabel}
          </PillBtn>
        )}
        {opensModal && (
          <PillBtn
            primary
            tint={tint}
            data-testid="pending-effect-open-modal"
            onClick={onResolveModal}
          >
            {primaryLabel}
          </PillBtn>
        )}
        {needsTarget && (
          <PillBtn
            primary
            tint={tint}
            data-testid="pending-effect-accept"
            onClick={onAccept}
            disabled={effect.confirmDisabled}
          >
            {primaryLabel}
          </PillBtn>
        )}
        {secondaryLabel && (
          <PillBtn tint={tint} data-testid="pending-effect-decline" onClick={onDecline}>
            {secondaryLabel}
          </PillBtn>
        )}
      </div>

      <Button
        onClick={onExpand}
        title={
          expanded
            ? m["sim.pendingEffects.resolveBar.collapseTitle"]()
            : m["sim.pendingEffects.resolveBar.expandTitle"]()
        }
        variant="ghost"
        size="icon"
        className="w-8 h-auto self-stretch text-hud-accent text-xs rounded-none"
        style={{
          background: "linear-gradient(180deg, rgba(248,250,254,.9), rgba(255,255,255,.9))",
          borderLeft: `1px solid ${tint}44`,
          clipPath: "none",
        }}
      >
        {expanded ? "▼" : "▲"}
      </Button>
    </div>
  );
}

interface ChooseOnePromptOverlayProps {
  readonly effect: PendingEffect;
  readonly tint: string;
  readonly onExpand: () => void;
}

function ChooseOnePromptOverlay({ effect, tint, onExpand }: ChooseOnePromptOverlayProps) {
  const options = effect.chooseOptions ?? [];

  return (
    <div className="font-body fixed inset-0 z-[180] pointer-events-none flex items-center justify-center px-3 py-[calc(var(--mobile-top-hud-height)+var(--safe-top)+12px)] md:py-8">
      <div
        className="pointer-events-auto w-full max-w-[min(920px,calc(100vw-28px))] text-hud-text [animation:gd-fade-in_.18s_ease]"
        role="dialog"
        aria-modal="true"
        aria-label={effect.title}
      >
        <div
          className="mx-auto mb-3 max-w-[min(640px,calc(100vw-28px))] overflow-hidden clip-hud-14 bg-[linear-gradient(180deg,rgba(255,255,255,.97),rgba(248,250,254,.99))]"
          style={{
            border: `1px solid ${tint}aa`,
            boxShadow: `0 0 0 1px rgba(45,107,255,.15), 0 0 40px ${tint}55, 0 12px 40px rgba(0,0,0,.58)`,
          }}
        >
          <div className="flex items-stretch">
            <div
              className="w-1.5 flex-shrink-0"
              style={{
                background: `linear-gradient(180deg, ${tint}, #2d6bff)`,
                boxShadow: `0 0 12px ${tint}`,
              }}
            />
            <div className="min-w-0 flex-1 px-3.5 py-2.5">
              <div
                className="font-mono text-hud-2xs font-bold tracking-hud-label"
                style={{ color: tint }}
              >
                CHOOSE ONE
              </div>
              <div className="font-display text-sm font-bold leading-snug text-hud-accent-hot tracking-hud-body [text-shadow:0_0_6px_rgba(0,0,0,.35)]">
                {effect.title}
              </div>
            </div>
            <Button
              onClick={onExpand}
              title={m["sim.pendingEffects.resolveBar.expandTitle"]()}
              variant="ghost"
              size="icon"
              className="w-8 h-auto self-stretch text-hud-accent text-xs rounded-none"
              style={{
                background: "linear-gradient(180deg, rgba(248,250,254,.9), rgba(255,255,255,.9))",
                borderLeft: `1px solid ${tint}44`,
                clipPath: "none",
              }}
            >
              ▲
            </Button>
          </div>
        </div>

        <div className="mx-auto flex max-w-[min(92vw,520px)] items-center justify-center gap-4 overflow-visible pt-5 pb-8 md:max-w-[620px] md:gap-6 md:pt-6">
          {options.map((option) => (
            <ChooseOneOptionCard key={option.index} option={option} tint={tint} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ChooseOneOptionCard({
  option,
  tint,
}: {
  readonly option: NonNullable<PendingEffect["chooseOptions"]>[number];
  readonly tint: string;
}) {
  const card = option.previewCard;
  return (
    <button
      type="button"
      data-testid={`pending-effect-choose-one-${option.index}`}
      onClick={option.onClick}
      className="group relative grid place-items-center border-0 bg-transparent p-0 outline-none focus-visible:ring-2 focus-visible:ring-hud-info focus-visible:ring-offset-1 focus-visible:ring-offset-hud-bg"
      aria-label={`Choose ${option.label}`}
    >
      <div
        className="relative grid place-items-center transition-transform duration-150 group-hover:-translate-y-1 group-focus-visible:-translate-y-1"
        aria-hidden
      >
        {card ? (
          <GameCard {...card} size="small-plus" imageFormat="full" />
        ) : (
          <GenericChoiceCard label={option.label} tint={tint} />
        )}
      </div>
    </button>
  );
}

function GenericChoiceCard({ label, tint }: { readonly label: string; readonly tint: string }) {
  return (
    <div
      className="relative grid h-[257px] w-[184px] place-items-center overflow-hidden clip-hud-8 bg-hud-deep"
      style={{
        border: `3px solid ${tint}`,
        boxShadow: `0 0 22px ${tint}66, inset 0 0 24px rgba(45,107,255,.18)`,
      }}
    >
      <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(45,107,255,.34),rgba(255,255,255,.06)_42%,rgba(45,107,255,.2))]" />
      <div className="relative px-3 text-center font-display text-hud-lg font-black leading-tight text-hud-accent-hot tracking-hud-body">
        {label}
      </div>
    </div>
  );
}

interface PillBtnProps {
  readonly children: ReactNode;
  readonly primary?: boolean;
  readonly tint: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
  readonly "data-testid"?: string;
}

function PillBtn({
  children,
  primary,
  tint,
  onClick,
  disabled,
  "data-testid": testId,
}: PillBtnProps) {
  const bg = primary
    ? `linear-gradient(180deg, #2d6bff, #1c4cd1)`
    : `linear-gradient(180deg, ${tint}22, rgba(248,250,254,.9))`;
  const color = primary ? "#ffffff" : "#1a2542";
  const borderColor = primary ? "#5a8dff" : `${tint}77`;
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      data-testid={testId}
      variant="outline"
      className="px-hud-md tracking-hud-body rounded-none clip-none"
      style={{
        background: bg,
        color,
        borderLeft: `1px solid ${borderColor}`,
        borderRight: `1px solid ${borderColor}`,
        borderTop: "none",
        borderBottom: "none",
        clipPath: "none",
      }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.12)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {children}
    </Button>
  );
}

export interface PendingEffectsPanelProps {
  readonly effects: readonly PendingEffect[];
  readonly activeId: string;
  readonly onAccept: (id: string) => void;
  readonly onDecline: (id: string) => void;
  readonly onSelectEffect: (id: string) => void;
  readonly onMinimize: () => void;
  readonly onOpenResolveModal?: (id: string) => void;
  readonly onReorder?: (fromIdx: number, toIdx: number) => void;
}

export function PendingEffectsPanel({
  effects,
  activeId,
  onAccept,
  onDecline,
  onSelectEffect,
  onMinimize,
  onOpenResolveModal,
  onReorder,
}: PendingEffectsPanelProps) {
  const [dragIdx, setDragIdx] = useState<number | null>(null);
  const [overIdx, setOverIdx] = useState<number | null>(null);

  if (!effects || effects.length === 0) return null;

  function commitDrop(toIdx: number | null) {
    if (dragIdx == null || toIdx == null || dragIdx === toIdx) {
      setDragIdx(null);
      setOverIdx(null);
      return;
    }
    onReorder?.(dragIdx, toIdx);
    setDragIdx(null);
    setOverIdx(null);
  }

  return (
    <div className="font-body fixed z-[175] text-hud-text clip-hud-14 bg-[linear-gradient(180deg,rgba(255,255,255,.97),rgba(248,250,254,.99))] border border-hud-accent/55 [box-shadow:0_0_0_1px_rgba(76,195,255,.12),0_0_30px_rgba(45,107,255,.2),0_8px_30px_rgba(0,0,0,.5)] [animation:gd-fade-in_.18s_ease] left-2 right-2 top-[calc(var(--mobile-top-hud-height)+var(--safe-top)+8px)] md:left-auto md:right-3.5 md:top-16 md:w-[336px]">
      <div className="pt-2.5 pr-3 pb-2.5 pl-3.5 border-b border-hud-border-hot flex items-center gap-2 bg-[linear-gradient(90deg,rgba(45,107,255,.18),transparent)]">
        <div className="flex-1 min-w-0">
          <div className="font-mono text-hud-2xs text-hud-accent font-bold tracking-hud-label">
            {m["sim.pendingEffects.panel.heading"]()}
          </div>
          <div className="font-display text-hud-lg font-bold text-hud-accent-hot uppercase mt-px tracking-hud-body">
            {m["sim.pendingEffects.panel.subheading"]()}
          </div>
        </div>
        <span className="font-mono px-[7px] py-[1px] text-hud-sm font-extrabold text-hud-accent tracking-hud-display border border-hud-accent bg-hud-accent/10">
          {String(effects.length).padStart(2, "0")}
        </span>
        <Button
          onClick={onMinimize}
          title={m["sim.pendingEffects.panel.minimizeTitle"]()}
          variant="outline"
          size="icon"
          className="w-[22px] h-[22px] text-hud-accent text-hud-sm clip-hud-4 bg-[linear-gradient(180deg,#fbfcfe,#f4f6fa)] border border-hud-accent/50"
        >
          ▁
        </Button>
      </div>

      <div
        className="overflow-y-auto max-h-[calc(100vh-200px)]"
        onDragOver={(e: DragEvent<HTMLDivElement>) => {
          if (dragIdx != null) e.preventDefault();
        }}
        onDrop={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (overIdx != null) commitDrop(overIdx);
        }}
      >
        {effects.map((ef, i) => (
          <EffectRow
            key={ef.id}
            effect={ef}
            active={ef.id === activeId}
            queued={i > 0}
            index={i}
            onAccept={() => onAccept(ef.id)}
            onDecline={() => onDecline(ef.id)}
            onOpenResolveModal={() => onOpenResolveModal?.(ef.id)}
            onFocus={() => onSelectEffect(ef.id)}
            dragging={dragIdx === i}
            dragOver={overIdx === i && dragIdx !== i}
            dropBefore={overIdx === i && dragIdx != null && dragIdx > i}
            dropAfter={overIdx === i && dragIdx != null && dragIdx < i}
            onDragStart={(e: DragEvent<HTMLDivElement>) => {
              setDragIdx(i);
              try {
                e.dataTransfer.effectAllowed = "move";
                e.dataTransfer.setData("text/plain", String(i));
              } catch {
                /* ignore */
              }
            }}
            onDragOverRow={(e: DragEvent<HTMLDivElement>) => {
              if (dragIdx == null) return;
              e.preventDefault();
              if (overIdx !== i) setOverIdx(i);
            }}
            onDropRow={(e: DragEvent<HTMLDivElement>) => {
              e.preventDefault();
              e.stopPropagation();
              commitDrop(i);
            }}
            onDragEnd={() => {
              setDragIdx(null);
              setOverIdx(null);
            }}
          />
        ))}
      </div>
    </div>
  );
}

interface EffectRowProps {
  readonly effect: PendingEffect;
  readonly active: boolean;
  readonly queued: boolean;
  readonly index: number;
  readonly onAccept: () => void;
  readonly onDecline: () => void;
  readonly onFocus: () => void;
  readonly onOpenResolveModal: () => void;
  readonly dragging: boolean;
  readonly dragOver: boolean;
  readonly dropBefore: boolean;
  readonly dropAfter: boolean;
  readonly onDragStart: (e: DragEvent<HTMLDivElement>) => void;
  readonly onDragOverRow: (e: DragEvent<HTMLDivElement>) => void;
  readonly onDropRow: (e: DragEvent<HTMLDivElement>) => void;
  readonly onDragEnd: () => void;
}

function EffectRow({
  effect,
  active,
  queued,
  index,
  onAccept,
  onDecline,
  onFocus,
  onOpenResolveModal,
  dragging,
  dragOver,
  dropBefore,
  dropAfter,
  onDragStart,
  onDragOverRow,
  onDropRow,
  onDragEnd,
}: EffectRowProps) {
  const tint = (effect.source.color && CARD_TINT[effect.source.color]) || "#2d6bff";
  const color = effect.source.color || "white";

  const baseOpacity = queued ? 0.45 : 1;

  return (
    <div
      onClick={queued ? undefined : onFocus}
      onDragOver={onDragOverRow}
      onDrop={onDropRow}
      aria-disabled={queued || undefined}
      className="relative border-b border-hud-border pt-2.5 pr-3 pb-2.5 pl-[26px] transition-[opacity,background] duration-[120ms]"
      style={{
        background: active
          ? `linear-gradient(90deg, ${tint}22, transparent)`
          : dragOver
            ? "rgba(45,107,255,.06)"
            : "transparent",
        opacity: dragging ? 0.35 : baseOpacity,
        filter: queued ? "saturate(.55)" : "none",
        cursor: queued ? "not-allowed" : active ? "default" : "pointer",
      }}
    >
      {active && (
        <div
          className="absolute left-0 top-1.5 bottom-1.5 w-[3px]"
          style={{
            background: `linear-gradient(180deg, ${tint}, #2d6bff)`,
            boxShadow: `0 0 6px ${tint}`,
          }}
        />
      )}

      {dropBefore && (
        <div className="absolute left-2 right-2 h-0.5 -top-px bg-[linear-gradient(90deg,transparent,#2d6bff,transparent)] [box-shadow:0_0_6px_#2d6bff]" />
      )}
      {dropAfter && (
        <div className="absolute left-2 right-2 h-0.5 -bottom-px bg-[linear-gradient(90deg,transparent,#2d6bff,transparent)] [box-shadow:0_0_6px_#2d6bff]" />
      )}

      <div
        draggable
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onClick={(e) => e.stopPropagation()}
        title={m["sim.pendingEffects.row.dragTitle"]()}
        className="font-mono absolute left-2 top-1/2 -translate-y-1/2 w-[14px] h-7 grid place-content-center select-none font-extrabold text-hud-sm leading-none tracking-[-0.05em] text-[rgba(45,107,255,.65)]"
        style={{ cursor: dragging ? "grabbing" : "grab" }}
      >
        <span className="opacity-90">⋮⋮</span>
      </div>

      <div className="flex gap-2.5 items-start">
        <MiniCard card={effect.source} tint={tint} />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span
              className="font-mono text-hud-2xs font-bold tracking-hud-label"
              style={{ color: tint }}
            >
              {String(index + 1).padStart(2, "0")} · {color.toUpperCase()}
            </span>
            {active && (
              <span className="font-mono text-hud-2xs font-extrabold bg-hud-accent text-[#ffffff] px-[5px] tracking-hud-label">
                {m["sim.pendingEffects.row.active"]()}
              </span>
            )}
          </div>
          <div className="font-display text-hud-lg font-bold text-hud-accent-hot tracking-hud-body leading-[1.15]">
            {effect.source.name}
          </div>
          <div className="text-hud-md text-hud-text-muted mt-[3px] leading-[1.35]">
            <strong className="tracking-hud-body" style={{ color: tint }}>
              {effect.title.toUpperCase()}
              {effect.code ? ` [${effect.code}]` : ""}
            </strong>
            {" — "}
            {effect.description}
          </div>
        </div>
      </div>

      {active && (
        <div className="mt-2 flex gap-[5px]">
          {effect.kind === "yes-no" ? (
            <>
              <StackBtn primary onClick={onAccept} tint={tint}>
                {effect.acceptLabel || m["sim.pendingEffects.row.accept"]()}
              </StackBtn>
              <StackBtn onClick={onDecline} tint={tint}>
                {effect.declineLabel || m["sim.pendingEffects.row.reject"]()}
              </StackBtn>
            </>
          ) : effect.kind === "scry" ? (
            <>
              <StackBtn primary onClick={onOpenResolveModal} tint={tint}>
                {m["sim.pendingEffects.row.resolveScry"]()}
              </StackBtn>
              <StackBtn onClick={onDecline} tint={tint}>
                {m["sim.pendingEffects.row.skip"]()}
              </StackBtn>
            </>
          ) : (
            <>
              <StackBtn disabled primary tint={tint}>
                {effect.kind === "select-hand" && m["sim.pendingEffects.row.pickFromHand"]()}
                {effect.kind === "select-play" && m["sim.pendingEffects.row.pickOnBoard"]()}
                {effect.kind === "select-any" && m["sim.pendingEffects.row.pickTarget"]()}
              </StackBtn>
              <StackBtn onClick={onDecline} tint={tint}>
                {m["sim.pendingEffects.row.cancel"]()}
              </StackBtn>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface StackBtnProps {
  readonly children: ReactNode;
  readonly primary?: boolean;
  readonly tint: string;
  readonly onClick?: () => void;
  readonly disabled?: boolean;
}

function StackBtn({ children, primary, tint, onClick, disabled }: StackBtnProps) {
  const bg = primary
    ? `linear-gradient(180deg, #2d6bff, #1c4cd1)`
    : `linear-gradient(180deg, rgba(255,255,255,.9), rgba(248,250,254,.95))`;
  const color = primary ? "#ffffff" : "#1a2542";
  const border = primary ? "1px solid #5a8dff" : `1px solid ${tint}99`;
  return (
    <Button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      variant="outline"
      size="sm"
      className="flex-1 h-auto px-2.5 py-1.5 text-hud-sm clip-hud-5"
      style={{ background: bg, color, border }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.15)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {children}
    </Button>
  );
}

function MiniCard({
  card,
  tint,
}: {
  readonly card: PendingEffect["source"];
  readonly tint: string;
}) {
  return (
    <div
      className="w-11 h-14 flex-shrink-0 relative overflow-hidden clip-hud-5"
      style={{
        background: `linear-gradient(160deg, ${tint}55, #f4f6fa 70%)`,
        border: `1px solid ${tint}aa`,
        boxShadow: `inset 0 0 10px rgba(0,0,0,.6), 0 0 6px ${tint}55`,
      }}
    >
      <div
        className="font-display absolute top-0.5 left-0.5 w-[14px] h-[14px] grid place-items-center text-hud-2xs font-black text-[#ffffff]"
        style={{
          background: "linear-gradient(135deg, #2d6bff, #1c4cd1)",
          border: "1px solid #5a8dff",
          clipPath: CLIP_COST,
        }}
      >
        {card?.cost ?? "?"}
      </div>

      <div
        className="absolute left-0 right-0 bottom-0 pt-1.5 pr-[3px] pl-[3px] pb-[2px]"
        style={{
          background: "linear-gradient(180deg, transparent, rgba(0,0,0,.9))",
        }}
      >
        <div className="font-display text-hud-2xs text-hud-accent-hot font-extrabold text-center whitespace-nowrap overflow-hidden text-ellipsis tracking-hud-body">
          {(card?.name || "?").slice(0, 9)}
        </div>
      </div>
    </div>
  );
}

export interface EffectsChipProps {
  readonly count: number;
  readonly onExpand: () => void;
}

export function EffectsChip({ count, onExpand }: EffectsChipProps) {
  if (!count) return null;
  return (
    <Button
      onClick={onExpand}
      variant="outline"
      className="fixed bottom-[18px] right-3.5 z-[170] h-auto pt-[7px] pr-[14px] pb-[7px] pl-3 text-hud-accent-hot clip-hud-8 bg-[linear-gradient(180deg,rgba(255,255,255,.97),rgba(248,250,254,.99))] border border-hud-accent/65 [box-shadow:0_0_14px_rgba(45,107,255,.3),0_4px_14px_rgba(0,0,0,.5)] [animation:gd-fade-in_.15s_ease]"
    >
      <div className="flex flex-col items-start leading-[1.05]">
        <span className="font-mono text-hud-2xs text-hud-accent font-bold tracking-hud-label">
          {m["sim.pendingEffects.chip.effects"]()}
        </span>
        <span className="font-mono text-hud-xs text-hud-text-dim font-bold tracking-hud-label">
          {m["sim.pendingEffects.chip.pending"]()}
        </span>
      </div>
      <span
        className="min-w-[22px] h-[22px] grid place-items-center text-hud-md font-black text-[#ffffff]"
        style={{
          background: "linear-gradient(180deg, #2d6bff, #1c4cd1)",
          border: "1px solid #5a8dff",
          clipPath: CLIP_COST,
        }}
      >
        {count}
      </span>
      <span className="text-hud-accent text-hud-sm font-extrabold">▲</span>
    </Button>
  );
}

export interface TargetPromptOverlayProps {
  readonly effect: PendingEffect | null;
  readonly onCancel: () => void;
}

export function TargetPromptOverlay({ effect, onCancel }: TargetPromptOverlayProps) {
  if (
    !effect ||
    effect.kind === "yes-no" ||
    effect.kind === "scry" ||
    effect.kind === "deck-look" ||
    effect.kind === "choose-one"
  )
    return null;
  const tint = (effect.source.color && CARD_TINT[effect.source.color]) || "#2d6bff";

  const zoneLabel =
    {
      "select-hand": m["sim.pendingEffects.targetPrompt.zoneHand"](),
      "select-play": m["sim.pendingEffects.targetPrompt.zonePlay"](),
      "select-any": m["sim.pendingEffects.targetPrompt.zoneAny"](),
      confirm: m["sim.pendingEffects.targetPrompt.zoneTarget"](),
    }[effect.kind] || m["sim.pendingEffects.targetPrompt.zoneTarget"]();

  return (
    <div
      className="font-display fixed left-1/2 top-[68px] -translate-x-1/2 z-[165] text-hud-text flex items-center gap-3 px-3.5 py-1.5 clip-hud-8 bg-[linear-gradient(180deg,rgba(255,255,255,.95),rgba(248,250,254,.98))] [animation:gd-fade-in_.15s_ease]"
      style={{
        border: `1px solid ${tint}`,
        boxShadow: `0 0 20px ${tint}55`,
      }}
    >
      <span className="font-mono text-hud-xs font-bold tracking-hud-label" style={{ color: tint }}>
        {m["sim.pendingEffects.targetPrompt.selectTarget"]()}
      </span>
      <span className="text-hud-md font-bold text-hud-accent-hot tracking-hud-body">
        {zoneLabel}
      </span>
      <span className="font-mono text-hud-2xs text-hud-text-dim tracking-hud-label">
        {effect.source.name.toUpperCase()} · {effect.title.toUpperCase()}
      </span>
      <Button
        onClick={onCancel}
        variant="ghost"
        size="sm"
        className="font-mono text-hud-text-muted text-hud-xs px-2 py-0.5 h-auto bg-transparent tracking-hud-label clip-none rounded-none"
        style={{ border: `1px solid ${tint}77`, clipPath: "none" }}
      >
        {m["sim.pendingEffects.targetPrompt.escape"]()}
      </Button>
    </div>
  );
}
