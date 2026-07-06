import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion } from "motion/react";

import { CardFace } from "../components/CardFace";
import type {
  BeamOverlayState,
  CardFaceKind,
  CardOverlayState,
  LayoutShiftState,
  PhaseOverlayState,
  ResourceOverlayState,
} from "./motionTypes";
import { refKey } from "./motionTypes";
import { rectCenter } from "./rectRegistry";

const CARD_EASE = [0.25, 0.1, 0.25, 1] as const;

export function CardMotionOverlay({
  overlay,
  reduced,
  visible,
  onComplete,
}: {
  overlay: CardOverlayState;
  reduced: boolean;
  visible: boolean;
  onComplete: (overlay: CardOverlayState) => void;
}) {
  const duration = reduced ? 0.03 : overlay.durationMs / 1000;
  const delay = reduced ? 0 : overlay.delayMs / 1000;
  const sourceEntity = projectEntityForFace(overlay.entity, overlay.sourceFace, "motion-source");
  const destinationEntity = projectEntityForFace(
    overlay.entity,
    overlay.destinationFace,
    "motion-destination",
  );
  const faceChanges = overlay.sourceFace !== overlay.destinationFace;

  return (
    <motion.div
      className="motion-card-overlay pointer-events-none fixed z-[1000] [perspective:900px]"
      data-testid="motion-card-overlay"
      data-motion-kind={overlay.kind}
      data-motion-id={overlay.id}
      data-sim-entity-id={overlay.entity.id}
      data-from-ref={overlay.fromRef ? refKey(overlay.fromRef) : undefined}
      data-to-ref={overlay.toRef ? refKey(overlay.toRef) : undefined}
      data-source-face={overlay.sourceFace}
      data-destination-face={overlay.destinationFace}
      style={{
        left: overlay.to.left,
        top: overlay.to.top,
        width: overlay.to.width,
        height: overlay.to.height,
        transformOrigin: "top left",
        visibility: visible ? undefined : "hidden",
      }}
      initial={
        reduced
          ? false
          : {
              x: overlay.from.left - overlay.to.left,
              y: overlay.from.top - overlay.to.top,
              scaleX: overlay.from.width / overlay.to.width,
              scaleY: overlay.from.height / overlay.to.height,
              opacity: overlay.kind === "enter" ? 0 : 1,
            }
      }
      animate={
        reduced
          ? { opacity: overlay.kind === "exit" ? 0 : 1 }
          : {
              x: 0,
              y: 0,
              scaleX: overlay.kind === "exit" ? 0.9 : 1,
              scaleY: overlay.kind === "exit" ? 0.9 : 1,
              opacity: overlay.kind === "exit" ? 0 : 1,
            }
      }
      transition={{ duration, delay, ease: CARD_EASE }}
      onAnimationComplete={() => onComplete(overlay)}
    >
      <div className="relative h-full w-full [&_.sim-card-face]:h-full [&_.sim-card-face]:min-h-0 [&_.sim-card-face]:w-full">
        {faceChanges ? (
          <>
            <motion.div
              className="absolute inset-0"
              animate={reduced ? { opacity: 0 } : { opacity: [1, 1, 0, 0] }}
              transition={{ duration, delay, ease: "easeInOut", times: [0, 0.28, 0.38, 1] }}
            >
              <CardFace
                entity={sourceEntity}
                density="normal"
                fill
                fullImageChrome="edge-to-edge"
                fullImageFit="cover"
              />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
              transition={{ duration, delay, ease: "easeInOut", times: [0, 0.3, 0.42, 1] }}
            >
              <CardFace
                entity={destinationEntity}
                density="normal"
                fill
                fullImageChrome="edge-to-edge"
                fullImageFit="cover"
              />
            </motion.div>
          </>
        ) : (
          <CardFace
            entity={destinationEntity}
            density="normal"
            fill
            fullImageChrome="edge-to-edge"
            fullImageFit="cover"
          />
        )}
      </div>
    </motion.div>
  );
}

