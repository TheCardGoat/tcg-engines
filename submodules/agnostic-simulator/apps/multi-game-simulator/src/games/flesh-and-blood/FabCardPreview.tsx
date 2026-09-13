import { ViewerSafeCardImage } from "@tcg/simulator-ui";
import { Button } from "@mantine/core";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { X } from "lucide-react";
import {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type FocusEvent,
  type ReactNode,
} from "react";

import { FabOfficialIcon, FabPitchGem } from "./FabIconography";
import { FabSymbolText } from "./FabSymbolText";
import { FabCardPreviewContext, type FabCardPreviewContextValue } from "./FabCardPreviewContext";
import type { FabCardArtResolver } from "./cardArt";
import { useFabCardArt, useFabCardLocale } from "./FabPresentationCatalog";
import { useFabImageRetry } from "./useFabImageRetry";
import { isFabFixtureArtPlaceholder } from "./fixture-art-placeholders";

type PreviewImageStatus = "loading" | "loaded" | "error";

const DESKTOP_PREVIEW_WIDTH_PX = 240;
const DESKTOP_PREVIEW_GAP_PX = 12;
const DESKTOP_PREVIEW_EDGE_PX = 16;

export const FAB_PREVIEW_TARGET_ATTR = "data-fab-preview-id";

function samePreview(current: SimulatorEntity | null, next: SimulatorEntity): boolean {
  return current?.id === next.id && current.imageUrl === next.imageUrl;
}

function FabCardPreviewStatIcon({ label, value }: { label: string; value: string }) {
  switch (label.toLocaleLowerCase()) {
    case "pitch": {
      const pitch = Number(value);
      return Number.isInteger(pitch) && pitch > 0 ? <FabPitchGem pitch={pitch} size={18} /> : label;
    }
    case "attack":
    case "power":
      return <FabOfficialIcon id="power" size={18} alt={label} />;
    case "defense":
      return <FabOfficialIcon id="defense" size={18} alt="Defense" />;
    case "cost":
      return <FabOfficialIcon id="cost" size={18} alt="Cost" />;
    default:
      return label;
  }
}

/**
 * Previews use the full asset for the exact printing when one is projected.
 * A missing printing never silently substitutes artwork from another printing.
 */
function fullPreviewEntity(
  entity: SimulatorEntity,
  locale: string,
  resolver: FabCardArtResolver,
): SimulatorEntity {
  const canonicalId = entity.dataAttributes?.["data-fab-canonical-id"];
  if (entity.face !== "public") return entity;
  if (typeof canonicalId !== "string") {
    return entity.imageUrl?.startsWith("https://cdn.tcg.online/public/fab/assets/full/")
      ? entity
      : { ...entity, imageUrl: undefined };
  }

  const printingId = entity.dataAttributes?.["data-fab-printing-id"];
  const identity = {
    locale,
    canonicalId,
    name: entity.title,
    ...(typeof printingId === "string" ? { printingId } : {}),
  };
  const art = resolver.resolveFabCardArt(identity);
  const imageUrl = art.printedImageUrl;
  if (!imageUrl) return { ...entity, imageUrl: undefined };

  return {
    ...entity,
    imageUrl,
    imageAspectRatio: art.printedImageAspectRatio,
    dataAttributes: {
      ...entity.dataAttributes,
      "data-art-variant": "printed",
      "data-fab-asset-locale": art.assetLocale,
      "data-fab-asset-locale-fallback": art.localeFallback ? "true" : undefined,
    },
  };
}

/**
 * Reusable card inspection surface. It uses the published full-card asset and
 * never loads catalog-provider image URLs.
 */
