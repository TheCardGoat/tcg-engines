import { useReducer } from "react";

import { useCardInspect } from "./card-inspect-context.tsx";
import { CARD_IMAGE_DIMENSIONS, CARD_SIZE_SCALES, type CardSize } from "./card-image-format.ts";
import { CARD_COLORS, CardFace } from "./CardFace.tsx";
import { toSimulatorEntity } from "./to-simulator-entity.ts";
import type { GameCardData } from "../types.ts";

const PREVIEW_SIZE: CardSize = "medium";
const { width: PREVIEW_WIDTH, height: PREVIEW_HEIGHT } = {
  width: Math.round(CARD_IMAGE_DIMENSIONS.full.width * CARD_SIZE_SCALES[PREVIEW_SIZE]),
  height: Math.round(CARD_IMAGE_DIMENSIONS.full.height * CARD_SIZE_SCALES[PREVIEW_SIZE]),
};

type PreviewImageStatus = "loading" | "loaded" | "error" | "none";

// Session-level art caches, mirroring Cyberpunk's `loadedImageUrls` ref:
// once a URL has loaded, re-hovering that card skips the text fallback and
// shows the art instantly. Failed URLs are remembered too, so a broken URL
// goes straight to the error fallback instead of flickering loading->error
// on every hover.
const loadedImageUrls = new Set<string>();
const failedImageUrls = new Set<string>();

export function CardHoverPreview() {
  const ctx = useCardInspect();
  // The image status is derived from the module-level caches below, so
  // switching hovered cards can never show a stale status for a frame.
  // This reducer just forces a re-render when a load/error callback lands.
  const [, bump] = useReducer((n: number) => n + 1, 0);
  if (!ctx?.hovered) return null;

  const card = ctx.hovered.card;
  const imageUrl = card.faceDown === true ? undefined : toSimulatorEntity(card).imageUrl;
  const imageStatus: PreviewImageStatus = !imageUrl
    ? "none"
    : loadedImageUrls.has(imageUrl)
      ? "loaded"
      : failedImageUrls.has(imageUrl)
        ? "error"
        : "loading";

  return (
    <div
      data-testid="card-hover-preview"
      data-card-id={card.id}
      className="absolute top-4 left-4 z-[28] pointer-events-none max-[767px]:hidden [@media(min-width:768px)_and_(max-width:1023px)_and_(min-height:521px)]:fixed [@media(max-height:520px)]:hidden [--zone-card-width:100%] [--zone-card-height:100%] [animation:gd-fade-in_.12s_ease]"
      style={{
        width: `min(${PREVIEW_WIDTH}px, calc(100% - 32px))`,
        aspectRatio: `${PREVIEW_WIDTH} / ${PREVIEW_HEIGHT}`,
        filter: "drop-shadow(0 8px 24px rgba(0,0,0,.6)) drop-shadow(0 0 18px rgba(45,107,255,.25))",
      }}
      aria-hidden
    >
      <CardFace
        card={{ ...card, exerted: false, selected: false, highlight: false }}
        width={PREVIEW_WIDTH}
        height={PREVIEW_HEIGHT}
        useContainerSize
        imageLoading="eager"
        onImageStatusChange={(status) => {
          if (!imageUrl) return;
          if (status === "loaded") {
            loadedImageUrls.add(imageUrl);
            failedImageUrls.delete(imageUrl);
          } else {
            failedImageUrls.add(imageUrl);
          }
          bump();
        }}
      />
      {imageStatus !== "loaded" && <CardPreviewFallback card={card} status={imageStatus} />}
    </div>
  );
}

/**
 * Text stand-in shown while the preview art is still loading (or after it
 * failed / when the card has no printable image, e.g. unprinted tokens).
 * Modeled on Cyberpunk's `CardPreviewFallback`: name, type line, cost,
 * AP/HP, keywords, traits, and the rules text, plus a small status chip.
 */
function CardPreviewFallback({
  card,
  status,
}: {
  readonly card: GameCardData;
  readonly status: Exclude<PreviewImageStatus, "loaded">;
}) {
  const tint = (card.color && CARD_COLORS[card.color]) || "#7b4182";
  const stats = [
    card.cardType ? card.cardType.charAt(0).toUpperCase() + card.cardType.slice(1) : null,
    card.cost != null ? `Cost ${card.cost}` : null,
    card.level != null ? `Lv ${card.level}` : null,
    statLabel("AP", card.baseAp, card.ap),
    statLabel("HP", card.baseHp, card.hp),
  ].filter((item): item is string => Boolean(item));
  const keywords = [
    ...(card.keywords ?? []).map((entry) =>
      entry.value == null ? entry.keyword : `${entry.keyword} ${entry.value}`,
    ),
    ...(card.grantedKeywords ?? []),
  ];
  const traits = card.traits ?? [];
  const setLabel = [card.set, card.cardNumber].filter(Boolean).join("-");

  return (
    <div
      data-testid="card-preview-fallback"
      className="absolute inset-0 flex flex-col gap-2 overflow-hidden p-4 text-white"
      style={{
        background: `linear-gradient(160deg, ${tint}59 0%, rgba(8,10,18,.96) 45%, rgba(8,10,18,.99) 100%)`,
        borderTop: `2px solid ${tint}`,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <span className="text-[9px] font-semibold uppercase tracking-[.18em] text-white/45">
          Card preview
        </span>
        {status !== "none" && (
          <span
            className={`rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider ${
              status === "error" ? "bg-red-500/15 text-red-300" : "bg-amber-400/15 text-amber-200"
            }`}
          >
            {status === "error" ? "Image unavailable" : "Image loading"}
          </span>
        )}
      </div>

      <div>
        <div className="font-display text-lg font-extrabold uppercase leading-tight [overflow-wrap:anywhere]">
          {card.name}
        </div>
        {card.subtitle && (
          <div className="text-xs text-white/60 [overflow-wrap:anywhere]">{card.subtitle}</div>
        )}
      </div>

      {stats.length > 0 && (
        <div className="flex flex-wrap gap-1" aria-label="Card stats">
          {stats.map((item) => (
            <span
              key={item}
              className="rounded-sm border border-white/15 bg-white/5 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
            >
              {item}
            </span>
          ))}
        </div>
      )}

      {keywords.length > 0 && (
        <div className="text-xs font-semibold uppercase tracking-wide text-cyan-200/85">
          {keywords.join(" · ")}
        </div>
      )}

      {traits.length > 0 && (
        <div className="text-[11px] uppercase tracking-wider text-white/50">
          {traits.join(" / ")}
        </div>
      )}

      <div className="mt-1 flex-1 overflow-y-auto border-t border-white/10 pt-2">
        {card.effect ? (
          <p className="whitespace-pre-line text-xs leading-relaxed text-white/85">{card.effect}</p>
        ) : (
          <p className="text-xs italic text-white/40">No rules text.</p>
        )}
      </div>

      {setLabel && (
        <div className="text-[10px] uppercase tracking-widest text-white/35">{setLabel}</div>
      )}
    </div>
  );
}

/** `AP 2 -> 4` when a modifier moved the value off its base, plain `AP 4`
 * otherwise. Null when the card has no such stat (e.g. commands). */
function statLabel(
  label: string,
  base: number | null | undefined,
  current: number | null | undefined,
): string | null {
  const resolved = current ?? base;
  if (resolved == null) return null;
  if (base != null && current != null && base !== current) {
    return `${label} ${base} -> ${current}`;
  }
  return `${label} ${resolved}`;
}
