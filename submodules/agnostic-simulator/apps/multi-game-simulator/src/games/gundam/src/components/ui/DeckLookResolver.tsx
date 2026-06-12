import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { Button } from "../primitives/index.ts";
import type { DeckLookConfirmResult, GameCardData, PendingEffect } from "./types.ts";

interface DeckLookCard extends GameCardData {
  readonly _uid: string;
}

export interface DeckLookResolverProps {
  readonly effect: PendingEffect | null;
  readonly onConfirm: (result: DeckLookConfirmResult) => void;
  readonly onCancel: () => void;
}

export function DeckLookResolver({ effect, onConfirm, onCancel }: DeckLookResolverProps) {
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onCancel();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  const config = effect?.deckLook;
  const initial = useMemo<DeckLookCard[]>(
    () => (config?.revealed ?? []).map((c, i) => ({ ...c, _uid: c.id ?? `deck-look-${i}` })),
    [config?.revealed],
  );
  const [tutor, setTutor] = useState<DeckLookCard | null>(null);
  const [toBottom, setToBottom] = useState<DeckLookCard[]>([]);
  const [toTrash, setToTrash] = useState<DeckLookCard[]>([]);

  useEffect(() => {
    setTutor(null);
    setToBottom([]);
    setToTrash([]);
  }, [effect?.id, config?.directiveIndex, config?.revealed]);

  if (!effect || !config) return null;

  const routedIds = new Set([
    tutor?._uid,
    ...toBottom.map((c) => c._uid),
    ...toTrash.map((c) => c._uid),
  ]);
  const toTop = initial.filter((c) => !routedIds.has(c._uid));
  const legalTutorIds = new Set(config.legalTutorIds);
  const canUseTrash = config.returnMode === "topOrTrash" || config.remainingDestination === "trash";
  const canUseBottom =
    config.returnMode !== "topOrTrash" && config.remainingDestination !== "trash";
  const legacyChooseTop = config.returnMode === "chooseTop" && !config.remainingDestination;
  const chooseSingleTop = config.returnMode === "chooseTop" && Boolean(config.remainingDestination);
  const topLimit = legacyChooseTop ? 0 : chooseSingleTop ? 1 : initial.length;
  const tint = "#4cc3ff";

  function route(card: DeckLookCard, destination: "top" | "bottom" | "trash" | "tutor") {
    setToBottom((cards) => cards.filter((c) => c._uid !== card._uid));
    setToTrash((cards) => cards.filter((c) => c._uid !== card._uid));
    setTutor((current) => (current?._uid === card._uid ? null : current));

    if (destination === "tutor") {
      setTutor(card);
      return;
    }
    if (destination === "bottom") setToBottom((cards) => [...cards, card]);
    if (destination === "trash") setToTrash((cards) => [...cards, card]);
  }

  function keepAsOnlyTop(card: DeckLookCard) {
    setTutor((current) => (current?._uid === card._uid ? null : current));
    const others = initial.filter((c) => c._uid !== card._uid && c._uid !== tutor?._uid);
    setToTrash(canUseTrash ? others : []);
    setToBottom(canUseTrash ? [] : others);
  }

  const topIsValid =
    config.returnMode === "topAndBottom"
      ? toBottom.length > 0 || initial.filter((c) => c._uid !== tutor?._uid).length <= 1
      : config.returnMode === "topOrTrash"
        ? true
        : legacyChooseTop
          ? toTop.length === 0
          : toTop.length === Math.min(1, initial.filter((c) => c._uid !== tutor?._uid).length);
  const readinessText = topIsValid
    ? "READY"
    : legacyChooseTop
      ? "ROUTE REMAINING CARDS TO BOTTOM"
      : config.returnMode === "topAndBottom"
        ? "ROUTE AT LEAST ONE CARD TO BOTTOM"
        : "KEEP EXACTLY ONE CARD ON TOP";

  return (
    <div className="font-body fixed inset-0 z-[210] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,rgba(30,73,199,.2),rgba(12,18,32,.86)_70%)] px-2 backdrop-blur-[3px] [animation:gd-fade-in_.2s_ease]">
      <div className="relative flex max-h-[90dvh] w-full max-w-[760px] flex-col overflow-hidden clip-hud-18 bg-[linear-gradient(180deg,rgba(255,255,255,.98),rgba(248,250,254,.99))] text-hud-text shadow-[0_0_60px_rgba(76,195,255,.35)]">
        <header className="flex items-center gap-3 border-b border-hud-accent/35 px-4 py-3">
          <div className="min-w-0 flex-1">
            <div className="font-mono text-hud-xs font-bold tracking-hud-label text-hud-accent">
              DECK SCAN
            </div>
            <div className="font-display truncate text-lg font-extrabold uppercase text-hud-accent-hot">
              {effect.source.name}
            </div>
            <div className="font-mono truncate text-hud-xs font-bold uppercase tracking-hud-body text-hud-text-dim">
              {effect.title}
            </div>
          </div>
          <Button onClick={onCancel} variant="outline" size="icon" className="clip-hud-5">
            X
          </Button>
        </header>

        <div className="grid gap-3 overflow-y-auto p-3 md:grid-cols-[1.15fr_.85fr]">
          <Zone title="REVEALED" count={initial.length} tint={tint}>
            <div className="flex flex-wrap gap-2">
              {initial.map((card) => (
                <DeckMiniCard
                  key={card._uid}
                  card={card}
                  muted={routedIds.has(card._uid)}
                  tutorLegal={card.id ? legalTutorIds.has(card.id) : false}
                  actions={[
                    ...(config.returnMode === "chooseTop"
                      ? legacyChooseTop
                        ? []
                        : [{ label: "TOP", onClick: () => keepAsOnlyTop(card), primary: true }]
                      : [{ label: "TOP", onClick: () => route(card, "top") }]),
                    ...(canUseBottom
                      ? [{ label: "BOTTOM", onClick: () => route(card, "bottom") }]
                      : []),
                    ...(canUseTrash
                      ? [{ label: "TRASH", onClick: () => route(card, "trash") }]
                      : []),
                    ...(card.id && legalTutorIds.has(card.id)
                      ? [
                          {
                            label: config.tutorDestination === "battleArea" ? "DEPLOY" : "HAND",
                            onClick: () => route(card, "tutor"),
                            primary: true,
                          },
                        ]
                      : []),
                  ]}
                />
              ))}
            </div>
          </Zone>

          <div className="grid gap-3">
            <Zone title="TOP OF DECK" count={`${toTop.length}/${topLimit}`} tint="#36ff8a">
              <CardStrip cards={toTop} empty="Choose card(s) to keep on top" />
            </Zone>
            {tutor && (
              <Zone
                title={config.tutorDestination === "battleArea" ? "DEPLOY" : "ADD TO HAND"}
                count={1}
                tint="#4cc3ff"
              >
                <CardStrip cards={[tutor]} empty="" />
              </Zone>
            )}
            {canUseBottom && (
              <Zone title="BOTTOM OF DECK" count={toBottom.length} tint="#c38af5">
                <CardStrip cards={toBottom} empty="Cards routed to bottom" />
              </Zone>
            )}
            {canUseTrash && (
              <Zone title="TRASH" count={toTrash.length} tint="#d7263d">
                <CardStrip cards={toTrash} empty="Cards routed to trash" />
              </Zone>
            )}
          </div>
        </div>

        <footer className="flex items-center gap-2 border-t border-hud-accent/25 px-4 py-2.5">
          <div className="font-mono flex-1 text-hud-xs font-bold tracking-hud-label text-hud-text-dim">
            {readinessText}
          </div>
          <Button onClick={onCancel} variant="outline" size="md" className="clip-hud-5">
            Cancel
          </Button>
          <Button
            onClick={() =>
              onConfirm({
                directiveIndex: config.directiveIndex,
                tutorCardId: tutor?.id,
                toTop,
                toBottom,
                toTrash,
              })
            }
            disabled={!topIsValid}
            data-testid="deck-look-confirm"
            variant="primary"
            size="md"
            className="clip-hud-5 glow-accent"
          >
            Confirm
          </Button>
        </footer>
      </div>
    </div>
  );
}