export function BeamMotionOverlay({
  overlay,
  reduced,
  onComplete,
}: {
  overlay: BeamOverlayState;
  reduced: boolean;
  onComplete: (overlay: BeamOverlayState) => void;
}) {
  const duration = reduced ? 0.03 : overlay.durationMs / 1000;
  const delay = reduced ? 0 : overlay.delayMs / 1000;
  const source = rectCenter(overlay.source);
  let completionAttached = false;

  return (
    <>
      {overlay.targets.map(({ ref, rect }, index) => {
        const target = rectCenter(rect);
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.hypot(dx, dy);
        const renderedLength = Math.max(8, length);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const attachCompletion = !completionAttached;
        completionAttached = true;
        return (
          <div key={`${overlay.id}:${index}`}>
            <div
              className="pointer-events-none fixed z-[1002] h-1 rounded-full"
              data-testid="motion-beam-overlay"
              data-motion-id={overlay.id}
              data-motion-kind={overlay.kind}
              data-source-ref={overlay.sourceRef ? refKey(overlay.sourceRef) : undefined}
              data-target-ref={refKey(ref)}
              style={{
                left: source.x,
                top: source.y,
                width: renderedLength,
                transform: `translateY(-2px) rotate(${angle}deg)`,
                transformOrigin: "left center",
              }}
            >
              <motion.div
                className="h-full w-full rounded-full bg-[linear-gradient(90deg,rgba(43,243,190,0.08),rgba(43,243,190,0.95),rgba(255,235,122,0.95))] shadow-[0_0_14px_rgba(43,243,190,0.72)]"
                initial={reduced ? false : { opacity: 0, scaleX: 0 }}
                animate={reduced ? { opacity: 0 } : { opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                transition={{ duration, delay, ease: "easeOut", times: [0, 0.42, 1] }}
                style={{ transformOrigin: "left center" }}
                onAnimationComplete={attachCompletion ? () => onComplete(overlay) : undefined}
              />
            </div>
            <motion.div
              className="pointer-events-none fixed z-[1002] rounded-md border-2 border-[#2bf3be] shadow-[0_0_18px_rgba(43,243,190,0.65)]"
              data-testid="motion-target-pulse"
              data-motion-id={overlay.id}
              data-target-ref={refKey(ref)}
              style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={
                reduced ? { opacity: 0 } : { opacity: [0, 0.95, 0], scale: [0.92, 1.04, 1.08] }
              }
              transition={{ duration, delay, ease: "easeOut", times: [0, 0.34, 1] }}
            />
            {overlay.label ? (
              <motion.div
                className="pointer-events-none fixed z-[1003] rounded-sm border border-[#ff2d75] bg-[#120713]/95 px-2 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-[#ffeb7a] shadow-[0_0_20px_rgba(255,45,117,0.55)]"
                data-testid="motion-result-badge"
                data-motion-id={overlay.id}
                data-result-label={overlay.label}
                data-target-ref={refKey(ref)}
                style={{
                  left: rect.left + rect.width / 2,
                  top: rect.top - 10,
                  transform: "translate(-50%, -100%)",
                }}
                initial={reduced ? false : { opacity: 0, scale: 0.9 }}
                animate={
                  reduced
                    ? { opacity: 1, scale: 1 }
                    : { opacity: [0, 1, 1, 0], scale: [0.9, 1, 1, 0.96] }
                }
                transition={{
                  duration: duration + (reduced ? 0 : 0.35),
                  delay,
                  ease: "easeOut",
                  times: [0, 0.14, 0.86, 1],
                }}
              >
                {overlay.label}
              </motion.div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}

export function ResourceMotionOverlay({
  overlay,
  reduced,
  onComplete,
}: {
  overlay: ResourceOverlayState;
  reduced: boolean;
  onComplete: (overlay: ResourceOverlayState) => void;
}) {
  const duration = reduced ? 0.03 : overlay.durationMs / 1000;
  const delay = reduced ? 0 : overlay.delayMs / 1000;
  return (
    <motion.span
      className="pointer-events-none fixed z-[1003] rounded-full px-2 py-1 text-[13px] font-extrabold leading-none shadow-[0_0_18px_rgba(124,255,177,.45)]"
      data-testid="motion-resource-float"
      data-motion-id={overlay.id}
      style={{
        left: overlay.anchor.left + overlay.anchor.width / 2,
        top: overlay.anchor.top,
        translateX: "-50%",
        color: overlay.delta >= 0 ? "#07131f" : "#fff5d6",
        background: overlay.delta >= 0 ? "#7cffb1" : "#ff4d5e",
      }}
      initial={reduced ? false : { y: 0, opacity: 0 }}
      animate={reduced ? { opacity: 0 } : { y: [0, -12, -56], opacity: [0, 1, 0] }}
      transition={{ duration, delay, ease: "easeOut", times: [0, 0.2, 1] }}
      onAnimationComplete={() => onComplete(overlay)}
    >
      {`${overlay.delta >= 0 ? "+" : ""}${overlay.delta}${overlay.label ? ` ${overlay.label}` : ""}`}
    </motion.span>
  );
}

export function PhaseMotionOverlay({
  overlay,
  reduced,
  onComplete,
}: {
  overlay: PhaseOverlayState;
  reduced: boolean;
  onComplete: (overlay: PhaseOverlayState) => void;
}) {
  const duration = reduced ? 0.03 : overlay.durationMs / 1000;
  const delay = reduced ? 0 : overlay.delayMs / 1000;
  return (
    <motion.div
      className="pointer-events-none fixed z-[1003] flex items-center gap-2 rounded-md border border-[rgba(76,195,255,.55)] bg-[rgba(6,13,30,.86)] px-4 py-2 text-[13px] font-bold uppercase text-white shadow-[0_0_24px_rgba(76,195,255,.28),0_12px_36px_rgba(0,0,0,.35)]"
      data-testid="motion-phase-change"
      data-motion-id={overlay.id}
      style={{
        left: overlay.center.x,
        top: overlay.center.y,
        transform: "translate(-50%, -50%)",
      }}
      initial={reduced ? false : { x: 30, opacity: 0 }}
      animate={reduced ? { opacity: 0 } : { x: [30, 0, 0, -30], opacity: [0, 1, 1, 0] }}
      transition={{ duration, delay, ease: "linear", times: [0, 0.18, 0.82, 1] }}
      onAnimationComplete={() => onComplete(overlay)}
    >
      <span className="opacity-60">{formatLabel(overlay.from)}</span>
      <span className="text-[rgba(76,195,255,.9)]">&gt;</span>
      <span>{formatLabel(overlay.to)}</span>
    </motion.div>
  );
}

export function LayoutShiftSentinel({
  overlay,
  reduced,
  onComplete,
}: {
  overlay: LayoutShiftState;
  reduced: boolean;
  onComplete: (overlay: LayoutShiftState) => void;
}) {
  return (
    <motion.div
      className="fixed size-px opacity-0"
      data-testid="motion-layout-shift-sentinel"
      data-motion-id={overlay.id}
      data-motion-layout-entities={overlay.entityIds.join(" ")}
      animate={{ opacity: 0 }}
      transition={{
        duration: reduced ? 0.03 : overlay.durationMs / 1000,
        delay: reduced ? 0 : overlay.delayMs / 1000,
      }}
      onAnimationComplete={() => onComplete(overlay)}
    />
  );
}

function projectEntityForFace(
  entity: SimulatorEntity,
  face: CardFaceKind,
  suffix: string,
): SimulatorEntity {
  if (face === "public") {
    return { ...entity, face: "public" };
  }
  return {
    ...entity,
    id: `${entity.id}:${suffix}`,
    title: "Hidden card",
    subtitle: "Private information",
    kind: "card",
    face: "hidden",
    states: [],
    imageUrl: undefined,
    backImageUrl: entity.backImageUrl,
    stats: [],
    traits: [],
    frameStyle: undefined,
    overlayBadges: undefined,
    spawnAnimation: undefined,
  };
}

function formatLabel(value: string): string {
  return value
    .split(/[-_\s/]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
