import { useFrame, useThree } from "@react-three/fiber";
import type {
  SimulatorSpatialStateChange,
  SimulatorSpatialStateChangeRendererProps,
  SimulatorSpatialTransfer,
  SimulatorSpatialTransferRendererProps,
} from "@tcg/simulator-ui";
import { useEffect, useRef } from "react";
import { Mesh, MeshBasicMaterial } from "three";

import { resolveCardTransferPose } from "./three-card-transfer-motion";
import { CyberpunkEffectCanvas } from "./CyberpunkEffectCanvas";

let cachedWebGlSupport: boolean | undefined;

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
  return (
    <div
      data-three-card-state-change-layer=""
      data-three-card-state-change-count={changes.length}
      style={{ position: "absolute", inset: 0, pointerEvents: "none", perspective: 900 }}
    >
      {changes.map((change) => (
        <DomCardStateChange
          key={change.id}
          change={change}
          playbackStartedAtMs={playbackStartedAtMs}
        />
      ))}
    </div>
  );
}

export function CyberpunkThreeCardTransferLayer({
  transfers,
  playbackStartedAtMs,
}: SimulatorSpatialTransferRendererProps) {
  return (
    <div
      data-three-card-transfer-layer={transfers.length > 0 ? "" : undefined}
      data-three-card-transfer-count={transfers.length}
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    >
      <CyberpunkEffectCanvas active={transfers.length > 0}>
        {transfers.map((transfer) => (
          <ThreeCardTransferEffects
            key={transfer.id}
            transfer={transfer}
            playbackStartedAtMs={playbackStartedAtMs}
          />
        ))}
      </CyberpunkEffectCanvas>
      {transfers.map((transfer) => (
        <DomCardTransfer
          key={transfer.id}
          transfer={transfer}
          playbackStartedAtMs={playbackStartedAtMs}
        />
      ))}
    </div>
  );
}

function ThreeCardTransferEffects({
  transfer,
  playbackStartedAtMs,
}: {
  readonly transfer: SimulatorSpatialTransfer;
  readonly playbackStartedAtMs?: number;
}) {
  const shadow = useRef<Mesh>(null);
  const landingHalo = useRef<Mesh>(null);
  const { size } = useThree();

  useFrame(() => {
    const elapsedMs = Math.max(0, performance.now() - (playbackStartedAtMs ?? performance.now()));
    const pose = resolveCardTransferPose({
      source: transfer.sourceRect,
      destination: transfer.destinationRect,
      elapsedMs,
      startAtMs: transfer.startAtMs,
      durationMs: transfer.durationMs,
      faceChanges: transfer.faceChanges,
      sourceVisible: transfer.sourceVisible,
      destinationVisible: transfer.destinationVisible,
    });
    const x = pose.centerX - size.width / 2;
    const y = size.height / 2 - pose.centerY;

    if (shadow.current) {
      shadow.current.position.set(x + 8, y - 10, -8);
      shadow.current.scale.set(pose.width * 1.04, pose.height * 1.04, 1);
      const material = shadow.current.material;
      if (material instanceof MeshBasicMaterial) material.opacity = pose.shadowOpacity;
    }
    if (landingHalo.current) {
      landingHalo.current.position.set(
        transfer.destinationRect.left + transfer.destinationRect.width / 2 - size.width / 2,
        size.height / 2 - (transfer.destinationRect.top + transfer.destinationRect.height / 2),
        -6,
      );
      landingHalo.current.scale.set(
        transfer.destinationRect.width * pose.landingHaloScale,
        transfer.destinationRect.width * 0.42 * pose.landingHaloScale,
        1,
      );
      const material = landingHalo.current.material;
      if (material instanceof MeshBasicMaterial) material.opacity = pose.landingHaloOpacity;
    }
  });

  return (
    <>
      <mesh ref={shadow} renderOrder={1}>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial color={0x02040a} transparent opacity={0} depthWrite={false} />
      </mesh>
      <mesh ref={landingHalo} renderOrder={1}>
        <ringGeometry args={[0.42, 0.5, 48]} />
        <meshBasicMaterial color={0x65e3e7} transparent opacity={0} depthWrite={false} />
      </mesh>
    </>
  );
}

