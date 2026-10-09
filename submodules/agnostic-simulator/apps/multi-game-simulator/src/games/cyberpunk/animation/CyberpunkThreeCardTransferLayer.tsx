import { useFrame, useThree } from "@react-three/fiber";
import { CARD_PRESENTATION_LAYERS } from "@tcg/simulator-ui";
import type {
  SimulatorSpatialStateChange,
  SimulatorSpatialStateChangeRendererProps,
  SimulatorSpatialTransfer,
  SimulatorSpatialTransferRendererProps,
} from "@tcg/simulator-ui";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Mesh, MeshBasicMaterial } from "three";

import { resolveLateMountClock, type CardTransferRect } from "@tcg/simulator-presentation/motion";
import { cardStateChangeTransform } from "./three-card-state-change-motion";
import {
  isStagedTrashRetrieval,
  isUnitHandPlay,
  STAGED_RETRIEVAL_VIA_HOLD,
} from "./three-card-transfer-plan";
import { resolveCyberpunkCardTransferPose, unitEntryElapsedMs } from "./unit-entry-motion";
import { useAnimationSurfaceFrame, type AnimationSurfaceFrame } from "./animationSurfaceFrame";
import { SimulatorEffectCanvas } from "@tcg/simulator-presentation/canvas";

let cachedWebGlSupport: boolean | undefined;

/**
 * The deck-reveal display spot: a full-size card centered over the board, the
 * same place reveals hold their cards. Staged trash→hand retrievals park here
 * so the recovered card is readable before it continues to the hand.
 */
function revealStageRect(mapRect: AnimationSurfaceFrame["mapRect"]): CardTransferRect {
  const width = Math.min(150, Math.max(92, window.innerWidth * 0.24));
  const height = (width * 7) / 5;
  return mapRect(
    new DOMRect(
      window.innerWidth / 2 - width / 2,
      window.innerHeight / 2 - height / 2,
      width,
      height,
    ),
  );
}

/** Route override for a transfer: a staging waypoint plus its hold fraction. */
function stagedRoute(
  transfer: SimulatorSpatialTransfer,
  mapRect: AnimationSurfaceFrame["mapRect"],
): { via: CardTransferRect; viaHold: number } | null {
  if (!isStagedTrashRetrieval(transfer.step)) return null;
  return { via: revealStageRect(mapRect), viaHold: STAGED_RETRIEVAL_VIA_HOLD };
}

export function supportsCyberpunkThreeCardTransfers(): boolean {
  if (typeof window === "undefined" || typeof document === "undefined") return false;
  if (typeof navigator !== "undefined" && navigator.userAgent.includes("jsdom")) return false;
  if (new URLSearchParams(window.location.search).get("cardRenderer") === "dom") return false;
  if (cachedWebGlSupport !== undefined) return cachedWebGlSupport;
  try {
    const probe = document.createElement("canvas");
    const context = probe.getContext("webgl2") ?? probe.getContext("webgl");
    cachedWebGlSupport = context !== null;
    return cachedWebGlSupport;
  } catch {
    cachedWebGlSupport = false;
    return false;
  }
}

export function CyberpunkThreeCardStateChangeLayer({
  changes,
  playbackStartedAtMs,
}: SimulatorSpatialStateChangeRendererProps) {
  const frame = useAnimationSurfaceFrame();
  const mapped = useMemo(
    () => changes.map((change) => ({ ...change, rect: frame.mapRect(change.rect) })),
    [changes, frame],
  );
  return createPortal(
    <div
      data-three-card-state-change-layer=""
      data-three-card-state-change-count={mapped.length}
      style={{
        position: frame.surface ? "absolute" : "fixed",
        inset: 0,
        zIndex: CARD_PRESENTATION_LAYERS.motion,
        pointerEvents: "none",
        perspective: 900,
      }}
    >
      {mapped.map((change) => (
        <DomCardStateChange
          key={change.id}
          change={change}
          playbackStartedAtMs={playbackStartedAtMs}
        />
      ))}
    </div>,
    frame.surface ?? document.body,
  );
}

