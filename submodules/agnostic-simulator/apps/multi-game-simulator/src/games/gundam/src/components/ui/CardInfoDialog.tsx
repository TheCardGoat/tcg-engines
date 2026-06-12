import { Fragment, useMemo, useRef } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

import { m } from "../../lib/i18n/messages.ts";
import { useLayoutMode } from "../../lib/use-layout-mode.ts";
import { Button, Popover, PopoverAnchor, PopoverContent } from "../primitives/index.ts";
import { DialogOverlay, DialogPortal } from "../primitives/dialog.tsx";
import { TAG_TONE_CLASSES } from "./card/card-tags.ts";
import { getCardTags } from "./card/card-tags.ts";
import type { CardColor, CardType, DOMRectLike, GameCardData } from "./types.ts";

const DIALOG_W = 340;

const FACTION_NAME_KEY: Record<CardColor, string> = {
  blue: "sim.cardInfo.faction.blue",
  green: "sim.cardInfo.faction.green",
  red: "sim.cardInfo.faction.red",
  white: "sim.cardInfo.faction.white",
  purple: "sim.cardInfo.faction.purple",
};
const CARD_COLOR: Record<CardColor, string> = {
  blue: "#1e49c7",
  green: "#2ea65a",
  red: "#d7263d",
  white: "#e8ecf1",
  purple: "#7b4182",
};

const CARD_TYPE_LABEL: Record<CardType, string> = {
  unit: "UNIT",
  pilot: "PILOT",
  command: "COMMAND",
  base: "BASE",
  resource: "RESOURCE",
};

export interface CardAction {
  readonly id: string;
  readonly label: string;
  readonly hint?: string;
  readonly tone?: "primary" | "default" | "danger";
  readonly disabled?: boolean;
}

export interface CardInfoDialogProps {
  readonly card: GameCardData | null;
  readonly anchor?: DOMRectLike | null;
  readonly actions?: readonly CardAction[];
  readonly onActionClick?: (actionId: string) => void;
  readonly onClose: () => void;
}

export const CARD_INFO_CARD_COLOR = CARD_COLOR;
export const CARD_INFO_DIALOG_W = DIALOG_W;

/**
 * Pure presentational body of the card info dialog — the dossier stack
 * WITHOUT the outer Popover / anchor machinery or close button. Exposed so
 * hover-driven surfaces (HoverCard-based CardLink) can reuse the same
 * visuals without reimplementing the layout.
 */
export function CardInfoBody({ card }: { readonly card: GameCardData }) {
  const factionColor = (card.color && CARD_COLOR[card.color]) || "#4cc3ff";
  const factionName =
    (card.color && m[FACTION_NAME_KEY[card.color]]()) || m["sim.cardInfo.faction.unknown"]();
  return (
    <>
      <div className="scanline absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" />
      {/* No `onClose` — the HoverCard unmounts on pointer-leave, so the
          close control would be a misleading no-op affordance. */}
      <Header card={card} factionColor={factionColor} factionName={factionName} />
      <StatsRow card={card} factionColor={factionColor} />
      {hasMeaningfulEffect(card.effect) && (
        <EffectBlock effect={card.effect!} factionColor={factionColor} />
      )}
      {(card.keywords?.length ?? 0) > 0 && (
        <KeywordsBlock card={card} factionColor={factionColor} />
      )}
      {(card.grantedKeywords?.length ?? 0) > 0 && (
        <GrantedKeywordsBlock keywords={card.grantedKeywords!} factionColor={factionColor} />
      )}
      {(card.activeEffects?.length ?? 0) > 0 && (
        <ActiveEffectsBlock effects={card.activeEffects!} factionColor={factionColor} />
      )}
      {(card.traits?.length ?? 0) > 0 && (
        <TraitsBlock traits={card.traits!} factionColor={factionColor} />
      )}
      {card.linkRequirement && (
        <LinkBlock requirement={card.linkRequirement} factionColor={factionColor} />
      )}
      <div className="h-3" />
    </>
  );
}

