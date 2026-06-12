import type { ReactNode } from "react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

import {
  redactEntityForHiddenZone,
  type SimulatorAnimationCardFace,
  type SimulatorAnimationEvent,
  type SimulatorEffectTargetEvent,
  type SimulatorEffectTargetSpec,
  type SimulatorLayoutShiftEvent,
} from "./events";
import {
  isPrimitiveOverlayEvent,
  resolvePrimitiveOverlayFaces,
  type PrimitiveOverlayFacePlan,
  type SimulatorPrimitiveOverlayEvent,
} from "./primitiveEvent";
import {
  readCachedZoneTransferRect,
  readEntityTransferRect,
  readZoneEntityRectCache,
  readZoneTransferRect,
} from "../components/ZoneTransferAnimator";
import type { Rect } from "../hooks/useFlipAnimation";
import { CardFace } from "../components/CardFace";

export interface SimulatorPrimitiveAnimatorProps {
  events?: readonly SimulatorAnimationEvent[] | null;
  children: ReactNode;
  onComplete?: (
    event: SimulatorPrimitiveOverlayEvent | SimulatorEffectTargetEvent | SimulatorLayoutShiftEvent,
  ) => void;
}

interface PrimitiveOverlayState {
  event: SimulatorPrimitiveOverlayEvent;
  facePlan: PrimitiveOverlayFacePlan;
  from: Rect;
  to: Rect;
}

interface TargetBeamState {
  event: SimulatorEffectTargetEvent;
  source: Rect;
  targets: readonly TargetBeamRect[];
}

interface TargetBeamRect {
  target: SimulatorEffectTargetSpec;
  rect: Rect;
}

const DEFAULT_DURATION_MS = 360;
const TARGET_BEAM_DURATION_MS = 380;
const LAYOUT_SHIFT_DURATION_MS = 220;
const PRIMITIVE_EASING = [0.22, 1, 0.36, 1] as const;
const FACE_FLIP_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