function DomCardTransfer({
  transfer,
  playbackStartedAtMs,
}: {
  readonly transfer: SimulatorSpatialTransfer;
  readonly playbackStartedAtMs?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      const node = card.current;
      if (!node) return;
      const elapsedMs = Math.max(0, performance.now() - (playbackStartedAtMs ?? performance.now()));
      const pose = resolveCardTransferPose({
        source: transfer.sourceRect,
        destination: transfer.destinationRect,
        elapsedMs,
        startAtMs: transfer.startAtMs,
        durationMs: transfer.durationMs,
        faceChanges: transfer.faceChanges,
        sourceVisible: transfer.sourceVisible,
        destinationVisible: transfer.destinationVisible,
      });
      node.style.left = `${pose.centerX}px`;
      node.style.top = `${pose.centerY}px`;
      node.style.width = `${pose.width}px`;
      node.style.height = `${pose.height}px`;
      node.style.opacity = String(pose.opacity);
      // A staggered group keeps its waiting cards at the shared pile anchor.
      // Lift the card that has actually started so its revealed face is not
      // covered by the later card backs still waiting at that anchor.
      node.style.zIndex =
        pose.progress > 0 && pose.progress < 1
          ? String(2 + Math.round(pose.progress * 1_000))
          : "1";
      if (transfer.faceChanges) {
        const faces = node.querySelectorAll<HTMLElement>("[data-spatial-entity-face]");
        const destinationFaceVisible = pose.faceRevealed;
        if (faces[0]) faces[0].style.visibility = destinationFaceVisible ? "hidden" : "visible";
        if (faces[1]) faces[1].style.visibility = destinationFaceVisible ? "visible" : "hidden";
      }
      node.style.transform = `translate3d(-50%, -50%, ${pose.depth}px) rotateX(${-Math.sin(Math.PI * pose.progress) * 0.055}rad) rotateY(${pose.rotationY}rad) rotateZ(${pose.rotationZ}rad)`;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [playbackStartedAtMs, transfer]);

  return (
    <div
      ref={card}
      data-three-card-transfer-entity={transfer.step.entity.id}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: transfer.sourceRect.width,
        height: transfer.sourceRect.height,
        opacity: 0,
        transformOrigin: "center",
        transformStyle: "preserve-3d",
        willChange: "transform, opacity",
      }}
    >
      <SpatialEntityFace entity={transfer.sourceEntity} />
      {transfer.faceChanges ? (
        <SpatialEntityFace entity={transfer.destinationEntity} hidden />
      ) : null}
    </div>
  );
}

function DomCardStateChange({
  change,
  playbackStartedAtMs,
}: {
  readonly change: SimulatorSpatialStateChange;
  readonly playbackStartedAtMs?: number;
}) {
  const card = useRef<HTMLDivElement>(null);
  useEffect(() => {
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
      const scale = 1 + Math.sin(Math.PI * progress) * 0.025;
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
      node.style.transform = `translate3d(-50%, -50%, ${Math.sin(Math.PI * progress) * 42}px) rotateY(${rotationY}rad) rotateZ(${rotationZ}deg) scale(${scale})`;
      frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [change, playbackStartedAtMs]);

  return (
    <div
      ref={card}
      data-three-card-state-change={change.step.change}
      data-three-card-state-change-entity={change.step.entity.id}
      style={{
        position: "fixed",
        left: 0,
        top: 0,
        width: change.rect.width,
        height: change.rect.height,
        transformOrigin: "center",
        transformStyle: "preserve-3d",
        willChange: "transform",
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
}: {
  readonly entity: SimulatorSpatialTransfer["sourceEntity"];
  readonly back?: boolean;
  readonly hidden?: boolean;
}) {
  if (entity.kind === "die") return <DieFace entity={entity} back={back} hidden={hidden} />;
  const url = entityImageUrl(entity);
  return (
    <div
      data-spatial-entity-face="card"
      data-spatial-image-url={url}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        borderRadius: "0.06px",
        background: "#232a38",
        backfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        visibility: hidden ? "hidden" : undefined,
        boxShadow: "8px 12px 10px rgba(2, 4, 10, .42)",
      }}
    >
      {url ? (
        <img
          alt=""
          src={url}
          draggable={false}
          style={{ display: "block", width: "100%", height: "100%", objectFit: "contain" }}
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
            ? "polygon(30% 0, 70% 0, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0 70%, 0 30%)"
            : type === "d20"
              ? "circle(50%)"
              : undefined;
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "grid",
        placeItems: "center",
        clipPath,
        borderRadius: type === "d6" ? "0.12px" : undefined,
        background: "linear-gradient(145deg, #fff47a, #e7ef28)",
        color: "#10131a",
        fontSize: "0.3px",
        fontWeight: 950,
        lineHeight: 1,
        backfaceVisibility: "hidden",
        transform: back ? "rotateY(180deg)" : undefined,
        visibility: hidden ? "hidden" : undefined,
        boxShadow: "inset 0 0 0 .03px rgba(255,255,255,.7)",
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
