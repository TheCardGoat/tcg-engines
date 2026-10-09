import {
  defOf,
  type AnimationScript,
  type AnimationStep,
  type MatchState,
} from "@tcg/cyberpunk-engine";
import {
  AnimationPlanV2Schema,
  type AnimationPlanV2,
  type AnimationRef,
  type AnimationStepV2,
} from "@tcg/protocol";

const PLAYER_SIDE_BY_ID = new Map<string, "player" | "opponent">([
  ["p1", "player"],
  ["p2", "opponent"],
]);

const CARD_ZONES = new Set([
  "field",
  "hand",
  "deck",
  "trash",
  "legendArea",
  "gigArea",
  "eddieArea",
  "removedFromGame",
]);
const PRIVATE_ZONES = new Set(["hand", "deck", "legendArea", "eddieArea"]);

/**
 * One script→plan transform for live and practice. Emits transfers, in-place
 * spend/ready and Call Legend face flips, Eddie/Gig value deltas, resolved
 * fight impacts, and turn announcements. Longer-lived combat intent remains a
 * projected board concern; this plan only carries the brief resolution beat.
 */
export function cyberpunkAnimationPlan(
  id: string,
  script: AnimationScript,
): AnimationPlanV2 | null {
  const steps = script.steps.flatMap((step) => mapStep(step));
  if (steps.length === 0) return null;
  return AnimationPlanV2Schema.parse({ id, version: 2, steps });
}

/**
 * Server plans carry engine-native zones and conservative hidden faces.
 * Normalize them at the viewer boundary where rendered zone ids and
 * private-zone visibility are known.
 */
export function projectCyberpunkAuthoritativeAnimationPlan(
  plan: AnimationPlanV2,
  viewerSeatId: string | null,
  state?: MatchState,
): AnimationPlanV2 {
  return AnimationPlanV2Schema.parse({
    ...plan,
    steps: plan.steps.map((step) => {
      if (step.type === "entityTransfer") {
        const reveal = projectReveal(step.reveal, viewerSeatId, state);
        const source = projectCyberpunkZoneEndpoint(step.from, viewerSeatId);
        const destination = projectCyberpunkZoneEndpoint(step.to, viewerSeatId);
        const returnsPublicCardToHand =
          step.from?.kind === "zone" &&
          (step.from.id === "field" || step.from.id === "trash") &&
          step.to?.kind === "zone" &&
          step.to.id === "hand";
        return {
          ...step,
          ...(reveal ? { reveal } : {}),
          entity:
            reveal?.kind === "hidden"
              ? entityRef(`hidden-reveal:${plan.id}:${step.id}`)
              : step.entity,
          ...(source.ref ? { from: source.ref } : { from: undefined }),
          ...(destination.ref ? { to: destination.ref } : { to: undefined }),
          sourceFace:
            step.from?.kind === "zone" && step.from.id === "legendArea"
              ? step.sourceFace
              : (source.face ?? step.sourceFace),
          destinationFace:
            reveal?.kind === "card" && !(step.to?.kind === "zone" && step.to.id === "deck")
              ? "public"
              : returnsPublicCardToHand
                ? "public"
                : step.to?.kind === "zone" && step.to.id === "legendArea"
                  ? step.destinationFace
                  : (destination.face ?? step.destinationFace),
        };
      }
      if (step.type === "valueDelta") {
        const subject = projectCyberpunkZoneEndpoint(step.subject, viewerSeatId);
        return subject.ref ? { ...step, subject: subject.ref } : step;
      }
      if (step.type === "randomization") {
        const at = projectCyberpunkZoneEndpoint(step.at, viewerSeatId);
        return at.ref ? { ...step, at: at.ref } : step;
      }
      if (step.type === "emphasize") {
        const reveal = projectReveal(step.reveal, viewerSeatId, state);
        const at = projectCyberpunkZoneEndpoint(step.at, viewerSeatId);
        const source = projectRevealSource(step, state);
        const actorSide = projectRevealActorSide(step, viewerSeatId, state);
        return at.ref
          ? {
              ...step,
              at: at.ref,
              ...(reveal ? { reveal } : {}),
              ...source,
              ...(actorSide ? { actorSide } : {}),
            }
          : step;
      }
      if (step.type === "effect" && step.sourceExitTo) {
        const destination = projectCyberpunkZoneEndpoint(step.sourceExitTo, viewerSeatId);
        return destination.ref ? { ...step, sourceExitTo: destination.ref } : step;
      }
      if (step.type === "combat") {
        const target = projectCyberpunkZoneEndpoint(step.target, viewerSeatId);
        return target.ref ? { ...step, target: target.ref } : step;
      }
      return step;
    }),
  });
}