export function SimulatorPrimitiveAnimator({
  events = null,
  children,
  onComplete,
}: SimulatorPrimitiveAnimatorProps) {
  const [overlays, setOverlays] = useState<PrimitiveOverlayState[]>([]);
  const [targetBeams, setTargetBeams] = useState<TargetBeamState[]>([]);
  const seenEventIdsRef = useRef<Set<string>>(new Set());
  const rectCacheRef = useRef<Map<string, Rect>>(new Map());
  const completeRef = useRef(onComplete);
  const prefersReducedMotion = useReducedMotion();
  const incomingEvents = useMemo(
    () => (events ? events.filter(isPrimitiveOverlayEvent) : []),
    [events],
  );
  const incomingTargetEvents = useMemo(
    () => (events ? events.filter(isEffectTargetEvent) : []),
    [events],
  );
  const incomingLayoutShiftEvents = useMemo(
    () => (events ? events.filter(isLayoutShiftEvent) : []),
    [events],
  );

  useEffect(() => {
    completeRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const newEvents = incomingEvents.filter((event) => !seenEventIdsRef.current.has(event.id));
    if (newEvents.length === 0) {
      if (
        !hasPendingEvents(seenEventIdsRef.current, incomingTargetEvents, incomingLayoutShiftEvents)
      ) {
        rectCacheRef.current = readZoneEntityRectCache();
      }
      return;
    }

    const nextOverlays = newEvents.map((event) => {
      const facePlan = resolvePrimitiveOverlayFaces(event);
      const { from, to } = resolvePrimitiveOverlayRects(event, rectCacheRef.current);

      seenEventIdsRef.current.add(event.id);
      return { event, facePlan, from, to };
    });

    setOverlays((current) => [...current, ...nextOverlays]);
    if (
      !hasPendingEvents(seenEventIdsRef.current, incomingTargetEvents, incomingLayoutShiftEvents)
    ) {
      rectCacheRef.current = readZoneEntityRectCache();
    }
  }, [incomingEvents, incomingLayoutShiftEvents, incomingTargetEvents]);

  useLayoutEffect(() => {
    const newEvents = incomingTargetEvents.filter(
      (event) => !seenEventIdsRef.current.has(event.id),
    );
    if (newEvents.length === 0) {
      if (!hasPendingEvents(seenEventIdsRef.current, incomingEvents, incomingLayoutShiftEvents)) {
        rectCacheRef.current = readZoneEntityRectCache();
      }
      return;
    }

    const nextBeams = newEvents.flatMap((event) => {
      seenEventIdsRef.current.add(event.id);
      const beam = resolveTargetBeamRects(event);
      return beam ? [beam] : [];
    });

    if (nextBeams.length > 0) {
      setTargetBeams((current) => [...current, ...nextBeams]);
    }
    if (!hasPendingEvents(seenEventIdsRef.current, incomingEvents, incomingLayoutShiftEvents)) {
      rectCacheRef.current = readZoneEntityRectCache();
    }
  }, [incomingEvents, incomingLayoutShiftEvents, incomingTargetEvents]);

  useLayoutEffect(() => {
    const newEvents = incomingLayoutShiftEvents.filter(
      (event) => !seenEventIdsRef.current.has(event.id),
    );
    if (newEvents.length === 0) {
      if (!hasPendingEvents(seenEventIdsRef.current, incomingEvents, incomingTargetEvents)) {
        rectCacheRef.current = readZoneEntityRectCache();
      }
      return;
    }

    newEvents.forEach((event) => {
      seenEventIdsRef.current.add(event.id);
      playLayoutShift(event, rectCacheRef.current, Boolean(prefersReducedMotion), (completed) => {
        completeRef.current?.(completed);
      });
    });
    rectCacheRef.current = readZoneEntityRectCache();
  }, [incomingEvents, incomingLayoutShiftEvents, incomingTargetEvents, prefersReducedMotion]);

  const handleComplete = (completedEvent: SimulatorPrimitiveOverlayEvent) => {
    completeRef.current?.(completedEvent);
    setOverlays((current) =>
      current.filter((overlayState) => overlayState.event.id !== completedEvent.id),
    );
  };

  const handleTargetBeamComplete = (completedEvent: SimulatorEffectTargetEvent) => {
    completeRef.current?.(completedEvent);
    setTargetBeams((current) =>
      current.filter((beamState) => beamState.event.id !== completedEvent.id),
    );
  };

  return (
    <>
      {children}
      {overlays.map((overlay) => (
        <PrimitiveOverlay key={overlay.event.id} overlay={overlay} onComplete={handleComplete} />
      ))}
      {targetBeams.map((beam) => (
        <TargetBeamOverlay key={beam.event.id} beam={beam} onComplete={handleTargetBeamComplete} />
      ))}
    </>
  );
}

interface PrimitiveOverlayProps {
  overlay: PrimitiveOverlayState;
  onComplete: (event: SimulatorPrimitiveOverlayEvent) => void;
}

