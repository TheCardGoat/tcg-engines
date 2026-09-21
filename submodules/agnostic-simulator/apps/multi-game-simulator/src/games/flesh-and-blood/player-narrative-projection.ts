import type {
  SimulatorCardReference,
  SimulatorEventLogEntry,
  SimulatorMatchHistoryDetail,
  SimulatorMatchHistoryMetric,
  SimulatorMatchHistoryRow,
} from "@tcg/simulator-contract";
import {
  FAB_LOG_KEY_NARRATIVE_ROLES,
  type FabLogActorLabelUsage,
  type FabLogCategory,
  type FabLogNarrativeRole,
} from "@tcg/flesh-and-blood-engine/log";
import {
  renderFabPlayerLogMessage,
  type FabPlayerLogActorLabel,
  type FabPlayerLogMessage,
  type FabVisiblePlayerLog,
} from "@tcg/flesh-and-blood-engine/simulator";

function tagsFor(category: FabLogCategory): SimulatorEventLogEntry["tags"] {
  switch (category) {
    case "action":
      return ["move"];
    case "combat":
      return ["combat"];
    case "ability":
      return ["ability"];
    case "rules":
    case "system":
      return ["system"];
  }
}

function actorLabelFor(viewerId: string, seatIds: readonly string[]): FabPlayerLogActorLabel {
  return (actorId: string, usage: FabLogActorLabelUsage): string | undefined => {
    if (!seatIds.includes(actorId)) return undefined;
    const isViewer = actorId === viewerId;
    if (usage === "possessive") return isViewer ? "Your" : "Opponent's";
    if (usage === "possessive-lower") return isViewer ? "your" : "opponent's";
    return isViewer ? "You" : "Opponent";
  };
}

function cardReferences(message: FabPlayerLogMessage): SimulatorCardReference[] | undefined {
  if (!message.cardRefs || message.cardRefs.length === 0) return undefined;
  return message.cardRefs.map((card) => ({
    name: card.name,
    entityId: card.instanceId,
    ...(card.canonicalId ? { definitionId: card.canonicalId } : {}),
  }));
}

function subjectId(message: FabPlayerLogMessage, fallback: string): string {
  const values = message.values as Readonly<Record<string, unknown>>;
  return typeof values.actorId === "string"
    ? values.actorId
    : typeof values.playerId === "string"
      ? values.playerId
      : fallback;
}

function historyKind(message: FabPlayerLogMessage): SimulatorMatchHistoryRow["kind"] {
  if (FAB_LOG_KEY_NARRATIVE_ROLES[message.key] === "outcome") return "outcome";
  return message.category === "combat" ? "combat" : "activity";
}

function historyMetrics(message: FabPlayerLogMessage): SimulatorMatchHistoryMetric[] | undefined {
  switch (message.metrics?.kind) {
    case "attack":
      return [{ kind: "value", label: "Attack", value: message.metrics.attack }];
    case "defense":
      return [{ kind: "value", label: "Defense", value: message.metrics.defense }];
    case "combat-outcome":
      return [
        {
          kind: "comparison",
          leftLabel: "Attack",
          left: message.metrics.attack,
          rightLabel: "Defense",
          right: message.metrics.defense,
        },
      ];
    default:
      return undefined;
  }
}

function receiptSubjectId(message: FabPlayerLogMessage, log: FabVisiblePlayerLog): string {
  const fallback = message.metrics?.kind === "combat-outcome" ? log.turnPlayerId : log.actorId;
  return subjectId(message, fallback);
}

type FabPaymentPitchMessage = Extract<
  FabPlayerLogMessage,
  { readonly key: "flesh-and-blood.pitch" }
>;

function isPaymentPitch(message: FabPlayerLogMessage): message is FabPaymentPitchMessage {
  return message.key === "flesh-and-blood.pitch";
}

/** Per-message provenance overrides the static key table (engine event causes). */
function narrativeRoleFor(message: FabPlayerLogMessage): FabLogNarrativeRole {
  return message.narrativeRole ?? FAB_LOG_KEY_NARRATIVE_ROLES[message.key];
}