export function CardInfoDialog({
  card,
  anchor,
  actions,
  onActionClick,
  onClose,
}: CardInfoDialogProps) {
  const anchorRef = useRef<{ getBoundingClientRect: () => DOMRect } | null>(null);
  anchorRef.current = useMemo(() => {
    if (!anchor) return null;
    return {
      getBoundingClientRect: () =>
        new DOMRect(anchor.left, anchor.top, anchor.width, anchor.height),
    };
  }, [anchor?.left, anchor?.top, anchor?.width, anchor?.height]);

  const open = card !== null;
  const factionColor = (card?.color && CARD_COLOR[card.color]) || "#4cc3ff";
  const factionName =
    (card?.color && m[FACTION_NAME_KEY[card.color]]()) || m["sim.cardInfo.faction.unknown"]();
  const isMobile = useLayoutMode() === "mobile";

  const body = card ? (
    <>
      <div className="scanline absolute inset-0 opacity-30 mix-blend-multiply pointer-events-none" />
      <Header card={card} factionColor={factionColor} factionName={factionName} onClose={onClose} />
      <StatsRow card={card} factionColor={factionColor} />
      {hasMeaningfulEffect(card.effect) && (
        <EffectBlock effect={card.effect!} factionColor={factionColor} />
      )}
      {(card.keywords?.length ?? 0) > 0 && (
        <KeywordsBlock card={card} factionColor={factionColor} />
      )}
      {(card.grantedKeywords?.length ?? 0) > 0 && (
        <GrantedKeywordsBlock keywords={card.grantedKeywords!} factionColor={factionColor} />
      )}
      {(card.activeEffects?.length ?? 0) > 0 && (
        <ActiveEffectsBlock effects={card.activeEffects!} factionColor={factionColor} />
      )}
      {(card.traits?.length ?? 0) > 0 && (
        <TraitsBlock traits={card.traits!} factionColor={factionColor} />
      )}
      {card.linkRequirement && (
        <LinkBlock requirement={card.linkRequirement} factionColor={factionColor} />
      )}
      {actions && actions.length > 0 && (
        <ActionsBlock actions={actions} factionColor={factionColor} onActionClick={onActionClick} />
      )}
      <div className="h-3" />
    </>
  ) : null;

  if (isMobile) {
    // Bottom-sheet on mobile: pinned to the bottom of the viewport, above the
    // action bar (handled by safe-area padding). Slides up when opened.
    return (
      <DialogPrimitive.Root
        open={open}
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <DialogPortal>
          <DialogOverlay />
          <DialogPrimitive.Content
            role="region"
            aria-label={card ? `Dossier: ${card.name}` : "Dossier"}
            className="fixed left-0 right-0 z-[300] focus:outline-none
              data-[state=open]:[animation:gd-fade-in_.18s_ease]"
            style={{
              bottom: `calc(var(--mobile-menubar-height) + var(--safe-bottom))`,
              maxHeight: `calc(100dvh - var(--mobile-menubar-height) - var(--mobile-top-hud-height) - var(--safe-top) - var(--safe-bottom) - 16px)`,
              overflowY: "auto",
              background: "linear-gradient(180deg, rgba(255,255,255,.96), rgba(248,250,254,.98))",
              borderTop: `1px solid ${factionColor}`,
              borderLeft: `1px solid ${factionColor}66`,
              borderRight: `1px solid ${factionColor}66`,
              boxShadow: `0 -12px 32px ${factionColor}44, 0 -1px 0 rgba(45,107,255,.15)`,
              backdropFilter: "blur(2px)",
            }}
          >
            <DialogPrimitive.Title className="sr-only">
              {card ? `Dossier: ${card.name}` : "Dossier"}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="sr-only">
              {card?.subtitle ?? "Card details and actions."}
            </DialogPrimitive.Description>
            {body}
          </DialogPrimitive.Content>
        </DialogPortal>
      </DialogPrimitive.Root>
    );
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      {anchorRef.current && (
        <PopoverAnchor virtualRef={anchorRef as React.RefObject<HTMLElement>} />
      )}
      <PopoverContent
        role="region"
        aria-label={card ? `Dossier: ${card.name}` : "Dossier"}
        side="top"
        align="start"
        sideOffset={10}
        collisionPadding={10}
        className="clip-hud-14"
        style={{
          width: DIALOG_W,
          background: "linear-gradient(180deg, rgba(255,255,255,.94), rgba(248,250,254,.96))",
          border: `1px solid ${factionColor}`,
          boxShadow: `0 0 0 1px rgba(45,107,255,.15), 0 0 32px ${factionColor}55`,
          backdropFilter: "blur(2px)",
        }}
      >
        {body}
      </PopoverContent>
    </Popover>
  );
}

