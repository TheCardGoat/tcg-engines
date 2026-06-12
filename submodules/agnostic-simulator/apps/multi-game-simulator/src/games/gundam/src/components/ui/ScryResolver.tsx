import { useEffect, useMemo, useState } from "react";
import type { MouseEvent, ReactNode } from "react";

import { m } from "../../lib/i18n/messages.ts";
import { Button } from "../primitives/index.ts";
import type { CardColor, GameCardData, PendingEffect, ScryConfirmResult } from "./types.ts";

const SCRY_TINT: Record<CardColor, string> = {
  blue: "#4cc3ff",
  green: "#2ea65a",
  red: "#d7263d",
  white: "#e8ecf1",
  purple: "#c38af5",
};

const CLIP_COST = "polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)";

interface ScryCard extends GameCardData {
  readonly _uid: string;
}

export interface ScryResolverProps {
  readonly effect: PendingEffect | null;
  readonly onConfirm: (result: ScryConfirmResult) => void;
  readonly onCancel: () => void;
}

export function ScryResolver({ effect, onConfirm, onCancel }: ScryResolverProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel?.();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const tint = (effect?.source.color && SCRY_TINT[effect.source.color]) || "#4cc3ff";
  const handLimit = effect?.handLimit ?? 1;

  const initialRevealed = useMemo<ScryCard[]>(
    () => (effect?.revealed || []).map((c, i) => ({ ...c, _uid: c.id ?? `r-${i}` })),
    [effect?.id, effect?.revealed],
  );

  const [toHand, setToHand] = useState<ScryCard[]>([]);
  const [toBottom, setToBottom] = useState<ScryCard[]>([]);
  const [revealed, setRevealed] = useState<ScryCard[]>(initialRevealed);

  function moveToHand(card: ScryCard) {
    if (toHand.length >= handLimit) return;
    setRevealed((r) => r.filter((c) => c._uid !== card._uid));
    setToBottom((r) => r.filter((c) => c._uid !== card._uid));
    setToHand((r) => [...r, card]);
  }
  function moveToBottom(card: ScryCard) {
    setRevealed((r) => r.filter((c) => c._uid !== card._uid));
    setToHand((r) => r.filter((c) => c._uid !== card._uid));
    setToBottom((r) => [...r, card]);
  }
  function moveBackToRevealed(card: ScryCard) {
    setToHand((r) => r.filter((c) => c._uid !== card._uid));
    setToBottom((r) => r.filter((c) => c._uid !== card._uid));
    setRevealed((r) => [...r, card]);
  }
  function shiftBottom(uid: string, dir: 1 | -1) {
    setToBottom((list) => {
      const i = list.findIndex((c) => c._uid === uid);
      if (i < 0) return list;
      const j = i + dir;
      if (j < 0 || j >= list.length) return list;
      const next = [...list];
      [next[i], next[j]] = [next[j]!, next[i]!];
      return next;
    });
  }

  function confirm() {
    const finalBottom = [...toBottom, ...revealed];
    onConfirm?.({ toHand, toBottom: finalBottom });
  }

  if (!effect) return null;

  return (
    <div
      className="font-body fixed inset-0 z-[210] flex items-center justify-center backdrop-blur-[3px]"
      style={{
        background:
          "radial-gradient(ellipse at center, rgba(30,73,199,.22), rgba(26,37,66,.82) 70%)",
        animation: "gd-fade-in .2s ease",
      }}
    >
      <div
        className="w-full max-w-[640px] max-h-[90dvh] mx-2 md:mx-0 text-hud-text flex flex-col relative clip-hud-18 bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,250,254,.99))]"
        style={{
          border: `1px solid ${tint}`,
          boxShadow: `0 0 0 1px rgba(45,107,255,.18), 0 0 60px ${tint}55, inset 0 0 40px rgba(45,107,255,.04)`,
        }}
      >
        <div className="scanline absolute inset-0 opacity-30 mix-blend-multiply" />

        <ScryHeader effect={effect} tint={tint} onClose={onCancel} />

        <div className="pt-3.5 px-hud-md pb-3.5 overflow-y-auto flex flex-col gap-3.5">
          <HandZone cards={toHand} limit={handLimit} onRemove={moveBackToRevealed} />
          <BottomDeckZone cards={toBottom} onRemove={moveBackToRevealed} onShift={shiftBottom} />
          <RevealedZone
            cards={revealed}
            handFull={toHand.length >= handLimit}
            onToHand={moveToHand}
            onToBottom={moveToBottom}
          />
        </div>

        <ScryFooter
          tint={tint}
          revealedCount={revealed.length}
          handCount={toHand.length}
          handLimit={handLimit}
          bottomCount={toBottom.length}
          onCancel={onCancel}
          onConfirm={confirm}
        />
      </div>
    </div>
  );
}

