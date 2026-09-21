import type { EntityStateChangeStepV2 } from "@tcg/protocol/animations";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import { motion } from "motion/react";
import { useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";

import { SimulatorEntityVisual, projectEntityVisual } from "../components/SimulatorEntityVisual";
import { useAnimationRegistryVersion } from "../hooks/useAnimationRegistryVersion";
import type { AnimationNodeRecord } from "../lib/node-registry";
import { useAnimationRuntime } from "../provider/contexts";
import type { SimulatorSpatialStateChange } from "../provider/contexts";

interface StateChangeVisual {
  readonly step: EntityStateChangeStepV2;
  readonly sourceEntity: SimulatorEntity;
  readonly destinationEntity: SimulatorEntity;
  readonly node: AnimationNodeRecord;
  readonly rect: DOMRect;
}

interface SuppressedNodeState {
  readonly visibility: string;
  readonly pointerEvents: string;
  readonly inert: boolean;
  readonly ariaHidden: string | null;
}

export function EntityStateChangeLayer() {
  const runtime = useAnimationRuntime();
  const transition = runtime.activeTransition;
  const reportedMissing = useMemo(() => new Set<string>(), [transition?.id]);
  const registryVersion = useAnimationRegistryVersion(runtime.registry);
  const [visuals, setVisuals] = useState<readonly StateChangeVisual[]>([]);

  useLayoutEffect(() => {
    if (!transition || transition.phase !== "running") {
      setVisuals((current) => (current.length === 0 ? current : []));
      return;
    }
    const suppressed = new Map<HTMLElement, SuppressedNodeState>();
    const next: StateChangeVisual[] = [];
    for (const compiled of runtime.compiledPlan?.steps ?? []) {
      if (compiled.step.type !== "entityStateChange") continue;
      const step = compiled.step;
      const node = runtime.registry.getPreferred(step.at);
      const sourceEntity = runtime.getEntity(transition.fromState, step.entity.id, step.sourceFace);
      const destinationEntity = runtime.getEntity(
        transition.toState,
        step.entity.id,
        step.destinationFace,
      );
      if (!node || !sourceEntity || !destinationEntity) {
        if (!reportedMissing.has(step.id))
          console.warn("[simulator-animation]", {
            type: "missing-state-change-visual",
            transitionId: transition.id,
            stepId: step.id,
            entityId: step.entity.id,
            missingNode: !node,
            missingSourceEntity: !sourceEntity,
            missingDestinationEntity: !destinationEntity,
          });
        reportedMissing.add(step.id);
        continue;
      }
      const visualNode = stateChangeVisualNode(node.node, step.change);
      if (!suppressed.has(visualNode)) {
        suppressed.set(visualNode, {
          visibility: visualNode.style.visibility,
          pointerEvents: visualNode.style.pointerEvents,
          inert: visualNode.inert,
          ariaHidden: visualNode.getAttribute("aria-hidden"),
        });
        visualNode.style.visibility = "hidden";
        visualNode.style.pointerEvents = "none";
        visualNode.inert = true;
        visualNode.setAttribute("aria-hidden", "true");
      }
      next.push({
        step,
        sourceEntity,
        destinationEntity,
        node,
        // Anchor the overlay to the actual card visual when the node exposes
        // one: slot boxes can be landscape or padded around a portrait card,
        // and the rotating copy must start/end exactly where the real card
        // sits, or the handoff snaps in size and position.
        rect: visualNode.getBoundingClientRect(),
      });
    }
    setVisuals(next);
    return () => {
      for (const [node, state] of suppressed) {
        node.style.visibility = state.visibility;
        node.style.pointerEvents = state.pointerEvents;
        node.inert = state.inert;
        if (state.ariaHidden === null) node.removeAttribute("aria-hidden");
        else node.setAttribute("aria-hidden", state.ariaHidden);
      }
    };
  }, [registryVersion, runtime, transition, reportedMissing]);

  if (typeof document === "undefined" || visuals.length === 0) return null;
  const SpatialStateChangeRenderer = runtime.spatialStateChangeRenderer;
  const spatialKinds = runtime.spatialStateChangeKinds;
  const spatialChanges = SpatialStateChangeRenderer
    ? visuals
        .filter((visual) => !spatialKinds || spatialKinds.includes(visual.sourceEntity.kind))
        .map<SimulatorSpatialStateChange>((visual) => {
          const compiled = runtime.compiledPlan?.steps.find(
            (entry) => entry.step.id === visual.step.id,
          );
          return {
            id: visual.step.id,
            step: visual.step,
            sourceEntity: visual.sourceEntity,
            destinationEntity: visual.destinationEntity,
            rect: visual.rect,
            density: visual.node.density ?? "normal",
            startAtMs: compiled?.startAtMs ?? 0,
            durationMs: compiled?.durationMs ?? 0,
          };
        })
    : [];
  const spatialIds = new Set(spatialChanges.map((change) => change.id));
  return createPortal(
    <div
      aria-hidden
      data-animation-state-change-layer=""
      style={{ position: "fixed", inset: 0, zIndex: 1000, pointerEvents: "none" }}
    >
      {SpatialStateChangeRenderer && spatialChanges.length > 0 ? (
        <SpatialStateChangeRenderer
          changes={spatialChanges}
          playbackStartedAtMs={runtime.playbackStartedAtMs}
        />
      ) : null}
      {visuals
        .filter((visual) => !spatialIds.has(visual.step.id))
        .map((visual) => (
          <StateChangeVisual key={visual.step.id} visual={visual} />
        ))}
    </div>,
    document.body,
  );
}

export function stateChangeVisualNode(
  node: HTMLElement,
  change: EntityStateChangeStepV2["change"],
): HTMLElement {
  if (change === "face") {
    return node.querySelector<HTMLElement>("[data-sim-animation-face-target]") ?? node;
  }
  if (change === "orientation") {
    return node.querySelector<HTMLElement>("[data-sim-animation-orientation-target]") ?? node;
  }
  return node;
}

function StateChangeVisual({ visual }: { readonly visual: StateChangeVisual }) {
  const runtime = useAnimationRuntime();
  const compiled = runtime.compiledPlan?.steps.find((entry) => entry.step.id === visual.step.id);
  const duration = (compiled?.durationMs ?? 0) / 1_000;
  const delay = (compiled?.startAtMs ?? 0) / 1_000;
  const source = projectEntityVisual(visual.sourceEntity, visual.step.sourceFace);
  const destination = projectEntityVisual(visual.destinationEntity, visual.step.destinationFace);
  const faceChange = visual.step.change === "face";
  const appearanceChange = visual.step.change === "appearance";
  const fromRotation = visual.step.fromRotationDeg ?? 0;
  const toRotation = visual.step.toRotationDeg ?? fromRotation;

  return (
    <motion.div
      data-animation-state-change={visual.step.change}
      initial={{
        transform: stateChangeTransform(fromRotation, 0, appearanceChange ? 0.96 : 1),
      }}
      animate={{
        transform:
          faceChange || appearanceChange
            ? [
                stateChangeTransform(fromRotation, 0, appearanceChange ? 0.96 : 1),
                stateChangeTransform(toRotation, faceChange ? 90 : 0, appearanceChange ? 1.04 : 1),
                stateChangeTransform(toRotation, 0, 1),
              ]
            : stateChangeTransform(toRotation, 0, 1),
      }}
      transition={{ delay, duration, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        left: visual.rect.left,
        top: visual.rect.top,
        width: visual.rect.width,
        height: visual.rect.height,
        transformStyle: "preserve-3d",
      }}
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: faceChange || appearanceChange ? [1, 1, 0] : 0 }}
        transition={{ delay, duration }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SimulatorEntityVisual
          entity={source}
          density={visual.node.density ?? "normal"}
          presentation="state-change"
        />
      </motion.div>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: faceChange || appearanceChange ? [0, 0, 1] : 1 }}
        transition={{ delay, duration }}
        style={{ position: "absolute", inset: 0 }}
      >
        <SimulatorEntityVisual
          entity={destination}
          density={visual.node.density ?? "normal"}
          presentation="state-change"
        />
      </motion.div>
    </motion.div>
  );
}

function stateChangeTransform(rotateZ: number, rotateY: number, scale: number): string {
  return `translate3d(0, 0, 0) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) scale(${scale})`;
}