function mapStep(step: AnimationStep): AnimationStepV2[] {
  const base = {
    id: step.id,
    startAtMs: step.startMs,
    durationMs: step.durationMs,
  };
  switch (step.kind) {
    case "actionEmphasis":
      return [
        {
          ...base,
          type: "emphasize",
          at:
            step.target.kind === "card"
              ? entityRef(step.target.cardId)
              : zoneRef(step.target.zone, step.target.playerId),
          style: "pulse",
          tone: step.tone,
          ...(step.label ? { label: step.label } : {}),
        },
      ];
    case "cardMove":
    case "cardExit": {
      const fromHostId = "fromHostId" in step ? step.fromHostId : undefined;
      const resolvingEffect = step.kind === "cardMove" && step.presentation === "resolving-effect";
      const resolvedEffect = step.kind === "cardMove" && step.presentation === "resolved-effect";
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: resolvingEffect
            ? zoneRef(step.fromZone, step.playerId)
            : resolvedEffect
              ? resolvingEffectAnchorRef(step.cardId)
              : fromHostId
                ? entityRef(step.cardId)
                : zoneRef(step.fromZone, step.playerId),
          to: resolvingEffect
            ? resolvingEffectAnchorRef(step.cardId)
            : zoneRef(step.toZone, step.playerId),
          sourceFace: resolvedEffect
            ? "public"
            : fromHostId
              ? "public"
              : (("sourceFace" in step ? step.sourceFace : undefined) ?? zoneFace(step.fromZone)),
          destinationFace: resolvingEffect
            ? "public"
            : (("destinationFace" in step ? step.destinationFace : undefined) ??
              zoneFace(step.toZone)),
          ...(step.kind === "cardMove" && !resolvingEffect && step.deckPlacement === "bottom"
            ? { destinationPresentation: "underlay" as const }
            : {}),
          // Exits that share a plan with earlier beats (a blocked fight plays
          // redirect + impact before the defeat) must stay visible at their
          // source until their own step starts instead of vanishing when the
          // presentation state advances to the command's end state.
          ...(step.kind === "cardExit" ? { sourcePresentation: "hold" as const } : {}),
          audioCue: resolvingEffect
            ? "card.play"
            : step.kind === "cardExit" && step.exitReason === "defeated"
              ? "card.destroy"
              : step.toZone === "trash"
                ? "card.discard"
                : "card.move",
        },
      ];
    }
    case "cardEnter":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: zoneRef("deck", step.playerId),
          to: zoneRef(step.toZone, step.playerId),
          sourceFace: zoneFace("deck"),
          destinationFace: zoneFace(step.toZone),
          audioCue:
            step.reason === "cardsDrawn" && step.toZone === "hand" ? "card.draw" : "card.move",
        },
      ];
    case "cardAttach":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.gearId),
          from: zoneRef("hand", step.playerId),
          to: entityRef(step.hostId),
          sourceFace: zoneFace("hand"),
          destinationFace: "public",
          // The host stays mounted while the gear clone flies onto it; only the
          // gear's own hand slot is suppressed behind the flying clone.
          destinationPresentation: "overlay",
          audioCue: "card.move",
        },
      ];
    case "cardReveal": {
      const reveal = {
        kind: "card" as const,
        cardId: String(step.cardId),
        audience:
          step.audience === "public"
            ? ({ kind: "all" } as const)
            : step.viewerIds && step.viewerIds.length > 1
              ? ({ kind: "players", ids: step.viewerIds.map(String) } as const)
              : ({ kind: "player", id: String(step.viewerId) } as const),
      };
      if (!step.toZone) {
        // The card remains in its zone. Deck reveals also use this marker for
        // a centered visual; card identity stays in the viewer-safe projection.
        return [
          {
            ...base,
            type: "emphasize",
            at: zoneRef(step.fromZone, step.ownerId),
            style: "spotlight",
            tone: "neutral",
            reveal,
            ...(step.sourceCardId ? { sourceCardId: String(step.sourceCardId) } : {}),
            audioCue: "card.reveal",
          },
        ];
      }
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.cardId),
          from: zoneRef(step.fromZone, step.ownerId),
          to: zoneRef(step.toZone, step.ownerId),
          sourceFace: zoneFace(step.fromZone),
          destinationFace: zoneFace(step.toZone),
          ...(step.toZone === "deck" && step.deckPlacement === "bottom"
            ? { destinationPresentation: "underlay" as const }
            : {}),
          audioCue: step.toZone === "trash" ? "card.discard" : "card.move",
          reveal,
        },
      ];
    }
    case "legendReveal":
      return [
        {
          ...base,
          type: "entityStateChange",
          entity: entityRef(step.cardId),
          at: entityRef(step.cardId),
          change: "face",
          sourceFace: "hidden",
          destinationFace: "public",
          ...(step.fromRotationDeg !== undefined ? { fromRotationDeg: step.fromRotationDeg } : {}),
          ...(step.toRotationDeg !== undefined ? { toRotationDeg: step.toRotationDeg } : {}),
          audioCue: "card.reveal",
        },
      ];
    case "gigMove":
      return [
        {
          ...base,
          type: "entityTransfer",
          entity: entityRef(step.dieId),
          from: gigZoneRef(step.from, step.fromPlayerId),
          to: gigZoneRef(step.to, step.toPlayerId),
          sourceFace: "public",
          destinationFace: "public",
          audioCue: step.moveKind === "steal" ? "resource.steal" : "resource.gain",
        },
      ];
    case "phaseChange":
      return [
        {
          ...base,
          type: "phaseChange",
          from: step.from,
          to: step.to,
          variant: step.variant ?? "phase",
          ...(step.turnPlayerId
            ? { player: { kind: "player" as const, id: String(step.turnPlayerId) } }
            : {}),
          ...(step.turnNumber ? { turnNumber: step.turnNumber } : {}),
          audioCue: "turn.change",
        },
      ];
    case "entityStateChange":
      return [
        {
          ...base,
          type: "entityStateChange",
          entity: entityRef(step.cardId),
          at: entityRef(step.cardId),
          change: "orientation",
          sourceFace: "public",
          destinationFace: "public",
          fromRotationDeg: step.change === "spent" ? 0 : 90,
          toRotationDeg: step.change === "spent" ? 90 : 0,
          audioCue: step.change === "spent" ? "resource.spend" : "card.move",
        },
      ];
    case "resourceFloat":
      if (step.resource === "gig") {
        if (!step.dieId) return [];
        return [
          {
            ...base,
            type: "valueDelta",
            subject: entityRef(step.dieId),
            delta: step.delta,
            label: "GIG",
            ...(step.previousValue !== undefined ? { fromValue: step.previousValue } : {}),
            ...(step.newValue !== undefined ? { toValue: step.newValue } : {}),
            audioCue: step.delta < 0 ? "resource.spend" : "resource.gain",
          },
        ];
      }
      return [
        {
          ...base,
          type: "valueDelta",
          subject: zoneRef("eddieArea", step.playerId),
          delta: step.delta,
          label: "EDDIES",
          audioCue: step.delta < 0 ? "resource.spend" : "resource.gain",
        },
      ];
    case "effectTarget":
      return [
        {
          ...base,
          type: "effect",
          source:
            step.presentation === "resolving-program"
              ? resolvingEffectAnchorRef(step.sourceCardId)
              : entityRef(step.sourceCardId),
          targets: step.targets.map(effectTargetRef),
          showText: false,
          ...(step.label ? { label: step.label } : {}),
          ...(step.tone ? { tone: step.tone } : {}),
          ...(step.presentation === "source-card"
            ? { presentation: step.presentation, sourceFace: "public" as const }
            : {}),
          ...(step.sourceExit
            ? { sourceExitTo: zoneRef(step.sourceExit.zone, step.sourceExit.playerId) }
            : {}),
          audioCue: "effect.trigger",
        },
      ];
    case "combat":
      return [
        {
          ...base,
          type: "combat",
          source: entityRef(step.attackerId),
          target: step.defenderId
            ? entityRef(step.defenderId)
            : gigZoneRef("gigArea", step.rivalId),
          reason: step.reason === "attackResolved" ? "resolved" : "declared",
          attackKind: step.attackKind,
          label: step.reason === "attackResolved" ? "RESULT" : "ATTACK",
          sourceStatus:
            step.reason === "attackResolved"
              ? combatParticipantStatus(step, "attacker")
              : "ATTACKER",
          targetStatus:
            step.reason === "attackResolved"
              ? combatParticipantStatus(step, "defender")
              : step.defenderId
                ? "DEFENDER"
                : "RIVAL GIGS",
          showText: true,
          ...(step.defeatedCardIds?.length
            ? { defeatedCardIds: step.defeatedCardIds.map((cardId) => String(cardId)) }
            : {}),
        },
      ];
    case "randomization":
      return [
        {
          ...base,
          type: "randomization",
          at: zoneRef(step.zone, step.playerId),
          kind: "shuffle",
          audioCue: "deck.shuffle",
        },
      ];
    case "combatRedirect":
      return [
        {
          ...base,
          type: "combat",
          source: entityRef(step.attackerId),
          target: entityRef(step.blockerId),
          reason: "blocked",
          label: "BLOCKED",
          sourceStatus: "ATTACKER",
          targetStatus: "BLOCKER",
          showText: true,
        },
      ];
    case "cardLand":
    case "gameResult":
      return [];
  }
}

