import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type {
  AnimationPlanStepV1,
  AnimationPlanV1,
  AnimationZoneRef,
  SimulatorAudioCueId,
} from "@tcg/protocol";
import type { SimulatorEntity, SimulatorZone } from "@tcg/simulator-contract";
import type { Ability, CardZone } from "@tcg/cyberpunk-types";
import { defOf } from "@tcg/cyberpunk-engine";
import {
  isSimulatorAnimationDebugEnabled,
  MotionAnimationSurface,
  simulatorAnimationDebug,
} from "@tcg/simulator-ui";

import { EFFECT_RESULT_HOLD_MS_BY_PACING } from "../../../simulator/gameConfig";
import { useSimulatorAudio } from "../../../simulator/audio";
import { PLAYER_SIDE_TO_ID, useEngine, useUserConfig } from "../engine";
import { Card } from "../components/GameBoard/Card";
import { CyberpunkAnimationVisualStateProvider } from "./AnimationVisualStateContext";
import {
  cyberpunkCardZoneToSimulatorZone,
  projectEntityForAnimationEntity,
  sideForPlayerId,
} from "../engine/projectSimulator";
import { cyberpunkAnimationScriptToAnimationPlans } from "./sharedEvents";
import type { Side } from "../engine";

type CyberpunkMatchState = ReturnType<typeof useEngine>["matchState"];
type CyberpunkRawEngineEventEntry = ReturnType<typeof useEngine>["rawEngineEvents"][number];
type CyberpunkCardType = "legend" | "unit" | "gear" | "program";
type CyberpunkCardColor = "blue" | "green" | "red" | "yellow";

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
  onAnimationPendingChange,
}: {
  children: ReactNode;
  onAnimationPendingChange?: (hasPendingAnimations: boolean) => void;
}) {
  const { humanSide, matchState, rawEngineEvents } = useEngine();
  const { animationPacing } = useUserConfig();
  const [plans, setPlans] = useState<AnimationPlanV1[]>([]);
  const [resolvingProgramVisuals, setResolvingProgramVisuals] = useState<ResolvingProgramVisual[]>(
    [],
  );
  const resolvingProgramCleanupByPlanIdRef = useRef<Map<string, ResolvingProgramVisual>>(new Map());
  const previousSummaryByPlanIdRef = useRef<Map<string, string>>(new Map());
  const processedRawEntryIdsRef = useRef<Set<number> | null>(null);
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);
  const resultHoldMs = EFFECT_RESULT_HOLD_MS_BY_PACING[animationPacing];
  const resolveZone = useMemo(() => cyberpunkAnimationZoneResolver, []);
  const { cancelScheduledCues, playCue, scheduleAnimationSteps } = useSimulatorAudio();
  const renderMotionEntity = useCallback(
    (entity: SimulatorEntity) => <CyberpunkMotionCard entity={entity} />,
    [],
  );

  useEffect(() => {
    onAnimationPendingChange?.(plans.length > 0);
  }, [onAnimationPendingChange, plans.length]);

  useEffect(
    () => () => {
      onAnimationPendingChange?.(false);
    },
    [onAnimationPendingChange],
  );

  useEffect(() => {
    const rawEntryIds = new Set(rawEngineEvents.map((entry) => entry.id));
    const processedEntryIds = processedRawEntryIdsRef.current;
    if (!processedEntryIds) {
      processedRawEntryIdsRef.current = rawEntryIds;
      if (rawEngineEvents.length > 0) {
        simulatorAnimationDebug("cyberpunk shared layer seeded existing raw entries", {
          rawEntryIds: [...rawEntryIds],
        });
      }
      return;
    }

    const maxRawEntryId = rawEngineEvents.at(-1)?.id ?? 0;
    const maxProcessedEntryId = Math.max(0, ...processedEntryIds);
    if (rawEngineEvents.length === 0 || maxRawEntryId < maxProcessedEntryId) {
      processedRawEntryIdsRef.current = rawEntryIds;
      setPlans([]);
      cancelScheduledCues();
      resolvingProgramCleanupByPlanIdRef.current.clear();
      setResolvingProgramVisuals([]);
      simulatorAnimationDebug("cyberpunk shared layer reset animation queue", {
        maxRawEntryId,
        maxProcessedEntryId,
      });
      return;
    }

    const newEntries = rawEngineEvents.filter((entry) => !processedEntryIds.has(entry.id));
    if (newEntries.length === 0) {
      return;
    }

    const mappedEntryResults = newEntries.map((entry) => {
      processedEntryIds.add(entry.id);
      for (const cue of cyberpunkImmediateSystemAudioCues(entry, viewerSeatId)) {
        playCue(cue);
      }
      const toState = entry.afterState ?? matchState;
      const pendingEffectSourceCardId = pendingEffectSourceProgramCardIdFromState(toState);
      const resolvingProgramSourceCardId = entry.beforeState
        ? pendingEffectSourceProgramCardIdFromState(entry.beforeState)
        : null;
      const stagedEffectSourceCardIds = stagedEffectSourceCardIdsFromEntry(entry, toState);
      const stagedEffectSourceLabels = stagedEffectSourceLabelsFromEntry(entry, toState);
      const mappedPlans = cyberpunkAnimationScriptToAnimationPlans(entry.animationScript, {
        viewerSeatId,
        idPrefix: String(entry.id),
        pendingEffectSourceCardId,
        resolvingProgramSourceCardId,
        stagedEffectSourceCardIds,
        stagedEffectSourceLabels,
        resultHoldMs,
      });
      simulatorAnimationDebug("cyberpunk animation entry processed", {
        rawEntryId: entry.id,
        stateID: entry.stateID,
        side: entry.side,
        move: entry.move,
        input: entry.input,
        pendingEffectSourceCardId,
        resolvingProgramSourceCardId,
        stagedEffectSourceCardIds: [...stagedEffectSourceCardIds],
        stagedEffectSourceLabels: [...stagedEffectSourceLabels],
        engineEvents: entry.events,
        moveLogs: entry.moveLogs,
        animationScript: entry.animationScript,
        mappedPlans,
      });
      return { entry, mappedPlans };
    });
    const mappedPlans = mappedEntryResults.flatMap((result) => result.mappedPlans);

    simulatorAnimationDebug("cyberpunk shared layer queued plans", {
      rawEntryIds: mappedEntryResults.map((result) => result.entry.id),
      planSummaries: mappedPlans.map((plan) => animationPlanSummary(plan)),
    });

    if (mappedPlans.length > 0) {
      const cleanupVisuals = mappedPlans.flatMap((plan) => {
        const visual = resolvingProgramCleanupVisualFromPlan(plan);
        if (!visual) return [];
        resolvingProgramCleanupByPlanIdRef.current.set(plan.id, visual);
        return [visual];
      });
      const persistentVisuals = mappedPlans.flatMap((plan) =>
        resolvingProgramVisualsFromPlan(plan),
      );
      const visualsToMerge = [...persistentVisuals, ...cleanupVisuals];
      if (visualsToMerge.length > 0) {
        setResolvingProgramVisuals((current) =>
          mergeResolvingProgramVisuals(current, visualsToMerge),
        );
      }
      setPlans((current) => [...current, ...mappedPlans]);
    }
  }, [
    cancelScheduledCues,
    humanSide,
    matchState,
    playCue,
    rawEngineEvents,
    resultHoldMs,
    viewerSeatId,
  ]);

  const handlePlanComplete = useCallback((completedPlanId: string) => {
    setPlans((current) => current.filter((plan) => plan.id !== completedPlanId));
    const cleanupVisual = resolvingProgramCleanupByPlanIdRef.current.get(completedPlanId);
    if (!cleanupVisual) {
      return;
    }
    resolvingProgramCleanupByPlanIdRef.current.delete(completedPlanId);
    setResolvingProgramVisuals((current) =>
      current.filter(
        (visual) => visual.cardId !== cleanupVisual.cardId || visual.side !== cleanupVisual.side,
      ),
    );
  }, []);

  useEffect(() => {
    if (!isSimulatorAnimationDebugEnabled()) {
      return;
    }
    const summaries = new Map(plans.map((plan) => [plan.id, animationPlanSummary(plan)]));
    const remapped = [...summaries].flatMap(([id, summary]) => {
      const previous = previousSummaryByPlanIdRef.current.get(id);
      return previous && previous !== summary ? [{ id, previous, current: summary }] : [];
    });

    simulatorAnimationDebug("cyberpunk shared layer remap", {
      stateID: matchState.ctx.stateID,
      rawEntries: rawEngineEvents.map((entry) => {
        const toState = entry.afterState ?? matchState;
        return {
          id: entry.id,
          stateID: entry.stateID,
          beforeStateID: entry.beforeState?.ctx.stateID,
          afterStateID: entry.afterState?.ctx.stateID,
          pendingEffectSourceCardId: pendingEffectSourceProgramCardIdFromState(toState),
          resolvingProgramSourceCardId: entry.beforeState
            ? pendingEffectSourceProgramCardIdFromState(entry.beforeState)
            : null,
        };
      }),
      planSummaries: [...summaries.values()],
      remapped,
    });
    previousSummaryByPlanIdRef.current = summaries;
  }, [plans, matchState, rawEngineEvents]);

  useEffect(() => () => cancelScheduledCues(), [cancelScheduledCues]);

  return (
    <ResolvingProgramVisualsContext.Provider value={resolvingProgramVisuals}>
      <CyberpunkAnimationVisualStateProvider hasPendingAnimations={plans.length > 0}>
        <MotionAnimationSurface
          animationPlans={plans}
          viewerSeatId={viewerSeatId}
          resolveEntity={(entityId) =>
            projectEntityForAnimationEntity(entityId, matchState, humanSide)
          }
          resolveZone={resolveZone}
          renderEntity={renderMotionEntity}
          getCardSuppressionDelayMs={cyberpunkCardSuppressionDelayMs}
          onAnimationStepsScheduled={scheduleAnimationSteps}
          onPlanComplete={handlePlanComplete}
        >
          {children}
        </MotionAnimationSurface>
      </CyberpunkAnimationVisualStateProvider>
    </ResolvingProgramVisualsContext.Provider>
  );
}

