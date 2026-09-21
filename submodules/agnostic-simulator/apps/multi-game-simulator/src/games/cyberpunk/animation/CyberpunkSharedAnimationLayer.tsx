import type { AnimationPlanV2, SimulatorAudioCueId } from "@tcg/protocol";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { SimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import {
  AnimationInteractionBoundary,
  createSimulatorAnimationScope,
  projectSimulatorEntityForFace,
  type SimulatorEntityVisualProps,
} from "@tcg/simulator-ui";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

import { useSimulatorAudio } from "../../../simulator/audio";
import { useSimulatorSettings } from "../../../simulator/settings";
import { Card } from "../components/GameBoard/Card";
import { useCardPreview } from "../components/CardPreview/CardPreviewContext";
import { DieDisplay } from "../components/GameBoard/DieDisplay";
import {
  PLAYER_SIDE_TO_ID,
  useEngine,
  type DieType,
  type EffectiveRule,
  type EngineCardType,
  type Side,
} from "../engine";
import { EnginePresentationStateProvider } from "../engine/engineContext";
import {
  cyberpunkCardZoneToSimulatorZone,
  projectEntityForAnimationEntity,
} from "../engine/projectSimulator";
import {
  cyberpunkAnimationScriptToAnimationPlans,
  isCyberpunkAuthoritativeRollback,
  projectCyberpunkAuthoritativeAnimationPlan,
} from "./sharedEvents";
import {
  CyberpunkThreeCardStateChangeLayer,
  CyberpunkThreeCardTransferLayer,
  supportsCyberpunkThreeCardTransfers,
} from "./CyberpunkThreeCardTransferLayer";
import { CyberpunkThreeFeedbackLayer } from "./CyberpunkThreeFeedbackLayer";
import { enhanceCyberpunkCardTransferTiming } from "./three-card-transfer-plan";
import { CyberpunkAnimationActivityProvider } from "./CyberpunkAnimationActivityContext";

type CyberpunkMatchState = ReturnType<typeof useEngine>["matchState"];
type CyberpunkRawEngineEventEntry = ReturnType<typeof useEngine>["rawEngineEvents"][number];

const CyberpunkAnimation = createSimulatorAnimationScope<CyberpunkMatchState>();

export interface ResolvingProgramVisual {
  cardId: string;
  side: Side;
  face: "hidden" | "public";
  label?: string;
}

const ResolvingProgramVisualsContext = createContext<readonly ResolvingProgramVisual[]>([]);

export function useResolvingProgramVisuals(): readonly ResolvingProgramVisual[] {
  return useContext(ResolvingProgramVisualsContext);
}

export function CyberpunkSharedAnimationLayer({
  children,
  commandGate,
}: {
  children: ReactNode;
  commandGate: SimulatorExternalCommandGate;
}) {
  const { humanSide, matchState } = useEngine();
  const {
    settings: { animationSpeed },
  } = useSimulatorSettings();
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);
  const threeCardTransfersEnabled = useMemo(supportsCyberpunkThreeCardTransfers, []);
  useEffect(() => {
    document.documentElement.dataset.cyberpunkCardRenderer = threeCardTransfersEnabled
      ? "three"
      : "dom";
    return () => {
      delete document.documentElement.dataset.cyberpunkCardRenderer;
    };
  }, [threeCardTransfersEnabled]);
  const projection = useMemo(
    () => ({
      getEntity: (state: CyberpunkMatchState, entityId: string, face: "public" | "hidden") => {
        const entity = projectEntityForAnimationEntity(entityId, state, humanSide);
        if (!entity) return null;
        // Never upgrade a hidden entity to a public visual. Eddie tap/untap
        // plans historically requested public faces; the projection is the
        // privacy boundary.
        const resolvedFace = face === "hidden" || entity.face === "hidden" ? "hidden" : "public";
        return projectSimulatorEntityForFace(entity, resolvedFace);
      },
      getZone: (_state: CyberpunkMatchState, ref: { kind: "zone"; id: string; ownerId?: string }) =>
        cyberpunkAnimationZoneResolver(ref),
    }),
    [humanSide],
  );

  return (
    <CyberpunkAnimation.Root
      sessionKey={`cyberpunk:${viewerSeatId}`}
      initialState={matchState}
      initialVersion={matchState.ctx.stateID}
      projection={projection}
      entityRenderer={CyberpunkEntityVisual}
      spatialTransferRenderer={
        threeCardTransfersEnabled ? CyberpunkThreeCardTransferLayer : undefined
      }
      spatialTransferKinds={
        threeCardTransfersEnabled ? ["card", "unit", "leader", "die"] : undefined
      }
      spatialStateChangeRenderer={
        threeCardTransfersEnabled ? CyberpunkThreeCardStateChangeLayer : undefined
      }
      spatialStateChangeKinds={threeCardTransfersEnabled ? ["card", "unit", "leader"] : undefined}
      suppressedOverlayStepTypes={
        threeCardTransfersEnabled ? ["valueDelta", "phaseChange"] : undefined
      }
      viewerSeatId={viewerSeatId}
      animationSpeed={animationSpeed}
      onScheduleAudio={scheduleAnimationSteps}
      onCancelAudio={cancelScheduledCues}
    >
      <CyberpunkAnimationBridge
        commandGate={commandGate}
        enhancedCardMotion={threeCardTransfersEnabled}
      >
        {children}
      </CyberpunkAnimationBridge>
    </CyberpunkAnimation.Root>
  );
}

