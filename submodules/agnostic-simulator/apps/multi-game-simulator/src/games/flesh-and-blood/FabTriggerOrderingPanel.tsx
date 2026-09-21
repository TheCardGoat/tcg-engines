import type { OrderingInput } from "@tcg/protocol";
import { resolveInteractionText } from "@tcg/simulator-ui";
import * as Popover from "@radix-ui/react-popover";
import { GripVertical, ListOrdered, RotateCw } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import type { FabCardArtResolver } from "./cardArt";
import { useFabCardArt, useFabCardLocale } from "./FabPresentationCatalog";
import { FabCardArtLadderImage } from "./useFabCardArtFallback";

interface FabTriggerOrderingPanelProps {
  readonly input: OrderingInput;
  readonly disabled?: boolean;
  /** Resolves a candidate instance to its presentation identity (chosen printing included). */
  readonly identityForCard?: (
    instanceId: string,
    label: string,
  ) => {
    canonicalId?: string;
    printingId?: string;
  };
  readonly onConfirm: (engineOrder: readonly string[]) => void;
  /** Enables automatic use of the engine-presented order for this and later trigger decisions. */
  readonly onEnableAutoOrder?: () => void;
}

interface TriggerOrderingEntry {
  readonly id: string;
  readonly label: string;
  readonly sourceName: string;
  readonly imageUrl?: string;
  /** Next artwork candidate after the preferred board image. */
  readonly defaultImageUrl?: string;
  /** Printed and catalog-source candidates used before degrading to initials. */
  readonly fallbackImageUrls?: readonly string[];
}

function triggerEntry(
  input: OrderingInput,
  index: number,
  locale: string,
  resolver: FabCardArtResolver,
  identityForCard?: (
    instanceId: string,
    label: string,
  ) => {
    canonicalId?: string;
    printingId?: string;
  },
): TriggerOrderingEntry {
  const candidate = input.candidates[index]!;
  const label = resolveInteractionText(candidate.text ?? { key: candidate.entity.instanceId });
  const separator = label.lastIndexOf(": ");
  const sourceName = separator === -1 ? label : label.slice(0, separator);
  const identity = identityForCard?.(candidate.entity.instanceId, label);
  return {
    id: candidate.entity.instanceId,
    label,
    sourceName,
    ...(() => {
      const art = resolver.resolveFabCardArt({
        locale,
        canonicalId: identity?.canonicalId ?? candidate.entity.definitionId,
        printingId: identity?.printingId,
        name: sourceName,
      });
      const candidates = [art.boardImageUrl].filter((url): url is string => Boolean(url));
      const [imageUrl, defaultImageUrl, ...fallbackImageUrls] = [...new Set(candidates)];
      return imageUrl
        ? {
            imageUrl,
            ...(defaultImageUrl ? { defaultImageUrl } : {}),
            ...(fallbackImageUrls.length > 0 ? { fallbackImageUrls } : {}),
          }
        : {};
    })(),
  };
}

function moveEntry(
  entries: readonly TriggerOrderingEntry[],
  sourceId: string,
  targetId: string,
): TriggerOrderingEntry[] {
  const sourceIndex = entries.findIndex((entry) => entry.id === sourceId);
  const targetIndex = entries.findIndex((entry) => entry.id === targetId);
  if (sourceIndex === -1 || targetIndex === -1 || sourceIndex === targetIndex) return [...entries];
  const next = [...entries];
  const [source] = next.splice(sourceIndex, 1);
  if (!source) return next;
  next.splice(targetIndex, 0, source);
  return next;
}

