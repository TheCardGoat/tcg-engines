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
  if (
    abilities.some(
      (ability) =>
        isPlayAbility(ability) &&
        (hasMultiTargetSpatialChoice(ability) || hasChainedSpatialChoice(ability)),
    )
  ) {
    return [];
  }
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

function hasMultiTargetSpatialChoice(ability: ProgramAbility): boolean {
  const targets = [
    ...(ability.bindings ?? []).map((binding) => binding.target),
    ...collectEffects(ability.effects ?? []).flatMap((effect) =>
      effect.target ? [effect.target] : [],
    ),
  ]
    .map(getSpatialCardSelection)
    .filter((selection): selection is NonNullable<typeof selection> => Boolean(selection));
  return targets.length > 1 || targets.some((selection) => selection.max > 1);
}

function getSpatialCardSelection(target: EngineTarget) {
  if (target.selector !== "card" || !target.selection) {
    return undefined;
  }
  const cardTypes = target.cardTypes ?? [];
  return cardTypes.some((type: string) => type === "unit" || type === "legend")
    ? target.selection
    : undefined;
}

/**
 * A chained `ifYouDo` target must be selected only after its parent effect
 * resolves. Pre-highlighting both steps makes legal targets indistinguishable
 * in the browser and permits a misleading direct-click shortcut.
 */
function hasChainedSpatialChoice(ability: ProgramAbility): boolean {
  return (ability.effects ?? []).some((effect) =>
    effect.effect === "ifYouDo"
      ? [effect.doEffect, ...(effect.ifEffects ?? []), ...(effect.elseEffects ?? [])].some(
          (nested) => nested?.target && isSpatialCardTarget(nested.target),
        )
      : false,
  );
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
  // The pre-play spatial shortcut submits one target immediately after the
  // Program is played. Multi-target effects must use the engine's staged
  // choice flow so the player can select every allowed target.
  return getSpatialCardSelection(target)?.max === 1;
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
