import { defOf, resolveTarget, type MatchState } from "@tcg/cyberpunk-engine";
import type { EngineInteractionView } from "@tcg/protocol";
import { PLAYER_SIDE_TO_ID, type Side } from "./sides";
import { interactionViewActionHasCandidate } from "./interactionViewHelpers";

type EngineTarget = Parameters<typeof resolveTarget>[0];

interface ProgramEffect {
  effect: string;
  target?: EngineTarget;
  doEffect?: ProgramEffect;
  ifEffects?: ProgramEffect[];
  elseEffects?: ProgramEffect[];
  effects?: ProgramEffect[];
}

interface ProgramAbility {
  trigger?: { trigger?: string };
  bindings?: { id: string; target: EngineTarget }[];
  effects?: ProgramEffect[];
}

interface ProgramTargetContext {
  matchState: MatchState;
  side: Side;
  interactionView: EngineInteractionView;
}

export function getProgramSpatialTargets(
  ctx: ProgramTargetContext,
  cardId: string | undefined,
): string[] {
  if (!cardId || !hasLegalPlayCard(ctx.interactionView, cardId)) {
    return [];
  }

  const card = ctx.matchState.G.cardIndex[cardId];
  if (!card) {
    return [];
  }
  const def = defOf(card);
  if (def.type !== "program") {
    return [];
  }

  const targets: string[] = [];
  const abilities = ((def as { abilities?: ProgramAbility[] }).abilities ?? []) as ProgramAbility[];
  abilities.forEach((ability, abilityIndex) => {
    if (!isPlayAbility(ability)) {
      return;
    }
    for (const binding of ability.bindings ?? []) {
      if (!isSpatialCardTarget(binding.target)) {
        continue;
      }
      const resolved = resolveTarget(binding.target, {
        state: ctx.matchState,
        sourceCardId: card.instanceId,
        sourcePlayerId: PLAYER_SIDE_TO_ID[ctx.side],
        abilityIndex,
        contextTargets: {},
        boundTargets: {},
      });
      targets.push(...resolved.filter((id) => isVisibleUnitOrLegend(ctx.matchState, id)));
    }
    for (const effect of collectEffects(ability.effects ?? [])) {
      if (!effect.target || !isSpatialCardTarget(effect.target)) {
        continue;
      }
      const resolved = resolveTarget(effect.target, {
        state: ctx.matchState,
        sourceCardId: card.instanceId,
        sourcePlayerId: PLAYER_SIDE_TO_ID[ctx.side],
        abilityIndex,
        contextTargets: {},
        boundTargets: {},
      });
      targets.push(...resolved.filter((id) => isVisibleUnitOrLegend(ctx.matchState, id)));
    }
  });

  return [...new Set(targets)];
}

function hasLegalPlayCard(view: EngineInteractionView, cardId: string): boolean {
  return interactionViewActionHasCandidate(view, "playCard", "cardId", cardId);
}

function isPlayAbility(ability: ProgramAbility): boolean {
  return ability.trigger?.trigger === "play";
}

function collectEffects(effects: readonly ProgramEffect[]): ProgramEffect[] {
  const out: ProgramEffect[] = [];
  for (const effect of effects) {
    out.push(effect);
    if (effect.effect === "ifYouDo") {
      const nested = [
        ...(effect.doEffect ? [effect.doEffect] : []),
        ...(effect.ifEffects ?? []),
        ...(effect.elseEffects ?? []),
      ];
      out.push(...collectEffects(nested));
    } else if (effect.effect === "delayed") {
      out.push(...collectEffects(effect.effects ?? []));
    }
  }
  return out;
}

function isSpatialCardTarget(target: EngineTarget): boolean {
  if (target.selector !== "card" || !target.selection) {
    return false;
  }
  const cardTypes = target.cardTypes ?? [];
  return cardTypes.some((type: string) => type === "unit" || type === "legend");
}

function isVisibleUnitOrLegend(state: MatchState, cardId: string): boolean {
  const card = state.G.cardIndex[cardId];
  if (!card) {
    return false;
  }
  if (card.zone !== "field" && card.zone !== "legendArea") {
    return false;
  }
  const type = defOf(card).type;
  return type === "unit" || type === "legend";
}