function combatParticipantStatus(
  step: Extract<AnimationStep, { kind: "combat" }>,
  participant: "attacker" | "defender",
): string {
  if (isPrevented(step, participant === "attacker" ? step.attackerId : step.defenderId)) {
    return "DEFEAT PREVENTED";
  }
  switch (step.result) {
    case "attackerWins":
      return participant === "attacker"
        ? defeated(step, step.attackerId)
          ? "WINS · DEFEATED"
          : "WINS FIGHT"
        : defeated(step, step.defenderId)
          ? "DEFEATED"
          : "LOSES FIGHT";
    case "defenderWins":
      return participant === "defender"
        ? defeated(step, step.defenderId)
          ? "WINS · DEFEATED"
          : "WINS FIGHT"
        : defeated(step, step.attackerId)
          ? "DEFEATED"
          : "LOSES FIGHT";
    case "mutual":
      return defeated(step, participant === "attacker" ? step.attackerId : step.defenderId)
        ? "LOSES · DEFEATED"
        : "LOSES FIGHT";
    case "gigsStolen":
      return participant === "attacker"
        ? `STEALS ${step.gigsStolen ?? 0} GIG${step.gigsStolen === 1 ? "" : "S"}`
        : `${step.gigsStolen ?? 0} GIG${step.gigsStolen === 1 ? "" : "S"} LOST`;
    case "blocked":
      return participant === "attacker" ? "ATTACK BLOCKED" : "BLOCKER";
    default:
      return participant === "attacker" ? "ATTACKER" : "DEFENDER";
  }
}