function CyberpunkMotionCard({ entity }: { entity: SimulatorEntity }) {
  const faceDown = entity.face === "hidden";
  const cardType = cyberpunkCardTypeFromEntity(entity);
  const overlayRuleLabels = new Set(entity.overlayBadges?.map((badge) => badge.label) ?? []);
  const effectiveRules = (["blocker", "goSolo", "cantAttack", "mustAttack"] as const).filter(
    (rule) => overlayRuleLabels.has(rule),
  );

  return (
    <Card
      imageUrl={entity.imageUrl}
      name={entity.title}
      cardId={entity.id}
      cardType={cardType}
      color={cyberpunkCardColorFromFrame(entity.frameStyle?.color)}
      faceDown={faceDown}
      tapped={entity.states.includes("rested")}
      rotateWhenTapped={false}
      effectiveRules={effectiveRules}
      keywords={entity.traits}
      hasSellTag={Boolean(entity.overlayBadges?.some((badge) => badge.label === "€$"))}
      cost={numberStat(entity, "Cost")}
      effectiveCost={numberStat(entity, "Cost")}
      power={numberStat(entity, "Power")}
      effectivePower={numberStat(entity, "Power")}
      disablePreview
      disableActionMenu
    />
  );
}

function cyberpunkCardTypeFromEntity(entity: SimulatorEntity): CyberpunkCardType | undefined {
  if (entity.face === "hidden") {
    return entity.backImageUrl?.includes("legend") ? "legend" : undefined;
  }

  if (entity.subtitle === "legend" || entity.kind === "leader") return "legend";
  if (entity.subtitle === "unit" || entity.kind === "unit") return "unit";
  if (entity.subtitle === "gear") return "gear";
  if (entity.subtitle === "program") return "program";

  const trait = entity.traits.find(
    (value): value is CyberpunkCardType =>
      value === "legend" || value === "unit" || value === "gear" || value === "program",
  );
  return trait;
}

