import { STANDARD_CARD_IMAGE_ASPECT_RATIO, type SimulatorEntity } from "@tcg/simulator-contract";
import {
  forwardRef,
  memo,
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
  type Ref,
} from "react";

import { cx } from "../class-names";
import { projectSimulatorEntityForFace } from "./entity-visibility";
import { ViewerSafeCardImage } from "./ViewerSafeCardImage";

const FULL_IMAGE_CARD_WIDTH: Record<NonNullable<CardFaceProps["density"]>, number> = {
  mini: 60,
  compact: 96,
  normal: 112,
  large: 136,
  full: 180,
};

interface CardFaceBaseProps {
  entity: SimulatorEntity;
  as?: "button" | "div";
  density?: "mini" | "compact" | "normal" | "large" | "full";
  fill?: boolean;
  fullImageChrome?: "default" | "edge-to-edge";
  fullImageFit?: "cover" | "contain";
  selected?: boolean;
  draggable?: boolean;
  targetable?: boolean;
  illegal?: boolean;
  highlighted?: boolean;
  dimmed?: boolean;
  accessibleLabel?: string;
  tabIndex?: number;
  onClick?: (entity: SimulatorEntity) => void;
  onDblClick?: (entity: SimulatorEntity) => void;
  onContextMenu?: (entity: SimulatorEntity, event: React.MouseEvent) => void;
  onDragStart?: (entity: SimulatorEntity, event: React.DragEvent) => void;
  onDragEnd?: (entity: SimulatorEntity, event: React.DragEvent) => void;
  onHoverEnter?: (entity: SimulatorEntity) => void;
  onHoverLeave?: (entity: SimulatorEntity) => void;
  onImageError?: (entity: SimulatorEntity) => void;
}

type CardFaceImageProps =
  | {
      imageMode?: "full";
      textBoxStart?: never;
      textBoxEnd?: never;
    }
  | {
      /** Remove one horizontal source-image band and join the remaining slices. */
      imageMode: "no-text";
      /** Top edge of the omitted band, expressed as a proportion of source height. */
      textBoxStart: number;
      /** Bottom edge of the omitted band, expressed as a proportion of source height. */
      textBoxEnd: number;
    };

export type CardFaceProps = CardFaceBaseProps & CardFaceImageProps;

function validateNoTextBounds(start: number, end: number) {
  if (!Number.isFinite(start) || !Number.isFinite(end) || start <= 0 || end >= 1 || start >= end) {
    throw new Error("CardFace no-text bounds must satisfy 0 < textBoxStart < textBoxEnd < 1.");
  }
  return { start, end };
}