interface ScryHeaderProps {
  readonly effect: PendingEffect;
  readonly tint: string;
  readonly onClose: () => void;
}

function ScryHeader({ effect, tint, onClose }: ScryHeaderProps) {
  return (
    <div
      className="pt-3 pr-4 pb-3 pl-hud-md flex items-center gap-3 relative"
      style={{
        background: `linear-gradient(135deg, ${tint}33 0%, ${tint}11 45%, transparent 100%)`,
        borderBottom: `1px solid ${tint}55`,
      }}
    >
      <div
        className="font-display w-10 h-10 grid place-items-center text-white font-black text-[17px]"
        style={{
          background: `linear-gradient(135deg, #fbfcfe, ${tint} 60%, #2d6bff)`,
          border: `1.5px solid #2d6bff`,
          clipPath: CLIP_COST,
          boxShadow: `0 0 10px ${tint}88`,
        }}
      >
        {effect.source.cost ?? "?"}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-mono text-hud-xs font-bold tracking-hud-label" style={{ color: tint }}>
          {m["sim.scry.header.protocol"]()}
        </div>
        <div className="font-display text-lg font-extrabold text-hud-accent-hot uppercase whitespace-nowrap overflow-hidden text-ellipsis mt-px tracking-hud-display [text-shadow:0_0_8px_rgba(45,107,255,.3)]">
          {effect.source.name}
        </div>
        <div className="font-mono text-hud-sm text-hud-text-dim mt-0.5 tracking-hud-body">
          {(effect.title || "").toUpperCase()}
          {effect.code ? ` [${effect.code}]` : ""}
        </div>
      </div>

      <Button
        onClick={onClose}
        title={m["sim.scry.header.cancelTitle"]()}
        variant="outline"
        size="icon"
        className="font-mono w-[26px] h-[26px] text-hud-accent text-xs clip-hud-5"
        style={{
          background: "linear-gradient(180deg, #fbfcfe, #f4f6fa)",
          border: "1px solid rgba(45,107,255,.55)",
        }}
      >
        ✕
      </Button>
    </div>
  );
}

function HandZone({
  cards,
  limit,
  onRemove,
}: {
  readonly cards: readonly ScryCard[];
  readonly limit: number;
  readonly onRemove: (card: ScryCard) => void;
}) {
  return (
    <Zone
      label={m["sim.scry.hand.label"]()}
      tint="#4cc3ff"
      subtitle={m["sim.scry.hand.subtitle"]({ limit: String(limit).padStart(2, "0") })}
      count={`${cards.length}/${limit}`}
      empty={cards.length === 0}
      emptyText={m["sim.scry.hand.empty"]()}
    >
      <div className="flex gap-2 flex-wrap">
        {cards.map((c) => (
          <ZoneCard
            key={c._uid}
            card={c}
            tint="#4cc3ff"
            actions={[
              {
                label: "×",
                title: m["sim.scry.hand.returnAction"](),
                onClick: () => onRemove(c),
              },
            ]}
          />
        ))}
      </div>
    </Zone>
  );
}