function CyberpunkAnimationBridge({
  children,
  commandGate,
  enhancedCardMotion,
}: {
  readonly children: ReactNode;
  readonly commandGate: SimulatorExternalCommandGate;
  readonly enhancedCardMotion: boolean;
}) {
  const { humanSide, matchState, rawEngineEvents } = useEngine();
  const { enqueue, replaceFromSync } = CyberpunkAnimation.useActions();
  const snapshot = CyberpunkAnimation.useState();
  const status = CyberpunkAnimation.useStatus();
  const { playCue } = useSimulatorAudio();
  const { hide: hideCardPreview } = useCardPreview();
  const processedRawEntryIdsRef = useRef<Set<number> | null>(null);
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);

  useEffect(() => {
    commandGate.setBlocked(status.isAnimating);
    if (status.isAnimating) hideCardPreview();
    return () => commandGate.setBlocked(false);
  }, [commandGate, hideCardPreview, status.isAnimating]);

  useEffect(() => {
    const currentIds = new Set(rawEngineEvents.map((entry) => entry.id));
    const processed = processedRawEntryIdsRef.current;
    if (!processed) {
      processedRawEntryIdsRef.current = currentIds;
      return;
    }
    const maxCurrent = rawEngineEvents.at(-1)?.id ?? 0;
    const maxProcessed = Math.max(0, ...processed);
    if (rawEngineEvents.length === 0) {
      processedRawEntryIdsRef.current = currentIds;
      if (snapshot.authoritativeVersion !== matchState.ctx.stateID) {
        replaceFromSync({ state: matchState, version: matchState.ctx.stateID });
      }
      return;
    }
    if (maxCurrent < maxProcessed) {
      processedRawEntryIdsRef.current = currentIds;
      replaceFromSync({ state: matchState, version: matchState.ctx.stateID });
      return;
    }
    if (isCyberpunkAuthoritativeRollback(matchState.ctx.stateID, snapshot.authoritativeVersion)) {
      // Undo restores an older authoritative version while raw event ids keep
      // increasing. It is a discontinuity, not a forward transition.
      processedRawEntryIdsRef.current = currentIds;
      replaceFromSync({ state: matchState, version: matchState.ctx.stateID });
      return;
    }

    for (const entry of rawEngineEvents) {
      if (processed.has(entry.id)) continue;
      processed.add(entry.id);
      for (const cue of cyberpunkImmediateSystemAudioCues(entry, viewerSeatId)) playCue(cue);
      const toState = entry.afterState ?? matchState;
      const plans = entry.animationPlan
        ? [projectCyberpunkAuthoritativeAnimationPlan(entry.animationPlan, viewerSeatId)]
        : cyberpunkAnimationScriptToAnimationPlans(entry.animationScript, {
            viewerSeatId,
            idPrefix: String(entry.id),
          });
      const plan = plans[0]
        ? enhanceCyberpunkCardTransferTiming(plans[0], enhancedCardMotion)
        : null;
      enqueue({
        state: toState,
        version: entry.stateID,
        plan,
        correlationId: String(entry.id),
        source: "local",
      });
    }

    // Some local/test-engine commits have no animation record. They still must
    // advance presentation state through the same queue instead of leaving the
    // board pinned to the last animated state.
    const highestEventVersion = rawEngineEvents.reduce(
      (highest, entry) => Math.max(highest, entry.stateID),
      -1,
    );
    if (
      matchState.ctx.stateID > highestEventVersion &&
      matchState.ctx.stateID > (snapshot.authoritativeVersion ?? -1)
    ) {
      enqueue({
        state: matchState,
        version: matchState.ctx.stateID,
        plan: null,
        source: "local",
      });
    }
  }, [
    enqueue,
    enhancedCardMotion,
    matchState,
    playCue,
    rawEngineEvents,
    replaceFromSync,
    snapshot.authoritativeVersion,
    viewerSeatId,
  ]);

  const resolvingVisuals = useMemo(
    () => resolvingProgramVisuals(snapshot.activeTransition?.plan ?? null),
    [snapshot.activeTransition?.plan],
  );

  return (
    <CyberpunkAnimationActivityProvider active={status.isAnimating}>
      <ResolvingProgramVisualsContext.Provider value={resolvingVisuals}>
        <AnimationInteractionBoundary active={status.isAnimating}>
          <EnginePresentationStateProvider
            state={snapshot.presentationState ?? snapshot.authoritativeState!}
          >
            {enhancedCardMotion ? <CyberpunkThreeFeedbackLayer /> : null}
            {children}
          </EnginePresentationStateProvider>
        </AnimationInteractionBoundary>
      </ResolvingProgramVisualsContext.Provider>
    </CyberpunkAnimationActivityProvider>
  );
}