export function FabCardPreviewSurface({
  entity,
  onClose,
}: {
  entity: SimulatorEntity;
  onClose?: () => void;
}) {
  const locale = useFabCardLocale();
  const resolver = useFabCardArt();
  const preview = useMemo(
    () => fullPreviewEntity(entity, locale, resolver),
    [entity, locale, resolver],
  );
  const [loadedImage, setLoadedImage] = useState<string>();
  const imageRef = useRef<HTMLImageElement>(null);
  const [rotatedImage, setRotatedImage] = useState<string>();
  const retry = useFabImageRetry(preview.imageUrl);
  const imageStatus: PreviewImageStatus = !preview.imageUrl
    ? "error"
    : retry.failed
      ? "error"
      : loadedImage === retry.key
        ? "loaded"
        : "loading";

  return (
    <div
      className="fab-card-preview-surface"
      data-testid="fab-card-preview-surface"
      data-rotated={rotatedImage === retry.key || undefined}
      style={
        {
          aspectRatio: preview.imageAspectRatio,
          "--fab-preview-ratio": preview.imageAspectRatio,
        } as CSSProperties
      }
    >
      <ViewerSafeCardImage
        key={retry.key}
        entity={preview}
        imageRef={imageRef}
        className="fab-card-preview-image"
        loading="eager"
        onImageLoad={() => {
          const image = imageRef.current;
          setRotatedImage(
            image && (preview.imageAspectRatio ?? 0) > 1 && image.naturalHeight > image.naturalWidth
              ? retry.key
              : undefined,
          );
          setLoadedImage(retry.key);
        }}
        onImageError={retry.fail}
      />
      {imageStatus !== "loaded" ? (
        <FabCardPreviewFallback
          entity={preview}
          status={imageStatus}
          onRetry={preview.imageUrl && retry.failed ? retry.retry : undefined}
        />
      ) : null}
      {onClose ? (
        <button
          type="button"
          className="fab-card-preview-close"
          aria-label="Close card preview"
          onClick={onClose}
        >
          <X size={16} strokeWidth={2.4} aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}

export function FabCardPreviewProvider({
  children,
  disabled = false,
}: {
  children: ReactNode;
  disabled?: boolean;
}) {
  const [hover, setHoverState] = useState<SimulatorEntity | null>(null);
  const [hoverLeft, setHoverLeft] = useState(0);
  const [pinned, setPinnedState] = useState<SimulatorEntity | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const pinnedRef = useRef(false);
  const disabledRef = useRef(disabled);
  disabledRef.current = disabled;
  const locale = useFabCardLocale();
  const resolver = useFabCardArt();
  const preview = pinned ?? hover;

  useEffect(() => {
    if (!disabled) return;
    pinnedRef.current = false;
    setPinnedState(null);
    setHoverState(null);
  }, [disabled]);

  const hide = useCallback(() => {
    pinnedRef.current = false;
    setPinnedState(null);
    setHoverState(null);
  }, []);

  useEffect(() => {
    if (!preview) return;
    const dismissPreview = (event: globalThis.KeyboardEvent) => {
      if (event.key !== "Escape") return;
      // The preview sits above dialogs and popovers; dismiss this layer before
      // their document-level Escape handlers can close the underlying panel.
      event.preventDefault();
      event.stopPropagation();
      hide();
    };
    const containPreviewPointer = (event: PointerEvent) => {
      if (event.target instanceof Node && previewRef.current?.contains(event.target)) {
        // Keep the opener focused: focus-out would dismiss its popover and
        // restore focus to the card, immediately reopening a hover preview.
        event.preventDefault();
        event.stopPropagation();
      } else {
        hide();
      }
    };
    window.addEventListener("keydown", dismissPreview, true);
    window.addEventListener("pointerdown", containPreviewPointer, true);
    return () => {
      window.removeEventListener("keydown", dismissPreview, true);
      window.removeEventListener("pointerdown", containPreviewPointer, true);
    };
  }, [hide, preview]);

  const setHover = useCallback(
    (entity: SimulatorEntity, trigger?: HTMLElement) => {
      // Hidden faces never become readable previews. Hover also cannot replace
      // an explicit inspect pin.
      if (disabledRef.current || pinnedRef.current || entity.face !== "public") return;
      const fullCardEntity = fullPreviewEntity(entity, locale, resolver);
      const triggerRect = trigger?.getBoundingClientRect();
      const overlapsDefaultPreview =
        triggerRect !== undefined &&
        triggerRect.left < DESKTOP_PREVIEW_WIDTH_PX &&
        triggerRect.right > 0;
      setHoverLeft(
        overlapsDefaultPreview
          ? Math.min(
              triggerRect.right + DESKTOP_PREVIEW_GAP_PX,
              Math.max(
                DESKTOP_PREVIEW_EDGE_PX,
                window.innerWidth - DESKTOP_PREVIEW_WIDTH_PX - DESKTOP_PREVIEW_EDGE_PX,
              ),
            )
          : 0,
      );
      setHoverState((current) => (samePreview(current, fullCardEntity) ? current : fullCardEntity));
    },
    [locale, resolver],
  );

  const clearHover = useCallback((entityId: string) => {
    if (pinnedRef.current) return;
    setHoverState((current) => (current?.id === entityId ? null : current));
  }, []);

  const pin = useCallback(
    (entity: SimulatorEntity) => {
      if (disabledRef.current || entity.face !== "public") return;
      pinnedRef.current = true;
      const fullCardEntity = fullPreviewEntity(entity, locale, resolver);
      setPinnedState((current) =>
        samePreview(current, fullCardEntity) ? current : fullCardEntity,
      );
    },
    [locale, resolver],
  );

  const value = useMemo<FabCardPreviewContextValue>(
    () => ({ setHover, clearHover, pin, hide }),
    [clearHover, hide, pin, setHover],
  );

  return (
    <FabCardPreviewContext.Provider value={value}>
      {children}
      <div
        ref={previewRef}
        className="fab-card-preview"
        data-testid="fab-card-preview"
        data-visible={preview ? "true" : undefined}
        data-mode={preview ? (pinned ? "pinned" : "hover") : undefined}
        aria-hidden={!preview}
        style={
          preview
            ? ({
                aspectRatio: preview.imageAspectRatio,
                "--fab-preview-left": `${hoverLeft}px`,
              } as CSSProperties)
            : undefined
        }
      >
        {preview ? <FabCardPreviewSurface entity={preview} onClose={hide} /> : null}
      </div>
    </FabCardPreviewContext.Provider>
  );
}

export function useFabPreviewTarget(
  entity: SimulatorEntity,
  options?: { enabled?: boolean; pinOnClick?: boolean },
) {
  const { setHover, clearHover, pin } = useFabCardPreview();
  const enabled = (options?.enabled ?? true) && entity.face === "public";
  const pinOnClick = options?.pinOnClick === true;
  const entityRef = useRef(entity);
  entityRef.current = entity;

  const occupy = useCallback(
    (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      if (!enabled) return;
      setHover(entityRef.current, event.currentTarget);
    },
    [enabled, setHover],
  );

  const leave = useCallback(
    (event: MouseEvent<HTMLElement> | FocusEvent<HTMLElement>) => {
      if (event.relatedTarget instanceof Node && event.currentTarget.contains(event.relatedTarget))
        return;
      if (enabled) clearHover(entityRef.current.id);
    },
    [clearHover, enabled],
  );

  const inspect = useCallback(() => {
    if (!enabled) return;
    pin(entityRef.current);
  }, [enabled, pin]);

  return {
    occupy,
    previewProps: {
      ...(enabled ? { [FAB_PREVIEW_TARGET_ATTR]: entity.id } : {}),
      onMouseEnter: occupy,
      onMouseLeave: leave,
      onFocus: occupy,
      onBlur: leave,
      ...(enabled && pinOnClick
        ? {
            onClick: inspect,
            onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
              if (event.key !== "Enter" && event.key !== " ") return;
              event.preventDefault();
              event.stopPropagation();
              inspect();
            },
          }
        : {}),
    },
  };
}

/**
 * Readable last-resort card face shared by the hover preview and board cards
 * whose art has not loaded or is not available in the presentation catalog.
 */
export function FabCardPreviewFallback({
  entity,
  status,
  variant = "preview",
  onRetry,
}: {
  entity: SimulatorEntity;
  status: Exclude<PreviewImageStatus, "loaded">;
  variant?: "preview" | "board";
  onRetry?: () => void;
}) {
  const rules = entity.details?.rules ?? [];
  const announceStatus = variant === "preview";
  const canonicalId = entity.dataAttributes?.["data-fab-canonical-id"];
  const placeholder = isFabFixtureArtPlaceholder(
    typeof canonicalId === "string" ? canonicalId : undefined,
  );

  return (
    <div
      className={`fab-card-preview-fallback fab-card-preview-fallback--${variant}`}
      {...(announceStatus ? { role: "status", "aria-live": "polite" } : {})}
    >
      <div className="sr-only">
        <span>{variant === "preview" ? "Card preview" : "Card image"}</span>
        <span data-status={placeholder ? "placeholder" : status}>
          {placeholder
            ? "Test card placeholder"
            : status === "error"
              ? "Image unavailable"
              : "Loading art"}
        </span>
      </div>
      <strong className="fab-card-preview-fallback-title">{entity.title}</strong>
      {placeholder ? <span>Test card placeholder · No printed artwork</span> : null}
      {onRetry && !placeholder ? (
        <Button size="xs" variant="light" onClick={onRetry}>
          Retry card image
        </Button>
      ) : null}
      <span className="fab-card-preview-fallback-type">{entity.subtitle}</span>
      {entity.stats.length > 0 ? (
        <dl className="fab-card-preview-fallback-stats">
          {entity.stats.map((stat) => (
            <FabCardPreviewFallbackStat key={stat.label} label={stat.label} value={stat.value} />
          ))}
        </dl>
      ) : null}
      <div className="fab-card-preview-fallback-rules">
        {rules.length > 0 ? (
          rules.map((rule) => (
            <p key={rule.id}>
              {rule.label ? <strong>{rule.label}: </strong> : null}
              <FabSymbolText text={rule.text} />
            </p>
          ))
        ) : (
          <p>
            {placeholder
              ? "This invented card is used only by test fixtures."
              : status === "error"
                ? "The card image could not be loaded."
                : "Loading card text…"}
          </p>
        )}
      </div>
    </div>
  );
}

function FabCardPreviewFallbackStat({ label, value }: { label: string; value: string }) {
  const pitch = Number(value);
  const valueIsInsidePitchGem =
    label.toLocaleLowerCase() === "pitch" && Number.isInteger(pitch) && pitch > 0;

  return (
    <div>
      <dt>
        <FabCardPreviewStatIcon label={label} value={value} />
      </dt>
      <dd
        className={valueIsInsidePitchGem ? "visually-hidden" : undefined}
        aria-hidden={valueIsInsidePitchGem || undefined}
      >
        {value}
      </dd>
    </div>
  );
}

export function useFabCardPreview(): FabCardPreviewContextValue {
  const context = useContext(FabCardPreviewContext);
  if (!context) {
    throw new Error("useFabCardPreview must be used inside FabCardPreviewProvider.");
  }
  return context;
}