function BottomDeckZone({
  cards,
  onRemove,
  onShift,
}: {
  readonly cards: readonly ScryCard[];
  readonly onRemove: (card: ScryCard) => void;
  readonly onShift: (uid: string, dir: 1 | -1) => void;
}) {
  return (
    <Zone
      label={m["sim.scry.bottom.label"]()}
      tint="#c38af5"
      subtitle={m["sim.scry.bottom.subtitle"]()}
      count={`${String(cards.length).padStart(2, "0")}`}
      empty={cards.length === 0}
      emptyText={m["sim.scry.bottom.empty"]()}
      legendTop={m["sim.scry.bottom.legendTop"]()}
      legendBottom={m["sim.scry.bottom.legendBottom"]()}
    >
      <div className="flex gap-2.5 flex-wrap items-start">
        {cards.map((c, i) => (
          <div key={c._uid} className="flex flex-col items-center gap-1">
            <div className="flex gap-0.5">
              <ArrowBtn dir="left" disabled={i === 0} onClick={() => onShift(c._uid, -1)} />
              <ArrowBtn
                dir="right"
                disabled={i === cards.length - 1}
                onClick={() => onShift(c._uid, 1)}
              />
            </div>
            <ZoneCard
              card={c}
              tint="#c38af5"
              position={i + 1}
              actions={[
                {
                  label: "×",
                  title: m["sim.scry.hand.returnAction"](),
                  onClick: () => onRemove(c),
                },
              ]}
            />
          </div>
        ))}
      </div>
    </Zone>
  );
}

function ArrowBtn({
  dir,
  disabled,
  onClick,
}: {
  readonly dir: "left" | "right";
  readonly disabled?: boolean;
  readonly onClick: () => void;
}) {
  const glyph = dir === "left" ? "‹" : "›";
  return (
    <Button
      disabled={disabled}
      onClick={onClick}
      variant="outline"
      size="icon"
      className="font-mono w-[22px] h-[22px] p-0 text-sm font-black leading-none clip-hud-4"
      style={{
        background: disabled
          ? "linear-gradient(180deg, rgba(40,50,65,.5), rgba(15,20,30,.5))"
          : "linear-gradient(180deg, rgba(195,138,245,.25), rgba(248,250,254,.7))",
        border: `1px solid ${disabled ? "rgba(148,163,184,.3)" : "rgba(195,138,245,.75)"}`,
        color: disabled ? "#475569" : "#5a8dff",
      }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.2)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {glyph}
    </Button>
  );
}

function RevealedZone({
  cards,
  handFull,
  onToHand,
  onToBottom,
}: {
  readonly cards: readonly ScryCard[];
  readonly handFull: boolean;
  readonly onToHand: (card: ScryCard) => void;
  readonly onToBottom: (card: ScryCard) => void;
}) {
  return (
    <Zone
      label={m["sim.scry.revealed.label"]()}
      tint="#2d6bff"
      subtitle={m["sim.scry.revealed.subtitle"]()}
      count={`${String(cards.length).padStart(2, "0")}`}
      empty={cards.length === 0}
      emptyText={m["sim.scry.revealed.empty"]()}
    >
      <div className="flex gap-2 flex-wrap">
        {cards.map((c) => (
          <ZoneCard
            key={c._uid}
            card={c}
            tint="#2d6bff"
            actions={[
              {
                label: m["sim.scry.revealed.toHand"](),
                title: handFull
                  ? m["sim.scry.revealed.toHandFullTitle"]()
                  : m["sim.scry.revealed.toHandTitle"](),
                primary: true,
                disabled: handFull,
                onClick: () => onToHand(c),
              },
              {
                label: m["sim.scry.revealed.toBottom"](),
                title: m["sim.scry.revealed.toBottomTitle"](),
                onClick: () => onToBottom(c),
              },
            ]}
            big
          />
        ))}
      </div>
    </Zone>
  );
}

interface ZoneProps {
  readonly label: string;
  readonly tint: string;
  readonly subtitle: string;
  readonly count: string;
  readonly children: ReactNode;
  readonly empty: boolean;
  readonly emptyText: string;
  readonly legendTop?: string;
  readonly legendBottom?: string;
}