export function CyberpunkThreeCardTransferLayer({
  transfers,
  playbackStartedAtMs,
}: SimulatorSpatialTransferRendererProps) {
  const frame = useAnimationSurfaceFrame();
  // Endpoint rects arrive measured in viewport space; over the rotated surface
  // they are rotated bounding boxes. Map them once so every pose below works
  // in the frame the overlay actually renders in.
  const mapped = useMemo(
    () =>
      transfers.map((transfer) => ({
        ...transfer,
        sourceRect: frame.mapRect(transfer.sourceRect),
        sourcePose: transfer.sourcePose
          ? { ...transfer.sourcePose, rect: frame.mapRect(transfer.sourcePose.rect) }
          : undefined,
        destinationRect: frame.mapRect(transfer.destinationRect),
      })),
    [transfers, frame],
  );
  return createPortal(
    <div
      data-three-card-transfer-layer={mapped.length > 0 ? "" : undefined}
      data-three-card-transfer-count={mapped.length}
      style={{
        position: frame.surface ? "absolute" : "fixed",
        inset: 0,
        zIndex: CARD_PRESENTATION_LAYERS.motion,
        pointerEvents: "none",
      }}
    >
      <SimulatorEffectCanvas active={mapped.length > 0}>
        {mapped.map((transfer) => (
          <ThreeCardTransferEffects
            key={transfer.id}
            transfer={transfer}
            playbackStartedAtMs={playbackStartedAtMs}
            mapRect={frame.mapRect}
          />
        ))}
      </SimulatorEffectCanvas>
      {mapped.map((transfer) => (
        <DomCardTransfer
          key={transfer.id}
          transfer={transfer}
          playbackStartedAtMs={playbackStartedAtMs}
          mapRect={frame.mapRect}
        />
      ))}
    </div>,
    frame.surface ?? document.body,
  );
}