function cyberpunkCardColorFromFrame(color: string | undefined): CyberpunkCardColor | undefined {
  switch (color?.toLowerCase()) {
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

function numberStat(entity: SimulatorEntity, label: string): number | null {
  const value = entity.stats.find((stat) => stat.label === label)?.value;
  if (value === undefined) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

export function cyberpunkImmediateSystemAudioCues(
  entry: CyberpunkRawEngineEventEntry,
  viewerSeatId: string,
): SimulatorAudioCueId[] {
  const cues: SimulatorAudioCueId[] = [];
  const seen = new Set<SimulatorAudioCueId>();
  const addCue = (cue: SimulatorAudioCueId) => {
    if (seen.has(cue)) {
      return;
    }
    seen.add(cue);
    cues.push(cue);
  };

  for (const event of entry.events) {
    if (event.type === "turnStarted") {
      addCue("turn.change");
    } else if (event.type === "gameEnded") {
      addCue(event.winnerId === viewerSeatId ? "game.win" : "game.loss");
    }
  }

  return cues;
}

function mergeResolvingProgramVisuals(
  current: readonly ResolvingProgramVisual[],
  incoming: readonly ResolvingProgramVisual[],
): ResolvingProgramVisual[] {
  const byKey = new Map(current.map((visual) => [resolvingProgramVisualKey(visual), visual]));
  for (const visual of incoming) {
    byKey.set(resolvingProgramVisualKey(visual), visual);
  }
  return [...byKey.values()];
}

function resolvingProgramVisualKey(visual: ResolvingProgramVisual): string {
  return `${visual.side}:${visual.cardId}`;
}

function resolvingProgramVisualsFromPlan(plan: AnimationPlanV1): ResolvingProgramVisual[] {
  return plan.steps.flatMap((step) => resolvingProgramEntryVisualFromStep(plan, step) ?? []);
}

function resolvingProgramCleanupVisualFromPlan(
  plan: AnimationPlanV1,
): ResolvingProgramVisual | null {
  const step = plan.steps.find(isResolvingProgramCleanupStep);
  if (step) {
    const side = sideFromCyberpunkAnchorId(step.to.id);
    return side
      ? {
          cardId: step.entity.id,
          side,
          face: step.destinationFace ?? "public",
          label: step.label,
        }
      : null;
  }
  const spotlight = plan.steps.find(isResolvingSpotlightStep);
  if (!spotlight) {
    return null;
  }
  const side = plan.actorId ? sideForPlayerId(plan.actorId) : null;
  return side
    ? {
        cardId: spotlight.entity.id,
        side,
        face: spotlight.sourceFace ?? "public",
        label: spotlight.label,
      }
    : null;
}

function resolvingProgramEntryVisualFromStep(
  plan: AnimationPlanV1,
  step: AnimationPlanStepV1,
): ResolvingProgramVisual | null {
  if (isResolvingProgramEntryStep(step)) {
    const side = sideFromCyberpunkAnchorId(step.from.id);
    return side
      ? {
          cardId: step.entity.id,
          side,
          face: step.destinationFace ?? "public",
          label: step.label,
        }
      : null;
  }
  if (isResolvingSpotlightStep(step)) {
    const side = plan.actorId ? sideForPlayerId(plan.actorId) : null;
    return side
      ? {
          cardId: step.entity.id,
          side,
          face: step.sourceFace ?? "public",
          label: step.label,
        }
      : null;
  }
  return null;
}

function isResolvingProgramEntryStep(step: AnimationPlanStepV1): step is Extract<
  AnimationPlanStepV1,
  { type: "moveEntity" }
> & {
  from: { id: string; kind: string };
  to: { id: string; kind: string };
} {
  return (
    step.type === "moveEntity" &&
    step.from?.kind === "zone" &&
    cyberpunkAnchorSuffix(step.from.id) === "hand" &&
    step.to?.kind === "anchor" &&
    step.to.id.startsWith("resolving-program:")
  );
}

function isResolvingProgramCleanupStep(step: AnimationPlanStepV1): step is Extract<
  AnimationPlanStepV1,
  { type: "moveEntity" }
> & {
  from: { id: string; kind: string };
  to: { id: string; kind: string };
} {
  return (
    step.type === "moveEntity" &&
    step.from?.kind === "anchor" &&
    step.from.id.startsWith("resolving-program:") &&
    step.to?.kind === "zone" &&
    cyberpunkAnchorSuffix(step.to.id) === "trash"
  );
}

function isResolvingSpotlightStep(step: AnimationPlanStepV1): step is Extract<
  AnimationPlanStepV1,
  { type: "spotlightEntity" }
> & {
  at: { id: string; kind: string };
} {
  return (
    step.type === "spotlightEntity" &&
    step.at.kind === "anchor" &&
    step.at.id.startsWith("resolving-program:")
  );
}

function pendingEffectSourceProgramCardIdFromState(matchState: CyberpunkMatchState): string | null {
  const choice = matchState.G.turnMetadata.pendingChoice;
  if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
    return null;
  }
  const sourceCardId = choice.payload.sourceCardId;
  if (!sourceCardId) {
    return null;
  }
  const sourceCard = matchState.G.cardIndex[String(sourceCardId)];
  return sourceCard && defOf(sourceCard).type === "program" ? String(sourceCardId) : null;
}

function stagedEffectSourceCardIdsFromEntry(
  entry: CyberpunkRawEngineEventEntry,
  matchState: CyberpunkMatchState,
): ReadonlySet<string> {
  const staged = new Set<string>();
  for (const step of entry.animationScript.steps) {
    if (step.kind !== "effectTarget") {
      continue;
    }
    const sourceCardId = String(step.sourceCardId);
    const sourceCard = matchState.G.cardIndex[sourceCardId];
    if (!sourceCard) {
      continue;
    }
    const def = defOf(sourceCard);
    if (def.type === "gear" || def.type === "legend" || triggerLabelForCard(sourceCard)) {
      staged.add(sourceCardId);
    }
  }
  return staged;
}

export function stagedEffectSourceLabelsFromEntry(
  entry: CyberpunkRawEngineEventEntry,
  matchState: CyberpunkMatchState,
): ReadonlyMap<string, string> {
  const labels = new Map<string, string>();
  const triggeredLabels = triggeredEffectLabelsFromEntry(entry);
  for (const step of entry.animationScript.steps) {
    if (step.kind !== "effectTarget") {
      continue;
    }
    const sourceCardId = String(step.sourceCardId);
    const triggeredLabel = triggeredLabels.get(sourceCardId);
    if (triggeredLabel) {
      labels.set(sourceCardId, triggeredLabel);
      continue;
    }
    const sourceCard = matchState.G.cardIndex[sourceCardId];
    if (!sourceCard) {
      continue;
    }
    const triggerLabel = triggerLabelForCard(sourceCard);
    if (triggerLabel) {
      labels.set(sourceCardId, triggerLabel.toUpperCase());
      continue;
    }
    const stagedLabel = stagedEffectSourceLabelForCard(sourceCard);
    if (stagedLabel) {
      labels.set(sourceCardId, stagedLabel);
    }
  }
  return labels;
}

function stagedEffectSourceLabelForCard(
  card: NonNullable<CyberpunkMatchState["G"]["cardIndex"][string]>,
): string | null {
  switch (defOf(card).type) {
    case "gear":
      return "Gear ability";
    case "legend":
      return "Legend ability";
    case "unit":
      return "Unit ability";
    default:
      return null;
  }
}

function triggeredEffectLabelsFromEntry(
  entry: CyberpunkRawEngineEventEntry,
): ReadonlyMap<string, string> {
  const labels = new Map<string, string>();
  for (const event of entry.events) {
    if (event.type !== "effectTriggered") {
      continue;
    }
    const label = triggerLabelForEffectType(event.effectType);
    if (label) {
      labels.set(String(event.sourceCardId), label.toUpperCase());
    }
  }
  return labels;
}

function triggerLabelForCard(
  card: NonNullable<CyberpunkMatchState["G"]["cardIndex"][string]>,
): string | null {
  const trigger = defOf(card).abilities.find((ability: Ability) => ability.kind === "triggered")
    ?.trigger?.trigger;
  return triggerLabelForEffectType(trigger);
}

function triggerLabelForEffectType(trigger: string | undefined): string | null {
  switch (trigger) {
    case "play":
      return "Play trigger";
    case "attack":
      return "Attack trigger";
    case "call":
    case "flip":
      return "Call trigger";
    case "defeated":
      return "Defeated trigger";
    default:
      return null;
  }
}

function animationPlanSummary(plan: AnimationPlanV1): string {
  return `${plan.id}:${plan.steps
    .map(
      (step) =>
        `${step.id}:${step.type}:delay=${step.delayMs ?? 0}:duration=${step.durationMs ?? 0}`,
    )
    .join("|")}`;
}

const CYBERPUNK_CARD_ZONE_BY_ANCHOR_SUFFIX: Record<string, CardZone> = {
  deck: "deck",
  hand: "hand",
  field: "field",
  trash: "trash",
  legendArea: "legendArea",
  eddieArea: "eddieArea",
  gigArea: "gigArea",
};

function cyberpunkAnimationZoneResolver(ref: AnimationZoneRef): SimulatorZone | null {
  const side = sideForCyberpunkAnimationRef(ref);
  const ownerId = ref.ownerId ?? (side ? String(PLAYER_SIDE_TO_ID[side]) : undefined);
  const suffix = cyberpunkAnchorSuffix(ref.id);
  const cardZone = suffix ? CYBERPUNK_CARD_ZONE_BY_ANCHOR_SUFFIX[suffix] : undefined;
  if (side && cardZone) {
    return cyberpunkCardZoneToSimulatorZone(cardZone, side);
  }
  if (suffix === "fixer" || suffix === "program-limbo") {
    return {
      id: ref.id,
      label: suffix === "fixer" ? "Fixer dice" : "Resolving Program",
      role: "custom",
      ownerId,
      visibility: "public",
      entityIds: [],
      hint: suffix === "fixer" ? "Fixer dice" : "Program being resolved",
      layoutHint: "stack",
    };
  }
  return {
    id: ref.id,
    label: ref.id,
    role: "custom",
    ownerId,
    visibility: "public",
    entityIds: [],
    hint: ref.id,
  };
}

function cyberpunkCardSuppressionDelayMs(overlay: {
  fromRef?: { kind: string; id: string };
  toRef?: { kind: string; id: string };
  delayMs: number;
}): number {
  if (
    ((overlay.fromRef?.kind === "zone" &&
      cyberpunkAnchorSuffix(overlay.fromRef.id) === "program-limbo") ||
      (overlay.fromRef?.kind === "anchor" &&
        overlay.fromRef.id.startsWith("resolving-program:"))) &&
    overlay.toRef?.kind === "zone" &&
    cyberpunkAnchorSuffix(overlay.toRef.id) === "trash"
  ) {
    return overlay.delayMs;
  }
  return 0;
}

function sideForCyberpunkAnimationRef(ref: AnimationZoneRef): Side | null {
  return sideForPlayerId(ref.ownerId) ?? sideFromCyberpunkAnchorId(ref.id);
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