function Zone({
  label,
  tint,
  subtitle,
  count,
  children,
  empty,
  emptyText,
  legendTop,
  legendBottom,
}: ZoneProps) {
  return (
    <div
      className="py-2.5 px-3 clip-hud-10"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,.6), rgba(248,250,254,.7))",
        border: `1px solid ${tint}55`,
      }}
    >
      <div
        className="flex items-center gap-2 pb-[5px] mb-2"
        style={{ borderBottom: `1px solid ${tint}44` }}
      >
        <span className="w-1 h-2.5" style={{ background: tint, boxShadow: `0 0 6px ${tint}` }} />
        <span className="font-display text-hud-md text-hud-text font-extrabold tracking-hud-label">
          {label}
        </span>
        <span
          className="font-mono text-hud-xs font-bold tracking-hud-label"
          style={{ color: tint }}
        >
          · {subtitle}
        </span>
        <div
          className="flex-1 h-px"
          style={{ background: `linear-gradient(90deg, ${tint}55, transparent)` }}
        />
        <span
          className="font-mono text-hud-xs font-extrabold px-[7px] py-[1px] bg-[rgba(248,250,254,.6)] tracking-hud-display"
          style={{
            border: `1px solid ${tint}`,
            color: tint,
          }}
        >
          {count}
        </span>
      </div>

      {legendTop && !empty && (
        <div className="font-mono text-hud-2xs text-hud-text-dim font-bold mb-1 tracking-hud-label">
          {legendTop}
        </div>
      )}

      {empty ? (
        <div
          className="font-mono py-3.5 px-3 text-hud-text-faint text-hud-sm font-bold text-center tracking-hud-label clip-hud-6"
          style={{ border: `1px dashed ${tint}55` }}
        >
          {emptyText}
        </div>
      ) : (
        children
      )}

      {legendBottom && !empty && (
        <div className="font-mono text-hud-2xs text-hud-text-dim font-bold mt-1 text-right tracking-hud-label">
          {legendBottom}
        </div>
      )}
    </div>
  );
}

interface CardAction {
  readonly label: string;
  readonly title: string;
  readonly onClick: () => void;
  readonly primary?: boolean;
  readonly disabled?: boolean;
}

interface ZoneCardProps {
  readonly card: ScryCard;
  readonly tint: string;
  readonly actions?: readonly CardAction[];
  readonly position?: number;
  readonly big?: boolean;
}

function ZoneCard({ card, tint, actions = [], position, big }: ZoneCardProps) {
  const w = big ? 82 : 66;
  const h = big ? 112 : 90;
  return (
    <div className="flex flex-col gap-1 items-stretch">
      <div
        className="flex-shrink-0 relative overflow-hidden clip-hud-6"
        style={{
          width: w,
          height: h,
          background: `linear-gradient(160deg, ${tint}55, #f4f6fa 70%)`,
          border: `1px solid ${tint}aa`,
          boxShadow: `inset 0 0 10px rgba(0,0,0,.6), 0 0 8px ${tint}55`,
        }}
      >
        <div
          className="font-display absolute top-[3px] left-[3px] w-4 h-4 grid place-items-center text-[#ffffff] font-black text-hud-xs bg-[linear-gradient(135deg,#2d6bff,#1c4cd1)] border border-[#5a8dff]"
          style={{ clipPath: CLIP_COST }}
        >
          {card.cost ?? "?"}
        </div>

        {position != null && (
          <div
            className="font-mono absolute top-[3px] right-[3px] min-w-4 h-4 px-[3px] grid place-items-center font-extrabold text-hud-xs tracking-hud-body bg-black/70"
            style={{
              border: `1px solid ${tint}`,
              color: tint,
            }}
          >
            {String(position).padStart(2, "0")}
          </div>
        )}

        {card.ap != null && (
          <div className="font-display absolute bottom-5 left-0.5 right-0.5 gap-0.5 flex justify-between font-black text-[8px]">
            <span className="px-[3px] py-px text-white bg-[rgba(255,45,122,.8)]">{card.ap}</span>
            <span className="px-[3px] py-px text-white bg-[rgba(76,195,255,.8)]">{card.hp}</span>
          </div>
        )}

        <div
          className="absolute left-0 right-0 bottom-0 pt-[7px] pr-[3px] pb-[2px] pl-[3px]"
          style={{
            background: "linear-gradient(180deg, transparent, rgba(0,0,0,.92))",
          }}
        >
          <div
            className="font-display text-hud-accent-hot font-extrabold text-center whitespace-nowrap overflow-hidden text-ellipsis tracking-hud-body"
            style={{ fontSize: big ? 8 : 7 }}
          >
            {card.name || "?"}
          </div>
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex gap-[3px]" style={{ width: w }}>
          {actions.map((a, i) => (
            <ActionBtn key={i} {...a} tint={tint} />
          ))}
        </div>
      )}
    </div>
  );
}