function PrimitiveOverlay({ overlay, onComplete }: PrimitiveOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [started, setStarted] = useState((overlay.event.delayMs ?? 0) <= 0);
  const [currentFace, setCurrentFace] = useState<SimulatorAnimationCardFace>(
    overlay.facePlan.sourceFace,
  );
  const faceRef = useRef<HTMLDivElement | null>(null);
  const duration = prefersReducedMotion ? 30 : (overlay.event.durationMs ?? DEFAULT_DURATION_MS);
  const overlayMotion = useMemo(
    () => createPrimitiveMotion(overlay.facePlan.kind, overlay.from, overlay.to),
    [overlay],
  );

  useEffect(() => {
    const delay = overlay.event.delayMs ?? 0;
    if (delay <= 0) {
      setStarted(true);
      return;
    }

    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [overlay.event.delayMs]);

  useEffect(() => {
    if (!started) {
      return;
    }

    const timers: number[] = [];
    if (!prefersReducedMotion && overlay.facePlan.sourceFace !== overlay.facePlan.destinationFace) {
      const flipAt = Math.max(30, Math.round(duration * 0.28));
      const hideDuration = Math.min(100, Math.max(42, Math.round(duration * 0.24)));
      const swapDelay = Math.max(24, Math.round(hideDuration * 0.72));
      const revealDuration = Math.min(120, Math.max(42, Math.round(duration * 0.28)));

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
              setCurrentFace(overlay.facePlan.destinationFace);
              face?.animate([{ transform: "rotateY(-88deg)" }, { transform: "rotateY(0deg)" }], {
                duration: revealDuration,
                easing: FACE_FLIP_EASING,
                fill: "both",
              });
            }, swapDelay),
          );
        }, flipAt),
      );
    } else {
      setCurrentFace(overlay.facePlan.destinationFace);
    }

    timers.push(window.setTimeout(() => onComplete(overlay.event), duration + 40));
    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [duration, onComplete, overlay, prefersReducedMotion, started]);

  if (!started) {
    return null;
  }

  const suppressionCss = buildPrimitiveSuppressionCss([overlay]);
  const overlayEntity =
    currentFace === "public"
      ? { ...overlay.facePlan.entity, face: "public" as const }
      : redactEntityForHiddenZone(
          overlay.facePlan.entity,
          `${overlay.facePlan.entity.id}:primitive-hidden`,
        );

  return (
    <>
      <style>{suppressionCss}</style>
      <motion.div
        className="simulator-animation-overlay pointer-events-none fixed z-[1001] [perspective:900px]"
        data-testid="sim-animation-overlay"
        data-animation-primitive={overlay.event.primitive}
        data-animation-kind={overlay.facePlan.kind}
        data-animation-id={overlay.event.id}
        data-entity-id={overlay.facePlan.entity.id}
        data-zone-id={overlay.facePlan.sourceZone?.id ?? overlay.facePlan.destinationZone?.id}
        data-from-zone-id={overlay.facePlan.sourceZone?.id}
        data-to-zone-id={overlay.facePlan.destinationZone?.id}
        data-target-entity-id={overlay.facePlan.targetEntityId}
        data-source-face={overlay.facePlan.sourceFace}
        data-destination-face={overlay.facePlan.destinationFace}
        data-current-face={currentFace}
        style={{
          left: overlay.to.left,
          top: overlay.to.top,
          width: overlay.to.width,
          height: overlay.to.height,
          transformOrigin: "top left",
        }}
        initial={prefersReducedMotion ? false : overlayMotion.initial}
        animate={prefersReducedMotion ? undefined : overlayMotion.animate}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: duration / 1000, ease: PRIMITIVE_EASING }
        }
      >
        <div
          ref={faceRef}
          className="h-full w-full origin-center [transform-style:preserve-3d] [&_.sim-card-face]:h-full [&_.sim-card-face]:min-h-0 [&_.sim-card-face]:w-full"
        >
          <CardFace entity={overlayEntity} density="normal" fill />
        </div>
      </motion.div>
    </>
  );
}