export const CardFace = memo(
  forwardRef<HTMLButtonElement | HTMLDivElement, CardFaceProps>(function CardFace(
    {
      entity,
      as = "button",
      density = "normal",
      fill = false,
      fullImageChrome = "default",
      fullImageFit = "contain",
      imageMode = "full",
      textBoxStart,
      textBoxEnd,
      selected = false,
      draggable = false,
      targetable = false,
      illegal = false,
      highlighted = false,
      dimmed = false,
      accessibleLabel,
      tabIndex = -1,
      onClick,
      onDblClick,
      onContextMenu,
      onDragStart,
      onDragEnd,
      onHoverEnter,
      onHoverLeave,
      onImageError,
    },
    ref,
  ) {
    const renderedEntity = projectSimulatorEntityForFace(entity);
    const isHidden = renderedEntity.face === "hidden";
    const title = renderedEntity.title;
    const displayKind = renderedEntity.kind;
    const subtitle = isHidden
      ? renderedEntity.subtitle
      : `${renderedEntity.subtitle} | ${displayKind}`;
    const frameColor = renderedEntity.frameStyle?.color;
    const cardImageUrl = isHidden ? renderedEntity.backImageUrl : renderedEntity.imageUrl;
    const [imageUnavailable, setImageUnavailable] = useState(false);

    // A stale or not-yet-published CDN URL must leave a readable card, rather
    // than an empty black image frame. Reset when this entity receives new art.
    useEffect(() => setImageUnavailable(false), [cardImageUrl]);

    const usesFullCardImage = Boolean(cardImageUrl) && !imageUnavailable;
    const sourceAspectRatio = renderedEntity.imageAspectRatio ?? STANDARD_CARD_IMAGE_ASPECT_RATIO;
    const noTextBounds =
      imageMode === "no-text"
        ? validateNoTextBounds(textBoxStart ?? Number.NaN, textBoxEnd ?? Number.NaN)
        : null;
    const renderedAspectRatio = noTextBounds
      ? sourceAspectRatio / (noTextBounds.start + 1 - noTextBounds.end)
      : sourceAspectRatio;
    const visibleDecorations = renderedEntity.decorations ?? [];
    const decorationLabels = visibleDecorations
      .map((decoration) => decoration.ariaLabel)
      .filter((label): label is string => Boolean(label));
    const ariaLabel =
      accessibleLabel ??
      (isHidden
        ? "Hidden card"
        : [
            title,
            displayKind,
            renderedEntity.ownerId,
            renderedEntity.accessibilityDescription,
            ...decorationLabels,
          ]
            .filter(Boolean)
            .join(", "));
    const visibleStates = renderedEntity.states;
    const visibleStats = renderedEntity.stats;
    const visibleTraits = renderedEntity.traits;

    const cardClass = cx(
      "sim-card-face relative grid select-none rounded-md border bg-[var(--card-bg)] text-[var(--board-text)] transition-colors",
      density === "mini" && "min-h-[86px] w-[60px] gap-1 p-1",
      density === "compact" && "min-h-[118px] flex-[0_1_138px] gap-2 p-2",
      density === "normal" && "min-h-[138px] flex-[0_1_156px] gap-2 p-2.5",
      density === "large" && "min-h-[174px] flex-[0_1_176px] gap-2 p-3",
      density === "full" && "min-h-[240px] flex-[0_1_240px] gap-2.5 p-3.5",
      displayKind === "leader" || displayKind === "unit"
        ? "border-[var(--game-accent)]"
        : "border-[var(--card-border)]",
      (displayKind === "die" || displayKind === "resource" || displayKind === "token") &&
        "bg-[var(--pill-bg)]",
      selected &&
        "is-selected border-[var(--game-accent)] shadow-[0_0_0_2px_color-mix(in_srgb,var(--game-accent)_22%,transparent)]",
      draggable && "cursor-grab active:cursor-grabbing",
      targetable && "cursor-crosshair ring-2 ring-[var(--game-accent)]/40",
      illegal && "opacity-40 grayscale",
      highlighted && "ring-2 ring-yellow-400/70 shadow-lg shadow-yellow-400/20",
      dimmed && "opacity-50",
      usesFullCardImage && "overflow-hidden",
      usesFullCardImage && fullImageChrome === "edge-to-edge" && "border-0",
    );

    const artClass = cx(
      "sim-card-art relative overflow-hidden rounded-[5px]",
      density === "mini" && "min-h-[28px]",
      density === "compact" && "min-h-[42px]",
      density === "normal" && "min-h-[54px]",
      density === "large" && "min-h-[72px]",
      density === "full" && "min-h-[110px]",
    );

    const handleClick = useCallback(() => onClick?.(entity), [entity, onClick]);
    const handleDblClick = useCallback(() => onDblClick?.(entity), [entity, onDblClick]);
    const handleContextMenu = useCallback(
      (e: React.MouseEvent) => {
        e.preventDefault();
        onContextMenu?.(entity, e);
      },
      [entity, onContextMenu],
    );
    const handleDragStart = useCallback(
      (e: React.DragEvent) => {
        if (!draggable) {
          e.preventDefault();
          return;
        }
        e.dataTransfer?.setData("text/plain", entity.id);
        e.dataTransfer?.setData("application/json", JSON.stringify({ entityId: entity.id }));
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        onDragStart?.(entity, e);
      },
      [entity, draggable, onDragStart],
    );
    const handleDragEnd = useCallback(
      (e: React.DragEvent) => onDragEnd?.(entity, e),
      [entity, onDragEnd],
    );
    const handleMouseEnter = useCallback(() => onHoverEnter?.(entity), [entity, onHoverEnter]);
    const handleMouseLeave = useCallback(() => onHoverLeave?.(entity), [entity, onHoverLeave]);
    const handleImageError = useCallback(() => {
      setImageUnavailable(true);
      onImageError?.(entity);
    }, [entity, onImageError]);

    const Element = as;
    return (
      <Element
        ref={ref as Ref<HTMLButtonElement> & Ref<HTMLDivElement>}
        {...(as === "button" ? { type: "button" as const } : {})}
        className={cardClass}
        data-testid="card"
        data-card-density={density}
        data-card-image-mode={usesFullCardImage ? imageMode : undefined}
        data-card-kind={displayKind}
        data-card-id={isHidden ? undefined : renderedEntity.id}
        data-face={isHidden ? "hidden" : "public"}
        id={isHidden ? undefined : `entity-${renderedEntity.id}`}
        data-entity-id={isHidden ? undefined : renderedEntity.id}
        data-sim-entity-id={isHidden ? undefined : renderedEntity.id}
        {...Object.fromEntries(
          Object.entries(renderedEntity.dataAttributes ?? {}).filter(
            ([, value]) => value !== undefined,
          ),
        )}
        aria-label={ariaLabel}
        tabIndex={tabIndex}
        draggable={draggable}
        onClick={handleClick}
        onDoubleClick={handleDblClick}
        onContextMenu={handleContextMenu}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={
          usesFullCardImage
            ? {
                // Games project their native ratio so layout is stable before
                // the browser starts decoding the image.
                aspectRatio: renderedAspectRatio,
                borderColor: frameColor,
                justifySelf: fill ? undefined : "start",
                maxWidth: "100%",
                minHeight: 0,
                padding: 0,
                width: fill || imageMode === "no-text" ? "100%" : FULL_IMAGE_CARD_WIDTH[density],
              }
            : frameColor
              ? { borderColor: frameColor }
              : undefined
        }
      >
        {usesFullCardImage && imageMode === "no-text" && cardImageUrl && noTextBounds ? (
          <div
            className="sim-card-image-slices absolute inset-0 flex flex-col"
            data-card-image-mode="no-text"
            aria-hidden="true"
          >
            <CardImageSlice
              src={cardImageUrl}
              aspectRatio={sourceAspectRatio / noTextBounds.start}
              position="top"
            />
            <CardImageSlice
              src={cardImageUrl}
              aspectRatio={sourceAspectRatio / (1 - noTextBounds.end)}
              position="bottom"
            />
            {visibleDecorations.length > 0 &&
              visibleDecorations.map((decoration) => (
                <span
                  key={decoration.id}
                  aria-label={decoration.ariaLabel}
                  className={cx(
                    "absolute inline-flex min-h-[18px] items-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-sm",
                    decoration.slot === "top-start" && "left-1 top-1",
                    decoration.slot === "top-end" && "right-1 top-1",
                    decoration.slot === "bottom-start" && "bottom-1 left-1",
                    decoration.slot === "bottom-end" && "bottom-1 right-1",
                    decoration.tone === "positive" && "bg-emerald-600",
                    decoration.tone === "negative" && "bg-red-600",
                    decoration.tone === "warning" && "bg-amber-500",
                    (!decoration.tone || decoration.tone === "neutral") && "bg-slate-600",
                  )}
                  data-decoration-id={decoration.id}
                >
                  {decoration.content.kind === "text" ? decoration.content.text : "●"}
                </span>
              ))}
          </div>
        ) : usesFullCardImage ? (
          <div className="absolute inset-0" aria-hidden="true">
            <ViewerSafeCardImage
              entity={renderedEntity}
              alt={title}
              className={cx(
                "absolute inset-0 rounded-[5px] bg-black",
                fullImageFit === "cover" ? "object-cover" : "object-contain",
              )}
              loading="eager"
              onImageError={handleImageError}
            />
            {visibleDecorations.length > 0 &&
              visibleDecorations.map((decoration) => (
                <span
                  key={decoration.id}
                  aria-label={decoration.ariaLabel}
                  className={cx(
                    "absolute inline-flex min-h-[18px] items-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-sm",
                    decoration.slot === "top-start" && "left-1 top-1",
                    decoration.slot === "top-end" && "right-1 top-1",
                    decoration.slot === "bottom-start" && "bottom-1 left-1",
                    decoration.slot === "bottom-end" && "bottom-1 right-1",
                    decoration.tone === "positive" && "bg-emerald-600",
                    decoration.tone === "negative" && "bg-red-600",
                    decoration.tone === "warning" && "bg-amber-500",
                    (!decoration.tone || decoration.tone === "neutral") && "bg-slate-600",
                  )}
                  data-decoration-id={decoration.id}
                >
                  {decoration.content.kind === "text" ? decoration.content.text : "●"}
                </span>
              ))}
          </div>
        ) : (
          <div className={artClass} aria-hidden="true">
            {isHidden ? (
              <>
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "repeating-linear-gradient(45deg,var(--card-art-a),var(--card-art-a)_6px,var(--card-art-b)_6px,var(--card-art-b)_12px)",
                  }}
                />
                <div className="absolute inset-0 grid place-items-center">
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--board-muted)]/60">
                    Hidden
                  </span>
                </div>
              </>
            ) : (
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(135deg,var(--card-art-a),var(--card-art-b)_52%,var(--card-art-c))",
                }}
              />
            )}

            {visibleDecorations.length > 0 &&
              visibleDecorations.map((decoration) => (
                <span
                  key={decoration.id}
                  aria-label={decoration.ariaLabel}
                  className={cx(
                    "absolute inline-flex min-h-[18px] items-center rounded-full px-1.5 py-0.5 text-[10px] font-black leading-none text-white shadow-sm",
                    decoration.slot === "top-start" && "left-1 top-1",
                    decoration.slot === "top-end" && "right-1 top-1",
                    decoration.slot === "bottom-start" && "bottom-1 left-1",
                    decoration.slot === "bottom-end" && "bottom-1 right-1",
                    decoration.tone === "positive" && "bg-emerald-600",
                    decoration.tone === "negative" && "bg-red-600",
                    decoration.tone === "warning" && "bg-amber-500",
                    (!decoration.tone || decoration.tone === "neutral") && "bg-slate-600",
                  )}
                  data-decoration-id={decoration.id}
                >
                  {decoration.content.kind === "text" ? decoration.content.text : "●"}
                </span>
              ))}
          </div>
        )}

        {!usesFullCardImage &&
          (density !== "mini" ? (
            <div className="sim-card-header grid items-start gap-2">
              <div className="min-w-0">
                <p className="text-[11px] font-bold leading-tight text-[var(--board-muted)]">
                  {subtitle}
                </p>
                <h4 className="mt-1 text-sm font-black leading-tight text-[var(--board-text)]">
                  {title}
                </h4>
              </div>
              <span className="entity-kind inline-flex min-h-6 items-center self-start rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-black uppercase leading-none text-[var(--pill-text)]">
                {displayKind}
              </span>
            </div>
          ) : (
            <div className="min-w-0">
              <h4 className="truncate text-[10px] font-black leading-tight text-[var(--board-text)]">
                {title}
              </h4>
            </div>
          ))}

        {!usesFullCardImage && visibleStates.length > 0 && density !== "mini" && (
          <div className="entity-states flex flex-wrap gap-1">
            {visibleStates.map((state, index) => (
              <span
                key={`${state}:${index}`}
                className="entity-state inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
              >
                {state}
              </span>
            ))}
          </div>
        )}

        {!usesFullCardImage && visibleStats.length > 0 && density !== "mini" && (
          <div className="entity-stats grid grid-cols-[repeat(auto-fit,minmax(68px,1fr))] gap-1.5">
            {visibleStats.map((stat, index) => (
              <span
                key={`${stat.label}:${stat.value}:${index}`}
                className="entity-stat inline-grid min-w-16 gap-0.5 rounded-md border border-[var(--board-border)] bg-[var(--board-surface)] px-2 py-1.5"
              >
                <span className="text-[11px] font-extrabold uppercase leading-none text-[var(--board-muted)]">
                  {stat.label}
                </span>
                <strong className="text-sm leading-none text-[var(--board-text)]">
                  {stat.value}
                </strong>
              </span>
            ))}
          </div>
        )}

        {!usesFullCardImage &&
          visibleTraits.length > 0 &&
          density !== "mini" &&
          density !== "compact" && (
            <div className="entity-traits flex flex-wrap gap-1">
              {visibleTraits.map((trait, index) => (
                <span
                  key={`${trait}:${index}`}
                  className="entity-trait inline-flex min-h-6 items-center rounded-full border border-[var(--pill-border)] bg-[var(--pill-bg)] px-2 py-1 text-[11px] font-extrabold leading-none text-[var(--pill-text)]"
                >
                  {trait}
                </span>
              ))}
            </div>
          )}
      </Element>
    );
  }),
);

CardFace.displayName = "CardFace";

function CardImageSlice({
  src,
  aspectRatio,
  position,
}: {
  src: string;
  aspectRatio: number;
  position: "top" | "bottom";
}) {
  const style: CSSProperties = {
    aspectRatio,
    backgroundImage: `url(${JSON.stringify(src)})`,
    backgroundPosition: `center ${position}`,
    backgroundRepeat: "no-repeat",
    backgroundSize: "100% auto",
    width: "100%",
  };

  return (
    <span className="sim-card-image-slice block shrink-0" data-slice={position} style={style} />
  );
}