interface ActionBtnProps extends CardAction {
  readonly tint: string;
}

function ActionBtn({ label, title, onClick, disabled, primary, tint }: ActionBtnProps) {
  const bg = primary
    ? "linear-gradient(180deg, #2d6bff, #1c4cd1)"
    : `linear-gradient(180deg, ${tint}22, rgba(248,250,254,.9))`;
  const color = primary ? "#ffffff" : "#1a2542";
  const border = primary ? "1px solid #5a8dff" : `1px solid ${tint}77`;
  return (
    <Button
      title={title}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      variant="outline"
      size="sm"
      className="flex-1 h-auto py-[3px] px-[2px] text-hud-2xs tracking-hud-body clip-hud-3 leading-none"
      style={{ background: bg, color, border }}
      onMouseEnter={(e: MouseEvent<HTMLButtonElement>) => {
        if (!disabled) e.currentTarget.style.filter = "brightness(1.15)";
      }}
      onMouseLeave={(e: MouseEvent<HTMLButtonElement>) => {
        e.currentTarget.style.filter = "none";
      }}
    >
      {label}
    </Button>
  );
}

interface ScryFooterProps {
  readonly tint: string;
  readonly revealedCount: number;
  readonly handCount: number;
  readonly handLimit: number;
  readonly bottomCount: number;
  readonly onCancel: () => void;
  readonly onConfirm: () => void;
}

function ScryFooter({
  tint,
  revealedCount,
  handCount,
  handLimit,
  bottomCount,
  onCancel,
  onConfirm,
}: ScryFooterProps) {
  return (
    <div
      className="py-2.5 px-4 flex items-center gap-2.5"
      style={{
        background: "linear-gradient(0deg, rgba(45,107,255,.06), transparent)",
        borderTop: `1px solid ${tint}44`,
      }}
    >
      <div className="flex gap-3.5 flex-1 flex-wrap">
        <Stat
          label={m["sim.scry.footer.hand"]()}
          value={m["sim.scry.footer.handValue"]({ count: handCount, limit: handLimit })}
          color="#4cc3ff"
        />
        <Stat label={m["sim.scry.footer.toBottom"]()} value={bottomCount} color="#c38af5" />
        <Stat
          label={m["sim.scry.footer.unsorted"]()}
          value={revealedCount}
          color={revealedCount ? "#2d6bff" : "#36ff8a"}
        />
      </div>
      {revealedCount > 0 && (
        <span className="font-mono text-hud-xs text-hud-text-dim font-bold tracking-hud-label">
          {m["sim.scry.footer.unsortedHint"]()}
        </span>
      )}
      <Button onClick={onCancel} variant="outline" size="md" className="clip-hud-5">
        {m["sim.scry.footer.cancel"]()}
      </Button>
      <Button onClick={onConfirm} variant="primary" size="md" className="clip-hud-5 glow-accent">
        {m["sim.scry.footer.confirm"]()}
      </Button>
    </div>
  );
}

function Stat({
  label,
  value,
  color,
}: {
  readonly label: string;
  readonly value: string | number;
  readonly color: string;
}) {
  return (
    <div className="flex flex-col leading-[1.1]">
      <span className="font-mono text-hud-2xs font-bold tracking-hud-label" style={{ color }}>
        {label}
      </span>
      <span className="font-display text-hud-lg text-hud-accent-hot font-extrabold tracking-hud-body">
        {value}
      </span>
    </div>
  );
}
