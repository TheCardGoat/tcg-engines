import type { ReactNode } from "react";
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
const MAX_CARD_OVERLAY_WIDTH = 240;
const MAX_CARD_OVERLAY_HEIGHT = 336;
const MAX_CARD_VIEWPORT_WIDTH_RATIO = 0.45;
const MAX_CARD_VIEWPORT_HEIGHT_RATIO = 0.65;
const FALLBACK_CARD_WIDTH = 118;
const FALLBACK_CARD_HEIGHT = 156;

export function CardMotionOverlay({
  overlay,
  reduced,
  visible,
  renderEntity,
  onComplete,
}: {
  overlay: CardOverlayState;
  reduced: boolean;
  visible: boolean;
  renderEntity?: MotionEntityRenderer;
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
  const from = safeCardMotionRect(overlay.from);
  const to = safeCardMotionRect(overlay.to);
  const faceChanges = overlay.sourceFace !== overlay.destinationFace;
  const isSpotlight = overlay.kind === "spotlight";

  return (
    <motion.div
      className={`motion-card-overlay pointer-events-none fixed z-[1000] [perspective:900px] ${
        isSpotlight ? "drop-shadow-[0_0_20px_rgba(255,235,122,0.55)]" : ""
      }`}
      data-testid="motion-card-overlay"
      data-motion-kind={overlay.kind}
      data-motion-id={overlay.id}
      data-sim-entity-id={overlay.entity.id}
      data-from-ref={overlay.fromRef ? refKey(overlay.fromRef) : undefined}
      data-to-ref={overlay.toRef ? refKey(overlay.toRef) : undefined}
      data-source-face={overlay.sourceFace}
      data-destination-face={overlay.destinationFace}
      style={{
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        transformOrigin: "top left",
        visibility: visible ? undefined : "hidden",
      }}
      initial={
        reduced
          ? false
          : isSpotlight
            ? { opacity: 0, scale: 0.96 }
            : {
                x: from.left - to.left,
                y: from.top - to.top,
                scaleX: from.width / to.width,
                scaleY: from.height / to.height,
                opacity: overlay.kind === "enter" ? 0 : 1,
              }
      }
      animate={
        reduced
          ? { opacity: overlay.kind === "exit" ? 0 : 1 }
          : isSpotlight
            ? { opacity: [0, 1, 1, 0], scale: [0.96, 1, 1, 0.98] }
            : {
                x: 0,
                y: 0,
                scaleX: overlay.kind === "exit" ? 0.9 : 1,
                scaleY: overlay.kind === "exit" ? 0.9 : 1,
                opacity: overlay.kind === "exit" ? 0 : 1,
              }
      }
      transition={
        isSpotlight
          ? { duration, delay, ease: "easeOut", times: [0, 0.14, 0.86, 1] }
          : { duration, delay, ease: CARD_EASE }
      }
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
              <MotionEntityFace entity={sourceEntity} renderEntity={renderEntity} />
            </motion.div>
            <motion.div
              className="absolute inset-0"
              animate={reduced ? { opacity: 1 } : { opacity: [0, 0, 1, 1] }}
              transition={{ duration, delay, ease: "easeInOut", times: [0, 0.3, 0.42, 1] }}
            >
              <MotionEntityFace entity={destinationEntity} renderEntity={renderEntity} />
            </motion.div>
          </>
        ) : (
          <MotionEntityFace entity={destinationEntity} renderEntity={renderEntity} />
        )}
        {overlay.label ? (
          <motion.div
            className="pointer-events-none absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-[calc(100%+6px)] whitespace-nowrap rounded-sm border border-[#ffeb7a] bg-[#120713]/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#ffeb7a] shadow-[0_0_18px_rgba(255,45,117,0.5)]"
            data-testid="motion-card-result-badge"
            data-motion-id={overlay.id}
            data-result-label={overlay.label}
            initial={reduced ? false : { opacity: 0, y: 4, scale: 0.96 }}
            animate={
              reduced
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: [0, 1, 1, 0], y: [4, 0, 0, -2], scale: [0.96, 1, 1, 0.98] }
            }
            transition={{
              duration: duration + (reduced ? 0 : 0.25),
              delay,
              ease: "easeOut",
              times: [0, 0.16, 0.84, 1],
            }}
          >
            {overlay.label}
          </motion.div>
        ) : null}
      </div>
    </motion.div>
  );
}