function ThreeCardTransferEffects({
  transfer,
  playbackStartedAtMs,
  mapRect,
}: {
  readonly transfer: SimulatorSpatialTransfer;
  readonly playbackStartedAtMs?: number;
  readonly mapRect: AnimationSurfaceFrame["mapRect"];
}) {
  const shadow = useRef<Mesh>(null);
  const { size } = useThree();
  const lateClock = useRef<{ offsetMs: number; durationMs: number } | null>(null);
  const staged = useMemo(() => stagedRoute(transfer, mapRect), [transfer, mapRect]);

  useFrame(() => {
    const elapsedMs = Math.max(0, performance.now() - (playbackStartedAtMs ?? performance.now()));
    if (lateClock.current === null) {
      lateClock.current = resolveLateMountClock({
        elapsedAtMountMs: elapsedMs,
        startAtMs: transfer.startAtMs,
        durationMs: transfer.durationMs,
      });
    }
    const receipt = soldReceiptRect(transfer, mapRect);
    const unitEntry = isUnitHandPlay(transfer.step);
    const pose = resolveCyberpunkCardTransferPose(
      {
        source: unitEntry
          ? (transfer.sourcePose?.rect ?? transfer.sourceRect)
          : transfer.sourceRect,
        destination: receipt ?? transfer.destinationRect,
        via: receipt ? transfer.destinationRect : (staged?.via ?? undefined),
        viaHold: receipt || !staged ? 0 : staged.viaHold,
        elapsedMs: unitEntry
          ? unitEntryElapsedMs(
              elapsedMs,
              lateClock.current.offsetMs,
              transfer.startAtMs,
              transfer.durationMs,
            )
          : elapsedMs - lateClock.current.offsetMs,
        startAtMs: transfer.startAtMs,
        durationMs: unitEntry ? transfer.durationMs : lateClock.current.durationMs,
        faceChanges: receipt ? false : transfer.faceChanges,
        underlay: transfer.step.destinationPresentation === "underlay",
        sourceVisible: transfer.sourceVisible,
        destinationVisible: transfer.destinationVisible,
        holdsAtSource: transfer.holdsAtSource,
      },
      unitEntry,
      transfer.sourcePose?.rotationDeg,
    );
    const x = pose.centerX - size.width / 2;
    const y = size.height / 2 - pose.centerY;

    if (shadow.current) {
      shadow.current.position.set(x + 8, y - 10, -8);
      shadow.current.scale.set(pose.width * 1.04, pose.height * 1.04, 1);
      const material = shadow.current.material;
      if (material instanceof MeshBasicMaterial) material.opacity = pose.shadowOpacity;
    }
  });

  return (
    <>
      <mesh ref={shadow} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={0x02040a} transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function DomCardTransfer({
  transfer,
  playbackStartedAtMs,
  mapRect,
}: {
  readonly transfer: SimulatorSpatialTransfer;
  readonly playbackStartedAtMs?: number;
  readonly mapRect: AnimationSurfaceFrame["mapRect"];
}) {
  const card = useRef<HTMLDivElement>(null);
  const [soldImageUrl, setSoldImageUrl] = useState<string>();
  const lateClock = useRef<{ offsetMs: number; durationMs: number } | null>(null);
  const staged = useMemo(() => stagedRoute(transfer, mapRect), [transfer, mapRect]);
  useEffect(() => {
    const image = soldReceiptElement(transfer)?.querySelector("img");
    setSoldImageUrl(image?.currentSrc || image?.src || undefined);
  }, [transfer]);
  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      const node = card.current;
      if (!node) return;
      const elapsedMs = Math.max(0, performance.now() - (playbackStartedAtMs ?? performance.now()));
      if (lateClock.current === null) {
        lateClock.current = resolveLateMountClock({
          elapsedAtMountMs: elapsedMs,
          startAtMs: transfer.startAtMs,
          durationMs: transfer.durationMs,
        });
      }
      const receipt = soldReceiptRect(transfer, mapRect);
      const unitEntry = isUnitHandPlay(transfer.step);
      const pose = resolveCyberpunkCardTransferPose(
        {
          source: unitEntry
            ? (transfer.sourcePose?.rect ?? transfer.sourceRect)
            : transfer.sourceRect,
          destination: receipt ?? transfer.destinationRect,
          via: receipt ? transfer.destinationRect : (staged?.via ?? undefined),
          viaHold: receipt || !staged ? 0 : staged.viaHold,
          elapsedMs: unitEntry
            ? unitEntryElapsedMs(
                elapsedMs,
                lateClock.current.offsetMs,
                transfer.startAtMs,
                transfer.durationMs,
              )
            : elapsedMs - lateClock.current.offsetMs,
          startAtMs: transfer.startAtMs,
          durationMs: unitEntry ? transfer.durationMs : lateClock.current.durationMs,
          faceChanges: receipt ? false : transfer.faceChanges,
          underlay: transfer.step.destinationPresentation === "underlay",
          sourceVisible: transfer.sourceVisible,
          destinationVisible: transfer.destinationVisible,
          holdsAtSource: transfer.holdsAtSource,
        },
        unitEntry,
        transfer.sourcePose?.rotationDeg,
      );
      node.style.left = `${pose.centerX}px`;
      node.style.top = `${pose.centerY}px`;
      node.style.width = `${pose.width}px`;
      node.style.height = `${pose.height}px`;
      node.style.opacity = String(pose.opacity);
      node.style.clipPath = pose.clipTop > 0 ? `inset(${pose.clipTop}% 0 0 0)` : "";
      // A staggered group keeps its waiting cards at the shared pile anchor.
      // Lift the card that has actually started so its revealed face is not
      // covered by the later card backs still waiting at that anchor.
      node.style.zIndex =
        pose.progress > 0 && pose.progress < 1
          ? String(2 + Math.round(pose.progress * 1_000))
          : "1";
      if (transfer.faceChanges && !receipt) {
        const faces = node.querySelectorAll<HTMLElement>("[data-spatial-entity-face]");
        const destinationFaceVisible = pose.faceRevealed;
        if (faces[0]) faces[0].style.visibility = destinationFaceVisible ? "hidden" : "visible";
        if (faces[1]) faces[1].style.visibility = destinationFaceVisible ? "visible" : "hidden";
      }
      node.style.transform = `translate3d(-50%, -50%, ${pose.depth}px) rotateX(${pose.rotationX}rad) rotateY(${pose.rotationY}rad) rotateZ(${pose.rotationZ}rad)`;
      frame = requestAnimationFrame(update);
    };
    // First pose synchronously before paint so a late-captured clone is
    // visible at its source on its first rendered frame.
    // update schedules the next frame itself. A second request here creates
    // two loops, only one of which is cancelled on unmount.
    update();
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [playbackStartedAtMs, staged, transfer, mapRect]);

  return (
    <div
      ref={card}
      data-three-card-transfer-entity={transfer.step.entity.id}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: transfer.sourceRect.width,
        height: transfer.sourceRect.height,
        opacity: 0,
        transformOrigin: "center",
        transformStyle: "preserve-3d",
        containerType: "inline-size",
        willChange: "transform, opacity",
      }}
    >
      <SpatialEntityFace entity={transfer.sourceEntity} imageUrl={soldImageUrl} />
      {transfer.faceChanges ? (
        <SpatialEntityFace entity={transfer.destinationEntity} hidden />
      ) : null}
    </div>
  );
}

function soldReceiptElement(transfer: SimulatorSpatialTransfer): HTMLElement | null {
  if (
    transfer.step.from?.kind !== "zone" ||
    transfer.step.to?.kind !== "zone" ||
    !transfer.step.to.id.endsWith("-eddieArea")
  )
    return null;
  return (
    [...document.querySelectorAll<HTMLElement>("[data-sold-card-id]")].find(
      (node) => node.dataset.soldCardId === transfer.step.entity.id,
    ) ?? null
  );
}

function soldReceiptRect(
  transfer: SimulatorSpatialTransfer,
  mapRect: AnimationSurfaceFrame["mapRect"],
): DOMRect | null {
  const element = soldReceiptElement(transfer);
  return element ? mapRect(element.getBoundingClientRect()) : null;
}