function resolvePrimitiveOverlayRects(
  event: SimulatorPrimitiveOverlayEvent,
  cache: Map<string, Rect>,
): { from: Rect; to: Rect } {
  switch (event.primitive) {
    case "flipReveal": {
      const rect =
        readCachedZoneTransferRect(cache, event.zone.id, event.entity.id) ??
        readZoneTransferRect(event.zone.id, event.entity.id, "destination");
      return { from: rect, to: rect };
    }
    case "zoneEnter": {
      const to = readZoneTransferRect(event.toZone.id, event.entity.id, "destination");
      const from = readZoneTransferRect(event.toZone.id, event.entity.id, "source");
      return { from, to };
    }
    case "zoneExit": {
      const from =
        readCachedZoneTransferRect(cache, event.fromZone.id, event.entity.id) ??
        readZoneTransferRect(event.fromZone.id, event.entity.id, "source");
      const to = readZoneTransferRect(event.fromZone.id, event.entity.id, "destination");
      return { from, to };
    }
    case "attach": {
      const from =
        readCachedZoneTransferRect(cache, event.fromZone.id, event.entity.id) ??
        readZoneTransferRect(event.fromZone.id, event.entity.id, "source");
      const to =
        readEntityTransferRect(event.targetEntityId, event.toZone.id) ??
        readZoneTransferRect(event.toZone.id, event.entity.id, "destination");
      return { from, to };
    }
  }
}

function resolveTargetBeamRects(event: SimulatorEffectTargetEvent): TargetBeamState | null {
  const source =
    readEntityTransferRect(event.sourceEntity.id, event.sourceZone?.id) ??
    (event.sourceZone
      ? readZoneTransferRect(event.sourceZone.id, event.sourceEntity.id, "source")
      : undefined);
  if (!source) {
    return null;
  }

  const targets = event.targets.flatMap((target) => {
    const rect = readTargetRect(target);
    return rect ? [{ target, rect }] : [];
  });

  return targets.length > 0 ? { event, source, targets } : null;
}

function readTargetRect(target: SimulatorEffectTargetSpec): Rect | undefined {
  switch (target.kind) {
    case "entity":
      return readEntityTransferRect(target.entityId, target.zone?.id);
    case "zone":
      return readZoneTransferRect(target.zone.id, "__effect-target__", "destination");
    case "player":
      return readPlayerSeatRect(target.seatId);
  }
}

function readPlayerSeatRect(seatId: string): Rect | undefined {
  const escaped = cssAttributeValue(seatId);
  const target = document.querySelector<HTMLElement>(
    `[data-sim-seat-id="${escaped}"], [data-player-id="${escaped}"], [data-seat-id="${escaped}"]`,
  );
  return target ? readDomRect(target) : undefined;
}

interface TargetBeamOverlayProps {
  beam: TargetBeamState;
  onComplete: (event: SimulatorEffectTargetEvent) => void;
}