function safeCardMotionRect(rect: CardOverlayState["from"]): CardOverlayState["from"] {
  const finite =
    Number.isFinite(rect.left) &&
    Number.isFinite(rect.top) &&
    Number.isFinite(rect.width) &&
    Number.isFinite(rect.height);
  if (!finite || rect.width <= 0 || rect.height <= 0) {
    return {
      left: viewportWidth() / 2 - FALLBACK_CARD_WIDTH / 2,
      top: viewportHeight() / 2 - FALLBACK_CARD_HEIGHT / 2,
      width: FALLBACK_CARD_WIDTH,
      height: FALLBACK_CARD_HEIGHT,
    };
  }

  const maxWidth = Math.min(
    MAX_CARD_OVERLAY_WIDTH,
    viewportWidth() * MAX_CARD_VIEWPORT_WIDTH_RATIO,
  );
  const maxHeight = Math.min(
    MAX_CARD_OVERLAY_HEIGHT,
    viewportHeight() * MAX_CARD_VIEWPORT_HEIGHT_RATIO,
  );
  const scale = Math.min(1, maxWidth / rect.width, maxHeight / rect.height);
  if (scale >= 1) {
    return rect;
  }

  const width = Math.max(1, rect.width * scale);
  const height = Math.max(1, rect.height * scale);
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

function viewportWidth(): number {
  return typeof window === "undefined" ? 1024 : window.innerWidth;
}

function viewportHeight(): number {
  return typeof window === "undefined" ? 768 : window.innerHeight;
}

export type MotionEntityRenderer = (entity: SimulatorEntity) => ReactNode;

function MotionEntityFace({
  entity,
  renderEntity,
}: {
  entity: SimulatorEntity;
  renderEntity?: MotionEntityRenderer;
}) {
  if (entity.kind === "die" && entity.face !== "hidden") {
    return <MotionDieFace entity={entity} />;
  }

  if (renderEntity) {
    return renderEntity(entity);
  }

  return (
    <CardFace
      entity={entity}
      density="normal"
      fill
      fullImageChrome="edge-to-edge"
      fullImageFit="cover"
    />
  );
}

function MotionDieFace({ entity }: { entity: SimulatorEntity }) {
  const dieLabel = entity.title || entity.traits[0]?.toUpperCase() || "DIE";
  const faceValue =
    stringValue(entity.dataAttributes?.["data-face"]) ??
    entity.stats.find((stat) => stat.label.toLowerCase() === "face")?.value;

  return (
    <div
      className="grid h-full w-full place-items-center"
      data-testid="motion-die-face"
      data-card-kind="die"
      data-entity-id={entity.id}
      data-sim-entity-id={entity.id}
      data-face={faceValue}
      aria-label={faceValue ? `${dieLabel}, showing ${faceValue}` : dieLabel}
    >
      <span className="relative grid aspect-square h-full max-h-full min-h-6 min-w-6 place-items-center rounded-full border border-[#2bf3be]/70 bg-[#101821] text-[clamp(0.7rem,42%,1.4rem)] font-black leading-none text-[#2bf3be] shadow-[0_0_14px_rgba(43,243,190,0.42)]">
        {faceValue ?? dieLabel}
      </span>
    </div>
  );
}

function stringValue(value: string | number | boolean | undefined): string | undefined {
  if (value === undefined || value === false) {
    return undefined;
  }
  return String(value);
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
  const isDirectCombat = overlay.kind === "combat" && overlay.attackKind === "direct";
  const isFightCombat = overlay.kind === "combat" && overlay.attackKind === "fight";
  const isBlockedCombat = overlay.kind === "combat" && overlay.reason === "blocked";
  const sourceBadge =
    overlay.kind === "effect" && overlay.sourceLabel
      ? overlay.sourceLabel
      : isBlockedCombat
        ? "Block"
        : isDirectCombat
          ? "Attack"
          : isFightCombat
            ? (overlay.sourceLabel ?? "Attacker")
            : null;
  const sourceBadgeTitle =
    isDirectCombat || isBlockedCombat || isFightCombat ? overlay.sourceLabel : sourceBadge;

  return (
    <>
      {sourceBadge ? (
        <>
          <motion.div
            className={`pointer-events-none fixed z-[1002] rounded-md border-2 ${
              isDirectCombat
                ? "border-[#ff2d75] shadow-[0_0_24px_rgba(255,45,117,0.75),inset_0_0_16px_rgba(255,235,122,0.2)]"
                : isBlockedCombat
                  ? "border-[#ffeb7a] shadow-[0_0_24px_rgba(255,235,122,0.72),inset_0_0_16px_rgba(43,243,190,0.2)]"
                  : "border-[#ffeb7a] shadow-[0_0_20px_rgba(255,235,122,0.65),inset_0_0_14px_rgba(255,235,122,0.18)]"
            }`}
            data-testid="motion-source-pulse"
            data-motion-id={overlay.id}
            data-motion-kind={overlay.kind}
            data-attack-kind={overlay.attackKind}
            data-combat-reason={overlay.reason}
            data-source-ref={overlay.sourceRef ? refKey(overlay.sourceRef) : undefined}
            data-source-label={sourceBadgeTitle ?? sourceBadge}
            style={{
              left: overlay.source.left,
              top: overlay.source.top,
              width: overlay.source.width,
              height: overlay.source.height,
            }}
            initial={reduced ? false : { opacity: 0, scale: 0.96 }}
            animate={
              reduced ? { opacity: 0 } : { opacity: [0, 0.95, 0], scale: [0.96, 1.08, 1.12] }
            }
            transition={{ duration, delay, ease: "easeOut", times: [0, 0.28, 1] }}
          />
          <motion.div
            className={`pointer-events-none fixed z-[1004] max-w-[min(18rem,calc(100vw-2rem))] rounded-sm border px-2 py-1 text-[11px] font-black uppercase shadow-[0_0_20px_rgba(255,235,122,0.42)] ${
              isDirectCombat
                ? "border-[#ff2d75] bg-[#190611]/95 text-[#ffe66d]"
                : isBlockedCombat
                  ? "border-[#ffeb7a] bg-[#161004]/95 text-[#fff4a8]"
                  : isFightCombat
                    ? "border-[#2bf3be] bg-[#061516]/95 text-[#baffef]"
                    : "border-[#ffeb7a] bg-[#151005]/95 text-[#fff4a8]"
            }`}
            data-testid="motion-source-badge"
            data-motion-id={overlay.id}
            data-motion-kind={overlay.kind}
            data-attack-kind={overlay.attackKind}
            data-combat-reason={overlay.reason}
            data-source-label={sourceBadgeTitle ?? sourceBadge}
            style={{
              left: source.x,
              top: overlay.source.top - 10,
              transform: "translate(-50%, -100%)",
            }}
            initial={reduced ? false : { opacity: 0, y: 4, scale: 0.96 }}
            animate={
              reduced
                ? { opacity: 1, y: 0, scale: 1 }
                : { opacity: [0, 1, 1, 0], y: [4, 0, 0, -2], scale: [0.96, 1, 1, 0.98] }
            }
            transition={{
              duration: duration + (reduced ? 0 : 0.35),
              delay,
              ease: "easeOut",
              times: [0, 0.14, 0.86, 1],
            }}
          >
            <span className="block text-[8px] leading-none text-[#2bf3be]">
              {isDirectCombat
                ? "Direct"
                : isBlockedCombat
                  ? "Blocker"
                  : isFightCombat
                    ? "Deals"
                    : "Trigger"}
            </span>
            <span className="block truncate">{sourceBadgeTitle ?? sourceBadge}</span>
          </motion.div>
        </>
      ) : null}
      {overlay.targets.map(({ ref, rect, label }, index) => {
        const target = rectCenter(rect);
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const length = Math.hypot(dx, dy);
        const renderedLength = Math.max(8, length);
        const angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        const resultBadgePosition =
          overlay.kind === "combat"
            ? combatResultBadgePosition(source.x, source.y, dx, dy, renderedLength)
            : {
                left: rect.left + rect.width / 2,
                top: rect.top - 10,
                transform: "translate(-50%, -100%)",
              };
        const detailBadgePosition = combatDetailBadgePosition(
          source.x,
          source.y,
          dx,
          dy,
          renderedLength,
        );
        const fightTargetLabel =
          overlay.kind === "combat" && overlay.attackKind === "fight" ? (label ?? "Target") : null;
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
                className={`h-full w-full rounded-full ${
                  isDirectCombat
                    ? "bg-[linear-gradient(90deg,rgba(255,45,117,0.08),rgba(255,45,117,0.98),rgba(255,235,122,0.98))] shadow-[0_0_18px_rgba(255,45,117,0.78)]"
                    : isBlockedCombat
                      ? "bg-[linear-gradient(90deg,rgba(255,235,122,0.08),rgba(255,235,122,0.98),rgba(43,243,190,0.98))] shadow-[0_0_18px_rgba(255,235,122,0.72)]"
                      : "bg-[linear-gradient(90deg,rgba(43,243,190,0.08),rgba(43,243,190,0.95),rgba(255,235,122,0.95))] shadow-[0_0_14px_rgba(43,243,190,0.72)]"
                }`}
                initial={reduced ? false : { opacity: 0, scaleX: 0 }}
                animate={reduced ? { opacity: 0 } : { opacity: [0, 1, 0], scaleX: [0, 1, 1] }}
                transition={{ duration, delay, ease: "easeOut", times: [0, 0.42, 1] }}
                style={{ transformOrigin: "left center" }}
                onAnimationComplete={attachCompletion ? () => onComplete(overlay) : undefined}
              />
            </div>
            <motion.div
              className={`pointer-events-none fixed z-[1002] rounded-md border-2 ${
                isDirectCombat
                  ? "border-[#ffeb7a] shadow-[0_0_22px_rgba(255,235,122,0.76)]"
                  : isBlockedCombat
                    ? "border-[#2bf3be] shadow-[0_0_22px_rgba(43,243,190,0.7)]"
                    : "border-[#2bf3be] shadow-[0_0_18px_rgba(43,243,190,0.65)]"
              }`}
              data-testid="motion-target-pulse"
              data-motion-id={overlay.id}
              data-motion-kind={overlay.kind}
              data-attack-kind={overlay.attackKind}
              data-combat-reason={overlay.reason}
              data-target-ref={refKey(ref)}
              style={{ left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
              initial={reduced ? false : { opacity: 0, scale: 0.92 }}
              animate={
                reduced ? { opacity: 0 } : { opacity: [0, 0.95, 0], scale: [0.92, 1.04, 1.08] }
              }
              transition={{ duration, delay, ease: "easeOut", times: [0, 0.34, 1] }}
            />
            {overlay.kind === "effect" && label ? (
              <motion.div
                className="pointer-events-none fixed z-[1004] max-w-[min(16rem,calc(100vw-2rem))] rounded-sm border border-[#2bf3be] bg-[#071516]/95 px-2 py-1 text-[10px] font-black uppercase text-[#baffef] shadow-[0_0_18px_rgba(43,243,190,0.45)]"
                data-testid="motion-target-badge"
                data-motion-id={overlay.id}
                data-target-ref={refKey(ref)}
                data-target-label={label}
                style={{
                  left: rect.left + rect.width / 2,
                  top: rect.top + rect.height + 8,
                  transform: "translateX(-50%)",
                }}
                initial={reduced ? false : { opacity: 0, y: -3, scale: 0.96 }}
                animate={
                  reduced
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: [0, 1, 1, 0], y: [-3, 0, 0, 2], scale: [0.96, 1, 1, 0.98] }
                }
                transition={{
                  duration: duration + (reduced ? 0 : 0.35),
                  delay,
                  ease: "easeOut",
                  times: [0, 0.14, 0.86, 1],
                }}
              >
                <span className="block text-[8px] leading-none text-[#ffeb7a]">Target</span>
                <span className="block truncate">{label}</span>
              </motion.div>
            ) : null}
            {fightTargetLabel ? (
              <motion.div
                className="pointer-events-none fixed z-[1004] max-w-[min(16rem,calc(100vw-2rem))] rounded-sm border border-[#ffeb7a] bg-[#160811]/95 px-2 py-1 text-[10px] font-black uppercase text-[#fff4a8] shadow-[0_0_18px_rgba(255,235,122,0.42)]"
                data-testid="motion-combat-target-badge"
                data-motion-id={overlay.id}
                data-target-ref={refKey(ref)}
                data-target-label={fightTargetLabel}
                style={{
                  left: rect.left + rect.width / 2,
                  top: rect.top + rect.height + 8,
                  transform: "translateX(-50%)",
                }}
                initial={reduced ? false : { opacity: 0, y: -3, scale: 0.96 }}
                animate={
                  reduced
                    ? { opacity: 1, y: 0, scale: 1 }
                    : { opacity: [0, 1, 1, 0], y: [-3, 0, 0, 2], scale: [0.96, 1, 1, 0.98] }
                }
                transition={{
                  duration: duration + (reduced ? 0 : 0.35),
                  delay,
                  ease: "easeOut",
                  times: [0, 0.14, 0.86, 1],
                }}
              >
                <span className="block text-[8px] leading-none text-[#ff2d75]">Receives</span>
                <span className="block truncate">{fightTargetLabel}</span>
              </motion.div>
            ) : null}
            {overlay.detailLabel ? (
              <motion.div
                className="pointer-events-none fixed z-[1010] rounded-sm border border-[#2bf3be] bg-[#061516]/95 px-2 py-1 text-[10px] font-black uppercase tracking-[0.12em] text-[#baffef] shadow-[0_0_18px_rgba(43,243,190,0.45)]"
                data-testid="motion-combat-detail-badge"
                data-motion-id={overlay.id}
                data-motion-kind={overlay.kind}
                data-detail-label={overlay.detailLabel}
                data-target-ref={refKey(ref)}
                style={detailBadgePosition}
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
                {overlay.detailLabel}
              </motion.div>
            ) : null}
            {overlay.label ? (
              <motion.div
                className={`pointer-events-none fixed z-[1010] rounded-sm border px-2 py-1 text-[11px] font-black uppercase text-[#ffeb7a] shadow-[0_0_20px_rgba(255,45,117,0.55)] ${
                  overlay.kind === "combat"
                    ? "border-[#ffeb7a] bg-[#160811]/95 tracking-[0.12em]"
                    : "border-[#ff2d75] bg-[#120713]/95 tracking-[0.18em]"
                }`}
                data-testid="motion-result-badge"
                data-motion-id={overlay.id}
                data-motion-kind={overlay.kind}
                data-result-label={overlay.label}
                data-target-ref={refKey(ref)}
                style={resultBadgePosition}
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
  const hasValueTransition =
    overlay.fromValue !== undefined &&
    overlay.toValue !== undefined &&
    overlay.fromValue !== overlay.toValue;
  const positive = overlay.delta >= 0;
  return (
    <>
      {hasValueTransition ? (
        <motion.span
          className="pointer-events-none fixed z-[1003] inline-flex items-center gap-1 rounded-md border border-[#ffeb7a] bg-[#070b13]/94 px-2 py-1 text-[12px] font-black text-[#ffeb7a] shadow-[0_0_22px_rgba(255,235,122,0.48)]"
          data-testid="motion-resource-value"
          data-motion-id={overlay.id}
          data-from-value={overlay.fromValue}
          data-to-value={overlay.toValue}
          data-delta={overlay.delta}
          style={{
            left: overlay.anchor.left + overlay.anchor.width / 2,
            top: overlay.anchor.top - 8,
            transform: "translate(-50%, -100%)",
          }}
          initial={reduced ? false : { opacity: 0, y: 4, scale: 0.96 }}
          animate={
            reduced
              ? { opacity: 1, y: 0, scale: 1 }
              : { opacity: [0, 1, 1, 0], y: [4, 0, 0, -2], scale: [0.96, 1.04, 1, 0.98] }
          }
          transition={{ duration, delay, ease: "easeOut", times: [0, 0.18, 0.72, 1] }}
          onAnimationComplete={hasValueTransition ? () => onComplete(overlay) : undefined}
        >
          <span>{overlay.fromValue}</span>
          <span className="text-[10px] text-[#2bf3be]">-&gt;</span>
          <span>{overlay.toValue}</span>
          <span className={positive ? "ml-1 text-[#7cffb1]" : "ml-1 text-[#ff7b88]"}>
            {positive ? "+" : ""}
            {overlay.delta}
          </span>
        </motion.span>
      ) : null}
      {!hasValueTransition ? (
        <motion.span
          className="pointer-events-none fixed z-[1004] rounded-full px-2 py-1 text-[13px] font-extrabold leading-none shadow-[0_0_18px_rgba(124,255,177,.45)]"
          data-testid="motion-resource-float"
          data-motion-id={overlay.id}
          style={{
            left: overlay.anchor.left + overlay.anchor.width / 2,
            top: overlay.anchor.top,
            translateX: "-50%",
            color: positive ? "#07131f" : "#fff5d6",
            background: positive ? "#7cffb1" : "#ff4d5e",
          }}
          initial={reduced ? false : { y: 0, opacity: 0 }}
          animate={reduced ? { opacity: 0 } : { y: [0, -12, -56], opacity: [0, 1, 0] }}
          transition={{
            duration,
            delay,
            ease: "easeOut",
            times: [0, 0.2, 1],
          }}
          onAnimationComplete={() => onComplete(overlay)}
        >
          {`${positive ? "+" : ""}${overlay.delta}${overlay.label ? ` ${overlay.label}` : ""}`}
        </motion.span>
      ) : null}
    </>
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
  const turnTitle =
    overlay.variant === "turn"
      ? overlay.playerId && overlay.playerId === overlay.viewerSeatId
        ? "Your Turn"
        : "Rival Turn"
      : null;
  return (
    <div
      className="pointer-events-none fixed z-[1003]"
      data-testid="motion-phase-change"
      data-motion-id={overlay.id}
      data-motion-phase-variant={overlay.variant}
      data-turn-number={overlay.turnNumber}
      style={{
        left: overlay.center.x,
        top: overlay.center.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      <motion.div
        className="flex min-w-36 flex-col items-center justify-center rounded-md border border-[rgba(76,195,255,.55)] bg-[rgba(6,13,30,.86)] px-4 py-2 text-center text-[13px] font-bold text-white shadow-[0_0_24px_rgba(76,195,255,.28),0_12px_36px_rgba(0,0,0,.35)]"
        initial={reduced ? false : { y: 8, scale: 0.96, opacity: 0 }}
        animate={
          reduced
            ? { opacity: [1, 1, 0] }
            : { y: [8, 0, 0, -8], scale: [0.96, 1, 1, 0.98], opacity: [0, 1, 1, 0] }
        }
        transition={{ duration, delay, ease: "easeOut", times: [0, 0.18, 0.82, 1] }}
        onAnimationComplete={() => onComplete(overlay)}
      >
        {turnTitle ? (
          <>
            <span>{turnTitle}</span>
            {overlay.turnNumber ? (
              <span className="mt-0.5 text-[11px] font-semibold text-[rgba(76,195,255,.9)]">
                Turn {overlay.turnNumber}
              </span>
            ) : null}
          </>
        ) : (
          <span className="flex items-center gap-2">
            <span className="opacity-60">{formatLabel(overlay.from)}</span>
            <span className="text-[rgba(76,195,255,.9)]">&gt;</span>
            <span>{formatLabel(overlay.to)}</span>
          </span>
        )}
      </motion.div>
    </div>
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

function combatResultBadgePosition(
  sourceX: number,
  sourceY: number,
  dx: number,
  dy: number,
  length: number,
): { left: number; top: number; transform: string } {
  const safeLength = Math.max(1, length);
  const normalX = (-dy / safeLength) * 20;
  const normalY = (dx / safeLength) * 20;
  return {
    left: sourceX + dx * 0.58 + normalX,
    top: sourceY + dy * 0.58 + normalY,
    transform: "translate(-50%, -50%)",
  };
}

function combatDetailBadgePosition(
  sourceX: number,
  sourceY: number,
  dx: number,
  dy: number,
  length: number,
): { left: number; top: number; transform: string } {
  const safeLength = Math.max(1, length);
  const normalX = (dy / safeLength) * 24;
  const normalY = (-dx / safeLength) * 24;
  return {
    left: sourceX + dx * 0.5 + normalX,
    top: sourceY + dy * 0.5 + normalY,
    transform: "translate(-50%, -50%)",
  };
}

function formatLabel(value: string): string {
  return value
    .split(/[-_\s/]+/g)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
}
