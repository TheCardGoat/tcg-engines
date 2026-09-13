import type { AnimationPlanV2, SimulatorAudioCueId } from "@tcg/protocol";
import type { SimulatorEntity } from "@tcg/simulator-contract";
import type { SimulatorExternalCommandGate } from "@tcg/simulator-runtime/animation";
import {
  AnimationInteractionBoundary,
  createSimulatorAnimationScope,
  type SimulatorEntityVisualProps,
} from "@tcg/simulator-ui";
import { defOf } from "@tcg/cyberpunk-engine";
import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";

import { EFFECT_RESULT_HOLD_MS_BY_PACING } from "../../../simulator/gameConfig";
import { useSimulatorAudio } from "../../../simulator/audio";
import { Card } from "../components/GameBoard/Card";
import {
  PLAYER_SIDE_TO_ID,
  useEngine,
  useUserConfig,
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
  const { animationPacing } = useUserConfig();
  const { cancelScheduledCues, scheduleAnimationSteps } = useSimulatorAudio();
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);
  const projection = useMemo(
    () => ({
      getEntity: (state: CyberpunkMatchState, entityId: string, _face: "public" | "hidden") =>
        projectEntityForAnimationEntity(entityId, state, humanSide),
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
      viewerSeatId={viewerSeatId}
      animationSpeed={
        animationPacing === "fast" ? "fast" : animationPacing === "cinematic" ? "slow" : "normal"
      }
      onScheduleAudio={scheduleAnimationSteps}
      onCancelAudio={cancelScheduledCues}
    >
      <CyberpunkAnimationBridge commandGate={commandGate}>{children}</CyberpunkAnimationBridge>
    </CyberpunkAnimation.Root>
  );
}

function CyberpunkAnimationBridge({
  children,
  commandGate,
}: {
  readonly children: ReactNode;
  readonly commandGate: SimulatorExternalCommandGate;
}) {
  const { humanSide, matchState, rawEngineEvents } = useEngine();
  const { animationPacing } = useUserConfig();
  const { enqueue, replaceFromSync } = CyberpunkAnimation.useActions();
  const snapshot = CyberpunkAnimation.useState();
  const status = CyberpunkAnimation.useStatus();
  const { playCue } = useSimulatorAudio();
  const processedRawEntryIdsRef = useRef<Set<number> | null>(null);
  const viewerSeatId = String(PLAYER_SIDE_TO_ID[humanSide]);

  useEffect(() => {
    commandGate.setBlocked(status.isAnimating);
    return () => commandGate.setBlocked(false);
  }, [commandGate, status.isAnimating]);

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
            pendingEffectSourceCardId: pendingEffectSourceProgramCardIdFromState(toState),
            resolvingProgramSourceCardId: entry.beforeState
              ? pendingEffectSourceProgramCardIdFromState(entry.beforeState)
              : null,
            stagedEffectSourceCardIds: stagedEffectSourceCardIdsFromEntry(entry, toState),
            stagedEffectSourceLabels: stagedEffectSourceLabelsFromEntry(entry, toState),
            resultHoldMs: EFFECT_RESULT_HOLD_MS_BY_PACING[animationPacing],
          });
      enqueue({
        state: toState,
        version: entry.stateID,
        plan: plans[0] ?? null,
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
    animationPacing,
    enqueue,
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
    <ResolvingProgramVisualsContext.Provider value={resolvingVisuals}>
      <AnimationInteractionBoundary active={status.isAnimating}>
        <EnginePresentationStateProvider
          state={snapshot.presentationState ?? snapshot.authoritativeState!}
        >
          {children}
        </EnginePresentationStateProvider>
      </AnimationInteractionBoundary>
    </ResolvingProgramVisualsContext.Provider>
  );
}

function CyberpunkEntityVisual({
  entity,
  density,
  className,
  presentation,
}: SimulatorEntityVisualProps) {
  const printedCost = numericStat(entity, "Cost");
  const effectiveCost = numericStat(entity, "Effective Cost") ?? printedCost;
  const printedPower = numericStat(entity, "Power");
  const effectivePower = numericStat(entity, "Effective Power") ?? printedPower;
  const effectiveRules = (entity.decorations ?? []).flatMap((decoration) =>
    decoration.content.kind === "icon" && isEffectiveRule(decoration.content.token)
      ? [decoration.content.token]
      : [],
  );
  return (
    <div className={[cyberpunkCardSizeClass(density), className].filter(Boolean).join(" ")}>
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

function pendingEffectSourceProgramCardIdFromState(matchState: CyberpunkMatchState): string | null {
  const choice = matchState.G.turnMetadata.pendingChoice;
  if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") return null;
  const sourceCardId = choice.payload.sourceCardId;
  if (!sourceCardId) return null;
  const sourceCard = matchState.G.cardIndex[String(sourceCardId)];
  return sourceCard && defOf(sourceCard).type === "program" ? String(sourceCardId) : null;
}

function stagedEffectSourceCardIdsFromEntry(
  entry: CyberpunkRawEngineEventEntry,
  matchState: CyberpunkMatchState,
): ReadonlySet<string> {
  const ids = new Set<string>();
  for (const step of entry.animationScript.steps) {
    if (step.kind !== "effectTarget") continue;
    const card = matchState.G.cardIndex[String(step.sourceCardId)];
    if (!card) continue;
    const definition = defOf(card);
    if (definition.type === "gear" || definition.type === "legend" || triggerLabelForCard(card)) {
      ids.add(String(step.sourceCardId));
    }
  }
  return ids;
}

export function stagedEffectSourceLabelsFromEntry(
  entry: CyberpunkRawEngineEventEntry,
  matchState: CyberpunkMatchState,
): ReadonlyMap<string, string> {
  const labels = new Map<string, string>();
  for (const step of entry.animationScript.steps) {
    if (step.kind !== "effectTarget") continue;
    const card = matchState.G.cardIndex[String(step.sourceCardId)];
    if (!card) continue;
    const label =
      triggerLabelForCard(card) ??
      (defOf(card).type === "gear"
        ? "Gear ability"
        : defOf(card).type === "legend"
          ? "Legend ability"
          : null);
    if (label) labels.set(String(step.sourceCardId), label.toUpperCase());
  }
  return labels;
}

function triggerLabelForCard(
  card: NonNullable<CyberpunkMatchState["G"]["cardIndex"][string]>,
): string | null {
  const trigger = defOf(card).abilities.find((ability) => ability.kind === "triggered")?.trigger
    ?.trigger;
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