function TargetBeamOverlay({ beam, onComplete }: TargetBeamOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const [started, setStarted] = useState((beam.event.delayMs ?? 0) <= 0);
  const duration = prefersReducedMotion ? 30 : (beam.event.durationMs ?? TARGET_BEAM_DURATION_MS);

  useEffect(() => {
    const delay = beam.event.delayMs ?? 0;
    if (delay <= 0) {
      setStarted(true);
      return;
    }

    const timer = window.setTimeout(() => setStarted(true), delay);
    return () => window.clearTimeout(timer);
  }, [beam.event.delayMs]);

  useEffect(() => {
    if (!started) {
      return;
    }

    const timer = window.setTimeout(() => onComplete(beam.event), duration + 40);
    return () => window.clearTimeout(timer);
  }, [beam.event, duration, onComplete, started]);

  if (!started) {
    return null;
  }

  const sourcePoint = rectCenter(beam.source);

  return (
    <>
      {beam.targets.map(({ target, rect }, index) => {
        const targetPoint = rectCenter(rect);
        const dx = targetPoint.x - sourcePoint.x;
        const dy = targetPoint.y - sourcePoint.y;
        const length = Math.hypot(dx, dy);
        if (length < 8) {
          return null;
        }
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

        return (
          <div key={`${beam.event.id}:${index}`}>
            <div
              className="pointer-events-none fixed z-[1002] h-1 rounded-full"
              data-testid="sim-effect-target-beam"
              data-animation-primitive={beam.event.primitive}
              data-animation-id={beam.event.id}
              data-source-entity-id={beam.event.sourceEntity.id}
              data-target-kind={target.kind}
              data-target-entity-id={target.kind === "entity" ? target.entityId : undefined}
              data-target-zone-id={target.kind === "zone" ? target.zone.id : undefined}
              data-target-seat-id={target.kind === "player" ? target.seatId : undefined}
              style={{
                left: sourcePoint.x,
                top: sourcePoint.y,
                width: length,
                transform: `translateY(-2px) rotate(${angle}deg)`,
                transformOrigin: "left center",
              }}
            >
              <motion.div
                className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(43,243,190,0.08),rgba(43,243,190,0.95),rgba(255,235,122,0.95))] shadow-[0_0_14px_rgba(43,243,190,0.72)]"
                initial={prefersReducedMotion ? false : { opacity: 0, scaleX: 0 }}
                animate={
                  prefersReducedMotion ? { opacity: 0 } : { opacity: [0, 1, 0], scaleX: [0, 1, 1] }
                }
                transition={
                  prefersReducedMotion
                    ? { duration: 0 }
                    : { duration: duration / 1000, ease: "easeOut", times: [0, 0.42, 1] }
                }
                style={{ transformOrigin: "left center" }}
              />
            </div>
            <motion.div
              className="pointer-events-none fixed z-[1002] rounded-md border-2 border-[#2bf3be] shadow-[0_0_18px_rgba(43,243,190,0.65)]"
              data-testid="sim-effect-target-pulse"
              data-animation-id={beam.event.id}
              data-target-kind={target.kind}
              data-target-entity-id={target.kind === "entity" ? target.entityId : undefined}
              style={{
                left: rect.left,
                top: rect.top,
                width: rect.width,
                height: rect.height,
              }}
              initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
              animate={
                prefersReducedMotion
                  ? { opacity: 0 }
                  : { opacity: [0, 0.95, 0], scale: [0.92, 1.04, 1.08] }
              }
              transition={
                prefersReducedMotion
                  ? { duration: 0 }
                  : { duration: duration / 1000, ease: "easeOut", times: [0, 0.34, 1] }
              }
            />
          </div>
        );
      })}
    </>
  );
}

function createPrimitiveMotion(kind: PrimitiveOverlayFacePlan["kind"], from: Rect, to: Rect) {
  const transferInitial = {
    x: from.left - to.left,
    y: from.top - to.top,
    scaleX: from.width / to.width,
    scaleY: from.height / to.height,
    opacity: 1,
  };

  switch (kind) {
    case "zone-enter":
      return {
        initial: {
          ...transferInitial,
          opacity: 0,
          scaleX: transferInitial.scaleX * 0.92,
          scaleY: transferInitial.scaleY * 0.92,
        },
        animate: { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 },
      };
    case "zone-exit":
      return {
        initial: transferInitial,
        animate: { x: 0, y: 0, scaleX: 0.9, scaleY: 0.9, opacity: 0 },
      };
    case "attach":
      return {
        initial: transferInitial,
        animate: { x: 0, y: 0, scaleX: 0.62, scaleY: 0.62, opacity: 1 },
      };
    case "flip-reveal":
      return {
        initial: { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 },
        animate: { x: 0, y: 0, scaleX: 1, scaleY: 1, opacity: 1 },
      };
  }
}

function isEffectTargetEvent(event: SimulatorAnimationEvent): event is SimulatorEffectTargetEvent {
  return event.primitive === "effectTarget";
}

function isLayoutShiftEvent(event: SimulatorAnimationEvent): event is SimulatorLayoutShiftEvent {
  return event.primitive === "layoutShift";
}

function hasPendingEvents(
  seenEventIds: ReadonlySet<string>,
  ...eventGroups: readonly (readonly SimulatorAnimationEvent[])[]
): boolean {
  return eventGroups.some((group) => group.some((event) => !seenEventIds.has(event.id)));
}