/** The paid-activity family: play and activation variants, zone-qualified or targeted. */
function isPaidActivity(message: FabPlayerLogMessage): boolean {
  return (
    message.key === "flesh-and-blood.play" ||
    message.key === "flesh-and-blood.play.from-zone" ||
    message.key === "flesh-and-blood.activate" ||
    message.key === "flesh-and-blood.activate.targeting"
  );
}

function historyTitle(message: FabPlayerLogMessage, actorLabel: FabPlayerLogActorLabel): string {
  return renderFabPlayerLogMessage(message, { actorLabel }).replace(/\.$/, "");
}

function paymentDetails(pitches: readonly FabPaymentPitchMessage[]): SimulatorMatchHistoryDetail[] {
  return pitches.map((pitch, index) => {
    const cards = cardReferences(pitch) ?? [{ name: pitch.values.cardName }];
    return {
      kind: "cards" as const,
      label: index === 0 ? "Cost" : "",
      lead: "Pitched",
      cards,
      amount: pitch.values.resources,
    };
  });
}

function paidActivityDetails(
  entries: readonly { readonly message: FabPlayerLogMessage }[],
  actorLabel: FabPlayerLogActorLabel,
): SimulatorMatchHistoryDetail[] {
  const beatChest = entries.find(
    ({ message }) => message.key === "flesh-and-blood.beat-chest",
  )?.message;
  return [
    ...paymentDetails(entries.flatMap(({ message }) => (isPaymentPitch(message) ? [message] : []))),
    ...entries.flatMap(({ message }): SimulatorMatchHistoryDetail[] => {
      if (isPaymentPitch(message)) return [];
      if (message.key === "flesh-and-blood.beat-chest") {
        return [
          {
            kind: "text",
            label: "Beat Chest",
            text: `Discarded ${message.values.cardNames}`,
          },
        ];
      }
      if (
        message.key === "flesh-and-blood.discard" ||
        message.key === "flesh-and-blood.discard.random"
      ) {
        if (beatChest?.key === "flesh-and-blood.beat-chest") return [];
        return [
          {
            kind: "cards",
            label: "Additional cost",
            lead: "Discarded",
            cards: cardReferences(message) ?? [{ name: message.values.cardName }],
            ...(message.key === "flesh-and-blood.discard.random" ? { trail: " at random" } : {}),
          },
        ];
      }
      if (message.key === "flesh-and-blood.cost-life") {
        return [{ kind: "text", label: "Cost", text: `Paid ${message.values.life} life` }];
      }
      if (message.key === "flesh-and-blood.cost-chi") {
        return [{ kind: "text", label: "Cost", text: `Paid ${message.values.chi} chi` }];
      }
      if (message.key === "flesh-and-blood.set-tapped") {
        return [
          {
            kind: "cards",
            label: "Cost",
            lead: message.values.state === "tapped" ? "Tapped" : "Untapped",
            cards: cardReferences(message) ?? [{ name: message.values.cardName }],
          },
        ];
      }
      return [{ kind: "text", label: "Cost", text: historyTitle(message, actorLabel) }];
    }),
  ];
}

function historyTurn(
  message: FabPlayerLogMessage,
  log: FabVisiblePlayerLog,
): { readonly turn: number; readonly turnOwnerSeatId: string } {
  const actorId = receiptSubjectId(message, log);
  // CR 4.4.3f makes the non-turn player draw at the end of turn 1. Present
  // that exceptional refill with the receiving player's upcoming turn so it
  // does not read as though they drew during the opponent's history group.
  if (
    log.turnNumber === 1 &&
    actorId !== log.turnPlayerId &&
    (message.key === "flesh-and-blood.draw" ||
      message.key === "flesh-and-blood.draw.cards" ||
      message.key === "flesh-and-blood.draw.private")
  ) {
    return { turn: 2, turnOwnerSeatId: actorId };
  }
  return { turn: log.turnNumber, turnOwnerSeatId: log.turnPlayerId };
}

export interface FabPlayerNarrativeProjectionOptions {
  readonly viewerId: string;
  readonly seatIds: readonly string[];
  readonly actorLabel?: FabPlayerLogActorLabel;
}

