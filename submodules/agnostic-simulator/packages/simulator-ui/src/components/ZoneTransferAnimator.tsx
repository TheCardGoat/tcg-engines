import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";

import {
  redactEntityForHiddenZone,
  resolveAnimationCardFaceForViewer,
  type SimulatorAnimationCardFace,
} from "../animation/events";
import { readElementRect, type Rect } from "../hooks/useFlipAnimation";
import { CardFace } from "./CardFace";

export type ZoneTransferKind = "draw" | "move-zone";

export interface ZoneTransferAnimationStep {
  id: string;
  kind: ZoneTransferKind;
  entity: SimulatorEntity;
  fromZone: SimulatorZone;
  toZone: SimulatorZone;
  viewerSeatId: string;
  delayMs?: number;
  durationMs?: number;
}

export interface ZoneTransferAnimatorProps {
  step?: ZoneTransferAnimationStep | null;
  steps?: readonly ZoneTransferAnimationStep[] | null;
  children: ReactNode;
  onComplete?: (step: ZoneTransferAnimationStep) => void;
}

interface OverlayState {
  step: ZoneTransferAnimationStep;
  from: Rect;
  to: Rect;
  sourceFace: SimulatorAnimationCardFace;
  destinationFace: SimulatorAnimationCardFace;
}

const DEFAULT_DURATION_MS = 560;
const TRANSFER_EASING = [0.25, 0.1, 0.25, 1] as const;
const FACE_FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const DEFAULT_CARD_WIDTH = 118;
const DEFAULT_CARD_HEIGHT = 156;

export function resolveZoneFaceForViewer(
  zone: SimulatorZone,
  viewerSeatId: string,
): SimulatorAnimationCardFace {
  return resolveAnimationCardFaceForViewer({
    entity: { id: "", ownerId: zone.ownerId ?? "" },
    zone,
    viewer: { viewerSeatId },
  });
}

export function projectEntityForZoneViewer(
  entity: SimulatorEntity,
  zone: SimulatorZone,
  viewerSeatId: string,
): SimulatorEntity {
  return resolveAnimationCardFaceForViewer({
    entity,
    zone,
    viewer: { viewerSeatId },
  }) === "public"
    ? { ...entity, face: "public" }
    : redactEntityForHiddenZone(entity);
}

export function ZoneTransferAnimator({
  step = null,
  steps = null,
  children,
  onComplete,
}: ZoneTransferAnimatorProps) {
  const [overlays, setOverlays] = useState<OverlayState[]>([]);
  const seenStepIdsRef = useRef<Set<string>>(new Set());
  const rectCacheRef = useRef<Map<string, Rect>>(new Map());
  const completeRef = useRef(onComplete);
  const prefersReducedMotion = useReducedMotion();
  const incomingSteps = useMemo(() => (steps ? [...steps] : step ? [step] : []), [step, steps]);

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const newSteps = incomingSteps.filter(
      (incomingStep) => !seenStepIdsRef.current.has(incomingStep.id),
    );
    if (newSteps.length === 0) {
      rectCacheRef.current = readZoneEntityRectCache();
      return;
    }

    const nextOverlays = newSteps.map((incomingStep) => {
      const viewer = { viewerSeatId: incomingStep.viewerSeatId };
      const sourceFace = resolveAnimationCardFaceForViewer({
        entity: incomingStep.entity,
        zone: incomingStep.fromZone,
        viewer,
      });
      const destinationFace = resolveAnimationCardFaceForViewer({
        entity: incomingStep.entity,
        zone: incomingStep.toZone,
        viewer,
      });
      const from =
        readCachedZoneTransferRect(
          rectCacheRef.current,
          incomingStep.fromZone.id,
          incomingStep.entity.id,
        ) ?? readZoneTransferRect(incomingStep.fromZone.id, incomingStep.entity.id, "source");
      const to = readZoneTransferRect(
        incomingStep.toZone.id,
        incomingStep.entity.id,
        "destination",
      );

      seenStepIdsRef.current.add(incomingStep.id);
      return {
        step: incomingStep,
        from,
        to,
        sourceFace,
        destinationFace,
      };
    });

    setOverlays((current) => [...current, ...nextOverlays]);
    rectCacheRef.current = readZoneEntityRectCache();
  }, [incomingSteps]);

  const layoutGroupId = `zone-transfer-${
    overlays[0]?.step.viewerSeatId ?? incomingSteps[0]?.viewerSeatId ?? "table"
  }`;

  const handleComplete = (completedStep: ZoneTransferAnimationStep) => {
    completeRef.current?.(completedStep);
    setOverlays((current) =>
      current.filter((overlayState) => overlayState.step.id !== completedStep.id),
    );
  };

  return (
    <LayoutGroup id={layoutGroupId}>
      <div className="zone-transfer-stage contents">{children}</div>
      {overlays.map((overlay) => (
        <TransferOverlay
          key={overlay.step.id}
          overlay={overlay}
          prefersReducedMotion={prefersReducedMotion}
          onComplete={handleComplete}
        />
      ))}
    </LayoutGroup>
  );
}