function playLayoutShift(
  event: SimulatorLayoutShiftEvent,
  cache: Map<string, Rect>,
  prefersReducedMotion: boolean,
  onComplete: (event: SimulatorLayoutShiftEvent) => void,
): void {
  const delay = event.delayMs ?? 0;
  const play = () => {
    const duration = prefersReducedMotion ? 30 : (event.durationMs ?? LAYOUT_SHIFT_DURATION_MS);
    const animations = event.entityIds.flatMap((entityId) => {
      const target = findLayoutShiftEntity(entityId);
      if (!target) {
        return [];
      }
      const from = readCachedLayoutShiftRect(cache, entityId);
      if (!from) {
        return [];
      }
      const to = readDomRect(target);
      const dx = from.left - to.left;
      const dy = from.top - to.top;
      if (Math.abs(dx) < 0.5 && Math.abs(dy) < 0.5) {
        return [];
      }

      target.dataset.simLayoutShiftAnimation = event.id;
      const animation = target.animate(
        [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "translate(0px, 0px)" }],
        {
          duration,
          easing: "cubic-bezier(0.22, 1, 0.36, 1)",
        },
      );
      animation.addEventListener(
        "finish",
        () => {
          if (target.dataset.simLayoutShiftAnimation === event.id) {
            delete target.dataset.simLayoutShiftAnimation;
          }
        },
        { once: true },
      );
      return [animation];
    });

    if (animations.length === 0) {
      onComplete(event);
      return;
    }

    window.setTimeout(() => onComplete(event), duration + 40);
  };

  if (delay <= 0) {
    play();
    return;
  }
  window.setTimeout(play, delay);
}

function readCachedLayoutShiftRect(cache: Map<string, Rect>, entityId: string): Rect | undefined {
  return rectForEntityId(cache, entityId);
}

function rectForEntityId(cache: Map<string, Rect>, entityId: string): Rect | undefined {
  for (const [key, rect] of cache) {
    const [, cachedEntityId] = key.split("::");
    if (cachedEntityId === entityId) {
      return rect;
    }
  }
  return undefined;
}

function findLayoutShiftEntity(entityId: string): HTMLElement | null {
  const escaped = cssAttributeValue(entityId);
  return document.querySelector<HTMLElement>(
    [
      `[data-sim-entity-id="${escaped}"]`,
      `[data-entity-id="${escaped}"]`,
      `[data-card-layout-id="${escaped}"]`,
    ].join(", "),
  );
}

function rectCenter(rect: Rect): { x: number; y: number } {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function readDomRect(element: HTMLElement): Rect {
  const rect = element.getBoundingClientRect();
  return {
    left: rect.left,
    top: rect.top,
    width: rect.width,
    height: rect.height,
  };
}

function buildPrimitiveSuppressionCss(overlays: readonly PrimitiveOverlayState[]): string {
  const selectors = overlays.flatMap((overlay) => {
    const entityId = overlay.facePlan.entity.id;
    const hiddenIds = [entityId, `${entityId}:hidden`, `${entityId}:primitive-hidden`];
    const zoneIds = [overlay.facePlan.sourceZone?.id, overlay.facePlan.destinationZone?.id].filter(
      (zoneId): zoneId is string => Boolean(zoneId),
    );

    return zoneIds.flatMap((zoneId) =>
      hiddenIds.flatMap((candidateId) => [
        `[data-sim-zone-id="${cssAttributeValue(zoneId)}"] [data-sim-entity-id="${cssAttributeValue(candidateId)}"]`,
        `[data-zone-id="${cssAttributeValue(zoneId)}"] [data-entity-id="${cssAttributeValue(candidateId)}"]`,
      ]),
    );
  });

  const uniqueSelectors = Array.from(new Set(selectors));
  return uniqueSelectors.length > 0
    ? `${uniqueSelectors.join(",\n")} { visibility: hidden !important; pointer-events: none !important; }`
    : "";
}

function cssAttributeValue(value: string): string {
  return value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\A ");
}