export function FabTriggerOrderingPanel({
  input,
  disabled = false,
  identityForCard,
  onConfirm,
  onEnableAutoOrder,
}: FabTriggerOrderingPanelProps) {
  const locale = useFabCardLocale();
  const resolver = useFabCardArt();
  const projectedEntries = useMemo(
    () =>
      input.candidates.map((_, index) =>
        triggerEntry(input, index, locale, resolver, identityForCard),
      ),
    [identityForCard, input, locale, resolver],
  );
  // The engine records the order layers are added (bottom to top). Players
  // reason about the inverse: the top layer resolves first.
  const initialResolutionOrder = useMemo(() => [...projectedEntries].reverse(), [projectedEntries]);
  const [resolutionOrder, setResolutionOrder] = useState(initialResolutionOrder);
  const [orderAnnouncement, setOrderAnnouncement] = useState("");
  const [autoOrderPopoverOpen, setAutoOrderPopoverOpen] = useState(false);
  const draggedIdRef = useRef<string | null>(null);
  const didDragRef = useRef(false);
  const pendingAnnouncementRef = useRef<string | null>(null);

  useEffect(() => {
    setResolutionOrder(initialResolutionOrder);
  }, [initialResolutionOrder, input.id]);

  useEffect(() => {
    const announcement = pendingAnnouncementRef.current;
    if (!announcement) return;
    pendingAnnouncementRef.current = null;
    setOrderAnnouncement(announcement);
  }, [resolutionOrder]);

  const reorder = (sourceId: string, targetId: string) => {
    setResolutionOrder((current) => {
      const next = moveEntry(current, sourceId, targetId);
      const moved = next.find((entry) => entry.id === sourceId);
      const position = next.findIndex((entry) => entry.id === sourceId);
      if (moved && position !== -1) {
        pendingAnnouncementRef.current = `${moved.sourceName} moved to position ${position + 1} of ${next.length}${position === 0 ? "; resolves first" : ""}.`;
      }
      return next;
    });
  };
  const rotateOrder = () => {
    setResolutionOrder((current) => {
      if (current.length < 2) return current;
      const next = [...current.slice(1), current[0]!];
      pendingAnnouncementRef.current = `${next[0]!.sourceName} now resolves first.`;
      return next;
    });
  };

  return (
    <section
      className="fab-trigger-order-panel"
      data-testid="fab-trigger-order-panel"
      aria-labelledby="fab-trigger-order-heading"
    >
      <header className="fab-trigger-order-heading">
        <span id="fab-trigger-order-heading">Triggers</span>
        <span>{resolutionOrder.length} abilities</span>
      </header>

      <ol
        className="fab-trigger-order-list"
        aria-label="Trigger resolution order. The front card resolves first."
      >
        {resolutionOrder.map((entry, index) => (
          <li
            key={entry.id}
            className="fab-trigger-order-entry"
            data-trigger-order-id={entry.id}
            style={
              {
                "--fab-trigger-order-index": index,
                zIndex: resolutionOrder.length - index,
              } as CSSProperties
            }
          >
            <button
              type="button"
              className="fab-trigger-order-card"
              disabled={disabled}
              aria-label={`${index === 0 ? "Resolves first" : `Resolves ${index + 1}`}: ${entry.label}. Click to resolve this first; drag to reorder; use the left and right arrow keys for keyboard ordering.`}
              onPointerDown={(event) => {
                if (event.button === 0 && event.pointerType !== "touch") {
                  draggedIdRef.current = entry.id;
                  didDragRef.current = false;
                  event.currentTarget.setPointerCapture?.(event.pointerId);
                }
              }}
              onPointerMove={(event) => {
                if (event.pointerType === "touch") return;
                const sourceId = draggedIdRef.current;
                if (!sourceId || event.buttons !== 1) return;
                const target = document
                  .elementFromPoint?.(event.clientX, event.clientY)
                  ?.closest<HTMLElement>("[data-trigger-order-id]");
                const targetId = target?.dataset.triggerOrderId;
                if (targetId && targetId !== sourceId) {
                  didDragRef.current = true;
                  reorder(sourceId, targetId);
                }
              }}
              onPointerEnter={(event) => {
                if (event.pointerType === "touch") return;
                const sourceId = draggedIdRef.current;
                if (event.buttons === 1 && sourceId && sourceId !== entry.id) {
                  didDragRef.current = true;
                  reorder(sourceId, entry.id);
                }
              }}
              onPointerUp={(event) => {
                draggedIdRef.current = null;
                if (event.currentTarget.hasPointerCapture?.(event.pointerId)) {
                  event.currentTarget.releasePointerCapture(event.pointerId);
                }
                window.setTimeout(() => {
                  didDragRef.current = false;
                }, 0);
              }}
              onPointerCancel={() => {
                draggedIdRef.current = null;
                didDragRef.current = false;
              }}
              onClick={() => {
                if (didDragRef.current) {
                  didDragRef.current = false;
                  return;
                }
                const first = resolutionOrder[0];
                if (first && first.id !== entry.id) reorder(entry.id, first.id);
              }}
              onKeyDown={(event) => {
                if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
                event.preventDefault();
                const offset = event.key === "ArrowLeft" ? -1 : 1;
                const target = resolutionOrder[index + offset];
                if (target) reorder(entry.id, target.id);
              }}
            >
              <span className="fab-trigger-order-art" aria-hidden="true">
                {entry.imageUrl ? (
                  <FabCardArtLadderImage
                    src={entry.imageUrl}
                    defaultSrc={entry.defaultImageUrl}
                    fallbackSrcs={entry.fallbackImageUrls}
                    variant="no-text"
                    fallback={
                      <span className="fab-trigger-order-fallback">{entry.sourceName}</span>
                    }
                  />
                ) : null}
                {!entry.imageUrl ? (
                  <span className="fab-trigger-order-fallback">{entry.sourceName}</span>
                ) : null}
              </span>
              <span className="fab-trigger-order-grip" aria-hidden="true">
                <GripVertical size={16} />
              </span>
              <span className="fab-trigger-order-position" aria-hidden="true">
                {index === 0 ? "First" : index + 1}
              </span>
            </button>
          </li>
        ))}
      </ol>

      {onEnableAutoOrder ? (
        <Popover.Root open={autoOrderPopoverOpen} onOpenChange={setAutoOrderPopoverOpen}>
          <Popover.Trigger asChild>
            <button
              type="button"
              className="fab-trigger-order-auto-control"
              aria-label="Configure automatic simultaneous trigger ordering"
              title="Automatically use this order for future simultaneous triggers"
            >
              <ListOrdered size={15} aria-hidden="true" />
            </button>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Content
              className="fab-trigger-order-auto-popover"
              side="right"
              align="start"
              sideOffset={8}
              collisionPadding={12}
            >
              <strong>Auto-order triggers</strong>
              <span>
                Use this listed order now and for future simultaneous triggers you control.
              </span>
              <button
                type="button"
                onClick={() => {
                  onEnableAutoOrder();
                  setAutoOrderPopoverOpen(false);
                }}
              >
                Enable auto-order
              </button>
              <small>Turn it off in Game settings.</small>
              <Popover.Arrow className="fab-trigger-order-auto-popover-arrow" />
            </Popover.Content>
          </Popover.Portal>
        </Popover.Root>
      ) : null}

      <footer className="fab-trigger-order-footer">
        <button
          type="button"
          className="fab-trigger-order-swap"
          disabled={disabled || resolutionOrder.length < 2}
          aria-label="Swap order: move the first trigger to the end"
          onClick={rotateOrder}
        >
          <RotateCw size={12} aria-hidden="true" />
          Swap order
        </button>
        <button
          type="button"
          className="fab-trigger-order-confirm"
          data-testid="fab-trigger-order-confirm"
          disabled={disabled}
          onClick={() => onConfirm(resolutionOrder.map((entry) => entry.id).reverse())}
        >
          Confirm order
        </button>
      </footer>
      <span className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {orderAnnouncement}
      </span>
    </section>
  );
}