interface HeaderProps {
  readonly card: GameCardData;
  readonly factionColor: string;
  readonly factionName: string;
  /**
   * When provided, renders the ✕ close control in the header. Omit in
   * hover-driven surfaces (HoverCard content) where the whole card
   * unmounts on pointer leave — a no-op close button in that context is
   * a misleading a11y affordance.
   */
  readonly onClose?: () => void;
}

function Header({ card, factionColor, factionName, onClose }: HeaderProps) {
  const typeLabel = card.cardType ? CARD_TYPE_LABEL[card.cardType] : "CARD";
  return (
    <div
      className="pl-3.5 pt-2.5 pb-2.5 pr-3 flex items-center gap-[9px] relative"
      style={{
        background: `linear-gradient(135deg, ${factionColor}33 0%, ${factionColor}11 45%, transparent 100%)`,
        borderBottom: `1px solid ${factionColor}55`,
      }}
    >
      {card.cost != null && (
        <div
          className="w-[34px] h-[34px] flex-shrink-0 grid place-items-center text-white font-black text-[15px] [text-shadow:0_0_4px_rgba(0,0,0,.9)] [clip-path:polygon(25%_0,75%_0,100%_50%,75%_100%,25%_100%,0_50%)]"
          style={{
            background: `linear-gradient(135deg, #fbfcfe, ${factionColor} 60%, #2d6bff)`,
            border: `1.5px solid #2d6bff`,
            boxShadow: `0 0 8px ${factionColor}88`,
          }}
        >
          {card.cost}
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div
          className="gd-mono text-hud-2xs font-bold tracking-hud-label"
          style={{ color: factionColor }}
        >
          ◆ {typeLabel} · {factionName}
        </div>
        <div className="gd-display font-extrabold text-hud-accent-hot uppercase whitespace-nowrap overflow-hidden text-ellipsis mt-px tracking-hud-body text-base [text-shadow:0_0_6px_rgba(45,107,255,.3)]">
          {card.name}
        </div>
        {card.subtitle && (
          <div className="gd-mono text-hud-xs text-hud-text-dim mt-px whitespace-nowrap overflow-hidden text-ellipsis tracking-hud-display">
            {card.subtitle.toUpperCase()}
          </div>
        )}
      </div>

      {onClose && (
        <Button
          onClick={onClose}
          title={m["sim.cardInfo.close.title"]()}
          variant="outline"
          size="icon"
          className="w-6 h-6 flex-shrink-0 text-hud-accent bg-[linear-gradient(180deg,#fbfcfe,#f4f6fa)] border-hud-accent/50 clip-hud-5"
        >
          ✕
        </Button>
      )}
    </div>
  );
}

interface StatsRowProps {
  readonly card: GameCardData;
  readonly factionColor: string;
}

function StatsRow({ card, factionColor }: StatsRowProps) {
  const stats: {
    label: string;
    value: number | string;
    color: string;
    icon: string;
    base?: number;
    delta?: number;
  }[] = [];
  const t = card.cardType;

  if (t === "unit") {
    if (card.ap != null) {
      const delta = card.baseAp != null ? card.ap - card.baseAp : 0;
      stats.push({
        label: m["sim.cardInfo.stat.atk"](),
        value: card.ap,
        color: "#d7263d",
        icon: "⚔",
        base: card.baseAp ?? undefined,
        delta: delta !== 0 ? delta : undefined,
      });
    }
    if (card.hp != null) {
      const delta = card.baseHp != null ? card.hp - card.baseHp : 0;
      stats.push({
        label: m["sim.cardInfo.stat.armor"](),
        value: card.hp,
        color: "#4cc3ff",
        icon: "▣",
        base: card.baseHp ?? undefined,
        delta: delta !== 0 ? delta : undefined,
      });
    }
  } else if (t === "base") {
    if (card.hp != null) {
      const delta = card.baseHp != null ? card.hp - card.baseHp : 0;
      stats.push({
        label: m["sim.cardInfo.stat.armor"](),
        value: card.hp,
        color: "#4cc3ff",
        icon: "▣",
        base: card.baseHp ?? undefined,
        delta: delta !== 0 ? delta : undefined,
      });
    }
  }
  if (card.level != null) {
    stats.push({
      label: m["sim.cardInfo.stat.level"](),
      value: card.level,
      color: "#2d6bff",
      icon: "◆",
    });
  }
  if (card.damage != null && card.damage > 0) {
    stats.push({
      label: m["sim.cardInfo.stat.damage"](),
      value: card.damage,
      color: "#ff4d5e",
      icon: "☣",
    });
  }

  if (stats.length === 0) {
    return (
      <div className="px-3 py-2 border-b border-hud-accent/15 bg-[rgba(248,250,254,.5)]">
        <Stat
          label={m["sim.cardInfo.stat.supportModule"]()}
          value="—"
          color={factionColor}
          icon="◉"
          wide
        />
      </div>
    );
  }

  return (
    <div className="px-3 py-2 flex items-center gap-[5px] border-b border-hud-accent/15 bg-[rgba(248,250,254,.5)]">
      {stats.map((s) => (
        <Stat
          key={s.label}
          label={s.label}
          value={s.value}
          color={s.color}
          icon={s.icon}
          wide={s.delta != null}
          delta={s.delta}
        />
      ))}
    </div>
  );
}

interface StatProps {
  readonly label: string;
  readonly value: number | string;
  readonly color: string;
  readonly icon: string;
  readonly wide?: boolean;
  readonly delta?: number;
}

function Stat({ label, value, color, icon, wide, delta }: StatProps) {
  const deltaColor = delta && delta > 0 ? "#36ff8a" : delta && delta < 0 ? "#ff4d5e" : undefined;
  return (
    <div
      className={`flex-1 flex flex-col items-center px-1.5 py-1 clip-hud-5 ${wide ? "min-w-40" : "min-w-[50px]"}`}
      style={{
        background: `linear-gradient(180deg, ${color}22, rgba(248,250,254,.6))`,
        border: `1px solid ${color}55`,
      }}
    >
      <div className="gd-mono text-hud-2xs font-bold tracking-hud-label" style={{ color }}>
        {icon} {label}
      </div>
      <div className="flex items-baseline gap-1">
        <div
          className="gd-display text-sm font-extrabold text-hud-accent-hot leading-[1.1]"
          style={{ textShadow: `0 0 5px ${color}77` }}
        >
          {value}
        </div>
        {deltaColor && delta != null && (
          <span
            className="gd-mono text-hud-2xs font-extrabold"
            style={{ color: deltaColor, textShadow: `0 0 4px ${deltaColor}66` }}
          >
            {delta > 0 ? "+" : ""}
            {delta}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Card effect text as printed on the card. Raw data carries HTML-entity
 * encoded keyword markers (`&lt;Blocker&gt;`) and `<br>` line breaks — decode
 * them and render keyword markers as styled accents without resorting to
 * `dangerouslySetInnerHTML`.
 */
function EffectBlock({
  effect,
  factionColor,
}: {
  readonly effect: string;
  readonly factionColor: string;
}) {
  const segments = useMemo(() => parseEffectText(effect), [effect]);
  if (segments.length === 0) return null;
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader
        label={m["sim.cardInfo.effect.heading"]()}
        count={1}
        factionColor={factionColor}
      />
      <div className="mt-1.5 px-2.5 py-2 bg-[linear-gradient(180deg,rgba(30,73,199,.18),rgba(30,73,199,.06))] border border-hud-info/35 clip-hud-6 text-xs text-hud-text-muted leading-[1.4]">
        {segments.map((seg, i) => (
          <Fragment key={i}>
            {seg.kind === "text" && seg.text}
            {seg.kind === "break" && <br />}
            {seg.kind === "keyword" && (
              <strong className="text-hud-accent font-bold">〈{seg.text}〉</strong>
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

/**
 * `true` when the raw effect string carries any printable content once HTML
 * tags and entities are stripped. Prevents empty `<br>`-only effect strings
 * from rendering a ghost EFFECT block.
 */
function hasMeaningfulEffect(raw: string | undefined): boolean {
  if (!raw) return false;
  const stripped = raw
    .replace(/<[^>]*>/g, "")
    .replace(/&[a-zA-Z]+;/g, "")
    .replace(/&#\d+;/g, "")
    .trim();
  return stripped.length > 0;
}

type EffectSegment =
  | { kind: "text"; text: string }
  | { kind: "break" }
  | { kind: "keyword"; text: string };

function parseEffectText(raw: string): EffectSegment[] {
  // Engine effect strings are lightly HTML-encoded: decode entities, then
  // split on <br> for line breaks and extract <keyword> markers as accents.
  const decoded = raw
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  const out: EffectSegment[] = [];
  const lineParts = decoded.split(/<br\s*\/?>/i);
  lineParts.forEach((line, i) => {
    if (i > 0) out.push({ kind: "break" });
    // Match <Keyword> tokens — only short, word-chars — and emit as keyword
    // segments. Anything else is plain text.
    let cursor = 0;
    const tokenRe = /<([A-Za-z][\w\s+-]{0,32})>/g;
    let match: RegExpExecArray | null;
    while ((match = tokenRe.exec(line)) !== null) {
      if (match.index > cursor) out.push({ kind: "text", text: line.slice(cursor, match.index) });
      out.push({ kind: "keyword", text: match[1] });
      cursor = match.index + match[0].length;
    }
    if (cursor < line.length) out.push({ kind: "text", text: line.slice(cursor) });
  });

  // Collapse empty trailing text.
  return out.filter((s) => s.kind !== "text" || s.text.trim().length > 0);
}

interface KeywordsBlockProps {
  readonly card: GameCardData;
  readonly factionColor: string;
}

function KeywordsBlock({ card, factionColor }: KeywordsBlockProps) {
  const tags = getCardTags(card).filter((t) => t.id.startsWith("kw-"));
  if (tags.length === 0) return null;
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader
        label={m["sim.cardInfo.keywords.heading"]()}
        count={tags.length}
        factionColor={factionColor}
      />
      <div className="mt-1.5 flex flex-col gap-1">
        {tags.map((tag) => {
          const Icon = tag.icon;
          return (
            <div
              key={tag.id}
              className="flex items-start gap-2 px-2.5 py-1.5 bg-[rgba(248,250,254,.45)] border clip-hud-6"
              style={{ borderColor: `${factionColor}44` }}
            >
              <span
                className={`mt-px inline-flex items-center justify-center w-5 h-5 rounded-full border ${TAG_TONE_CLASSES[tag.tone]}`}
              >
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <div className="flex-1 min-w-0">
                <div className="gd-display text-hud-sm text-hud-accent-hot font-extrabold tracking-hud-display uppercase">
                  {tag.label}
                </div>
                <div className="gd-mono text-hud-xs text-hud-text-dim mt-px leading-[1.35]">
                  {tag.tooltip}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

interface TraitsBlockProps {
  readonly traits: readonly string[];
  readonly factionColor: string;
}

function TraitsBlock({ traits, factionColor }: TraitsBlockProps) {
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader
        label={m["sim.cardInfo.traits.heading"]()}
        count={traits.length}
        factionColor={factionColor}
      />
      <div className="mt-1.5 flex flex-wrap gap-1">
        {traits.map((t) => (
          <span
            key={t}
            className="gd-mono text-hud-2xs font-bold tracking-hud-label uppercase px-2 py-1 text-hud-text-muted bg-[rgba(248,250,254,.6)] border border-white/15 clip-hud-5"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

interface LinkBlockProps {
  readonly requirement: string;
  readonly factionColor: string;
}

function LinkBlock({ requirement, factionColor }: LinkBlockProps) {
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader
        label={m["sim.cardInfo.link.heading"]()}
        count={1}
        factionColor={factionColor}
      />
      <div
        className="mt-1.5 px-2.5 py-1.5 bg-[rgba(248,250,254,.45)] border clip-hud-6 gd-mono text-hud-xs text-hud-text-muted leading-[1.4]"
        style={{ borderColor: `${factionColor}44` }}
      >
        {requirement}
      </div>
    </div>
  );
}

interface ActionsBlockProps {
  readonly actions: readonly CardAction[];
  readonly factionColor: string;
  readonly onActionClick?: (actionId: string) => void;
}

function ActionsBlock({ actions, factionColor, onActionClick }: ActionsBlockProps) {
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader
        label={m["sim.cardInfo.actions.heading"]()}
        count={actions.length}
        factionColor={factionColor}
      />
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        {actions.map((a) => {
          const color =
            a.tone === "primary" ? "#2d6bff" : a.tone === "danger" ? "#d7263d" : factionColor;
          return (
            <button
              key={a.id}
              type="button"
              disabled={a.disabled}
              onClick={() => onActionClick?.(a.id)}
              className="flex-1 min-w-[130px] px-2.5 py-1.5 flex items-center gap-2 text-left clip-hud-6 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: `linear-gradient(180deg, ${color}33, rgba(248,250,254,.85))`,
                border: `1px solid ${color}99`,
                color: "#fff",
              }}
              onMouseEnter={(e) => {
                if (!a.disabled)
                  e.currentTarget.style.background = `linear-gradient(180deg, ${color}55, rgba(248,250,254,.75))`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = `linear-gradient(180deg, ${color}33, rgba(248,250,254,.85))`;
              }}
            >
              <span
                className="text-hud-lg leading-none"
                style={{ color, textShadow: `0 0 5px ${color}` }}
              >
                ▶
              </span>
              <span className="flex flex-col leading-[1.05] min-w-0">
                <span className="gd-display text-hud-sm font-extrabold text-hud-accent-hot tracking-hud-display uppercase whitespace-nowrap overflow-hidden text-ellipsis">
                  {a.label}
                </span>
                {a.hint && (
                  <span className="gd-mono text-hud-2xs text-hud-text-dim font-bold tracking-hud-display whitespace-nowrap overflow-hidden text-ellipsis">
                    {a.hint}
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface GrantedKeywordsBlockProps {
  readonly keywords: readonly string[];
  readonly factionColor: string;
}

function GrantedKeywordsBlock({ keywords, factionColor }: GrantedKeywordsBlockProps) {
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader label="GRANTED" count={keywords.length} factionColor={factionColor} />
      <div className="mt-1.5 flex flex-wrap gap-1">
        {keywords.map((kw) => (
          <span
            key={kw}
            className="gd-mono text-hud-2xs font-bold tracking-hud-label uppercase px-2 py-1 border clip-hud-5"
            style={{
              color: "#8cffc1",
              background: "rgba(54,255,138,.1)",
              borderColor: "rgba(54,255,138,.35)",
            }}
          >
            ★ {kw}
          </span>
        ))}
      </div>
    </div>
  );
}

interface ActiveEffectsBlockProps {
  readonly effects: readonly import("./types.ts").ActiveEffectEntry[];
  readonly factionColor: string;
}

function ActiveEffectsBlock({ effects, factionColor }: ActiveEffectsBlockProps) {
  return (
    <div className="mt-2.5 mx-3">
      <SectionHeader label="ACTIVE EFFECTS" count={effects.length} factionColor={factionColor} />
      <div className="mt-1.5 flex flex-col gap-1">
        {effects.map((e, i) => (
          <div
            key={`${e.sourceId}${e.kind}${i}`}
            className="flex items-start gap-2 px-2.5 py-1.5 bg-[rgba(248,250,254,.45)] border clip-hud-6"
            style={{ borderColor: `${factionColor}44` }}
          >
            <span
              className="mt-px inline-flex items-center justify-center w-5 h-5 border text-[11px] font-bold tabular-nums"
              style={{
                color: "#8cffc1",
                background: "rgba(54,255,138,.15)",
                borderColor: "rgba(54,255,138,.6)",
                clipPath: "polygon(3px 0, 100% 0, calc(100% - 3px) 100%, 0 100%)",
              }}
            >
              ★
            </span>
            <div className="flex-1 min-w-0">
              <div className="gd-display text-hud-sm text-hud-accent-hot font-extrabold tracking-hud-display uppercase">
                {e.description}
              </div>
              {e.duration && (
                <div className="gd-mono text-hud-2xs text-hud-text-dim mt-px">
                  Duration: {e.duration}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

interface SectionHeaderProps {
  readonly label: string;
  readonly count: number;
  readonly factionColor: string;
}

function SectionHeader({ label, count, factionColor }: SectionHeaderProps) {
  return (
    <div
      className="flex items-center gap-1.5 pb-[3px]"
      style={{ borderBottom: `1px solid ${factionColor}55` }}
    >
      <span
        className="w-1 h-2"
        style={{ background: factionColor, boxShadow: `0 0 5px ${factionColor}` }}
      />
      <span className="gd-display text-hud-xs text-hud-text font-extrabold tracking-hud-label">
        {label}
      </span>
      <div
        className="flex-1 h-px"
        style={{ background: `linear-gradient(90deg, ${factionColor}55, transparent)` }}
      />
      <span
        className="gd-mono text-hud-2xs font-bold px-1.5 bg-[rgba(248,250,254,.6)] tracking-hud-display"
        style={{
          border: `1px solid ${factionColor}`,
          color: factionColor,
        }}
      >
        {String(count).padStart(2, "0")}
      </span>
    </div>
  );
}