function defeated(
  step: Extract<AnimationStep, { kind: "combat" }>,
  cardId: string | null,
): boolean {
  return (
    cardId !== null &&
    (step.defeatedCardIds ?? []).some((defeatedId) => String(defeatedId) === cardId)
  );
}

function isPrevented(
  step: Extract<AnimationStep, { kind: "combat" }>,
  cardId: string | null,
): boolean {
  return (
    cardId !== null &&
    (step.preventedCardIds ?? []).some((preventedId) => String(preventedId) === cardId)
  );
}

function projectReveal(
  reveal: Extract<AnimationStepV2, { type: "emphasize" | "entityTransfer" }>["reveal"],
  viewerSeatId: string | null,
  state?: MatchState,
): Extract<AnimationStepV2, { type: "emphasize" | "entityTransfer" }>["reveal"] {
  if (!reveal || reveal.kind === "hidden") return reveal;
  if (reveal.audience.kind === "player" && reveal.audience.id !== viewerSeatId) {
    return { kind: "hidden" };
  }
  if (
    reveal.audience.kind === "players" &&
    (viewerSeatId === null || !reveal.audience.ids.includes(viewerSeatId))
  ) {
    return { kind: "hidden" };
  }
  const card = state?.G.cardIndex[reveal.cardId];
  if (!card) return reveal;
  const definition = defOf(card);
  return {
    ...reveal,
    title: definition.displayName ?? definition.name,
    imageUrl: definition.imageUrl,
  };
}

/**
 * Resolve the ability card behind a reveal emphasis into caption-ready text
 * and art. The source card is public information — attach it regardless of
 * the revealed identities' audience so every viewer learns why the reveal
 * is happening.
 */
