import { useCallback, useEffect, useRef } from "react";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { ResolvingEntityStage } from "@tcg/simulator-ui";

import { useCardInspect } from "../components/ui/card/card-inspect-context.tsx";
import type { GameCardData } from "../components/ui/types.ts";

import { GUNDAM_COMMAND_FOCUS_ANCHOR_ID } from "@tcg/gundam-server-adapter";
export { GUNDAM_COMMAND_FOCUS_ANCHOR_ID };

export function burstDecisionFocusLabel(controllerId: string, viewerSeatId: string | null): string {
  return controllerId === viewerSeatId ? "Burst — your decision" : "Burst — opponent deciding";
}

export function effectDecisionFocusLabel(
  controllerId: string,
  viewerSeatId: string | null,
): string {
  return controllerId === viewerSeatId ? "Effect — your decision" : "Effect — opponent deciding";
}

export function CommandFocusArea({
  entity,
  previewCard,
  active,
  label = "Command resolving",
}: {
  readonly entity: SimulatorEntity | null;
  readonly previewCard?: GameCardData | null;
  readonly active: boolean;
  readonly label?: string;
}) {
  const inspect = useCardInspect();
  const inspectRef = useRef(inspect);
  inspectRef.current = inspect;
  const ownsHoverRef = useRef(false);
  const canPreview = active && previewCard?.faceDown !== true && Boolean(previewCard && inspect);

  const showPreview = useCallback(() => {
    if (!canPreview || !previewCard || !inspect) return;
    ownsHoverRef.current = true;
    inspect.setHover(previewCard);
  }, [canPreview, inspect, previewCard]);

  const hidePreview = useCallback(() => {
    const currentInspect = inspectRef.current;
    ownsHoverRef.current = false;
    if (currentInspect && currentInspect.hovered?.card.id === previewCard?.id) {
      currentInspect.setHover(null);
    }
  }, [previewCard?.id]);

  useEffect(() => {
    if (
      ownsHoverRef.current &&
      inspect &&
      inspect.hovered?.card.id === previewCard?.id &&
      previewCard
    ) {
      inspect.setHover(previewCard);
    }
  }, [inspect, previewCard]);

  useEffect(
    () => () => {
      const currentInspect = inspectRef.current;
      if (
        ownsHoverRef.current &&
        currentInspect &&
        currentInspect.hovered?.card.id === previewCard?.id
      ) {
        currentInspect.setHover(null);
      }
    },
    [previewCard?.id],
  );

  useEffect(() => {
    if (!canPreview && ownsHoverRef.current) hidePreview();
  }, [canPreview, hidePreview]);

  return (
    <div
      className={`absolute right-4 top-1/2 z-[80] -translate-y-1/2 ${
        canPreview ? "pointer-events-auto cursor-zoom-in" : "pointer-events-none"
      }`}
      data-testid="gundam-command-focus-preview-handle"
      data-preview-enabled={canPreview ? "true" : "false"}
      onPointerEnter={(event) => {
        if (event.pointerType !== "touch") showPreview();
      }}
      onPointerLeave={hidePreview}
    >
      <ResolvingEntityStage
        entity={entity}
        active={active}
        anchorId={GUNDAM_COMMAND_FOCUS_ANCHOR_ID}
        label={label}
        testId="gundam-command-focus"
        className="grid justify-items-center gap-2"
        labelClassName={`clip-hud-6 border border-hud-accent/70 bg-hud-deep/95 px-3 py-1 font-display text-[10px] font-black uppercase tracking-[0.22em] text-hud-accent shadow-[0_0_22px_rgba(76,195,255,.38)] transition-opacity duration-150 ${active ? "opacity-100" : "opacity-0"}`}
        entityClassName={`h-[156px] w-[112px] transition-[opacity,filter] duration-150 [&_.sim-card-face]:h-full [&_.sim-card-face]:w-full ${active ? "drop-shadow-[0_0_18px_rgba(76,195,255,.72)]" : "opacity-0"}`}
      />
    </div>
  );
}