interface TransferOverlayProps {
  overlay: OverlayState;
  prefersReducedMotion: boolean | null;
  onComplete: (step: ZoneTransferAnimationStep) => void;
}

function TransferOverlay({ overlay, prefersReducedMotion, onComplete }: TransferOverlayProps) {
  const [started, setStarted] = useState((overlay.step.delayMs ?? 0) <= 0);
  const [currentFace, setCurrentFace] = useState<SimulatorAnimationCardFace>(overlay.sourceFace);
  const faceRef = useRef<HTMLDivElement | null>(null);
  const completedRef = useRef(false);
  const overlayMotion = useMemo(() => createTransferMotion(overlay.from, overlay.to), [overlay]);
  const motionInitial = prefersReducedMotion ? false : overlayMotion.initial;
  const motionAnimate = prefersReducedMotion ? undefined : overlayMotion.animate;
  const motionTransition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: (overlay.step.durationMs ?? DEFAULT_DURATION_MS) / 1000,
        ease: TRANSFER_EASING,
      };

  useEffect(() => {
    const delay = overlay.step.delayMs ?? 0;
    if (delay <= 0) {
      setStarted(true);
      return;
    }

    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [overlay.step.delayMs]);

  useEffect(() => {
    if (!started) {
      return;
    }

    const duration = overlay.step.durationMs ?? DEFAULT_DURATION_MS;
    const timers: number[] = [];
    const completeOnce = () => {
      if (completedRef.current) {
        return;
      }
      completedRef.current = true;
      onComplete(overlay.step);
    };

    if (prefersReducedMotion) {
      setCurrentFace(overlay.destinationFace);
      timers.push(window.setTimeout(completeOnce, 30));
      return () => timers.forEach((timer) => window.clearTimeout(timer));
    }

    if (overlay.sourceFace !== overlay.destinationFace) {
      const flipAt = Math.max(40, Math.round(duration * 0.3));
      const hideDuration = Math.min(110, Math.max(45, Math.round(duration * 0.22)));
      const swapDelay = Math.max(28, Math.round(hideDuration * 0.78));
      const revealDuration = Math.min(140, Math.max(45, Math.round(duration * 0.25)));
      timers.push(
        window.setTimeout(() => {
          const face = faceRef.current;
          face?.animate([{ transform: "rotateY(0deg)" }, { transform: "rotateY(88deg)" }], {
            duration: hideDuration,
            easing: "cubic-bezier(0.25, 1, 0.5, 1)",
            fill: "both",
          });
          timers.push(
            window.setTimeout(() => {
              setCurrentFace(overlay.destinationFace);
              face?.animate([{ transform: "rotateY(-88deg)" }, { transform: "rotateY(0deg)" }], {
                duration: revealDuration,
                easing: FACE_FLIP_EASING,
                fill: "both",
              });
            }, swapDelay),
          );
        }, flipAt),
      );
    }

    timers.push(window.setTimeout(completeOnce, duration + 120));
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [onComplete, overlay, prefersReducedMotion, started]);

  if (!started) {
    return null;
  }

  const suppressionCss = buildTransferSuppressionCss([overlay.step]);
  const overlayEntity =
    currentFace === "public"
      ? { ...overlay.step.entity, face: "public" as const }
      : redactEntityForHiddenZone(overlay.step.entity, `${overlay.step.entity.id}:transfer-hidden`);
  const overlayStyle = {
    left: overlay.to.left,
    top: overlay.to.top,
    width: overlay.to.width,
    height: overlay.to.height,
    transformOrigin: "top left",
  };
  const overlayCard = (
    <div
      ref={faceRef}
      className="h-full w-full origin-center [transform-style:preserve-3d] [&_.sim-card-face]:h-full [&_.sim-card-face]:min-h-0 [&_.sim-card-face]:w-full"
    >
      <CardFace entity={overlayEntity} density="normal" fill />
    </div>
  );

  if (prefersReducedMotion) {
    return (
      <>
        <style>{suppressionCss}</style>
        <div
          className="zone-transfer-overlay pointer-events-none fixed z-[1000] [perspective:900px]"
          data-testid="zone-transfer-overlay"
          data-transfer-kind={overlay.step.kind}
          data-transfer-id={overlay.step.id}
          data-from-zone-id={overlay.step.fromZone.id}
          data-to-zone-id={overlay.step.toZone.id}
          data-source-face={overlay.sourceFace}
          data-destination-face={overlay.destinationFace}
          data-current-face={currentFace}
          style={overlayStyle}
        >
          {overlayCard}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{suppressionCss}</style>
      <motion.div
        className="zone-transfer-overlay pointer-events-none fixed z-[1000] [perspective:900px]"
        data-testid="zone-transfer-overlay"
        data-transfer-kind={overlay.step.kind}
        data-transfer-id={overlay.step.id}
        data-from-zone-id={overlay.step.fromZone.id}
        data-to-zone-id={overlay.step.toZone.id}
        data-source-face={overlay.sourceFace}
        data-destination-face={overlay.destinationFace}
        data-current-face={currentFace}
        style={overlayStyle}
        initial={motionInitial}
        animate={motionAnimate}
        transition={motionTransition}
        onAnimationComplete={() => {
          if (completedRef.current) {
            return;
          }
          completedRef.current = true;
          onComplete(overlay.step);
        }}
      >
        {overlayCard}
      </motion.div>
    </>
  );
}

function createTransferMotion(from: Rect, to: Rect) {
  return {
    initial: {
      x: from.left - to.left,
      y: from.top - to.top,
      scaleX: from.width / to.width,
      scaleY: from.height / to.height,
    },
    animate: {
      x: 0,
      y: 0,
      scaleX: 1,
      scaleY: 1,
    },
  };
}

function buildTransferSuppressionCss(steps: readonly ZoneTransferAnimationStep[]): string {
  const selectors = steps.flatMap((step) =>
    Array.from(new Set([step.fromZone.id, step.toZone.id])).flatMap((zoneId) =>
      transferEntityIds(step.entity.id).flatMap((entityId) =>
        zoneAnchorSelectors(zoneId).flatMap((zoneSelector) =>
          entityAnchorSelectors(entityId).map(
            (entitySelector) => `.zone-transfer-stage ${zoneSelector} ${entitySelector}`,
          ),
        ),
      ),
    ),
  );
  const layoutSelectors = steps.flatMap((step) =>
    Array.from(new Set([step.fromZone.id, step.toZone.id])).flatMap((zoneId) =>
      zoneAnchorSelectors(zoneId).map(
        (zoneSelector) => `.zone-transfer-stage ${zoneSelector} [data-card-layout-id]`,
      ),
    ),
  );

  return [
    `${Array.from(new Set(selectors)).join(",\n")} { visibility: hidden !important; pointer-events: none !important; }`,
    `${Array.from(new Set(layoutSelectors)).join(",\n")} { transform: none !important; }`,
  ].join("\n");
}

function transferEntityIds(entityId: string): string[] {
  return Array.from(new Set([entityId, `${entityId}:hidden`, `${entityId}:transfer-hidden`]));
}

export function readZoneEntityRectCache(): Map<string, Rect> {
  const cache = new Map<string, Rect>();
  const zones = document.querySelectorAll<HTMLElement>("[data-sim-zone-id], [data-zone-id]");
  zones.forEach((zone) => {
    const zoneId = zoneAnchorId(zone);
    if (!zoneId) {
      return;
    }
    const entities = zone.querySelectorAll<HTMLElement>("[data-sim-entity-id], [data-entity-id]");
    entities.forEach((entity) => {
      const entityId = entityAnchorId(entity);
      if (!entityId || cache.has(zoneEntityCacheKey(zoneId, entityId))) {
        return;
      }
      const rect = entity.getBoundingClientRect();
      const style = window.getComputedStyle(entity);
      if (rect.width <= 0 || rect.height <= 0 || style.display === "none") {
        return;
      }
      cache.set(zoneEntityCacheKey(zoneId, entityId), readElementRect(entity));
    });
  });
  return cache;
}

export function readCachedZoneTransferRect(
  cache: Map<string, Rect>,
  zoneId: string,
  entityId: string,
): Rect | undefined {
  for (const candidateId of transferEntityIds(entityId)) {
    const rect = cache.get(zoneEntityCacheKey(zoneId, candidateId));
    if (rect) {
      return rect;
    }
  }
  return undefined;
}

function zoneEntityCacheKey(zoneId: string, entityId: string): string {
  return `${zoneId}::${entityId}`;
}

export function readZoneTransferRect(
  zoneId: string,
  entityId: string,
  preference: "source" | "destination",
): Rect {
  const zone = findZoneAnchor(zoneId);
  const card = findZoneTransferCard(zone, entityId);

  if (card) {
    return readElementRect(card);
  }

  if (!zone) {
    return {
      left: window.innerWidth / 2 - DEFAULT_CARD_WIDTH / 2,
      top: window.innerHeight / 2 - DEFAULT_CARD_HEIGHT / 2,
      width: DEFAULT_CARD_WIDTH,
      height: DEFAULT_CARD_HEIGHT,
    };
  }

  return virtualCardRect(readElementRect(zone), preference);
}

function findZoneTransferCard(zone: HTMLElement | null, entityId: string): HTMLElement | null {
  if (!zone) {
    return null;
  }
  for (const candidateId of transferEntityIds(entityId)) {
    const card = findEntityAnchor(zone, candidateId);
    if (card && card.getBoundingClientRect().width > 0 && card.getBoundingClientRect().height > 0) {
      return card;
    }
  }
  return null;
}

export function readEntityTransferRect(
  entityId: string,
  fallbackZoneId?: string,
): Rect | undefined {
  const candidate = document.querySelector<HTMLElement>(entityAnchorSelectors(entityId).join(", "));
  if (candidate && candidate.getBoundingClientRect().width > 0) {
    return readElementRect(candidate);
  }

  return fallbackZoneId ? readZoneTransferRect(fallbackZoneId, entityId, "destination") : undefined;
}

function virtualCardRect(zone: Rect, preference: "source" | "destination"): Rect {
  const width = Math.min(DEFAULT_CARD_WIDTH, Math.max(82, zone.width * 0.42));
  const height = Math.min(DEFAULT_CARD_HEIGHT, Math.max(112, width * 1.32));
  const inset = Math.min(18, Math.max(8, zone.width * 0.08));
  const left =
    preference === "source"
      ? zone.left + zone.width - width - inset
      : zone.left + Math.min(inset, Math.max(0, (zone.width - width) / 2));
  const top = zone.top + Math.min(56, Math.max(12, zone.height * 0.34));

  return {
    left: clamp(left, 8, window.innerWidth - width - 8),
    top: clamp(top, 8, window.innerHeight - height - 8),
    width,
    height,
  };
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\A ");
}

function zoneAnchorId(zone: HTMLElement): string | undefined {
  return zone.dataset.simZoneId ?? zone.dataset.zoneId;
}

function entityAnchorId(entity: HTMLElement): string | undefined {
  return entity.dataset.simEntityId ?? entity.dataset.entityId;
}

function findZoneAnchor(zoneId: string): HTMLElement | null {
  for (const selector of zoneAnchorSelectors(zoneId)) {
    const zone = document.querySelector<HTMLElement>(selector);
    if (zone) {
      return zone;
    }
  }
  return null;
}

function findEntityAnchor(zone: HTMLElement, entityId: string): HTMLElement | null {
  for (const selector of entityAnchorSelectors(entityId)) {
    const entity = zone.querySelector<HTMLElement>(selector);
    if (entity) {
      return entity;
    }
  }
  return null;
}

function zoneAnchorSelectors(zoneId: string): string[] {
  const value = cssAttributeValue(zoneId);
  return [`[data-sim-zone-id="${value}"]`, `[data-zone-id="${value}"]`];
}

function entityAnchorSelectors(entityId: string): string[] {
  const value = cssAttributeValue(entityId);
  return [`[data-sim-entity-id="${value}"]`, `[data-entity-id="${value}"]`];
}