/** Match initialization is presentation context, not a fabricated command consequence. */
export function projectFabPlayerNarrativeMatchStart(
  firstTurnPlayerId: string,
  options: FabPlayerNarrativeProjectionOptions & { readonly timestamp?: number },
): SimulatorMatchHistoryRow {
  const actorLabel = options.actorLabel ?? actorLabelFor(options.viewerId, options.seatIds);
  const firstLabel = actorLabel(firstTurnPlayerId, "subject") ?? firstTurnPlayerId;
  return {
    id: "fab-match-start",
    turn: 1,
    timestamp: new Date(options.timestamp ?? 0).toISOString(),
    kind: "match-start",
    title: `Match started · ${firstLabel} ${firstLabel === "You" ? "go" : "goes"} first`,
    actorSeatId: firstTurnPlayerId,
    turnOwnerSeatId: firstTurnPlayerId,
  };
}

/**
 * Direct projection: each engine-authored narrative consequence becomes one UI row.
 * No event correlation, zone inspection, or English-string parsing occurs.
 */
export function projectFabPlayerNarrativeEntries(
  logs: readonly FabVisiblePlayerLog[],
  options: FabPlayerNarrativeProjectionOptions,
): SimulatorEventLogEntry[] {
  const actorLabel = options.actorLabel ?? actorLabelFor(options.viewerId, options.seatIds);
  return logs.flatMap((log) =>
    log.entries.map(({ entryId, message }) => {
      const cards = cardReferences(message);
      return {
        id: entryId,
        turn: log.turnNumber,
        phase: log.phase,
        seatId: receiptSubjectId(message, log),
        timestamp: new Date(log.timestamp || 0).toISOString(),
        message: renderFabPlayerLogMessage(message, { actorLabel }),
        tags: tagsFor(message.category),
        ...(cards
          ? {
              cardRefs: cards,
              entityIds: cards.flatMap((card) => (card.entityId ? [card.entityId] : [])),
            }
          : {}),
      };
    }),
  );
}

/** The same direct narrative, adapted to the simulator's history row contract. */
export function projectFabPlayerNarrativeHistory(
  logs: readonly FabVisiblePlayerLog[],
  options: FabPlayerNarrativeProjectionOptions,
): SimulatorMatchHistoryRow[] {
  const actorLabel = options.actorLabel ?? actorLabelFor(options.viewerId, options.seatIds);
  return logs.flatMap((log) => {
    const visibleEntries = log.entries.filter(({ message }) => {
      const role = narrativeRoleFor(message);
      return role !== "diagnostic" && role !== "transient";
    });
    const paidActivity = visibleEntries.find(({ message }) => isPaidActivity(message));
    const paidDetails = paidActivity
      ? visibleEntries.filter(({ message }) => {
          return (
            narrativeRoleFor(message) === "detail" || message.key === "flesh-and-blood.beat-chest"
          );
        })
      : [];
    return visibleEntries.flatMap(({ entryId, message }) => {
      if (
        paidActivity &&
        (narrativeRoleFor(message) === "detail" || message.key === "flesh-and-blood.beat-chest")
      ) {
        return [];
      }
      if (message.key === "flesh-and-blood.turn.started") return [];
      const cards = cardReferences(message);
      const detailCards =
        paidActivity?.entryId === entryId
          ? paidDetails.flatMap(({ message: detail }) => cardReferences(detail) ?? [])
          : [];
      const allCards = cards ? [...cards, ...detailCards] : detailCards;
      const metrics = historyMetrics(message);
      const historicalTurn = historyTurn(message, log);
      const details =
        paidActivity?.entryId === entryId ? paidActivityDetails(paidDetails, actorLabel) : [];
      return [
        {
          id: entryId,
          turn: historicalTurn.turn,
          timestamp: new Date(log.timestamp || 0).toISOString(),
          turnOwnerSeatId: historicalTurn.turnOwnerSeatId,
          actorSeatId: receiptSubjectId(message, log),
          kind: historyKind(message),
          title: historyTitle(message, actorLabel),
          ...(details.length > 0 ? { details } : {}),
          ...(metrics ? { metrics } : {}),
          ...(allCards.length > 0
            ? {
                cardRefs: allCards,
                entityIds: allCards.flatMap((card) => (card.entityId ? [card.entityId] : [])),
              }
            : {}),
        },
      ];
    });
  });
}