function DomCardStateChange({
  change,
  playbackStartedAtMs,
}: {
  readonly change: SimulatorSpatialStateChange;
  readonly playbackStartedAtMs?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    let frame = 0;
    const update = () => {
      const node = card.current;
      if (!node) return;
      const duration = Math.max(1, change.durationMs);
      const progress = clamp01(
        (performance.now() - (playbackStartedAtMs ?? performance.now()) - change.startAtMs) /
          duration,
      );
      const eased = smoothStep(progress);
      const lift = Math.sin(Math.PI * progress) * 24;
      const fromRotation = change.step.fromRotationDeg ?? 0;
      const toRotation = change.step.toRotationDeg ?? fromRotation;
      const rotationZ = lerp(fromRotation, toRotation, eased);
      const rotationY = change.step.change === "face" ? Math.PI * eased : 0;
      const centerX = change.rect.left + change.rect.width / 2;
      const centerY = change.rect.top + change.rect.height / 2 - lift;
      node.style.left = `${centerX}px`;
      node.style.top = `${centerY}px`;
      node.style.width = `${change.rect.width}px`;
      node.style.height = `${change.rect.height}px`;
      // The mount style cannot know the rect yet; stay invisible until this
      // first tick has positioned the clone, or it paints at the layer origin.
      node.style.opacity = "1";
      node.style.transform = cardStateChangeTransform(progress, rotationZ, rotationY);
      frame = requestAnimationFrame(update);
    };
    // Pose the clone synchronously before first paint: an async first tick
    // leaves the clone invisible (mount opacity 0) for a frame while the real
    // card is suppressed - a one-frame blink at the slot.
    update();
    return () => cancelAnimationFrame(frame);
  }, [change, playbackStartedAtMs]);

  return (
    <div
      ref={card}
      data-three-card-state-change={change.step.change}
      data-three-card-state-change-entity={change.step.entity.id}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: change.rect.width,
        height: change.rect.height,
        opacity: 0,
        transformOrigin: "center",
        transformStyle: "preserve-3d",
        containerType: "inline-size",
        willChange: "transform, opacity",
      }}
    >
      <SpatialEntityFace entity={change.sourceEntity} />
      {change.step.change === "face" ? (
        <SpatialEntityFace entity={change.destinationEntity} back />
      ) : null}
    </div>
  );
}

function SpatialEntityFace({
  entity,
  back = false,
  hidden = false,
  imageUrl,
}: {
  readonly entity: SimulatorSpatialTransfer["sourceEntity"];
  readonly back?: boolean;
  readonly hidden?: boolean;
  readonly imageUrl?: string;
}) {
  if (entity.kind === "die") return <DieFace entity={entity} back={back} hidden={hidden} />;
  const url = imageUrl ?? entityImageUrl(entity);
  return (
    <div
      data-spatial-entity-face="card"
      data-spatial-image-url={url}
      style={{
        position: "absolute",
        inset: 0,
        backfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        visibility: hidden ? "hidden" : undefined,
      }}
    >
      {url ? (
        <img
          alt=""
          src={url}
          draggable={false}
          style={{
            display: "block",
            width: "100%",
            height: "100%",
            objectFit: "contain",
            filter: "drop-shadow(8px 12px 10px rgba(2, 4, 10, .42))",
          }}
        />
      ) : null}
    </div>
  );
}

function DieFace({
  entity,
  back,
  hidden = false,
}: {
  readonly entity: SimulatorSpatialTransfer["sourceEntity"];
  readonly back: boolean;
  readonly hidden?: boolean;
}) {
  const type = entity.traits[0] ?? "d6";
  const face = entity.stats.find((stat) => stat.label === "Face")?.value ?? "-";
  const clipPath =
    type === "d4"
      ? "polygon(50% 0, 100% 100%, 0 100%)"
      : type === "d10"
        ? "polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"
        : type === "d12"
          ? "polygon(50% 0, 98% 36%, 80% 100%, 20% 100%, 2% 36%)"
          : type === "d8"
            ? "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%)"
            : type === "d20"
              ? "circle(50%)"
              : undefined;
  return (
    <div
      data-spatial-entity-face="die"
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        clipPath,
        borderRadius: type === "d6" ? "12%" : undefined,
        background: "linear-gradient(145deg, #fff47a, #e7ef28)",
        color: "#10131a",
        fontSize: "45cqi",
        fontWeight: 950,
        lineHeight: 1,
        backfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        visibility: hidden ? "hidden" : undefined,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,.7)",
      }}
    >
      {face === "-" ? type.toUpperCase() : face}
    </div>
  );
}

function entityImageUrl(entity: SimulatorSpatialTransfer["sourceEntity"]): string | undefined {
  return entity.face === "hidden" ? entity.backImageUrl : entity.imageUrl;
}

function smoothStep(value: number): number {
  return value * value * (3 - 2 * value);
}

function lerp(from: number, to: number, amount: number): number {
  return from + (to - from) * amount;
}

function clamp01(value: number): number {
  return Math.min(1, Math.max(0, value));
}