function CyberpunkEntityVisual({
  entity,
  density,
  className,
  presentation,
}: SimulatorEntityVisualProps) {
  // Gig dice must fly as dice: without this the transfer clone renders the
  // generic Card shell, whose imageless fallback is the card back.
  if (entity.kind === "die") {
    return (
      <div className={["h-full w-full", className].filter(Boolean).join(" ")}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          <DieDisplay
            dieType={(entity.traits[0] ?? "d6") as DieType}
            faceValue={dieFaceValue(entity)}
            label={entity.title}
            size="md"
          />
        </div>
      </div>
    );
  }
  const printedCost = numericStat(entity, "Cost");
  const effectiveCost = numericStat(entity, "Effective Cost") ?? printedCost;
  const printedPower = numericStat(entity, "Power");
  const effectivePower = numericStat(entity, "Effective Power") ?? printedPower;
  const effectiveRules = (entity.decorations ?? []).flatMap((decoration) =>
    decoration.content.kind === "icon" && isEffectiveRule(decoration.content.token)
      ? [decoration.content.token]
      : [],
  );
  // State-change copies are anchored to the measured real card box, so they
  // must fill it — fixed density sizes would pop in size against the real
  // card at both ends of the transition.
  const sizeClass =
    presentation === "state-change" ? "h-full w-full" : cyberpunkCardSizeClass(density);
  return (
    <div className={[sizeClass, className].filter(Boolean).join(" ")}>
      <Card
        imageUrl={entity.imageUrl}
        name={entity.title}
        faceDown={entity.face === "hidden"}
        cardType={cardType(entity)}
        color={cardColor(entity.frameStyle?.color)}
        tapped={entity.states.includes("rested")}
        rotateWhenTapped={presentation !== "state-change"}
        effectiveRules={effectiveRules}
        hasSellTag={entity.decorations?.some((item) => item.id === "sell-tag")}
        classifications={entity.traits}
        cost={printedCost}
        effectiveCost={effectiveCost}
        power={printedPower}
        effectivePower={effectivePower}
        disablePreview
      />
    </div>
  );
}

