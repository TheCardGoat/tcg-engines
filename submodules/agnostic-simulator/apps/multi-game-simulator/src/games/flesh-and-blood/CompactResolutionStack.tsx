import { useEffect, useId, useRef, useState } from "react";
import { ArrowDown, ArrowUp, RotateCcw } from "lucide-react";
import { AnimatedEntityCollection, AnimatedEntityListItem } from "@tcg/simulator-ui";

import type { FabCombatStackEntryView } from "./combatChainView";
import { FabBoardCardFace } from "./FabBoardCardFace";
import { useFabCardPreview, useFabPreviewTarget } from "./FabCardPreview";
import {
  FabOpponentTriggerYieldControl,
  type FabOpponentTriggerYieldAction,
} from "./FabOpponentTriggerYield";

export interface CompactResolutionStackProps {
  readonly stack: readonly FabCombatStackEntryView[];
  readonly viewerId?: string;
  readonly ownerLabels?: Readonly<Record<string, string>>;
  readonly interactionMode: "desktop" | "mobile";
  readonly placement?: "center" | "top" | "bottom";
  readonly onCyclePlacement?: () => void;
  readonly opponentYieldAction?: FabOpponentTriggerYieldAction;
  readonly minimized?: boolean;
}

function CompactResolutionCard({
  entry,
  ownerLabel,
  interactionMode,
  expanded,
  onExpand,
  onCollapse,
  onOccupied,
}: {
  readonly entry: FabCombatStackEntryView;
  readonly ownerLabel: string;
  readonly interactionMode: "desktop" | "mobile";
  readonly expanded: boolean;
  readonly onExpand: () => void;
  readonly onCollapse: () => void;
  readonly onOccupied: (entry: FabCombatStackEntryView) => void;
}) {
  const { pin } = useFabCardPreview();
  const previewTarget = useFabPreviewTarget(entry.entity, {
    enabled: interactionMode === "desktop",
  });
  return (
    <button
      type="button"
      className="fab-compact-resolution-card"
      data-testid={`fab-compact-resolution-entry-${entry.order}`}
      aria-label={`Stack layer ${entry.order}, ${entry.order === 1 ? "resolves next" : `resolves after layer ${entry.order - 1}`}: ${entry.entity.title}, owned by ${ownerLabel}`}
      aria-expanded={interactionMode === "mobile" ? expanded : undefined}
      {...previewTarget.previewProps}
      onMouseEnter={
        interactionMode === "desktop"
          ? (event) => {
              previewTarget.occupy(event);
              onOccupied(entry);
            }
          : undefined
      }
      onFocus={
        interactionMode === "desktop"
          ? (event) => {
              previewTarget.occupy(event);
              onOccupied(entry);
            }
          : undefined
      }
      onClick={
        interactionMode === "mobile"
          ? () => {
              if (!expanded) {
                onExpand();
                return;
              }
              pin(entry.entity);
              onOccupied(entry);
              onCollapse();
            }
          : undefined
      }
    >
      <span className="fab-compact-resolution-art" aria-hidden="true">
        <FabBoardCardFace
          entity={entry.entity}
          density="mini"
          fill
          frameBadges="hide"
          preview={false}
        />
      </span>
      <span className="fab-compact-resolution-owner" aria-hidden="true">
        {ownerLabel}
      </span>
    </button>
  );
}

function ownerLabelFor(
  entry: FabCombatStackEntryView,
  viewerId: string | undefined,
  ownerLabels: Readonly<Record<string, string>> | undefined,
): string {
  if (ownerLabels?.[entry.entity.ownerId]) return ownerLabels[entry.entity.ownerId];
  if (viewerId == null) return entry.entity.ownerId;
  return entry.entity.ownerId === viewerId ? "You" : "Opponent";
}