function Zone({
  title,
  count,
  tint,
  children,
}: {
  readonly title: string;
  readonly count: string | number;
  readonly tint: string;
  readonly children: ReactNode;
}) {
  return (
    <section className="clip-hud-10 border bg-white/70 p-2.5" style={{ borderColor: `${tint}77` }}>
      <div
        className="mb-2 flex items-center gap-2 border-b pb-1.5"
        style={{ borderColor: `${tint}55` }}
      >
        <span className="h-2.5 w-1" style={{ background: tint, boxShadow: `0 0 6px ${tint}` }} />
        <span className="font-display text-hud-sm font-extrabold tracking-hud-label">{title}</span>
        <span className="ml-auto font-mono text-hud-xs font-black" style={{ color: tint }}>
          {count}
        </span>
      </div>
      {children}
    </section>
  );
}

function CardStrip({
  cards,
  empty,
}: {
  readonly cards: readonly DeckLookCard[];
  readonly empty: string;
}) {
  if (cards.length === 0) {
    return (
      <div className="clip-hud-6 border border-dashed border-hud-accent/35 px-2 py-3 text-center font-mono text-hud-xs font-bold uppercase tracking-hud-label text-hud-text-faint">
        {empty}
      </div>
    );
  }
  return (
    <div className="flex flex-wrap gap-1.5">
      {cards.map((card) => (
        <DeckMiniCard key={card._uid} card={card} />
      ))}
    </div>
  );
}

function DeckMiniCard({
  card,
  actions = [],
  muted,
  tutorLegal,
}: {
  readonly card: DeckLookCard;
  readonly actions?: readonly { label: string; onClick: () => void; primary?: boolean }[];
  readonly muted?: boolean;
  readonly tutorLegal?: boolean;
}) {
  return (
    <div className={`flex w-[78px] flex-col gap-1 ${muted ? "opacity-45" : ""}`}>
      <div
        data-testid={card.id ? `deck-look-card-${card.id}` : undefined}
        className="relative h-[106px] overflow-hidden clip-hud-6 border bg-[linear-gradient(160deg,rgba(76,195,255,.35),#f4f6fa_70%)]"
        style={{ borderColor: tutorLegal ? "#36ff8a" : "rgba(76,195,255,.7)" }}
      >
        <div className="absolute left-1 top-1 grid h-4 min-w-4 place-items-center bg-hud-accent px-1 font-display text-[9px] font-black text-white clip-hud-3">
          {card.cost ?? "?"}
        </div>
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent px-1 pb-1 pt-5">
          <div className="truncate text-center font-display text-[8px] font-extrabold text-hud-accent-hot">
            {card.name}
          </div>
        </div>
      </div>
      {actions.length > 0 && (
        <div className="grid grid-cols-2 gap-0.5">
          {actions.map((action) => (
            <Button
              key={action.label}
              onClick={action.onClick}
              data-testid={card.id ? `deck-look-action-${card.id}-${action.label}` : undefined}
              variant={action.primary ? "primary" : "outline"}
              size="sm"
              className="h-auto px-1 py-1 text-[8px] leading-none clip-hud-3"
            >
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