function cyberpunkCardSizeClass(density: SimulatorEntityVisualProps["density"]): string {
  switch (density) {
    case "mini":
      return "h-[84px] w-[60px] shrink-0";
    case "compact":
      return "h-[134px] w-[96px] shrink-0";
    case "large":
      return "h-[190px] w-[136px] shrink-0";
    default:
      return "h-[157px] w-[112px] shrink-0";
  }
}

function resolvingProgramVisuals(plan: AnimationPlanV2 | null): ResolvingProgramVisual[] {
  if (!plan) return [];
  const visuals = new Map<string, ResolvingProgramVisual>();
  for (const step of plan.steps) {
    if (step.type !== "entityTransfer") continue;
    const anchor =
      step.from?.kind === "anchor" && step.from.id.startsWith("resolving-program:")
        ? step.from
        : step.to?.kind === "anchor" && step.to.id.startsWith("resolving-program:")
          ? step.to
          : null;
    if (!anchor) continue;
    const zone = step.from?.kind === "zone" ? step.from : step.to?.kind === "zone" ? step.to : null;
    const side = zone ? sideFromCyberpunkAnchorId(zone.id) : null;
    if (!side) continue;
    visuals.set(step.entity.id, {
      cardId: step.entity.id,
      side,
      face: step.destinationFace,
    });
  }
  return [...visuals.values()];
}

export function cyberpunkImmediateSystemAudioCues(
  entry: CyberpunkRawEngineEventEntry,
  viewerSeatId: string,
): SimulatorAudioCueId[] {
  const cues = new Set<SimulatorAudioCueId>();
  for (const event of entry.events) {
    if (event.type === "turnStarted") cues.add("turn.change");
    else if (event.type === "gameEnded") {
      cues.add(event.winnerId === viewerSeatId ? "game.win" : "game.loss");
    }
  }
  return [...cues];
}

function cyberpunkAnimationZoneResolver(ref: { kind: "zone"; id: string; ownerId?: string }) {
  const side = sideFromCyberpunkAnchorId(ref.id);
  const suffix = cyberpunkAnchorSuffix(ref.id);
  const cardZone =
    suffix === "deck" ||
    suffix === "hand" ||
    suffix === "field" ||
    suffix === "trash" ||
    suffix === "legendArea" ||
    suffix === "eddieArea" ||
    suffix === "gigArea"
      ? suffix
      : null;
  if (side && cardZone) return cyberpunkCardZoneToSimulatorZone(cardZone, side);
  return {
    id: ref.id,
    label: ref.id,
    role: "custom" as const,
    ownerId: ref.ownerId,
    visibility: "public" as const,
    entityIds: [],
    hint: ref.id,
  };
}

function sideFromCyberpunkAnchorId(id: string): Side | null {
  if (id.startsWith("p-")) return "player";
  if (id.startsWith("opp-")) return "opponent";
  return null;
}

function cyberpunkAnchorSuffix(id: string): string | null {
  if (id.startsWith("p-")) return id.slice(2);
  if (id.startsWith("opp-")) return id.slice(4);
  return null;
}

function numericStat(entity: SimulatorEntity, label: string): number | null {
  const value = entity.stats.find((stat) => stat.label === label)?.value;
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function dieFaceValue(entity: SimulatorEntity): number | undefined {
  const parsed = numericStat(entity, "Face");
  return parsed !== null && parsed > 0 ? parsed : undefined;
}

function cardType(entity: SimulatorEntity): EngineCardType | undefined {
  if (entity.kind === "leader") return "legend";
  const type = entity.traits[0];
  return type === "unit" || type === "gear" || type === "program" ? type : undefined;
}

function cardColor(color: string | undefined): "blue" | "green" | "red" | "yellow" | undefined {
  switch (color) {
    case "#3b82f6":
      return "blue";
    case "#22c55e":
      return "green";
    case "#ef4444":
      return "red";
    case "#eab308":
      return "yellow";
    default:
      return undefined;
  }
}

function isEffectiveRule(value: string): value is EffectiveRule {
  return (
    value === "blocker" ||
    value === "goSolo" ||
    value === "adrenaline" ||
    value === "cantAttack" ||
    value === "mustAttack" ||
    value === "cantBeBlocked" ||
    value === "canAttackOnPlayedTurnAgainstUnits"
  );
}