export function CompactResolutionStack({
  stack,
  viewerId,
  ownerLabels,
  interactionMode,
  placement = "center",
  onCyclePlacement,
  opponentYieldAction,
  minimized = false,
}: CompactResolutionStackProps) {
  const [expanded, setExpanded] = useState(false);
  const headingId = useId();
  const rootRef = useRef<HTMLOListElement>(null);
  const { setHover, clearHover } = useFabCardPreview();
  const activePreviewIdRef = useRef<string | null>(null);
  const stackIdentity = stack.map((entry) => `${entry.order}:${entry.entity.id}`).join("|");
  const previousStackIdentityRef = useRef(stackIdentity);

  useEffect(() => {
    if (previousStackIdentityRef.current === stackIdentity) return;
    previousStackIdentityRef.current = stackIdentity;
    setExpanded(false);

    const activePreviewId = activePreviewIdRef.current;
    if (activePreviewId && !stack.some((entry) => entry.entity.id === activePreviewId)) {
      activePreviewIdRef.current = null;
      clearHover(activePreviewId);
    }
  }, [clearHover, stack, stackIdentity]);

  useEffect(() => {
    if (!minimized) return;
    setExpanded(false);
    const activePreviewId = activePreviewIdRef.current;
    activePreviewIdRef.current = null;
    if (activePreviewId) clearHover(activePreviewId);
  }, [clearHover, minimized]);

  useEffect(() => {
    if (interactionMode !== "mobile" || !expanded) return;

    const contractOnOutsidePointer = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setExpanded(false);
    };
    const contractOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setExpanded(false);
    };

    document.addEventListener("pointerdown", contractOnOutsidePointer);
    document.addEventListener("keydown", contractOnEscape);
    return () => {
      document.removeEventListener("pointerdown", contractOnOutsidePointer);
      document.removeEventListener("keydown", contractOnEscape);
    };
  }, [expanded, interactionMode]);

  if (stack.length > 3) return null;

  const occupy = (entry: FabCombatStackEntryView) => {
    activePreviewIdRef.current = entry.entity.id;
    setHover(entry.entity);
  };
  const previewResolvingLayer = () => {
    const top = stack.find((entry) => entry.order === 1) ?? stack[0];
    if (top) occupy(top);
  };

  const stackList = (
    <ol
      key="compact-stack-list"
      ref={rootRef}
      className="fab-compact-resolution-stack"
      data-testid="fab-compact-resolution-stack"
      data-expanded={expanded ? "true" : "false"}
      data-interaction-mode={interactionMode}
      data-stack-count={stack.length}
      aria-label={`Resolution stack, ${stack.length} ${stack.length === 1 ? "layer" : "layers"}. Layer 1 resolves next.`}
      onPointerEnter={
        interactionMode === "desktop"
          ? () => {
              setExpanded(true);
              previewResolvingLayer();
            }
          : undefined
      }
      onPointerLeave={
        interactionMode === "desktop"
          ? () => {
              setExpanded(false);
              const entityId = activePreviewIdRef.current;
              if (entityId) clearHover(entityId);
            }
          : undefined
      }
      onFocusCapture={
        interactionMode === "desktop"
          ? () => {
              setExpanded(true);
              previewResolvingLayer();
            }
          : undefined
      }
      onBlurCapture={
        interactionMode === "desktop"
          ? (event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
                setExpanded(false);
              }
            }
          : undefined
      }
    >
      <AnimatedEntityCollection>
        {stack.map((entry) => {
          const ownerLabel = ownerLabelFor(entry, viewerId, ownerLabels);
          return (
            <AnimatedEntityListItem
              key={entry.entity.id}
              entityId={entry.entity.id}
              zoneRef={{
                kind: "zone",
                id: `${entry.entity.ownerId}:stack`,
                ownerId: entry.entity.ownerId,
              }}
              density="compact"
              data-stack-order={entry.order}
            >
              <div className="fab-compact-resolution-card-wrap">
                <CompactResolutionCard
                  entry={entry}
                  ownerLabel={ownerLabel}
                  interactionMode={interactionMode}
                  expanded={expanded}
                  onExpand={() => setExpanded(true)}
                  onCollapse={() => setExpanded(false)}
                  onOccupied={occupy}
                />
                {entry.order === 1 &&
                opponentYieldAction?.sourceInstanceId ===
                  (entry.sourceInstanceId ?? entry.entity.id) ? (
                  <FabOpponentTriggerYieldControl action={opponentYieldAction} />
                ) : null}
              </div>
            </AnimatedEntityListItem>
          );
        })}
      </AnimatedEntityCollection>
    </ol>
  );

  const content = (
    <section
      key="compact-stack-panel"
      className="fab-compact-resolution-panel"
      data-testid="fab-compact-resolution-panel"
      data-interaction-mode={interactionMode}
      data-stack-count={stack.length}
      data-minimized={minimized ? "true" : "false"}
      data-placement={placement}
      aria-labelledby={headingId}
    >
      <header className="fab-compact-resolution-panel-heading">
        <h2 id={headingId} className="fab-compact-resolution-panel-heading-title">
          Stack
        </h2>
        <span className="fab-compact-resolution-panel-heading-meta">
          <span>
            {stack.length} {stack.length === 1 ? "layer" : "layers"}
          </span>
          {interactionMode === "desktop" && onCyclePlacement ? (
            <span className="fab-compact-resolution-panel-controls">
              <button
                type="button"
                className="fab-compact-resolution-panel-control"
                data-testid="fab-compact-resolution-cycle-placement"
                aria-label={`Move stack ${placement === "center" ? "to top" : placement === "top" ? "to bottom" : "to center"}`}
                title={`Move stack ${placement === "center" ? "to top" : placement === "top" ? "to bottom" : "to center"}`}
                onClick={onCyclePlacement}
              >
                {placement === "top" ? (
                  <ArrowDown size={13} aria-hidden="true" />
                ) : placement === "bottom" ? (
                  <RotateCcw size={13} aria-hidden="true" />
                ) : (
                  <ArrowUp size={13} aria-hidden="true" />
                )}
              </button>
            </span>
          ) : null}
        </span>
      </header>
      {minimized ? null : stackList}
    </section>
  );

  return <AnimatedEntityCollection>{stack.length === 0 ? null : content}</AnimatedEntityCollection>;
}