function projectRevealSource(
  step: Extract<AnimationStepV2, { type: "emphasize" }>,
  state?: MatchState,
): { sourceTitle?: string; sourceImageUrl?: string } {
  if (!step.sourceCardId || step.sourceTitle) return {};
  const card = state?.G.cardIndex[step.sourceCardId];
  if (!card) return {};
  const definition = defOf(card);
  return {
    sourceTitle: definition.displayName ?? definition.name,
    ...(definition.imageUrl ? { sourceImageUrl: definition.imageUrl } : {}),
  };
}

/**
 * Resolve who is acting behind a reveal emphasis — the source card's
 * controller — into a viewer-relative side, so a bystander caption can say
 * "Your Rival is looking…" instead of an ownerless sentence. Absent when the
 * actor cannot be proven (no source card, no state, unknown seat).
 */
function projectRevealActorSide(
  step: Extract<AnimationStepV2, { type: "emphasize" }>,
  viewerSeatId: string | null,
  state?: MatchState,
): "player" | "opponent" | undefined {
  if (!step.sourceCardId) return undefined;
  const actorSide = PLAYER_SIDE_BY_ID.get(
    String(state?.G.cardIndex[step.sourceCardId]?.controllerId ?? ""),
  );
  if (!actorSide) return undefined;
  const viewerSide = viewerSeatId
    ? (PLAYER_SIDE_BY_ID.get(viewerSeatId) ?? "player")
    : // No viewer seat (observer): fall back to the p1-as-player convention
      // the zone projection uses.
      "player";
  return actorSide === viewerSide ? "player" : "opponent";
}

function projectCyberpunkZoneEndpoint(
  ref: AnimationRef | undefined,
  viewerSeatId: string | null,
): { ref: AnimationRef | undefined; face: "public" | "hidden" | null } {
  if (!ref || ref.kind !== "zone") {
    return { ref, face: null };
  }
  const side = PLAYER_SIDE_BY_ID.get(ref.ownerId ?? "");
  if (!side) return { ref, face: null };
  const isLocal = viewerSeatId ? ref.ownerId === viewerSeatId : side === "player";
  if (ref.id === "fixerArea") {
    return {
      ref: {
        kind: "zone",
        id: isLocal ? "p-fixer" : "opp-fixer",
        ownerId: ref.ownerId ?? "",
      },
      face: "public",
    };
  }
  if (!CARD_ZONES.has(ref.id)) {
    return { ref, face: null };
  }
  const zone = ref.id;
  const prefix = isLocal ? "p" : "opp";
  const renderedId =
    zone === "eddieArea"
      ? `${prefix}-eddieArea`
      : zone === "gigArea"
        ? `${prefix}-gigArea`
        : `${prefix}-${zone}`;
  return {
    ref: { kind: "zone", id: renderedId, ownerId: ref.ownerId ?? "" },
    face: viewerSafeFace(zone, side, viewerSeatId),
  };
}

function viewerSafeFace(
  zone: string,
  side: "player" | "opponent",
  viewerSeatId: string | null,
): "public" | "hidden" {
  if (zone === "deck" || zone === "legendArea") return "hidden";
  if (zone !== "hand" && zone !== "eddieArea") return "public";
  return (side === "player" ? "p1" : "p2") === viewerSeatId ? "public" : "hidden";
}

function zoneFace(zone: string): "public" | "hidden" {
  return PRIVATE_ZONES.has(zone) ? "hidden" : "public";
}

function entityRef(id: string): { kind: "entity"; id: string } {
  return { kind: "entity", id: String(id) };
}

function resolvingEffectAnchorRef(id: string): { kind: "anchor"; id: string } {
  return { kind: "anchor", id: `resolving-program:${String(id)}` };
}

function effectTargetRef(
  target: Extract<AnimationStep, { kind: "effectTarget" }>["targets"][number],
): AnimationRef {
  switch (target.kind) {
    case "card":
      return entityRef(target.cardId);
    case "gig":
      return entityRef(target.dieId);
    case "player":
      return { kind: "player", id: String(target.playerId) };
  }
}

function zoneRef(zone: string, playerId: string): { kind: "zone"; id: string; ownerId: string } {
  return { kind: "zone", id: zone, ownerId: String(playerId) };
}

function gigZoneRef(
  zone: "fixerArea" | "gigArea",
  playerId: string,
): { kind: "zone"; id: string; ownerId: string } {
  return { kind: "zone", id: zone, ownerId: String(playerId) };
}
