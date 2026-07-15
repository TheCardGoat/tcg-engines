import { defOf, type CardInstance, type MatchState } from "@tcg/cyberpunk-engine";

export interface AttackTriggerSummary {
  cardId: string;
  cardName: string;
  text: string;
}

interface AttackAbilitySummarySource {
  kind?: string;
  text: string;
  trigger?: { trigger?: string };
  source?: { selector?: string };
}

interface AttackCardSummarySource {
  name: string;
  displayName?: string;
  abilities?: AttackAbilitySummarySource[];
}

export function collectAttackTriggerSummaries(
  state: MatchState,
  attackerId: string | null | undefined,
): AttackTriggerSummary[] {
  if (!attackerId) {
    return [];
  }

  const attacker = state.G.cardIndex[attackerId];
  if (!attacker) {
    return [];
  }

  return [
    ...triggerSummariesForCard(attacker),
    ...attacker.meta.attachedGearIds.flatMap((gearId) => {
      const gear = state.G.cardIndex[String(gearId)];
      if (!gear || String(gear.meta.attachedToId) !== attackerId) {
        return [];
      }
      return triggerSummariesForCard(gear, { sourceSelector: "host" });
    }),
  ];
}

export function collectPendingAttackTriggerSummaries(state: MatchState): AttackTriggerSummary[] {
  const choice = state.G.turnMetadata.pendingChoice;
  if (choice?.type === "chooseTrigger") {
    return choice.payload.options.map((option) => ({
      cardId: option.sourceCardId as unknown as string,
      cardName: option.cardName,
      text: option.abilityText,
    }));
  }

  const queued = [
    ...(state.G.turnMetadata.currentTrigger ? [state.G.turnMetadata.currentTrigger] : []),
    ...state.G.turnMetadata.triggerQueue,
  ];

  return queued
    .filter((trigger) => trigger.event.type === "attackDeclared")
    .map((trigger) => {
      const card = state.G.cardIndex[trigger.sourceCardId as unknown as string];
      const def = card ? defOf(card) : null;
      return {
        cardId: trigger.sourceCardId as unknown as string,
        cardName: def?.displayName ?? def?.name ?? "Unknown card",
        text: trigger.abilityText,
      };
    });
}

export function formatAttackTriggerList(triggers: readonly AttackTriggerSummary[]): string {
  if (triggers.length === 0) {
    return "No ATTACK trigger.";
  }
  return triggers.map((trigger) => `${trigger.cardName}: ${trigger.text}`).join(" | ");
}

function triggerSummariesForCard(
  card: CardInstance,
  opts?: { sourceSelector?: string },
): AttackTriggerSummary[] {
  const def = defOf(card) as AttackCardSummarySource;
  return (def.abilities ?? [])
    .filter((ability) => ability.kind === "triggered")
    .filter((ability) => ability.trigger?.trigger === "attack")
    .filter((ability) =>
      opts?.sourceSelector ? ability.source?.selector === opts.sourceSelector : true,
    )
    .map((ability) => ({
      cardId: card.instanceId as unknown as string,
      cardName: def.displayName ?? def.name,
      text: ability.text,
    }));
}
