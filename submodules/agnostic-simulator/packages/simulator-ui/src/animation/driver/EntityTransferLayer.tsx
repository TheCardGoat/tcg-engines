import type { AnimationRef, EntityTransferStepV2 } from "@tcg/protocol/animations";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { AnimationSequence } from "motion";
import { useAnimate } from "motion/react";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { SimulatorEntityVisual, projectEntityVisual } from "../components/SimulatorEntityVisual";
import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import { type AnimationNodeRecord } from "../lib/node-registry";
import { useAnimationRuntime } from "../provider/contexts";

interface PortalTransfer {
  readonly step: EntityTransferStepV2;
  readonly sourceEntity: SimulatorEntity;
  readonly destinationEntity: SimulatorEntity;
  readonly source: AnimationNodeRecord | null;
  readonly destination: AnimationNodeRecord | null;
  readonly sourceRect: DOMRect | null;
  readonly destinationRect: DOMRect | null;
}

interface TransferCaptureState {
  readonly transitionId: string | null;
  readonly transfers: readonly PortalTransfer[];
}

export function EntityTransferLayer() {
  const runtime = useAnimationRuntime();
  const transition = runtime.activeTransition;
  const registryVersion = useAnimationRegistryVersion(runtime.registry);
  const [elapsedMs, setElapsedMs] = useState(0);
  const [captureReadyId, setCaptureReadyId] = useState<string | null>(null);
  const [transfers, setTransfers] = useState<readonly PortalTransfer[]>([]);
  const sources = useRef(new Map<string, { node: AnimationNodeRecord; rect: DOMRect }>());
  const sourceTransition = useRef<string | null>(null);
  const unresolvedTransfersRef = useRef(new Map<string, () => void>());
  const capturedTransfersRef = useRef<TransferCaptureState>({
    transitionId: null,
    transfers: [],
  });
  const entitySteps = useMemo(
    () =>
      runtime.compiledPlan?.steps.filter(
        (entry): entry is typeof entry & { step: EntityTransferStepV2 } =>
          entry.step.type === "entityTransfer",
      ) ?? [],
    [runtime.compiledPlan],
  );

  // Let the destination presentation commit its entity registrations before
  // falling back to an aggregate zone (deck, resource pile, etc.).
  useLayoutEffect(() => {
    if (transition?.phase !== "running") {
      setCaptureReadyId(null);
      return;
    }
    const frame = requestAnimationFrame(() => setCaptureReadyId(transition.id));
    return () => cancelAnimationFrame(frame);
  }, [transition?.id, transition?.phase]);

  useLayoutEffect(() => {
    if (transition?.id !== sourceTransition.current) {
      sources.current.clear();
      sourceTransition.current = transition?.id ?? null;
    }
    if (transition?.phase === "preparing") {
      for (const { step } of entitySteps) {
        if (sources.current.has(step.id)) continue;
        // Cache only the entity's own source geometry during preparation. A
        // zone fallback may be a deliberately tiny anchor (the FAB stack uses
        // one) and the exiting entity can register one layout pass later. If
        // we cache that anchor here, it permanently wins over the real card
        // and the transfer has to scale by tens of times as it resolves.
        const node = selectEntityEndpoint(
          runtime.registry.get(step.from?.kind === "entity" ? step.from : step.entity),
          step.from,
          "present",
        );
        if (node) {
          const entity = runtime.getEntity(transition.fromState, step.entity.id, step.sourceFace);
          sources.current.set(step.id, {
            node,
            rect: transferNodeRect(node, step.entity.id, entity?.imageAspectRatio),
          });
        }
      }
    }
    if (!transition || transition.phase === "preparing") {
      unresolvedTransfersRef.current.clear();
      capturedTransfersRef.current = { transitionId: null, transfers: [] };
      setTransfers((current) => (current.length === 0 ? current : []));
      return;
    }
    if (transition.phase === "reflowing") {
      // Endpoint registration may take another layout pass. Report only
      // transfers still unresolved when the primary animation has finished.
      for (const report of unresolvedTransfersRef.current.values()) report();
      unresolvedTransfersRef.current.clear();
      // Keep captured sources suppressed until reflow finishes; only the
      // portal visuals end when the running phase ends.
      return;
    }
    if (captureReadyId !== transition.id) return;
    if (capturedTransfersRef.current.transitionId !== transition.id) {
      unresolvedTransfersRef.current.clear();
      capturedTransfersRef.current = { transitionId: transition.id, transfers: [] };
    }

    const pendingCaptures: Omit<PortalTransfer, "sourceRect" | "destinationRect">[] = [];
    for (const { step } of entitySteps) {
      if (capturedTransfersRef.current.transfers.some((captured) => captured.step.id === step.id)) {
        continue;
      }
      const entityNodes = runtime.registry.get(step.entity);
      const source =
        sources.current.get(step.id)?.node ??
        selectEntityEndpoint(
          runtime.registry.get(step.from?.kind === "entity" ? step.from : step.entity),
          step.from,
          "exiting",
        ) ??
        resolveNode(runtime.registry, step.from);
      const destination =
        selectEntityEndpoint(
          runtime.registry.get(step.to?.kind === "entity" ? step.to : step.entity),
          step.to,
          "present",
        ) ?? resolveNode(runtime.registry, step.to);
      const sourceEntity = runtime.getEntity(
        transition.fromState,
        step.from?.kind === "entity" ? step.from.id : step.entity.id,
        step.sourceFace,
      );
      const destinationEntity = runtime.getEntity(
        transition.toState,
        step.entity.id,
        step.destinationFace,
      );
      if (
        (!sourceEntity && !destinationEntity) ||
        !portalTransferEndpointsReady(step, source, destination)
      ) {
        const missing = [
          !sourceEntity && !destinationEntity ? "entity" : null,
          !source ? "source" : null,
          !destination ? "destination" : null,
        ]
          .filter(Boolean)
          .join(",");
        unresolvedTransfersRef.current.set(step.id, () =>
          console.warn(
            `[simulator-animation] missing-spatial-visual transition=${transition.id} step=${step.id} entity=${step.entity.id} missing=${missing}`,
            {
              type: "missing-spatial-visual",
              transitionId: transition.id,
              stepId: step.id,
              entityId: step.entity.id,
              missingEntity: !sourceEntity && !destinationEntity,
              missingSource: !source,
              missingDestination: !destination,
              from: step.from,
              to: step.to,
              registeredEntityNodes: entityNodes.map((record) => ({
                presence: record.presence,
                zoneId: record.zoneId,
              })),
            },
          ),
        );
        continue;
      }

      // The destination commonly registers one React layout pass after the
      // active presentation swaps. Capturing a source-only frame here turns
      // the transfer into a zero-distance fade and prevents the later,
      // complete geometry from being used. Wait for every declared endpoint;
      // registryVersion will retry this effect as those nodes register.
      unresolvedTransfersRef.current.delete(step.id);

      pendingCaptures.push({
        step,
        sourceEntity: sourceEntity ?? destinationEntity!,
        destinationEntity: destinationEntity ?? sourceEntity!,
        source,
        destination,
      });
    }

    // Read every endpoint before writing suppression styles. More importantly,
    // keep the first valid geometry for the whole transition: registry churn
    // from AnimatePresence must not restart an in-flight Motion transform.
    const captured = pendingCaptures.map<PortalTransfer>((transfer) => {
      const sourceRect =
        sources.current.get(transfer.step.id)?.rect ??
        (transfer.source
          ? transferNodeRect(
              transfer.source,
              transfer.step.entity.id,
              transfer.sourceEntity.imageAspectRatio,
            )
          : null);
      const destinationRect = transfer.destination
        ? transferNodeRect(
            transfer.destination,
            transfer.step.entity.id,
            transfer.destinationEntity.imageAspectRatio,
          )
        : null;
      const normalizedRects = normalizePositionOnlyZoneRects(
        sourceRect,
        destinationRect,
        transfer.source,
        transfer.destination,
      );
      return {
        ...transfer,
        sourceRect: normalizedRects.source,
        destinationRect: normalizedRects.destination,
      };
    });
    const nextTransfers = mergePortalTransferCaptures(
      capturedTransfersRef.current.transfers,
      captured,
    );
    if (nextTransfers === capturedTransfersRef.current.transfers) return;

    capturedTransfersRef.current = { transitionId: transition.id, transfers: nextTransfers };
    setTransfers(nextTransfers);
  }, [captureReadyId, entitySteps, registryVersion, runtime, transition]);

  // Only visual handoff boundaries update React. These never control gameplay
  // completion: the provider's compiled timeline remains the single authority.
  useEffect(() => {
    const elapsed = Math.max(
      0,
      performance.now() - (runtime.playbackStartedAtMs ?? performance.now()),
    );
    setElapsedMs(elapsed);
    if (transition?.phase !== "running") return;
    const boundaries = [
      ...new Set(entitySteps.flatMap((entry) => [entry.startAtMs, entry.endAtMs])),
    ].sort((a, b) => a - b);
    const timers = boundaries
      .filter((time) => time > elapsed)
      .map((time) => setTimeout(() => setElapsedMs(time), time - elapsed));
    return () => {
      timers.forEach(clearTimeout);
    };
  }, [transition?.id, transition?.phase, entitySteps, runtime.playbackStartedAtMs]);

  useLayoutEffect(() => {
    if (!transition || transition.phase === "preparing") return;

    const suppressed = new Set<HTMLElement>();
    if (transition.phase === "reflowing") {
      for (const { step } of entitySteps) {
        for (const record of runtime.registry.get(step.entity)) {
          if (record.presence !== "exiting" || suppressed.has(record.node)) continue;
          suppressNode(record.node);
          suppressed.add(record.node);
        }
      }
    }
    for (const transfer of transfers) {
      const timing = entitySteps.find((entry) => entry.step.id === transfer.step.id);
      // Retained source nodes must never reappear after their overlay lands.
      if (!timing || elapsedMs >= timing.startAtMs) {
        for (const record of runtime.registry.get(transfer.step.entity)) {
          if (record.presence !== "exiting" || suppressed.has(record.node)) continue;
          suppressNode(record.node);
          suppressed.add(record.node);
        }
      }
      const landed = transition.phase === "reflowing" || (timing && elapsedMs >= timing.endAtMs);
      for (const [endpoint, record] of [
        ["source", transfer.source],
        ["destination", transfer.destination],
      ] as const) {
        if (!record || record.ref.kind === "zone" || suppressed.has(record.node)) continue;
        if (endpoint === "destination" && landed) continue;
        if (endpoint === "source" && !landed && timing && elapsedMs < timing.startAtMs) continue;
        if (!entityTransferSuppressesEndpoint(transfer.step, endpoint)) continue;
        suppressNode(record.node);
        suppressed.add(record.node);
      }
    }

    return () => {
      for (const node of suppressed) restoreNode(node);
    };
  }, [entitySteps, elapsedMs, runtime, transfers, transition]);

  if (
    typeof document === "undefined" ||
    transfers.length === 0 ||
    transition?.phase !== "running"
  ) {
    return null;
  }

  return createPortal(
    <div
      aria-hidden
      data-animation-transfer-layer=""
      style={{ position: "fixed", inset: 0, zIndex: 1000, pointerEvents: "none" }}
    >
      {transfers
        .filter((transfer) => {
          const timing = entitySteps.find((entry) => entry.step.id === transfer.step.id);
          return !timing || elapsedMs < timing.endAtMs;
        })
        .map((transfer) => (
          <PortalTransferVisual key={transfer.step.id} transfer={transfer} />
        ))}
    </div>,
    document.body,
  );
}

export function entityTransferSuppressesEndpoint(
  step: Pick<EntityTransferStepV2, "sourcePresentation" | "destinationPresentation">,
  endpoint: "source" | "destination",
): boolean {
  return endpoint === "source"
    ? step.sourcePresentation !== "copy"
    : step.destinationPresentation !== "overlay";
}

function PortalTransferVisual({ transfer }: { readonly transfer: PortalTransfer }) {
  const sourceRect = transfer.sourceRect ?? transfer.destinationRect;
  const destinationRect = transfer.destinationRect ?? transfer.sourceRect;
  if (!sourceRect || !destinationRect) return null;
  return (
    <CapturedPortalTransferVisual
      transfer={transfer}
      sourceRect={sourceRect}
      destinationRect={destinationRect}
    />
  );
}

function CapturedPortalTransferVisual({
  transfer,
  sourceRect,
  destinationRect,
}: {
  readonly transfer: PortalTransfer;
  readonly sourceRect: DOMRect;
  readonly destinationRect: DOMRect;
}) {
  const runtime = useAnimationRuntime();
  const [scope, animate] = useAnimate<HTMLDivElement>();
  const compiled = runtime.compiledPlan?.steps.find((entry) => entry.step.id === transfer.step.id);

  const sourceEntity = projectEntityVisual(transfer.sourceEntity, transfer.step.sourceFace);
  const destinationEntity = projectEntityVisual(
    transfer.destinationEntity,
    transfer.step.destinationFace,
  );
  const density = transfer.source?.density ?? transfer.destination?.density ?? "normal";
  // A deck is a compact pile marker, not the size of the card being drawn.
  // Fly draws at their hand size from the pile's center all the way to landing.
  const transition = runtime.activeTransition;
  const isDraw =
    transition !== null &&
    transfer.step.from?.kind === "zone" &&
    transfer.step.to?.kind === "zone" &&
    runtime.getZone(transition.fromState, transfer.step.from)?.role === "deck" &&
    runtime.getZone(transition.toState, transfer.step.to)?.role === "hand";
  const { width, height, left, top } = isDraw
    ? drawTransferRect(sourceRect, destinationRect)
    : sourceRect;
  const deltaX = destinationRect.left - left;
  const deltaY = destinationRect.top - top;
  const scale = isDraw ? 1 : uniformTransferScale(sourceRect, destinationRect);
  const faceChanges =
    runtime.transferFaceChange !== "instant" &&
    transfer.step.sourceFace !== transfer.step.destinationFace;
  const startAtSeconds = (compiled?.startAtMs ?? 0) / 1_000;
  const durationSeconds = (compiled?.durationMs ?? 0) / 1_000;
  const destinationOpacity = transfer.destinationRect ? 1 : 0;
  const spatialMotionSuppressed = runtime.spatialMotionSuppressed;
  const sourceZoneId =
    transfer.source?.zoneId ??
    (transfer.step.from?.kind === "zone" ? transfer.step.from.id : undefined);
  const acknowledgeResolution =
    sourceZoneId?.endsWith(":stack") || sourceZoneId?.endsWith(":combat-chain");

  useEffect(() => {
    if (!scope.current) return;
    if (spatialMotionSuppressed) {
      const controls = animate([
        [
          "[data-animation-reduced-source]",
          { opacity: [1, 0] },
          { at: startAtSeconds, duration: durationSeconds, ease: "linear" },
        ],
        [
          "[data-animation-reduced-destination]",
          { opacity: [0, 1] },
          { at: startAtSeconds, duration: durationSeconds, ease: "linear" },
        ],
      ]);
      controls.time =
        Math.max(0, performance.now() - (runtime.playbackStartedAtMs ?? performance.now())) / 1_000;
      return () => controls.stop();
    }
    const transform = [transferTransform(0, 0, 0, 1), transferTransform(deltaX, deltaY, 0, scale)];
    const sequence: AnimationSequence = [
      [
        scope.current,
        { transform, opacity: [transfer.sourceRect ? 1 : 0, destinationOpacity] },
        {
          at: startAtSeconds,
          duration: durationSeconds,
          ease: [0.16, 1, 0.3, 1],
        },
      ],
    ];
    if (acknowledgeResolution) {
      sequence.push([
        scope.current,
        { filter: ["brightness(1)", "brightness(1.18)", "brightness(1)"] },
        {
          at: startAtSeconds,
          duration: Math.min(0.14, durationSeconds * 0.35),
          ease: [0.16, 1, 0.3, 1],
        },
      ]);
    }
    if (faceChanges) {
      sequence.push([
        "[data-animation-transfer-flip]",
        { transform: ["rotateY(0deg)", "rotateY(180deg)"] },
        {
          at: startAtSeconds + durationSeconds * 0.24,
          duration: durationSeconds * 0.52,
          ease: [0.16, 1, 0.3, 1],
        },
      ]);
    }
    const controls = animate(sequence);
    // Geometry may register after playback begins. Join the existing clock
    // instead of starting a second full-duration animation on mount.
    controls.time =
      Math.max(0, performance.now() - (runtime.playbackStartedAtMs ?? performance.now())) / 1_000;
    return () => controls.stop();
  }, [
    animate,
    acknowledgeResolution,
    deltaX,
    deltaY,
    destinationOpacity,
    durationSeconds,
    faceChanges,
    scale,
    scope,
    spatialMotionSuppressed,
    startAtSeconds,
    transfer.sourceRect,
    transfer.step.id,
    runtime.playbackStartedAtMs,
  ]);

  if (spatialMotionSuppressed) {
    return (
      <div ref={scope} data-animation-transfer-entity={transfer.step.entity.id}>
        <div
          data-animation-reduced-source=""
          style={{
            position: "fixed",
            left: sourceRect.left,
            top: sourceRect.top,
            width: sourceRect.width,
            height: sourceRect.height,
            opacity: 1,
          }}
        >
          <SimulatorEntityVisual entity={sourceEntity} density={density} presentation="transfer" />
        </div>
        <div
          data-animation-reduced-destination=""
          style={{
            position: "fixed",
            left: destinationRect.left,
            top: destinationRect.top,
            width: destinationRect.width,
            height: destinationRect.height,
            opacity: 0,
          }}
        >
          <SimulatorEntityVisual
            entity={destinationEntity}
            density={density}
            presentation="transfer"
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={scope}
      data-animation-transfer-entity={transfer.step.entity.id}
      data-animation-transfer-quantity={transfer.step.quantity}
      data-animation-transfer-face-change={faceChanges ? "true" : undefined}
      style={{
        position: "fixed",
        left,
        top,
        width,
        height,
        transformOrigin: "top left",
        transform: transferTransform(0, 0, 0, 1),
        opacity: 0,
        perspective: faceChanges ? 800 : undefined,
        willChange: "transform, opacity",
      }}
    >
      {faceChanges ? (
        <div
          data-animation-transfer-flip=""
          style={{
            position: "absolute",
            inset: 0,
            transformStyle: "preserve-3d",
            transform: "rotateY(0deg)",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
            }}
          >
            <SimulatorEntityVisual
              entity={sourceEntity}
              density={density}
              presentation="transfer"
            />
          </div>
          <div
            style={{
              position: "absolute",
              inset: 0,
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            <SimulatorEntityVisual
              entity={destinationEntity}
              density={density}
              presentation="transfer"
            />
          </div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0 }}>
          <SimulatorEntityVisual entity={sourceEntity} density={density} presentation="transfer" />
        </div>
      )}
    </div>
  );
}

export function transferTransform(x: number, y: number, rotate: number, scale: number): string {
  return `translate3d(${x}px, ${y}px, 0) rotate(${rotate}deg) scale(${scale})`;
}

export function mergePortalTransferCaptures<T extends { readonly step: { readonly id: string } }>(
  current: readonly T[],
  additions: readonly T[],
): readonly T[] {
  if (additions.length === 0) return current;
  const capturedIds = new Set(current.map((capture) => capture.step.id));
  const uniqueAdditions = additions.filter((capture) => !capturedIds.has(capture.step.id));
  return uniqueAdditions.length === 0 ? current : [...current, ...uniqueAdditions];
}

export function portalTransferEndpointsReady(
  step: Pick<EntityTransferStepV2, "from" | "to">,
  source: object | null,
  destination: object | null,
): boolean {
  return (
    (step.from === undefined || source !== null) && (step.to === undefined || destination !== null)
  );
}

/**
 * Cards can move between differently shaped slots (for example Hand and
 * Battle Area). A non-uniform scale stretches art during the transfer; use
 * the smaller axis ratio so the whole card remains inside the destination
 * footprint without changing its aspect ratio.
 */
export function uniformTransferScale(
  source: Pick<DOMRect, "width" | "height">,
  destination: Pick<DOMRect, "width" | "height">,
): number {
  if (source.width <= 0 || source.height <= 0) return 1;
  return Math.min(destination.width / source.width, destination.height / source.height);
}

function resolveNode(
  registry: ReturnType<typeof useAnimationRuntime>["registry"],
  ref: AnimationRef | undefined,
): AnimationNodeRecord | null {
  return ref ? registry.getPreferred(ref) : null;
}

export function selectEntityEndpoint<T extends Pick<AnimationNodeRecord, "presence" | "zoneId">>(
  entityNodes: readonly T[],
  ref: AnimationRef | undefined,
  preferredPresence: AnimationNodeRecord["presence"],
): T | null {
  if (ref?.kind === "anchor" || ref?.kind === "player") return null;
  const candidates =
    ref?.kind === "zone" ? entityNodes.filter((record) => record.zoneId === ref.id) : entityNodes;
  return (
    candidates.find((record) => record.presence === preferredPresence) ?? candidates.at(0) ?? null
  );
}

const suppressedStyles = new WeakMap<
  HTMLElement,
  {
    visibility: string;
    pointerEvents: string;
    ariaHidden: string | null;
    inert: boolean;
    suppressedAttribute: string | null;
  }
>();

function suppressNode(node: HTMLElement): void {
  suppressedStyles.set(node, {
    visibility: node.style.visibility,
    pointerEvents: node.style.pointerEvents,
    ariaHidden: node.getAttribute("aria-hidden"),
    inert: node.inert,
    suppressedAttribute: node.getAttribute("data-simulator-animation-suppressed"),
  });
  node.setAttribute("data-simulator-animation-suppressed", "true");
  node.style.visibility = "hidden";
  node.style.pointerEvents = "none";
  node.setAttribute("aria-hidden", "true");
  node.inert = true;
}

function restoreNode(node: HTMLElement): void {
  const previous = suppressedStyles.get(node);
  if (!previous) return;
  node.style.visibility = previous.visibility;
  node.style.pointerEvents = previous.pointerEvents;
  if (previous.ariaHidden === null) node.removeAttribute("aria-hidden");
  else node.setAttribute("aria-hidden", previous.ariaHidden);
  node.inert = previous.inert;
  if (previous.suppressedAttribute === null) {
    node.removeAttribute("data-simulator-animation-suppressed");
  } else {
    node.setAttribute("data-simulator-animation-suppressed", previous.suppressedAttribute);
  }
  suppressedStyles.delete(node);
}

// A registered slot can include status bands or stretch to fill a grid cell.
// Measure its rendered entity when available so a transfer lands on the card,
// rather than scaling to the surrounding layout box. Anchors keep their bounds.
export function transferNodeRect(
  record: AnimationNodeRecord,
  entityId: string,
  entityAspectRatio?: number,
): DOMRect {
  if (record.ref.kind === "anchor" || record.ref.kind === "player") {
    return record.node.getBoundingClientRect();
  }
  // Zone fallbacks can still contain the exact card before its registration
  // commits. Resolve that card before using an aggregate pile or counter.
  const visual = Array.from(record.node.querySelectorAll<HTMLElement>("[data-sim-entity-id]")).find(
    (node) => node.dataset.simEntityId === entityId,
  );
  const geometry = record.node.querySelector<HTMLElement>("[data-sim-animation-geometry]");
  const rect = (visual ?? geometry ?? record.node).getBoundingClientRect();
  const aspectRatio = entityAspectRatio ?? record.entity?.imageAspectRatio;
  if (visual || !aspectRatio || aspectRatio <= 0) return rect;

  const fitted = fitRectToAspectRatio(rect, aspectRatio);
  return new DOMRect(fitted.left, fitted.top, fitted.width, fitted.height);
}

type TransferRect = Pick<DOMRect, "left" | "top" | "width" | "height">;

export function drawTransferRect(source: TransferRect, destination: TransferRect): TransferRect {
  return {
    left: source.left + (source.width - destination.width) / 2,
    top: source.top + (source.height - destination.height) / 2,
    width: destination.width,
    height: destination.height,
  };
}

export function fitRectToAspectRatio(rect: TransferRect, aspectRatio: number): TransferRect {
  if (!Number.isFinite(aspectRatio) || aspectRatio <= 0) return rect;
  const width = Math.min(rect.width, rect.height * aspectRatio);
  const height = width / aspectRatio;
  return {
    left: rect.left + (rect.width - width) / 2,
    top: rect.top + (rect.height - height) / 2,
    width,
    height,
  };
}

// Some zones expose an invisible point anchor when they do not render the
// moving entity itself (for example the collapsed FAB stack on mobile). Those
// bounds describe position, not card size. Give the point the opposite real
// endpoint's dimensions so the transfer preserves its visual scale while
// still travelling to or from the intended zone location.
function normalizePositionOnlyZoneRects(
  source: DOMRect | null,
  destination: DOMRect | null,
  sourceNode: AnimationNodeRecord | null,
  destinationNode: AnimationNodeRecord | null,
): { readonly source: DOMRect | null; readonly destination: DOMRect | null } {
  if (!source || !destination) return { source, destination };
  const sourceIsPoint = isPositionOnlyZoneRect(sourceNode, source);
  const destinationIsPoint = isPositionOnlyZoneRect(destinationNode, destination);
  if (sourceIsPoint && hasEntityGeometry(destinationNode)) {
    return {
      source: rectAroundCenter(source, destination.width, destination.height),
      destination,
    };
  }
  if (destinationIsPoint && hasEntityGeometry(sourceNode)) {
    return {
      source,
      destination: rectAroundCenter(destination, source.width, source.height),
    };
  }
  return { source, destination };
}

function isPositionOnlyZoneRect(
  record: AnimationNodeRecord | null,
  rect: Pick<DOMRect, "width" | "height">,
): boolean {
  return record?.ref.kind === "zone" && rect.width <= 2 && rect.height <= 2;
}

function hasEntityGeometry(record: AnimationNodeRecord | null): boolean {
  return record?.ref.kind === "entity";
}

function rectAroundCenter(rect: DOMRect, width: number, height: number): DOMRect {
  return new DOMRect(
    rect.left + (rect.width - width) / 2,
    rect.top + (rect.height - height) / 2,
    width,
    height,
  );
}
