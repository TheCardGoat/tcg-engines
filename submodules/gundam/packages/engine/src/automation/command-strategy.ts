import type { Card, CommandCard, Directive, EffectAction } from "@tcg/gundam-types";

import type { GundamG } from "../gundam/types.ts";
import { getEffectiveStats } from "../gundam/rules/derived-state.ts";

import type { GundamBotCandidate } from "./candidate-types.ts";
import type { FamilyPolicy } from "./shared-policies.ts";
import type { CandidateStrategy, CandidateStrategyContext } from "./types.ts";

type PlayCommandCandidate = Extract<GundamBotCandidate, { family: "playCommand" }>;

function findVisibleDefinition(parent: CandidateStrategyContext, cardId: string): Card | null {
  for (const zone of Object.values(parent.view.zones.zones)) {
    const card = zone.cards.find((candidate) => candidate.instanceId === cardId);
    if (card) return card.definition;
  }
  return null;
}

function visibleCardValue(parent: CandidateStrategyContext, cardId: string): number {
  const definition = findVisibleDefinition(parent, cardId);
  if (!definition) return 0;
  if (definition.type === "unit") {
    const g = parent.state.G as unknown as GundamG;
    const stats = getEffectiveStats(cardId, g, parent.cards);
    const remainingHp = Math.max(0, stats.hp - (g.damage[cardId] ?? 0));
    return Math.max(1, stats.cost * 2 + stats.ap + remainingHp);
  }
  if (definition.type === "base") return Math.max(2, definition.cost * 2 + definition.hp);
  return Math.max(1, (definition.cost ?? 0) * 2 + 2);
}

function scoreTargetedAction(
  parent: CandidateStrategyContext,
  action: EffectAction,
  targetId: string,
): number {
  const g = parent.state.G as unknown as GundamG;
  const definition = findVisibleDefinition(parent, targetId);
  switch (action.action) {
    case "dealDamage":
    case "dealDamageThenDrawIfDestroyed": {
      if (definition?.type !== "unit") return 0;
      const remainingHp = Math.max(
        0,
        getEffectiveStats(targetId, g, parent.cards).hp - (g.damage[targetId] ?? 0),
      );
      const realized = Math.min(action.amount, remainingHp);
      const lethal = action.amount >= remainingHp && remainingHp > 0;
      return (
        realized * 3 +
        (lethal ? 20 + visibleCardValue(parent, targetId) : 0) +
        (action.action === "dealDamageThenDrawIfDestroyed" && lethal ? action.drawCount * 4 : 0)
      );
    }
    case "recoverHP":
      return Math.min(action.amount, g.damage[targetId] ?? 0) * 3;
    case "destroy":
    case "exile":
    case "returnToHand":
    case "returnToDeck":
    case "placeInTrash":
      return visibleCardValue(parent, targetId) + 12;
    case "rest":
      return g.exhausted[targetId] ? 0 : Math.max(3, visibleCardValue(parent, targetId) / 2);
    case "setActive":
      return g.exhausted[targetId] ? Math.max(3, visibleCardValue(parent, targetId) / 2) : 0;
    case "statModifier": {
      if (action.stat === "cost") return Math.abs(action.amount) * 2;
      const magnitude = Math.abs(action.amount);
      if (definition?.type !== "unit") return magnitude * 2;
      const stats = getEffectiveStats(targetId, g, parent.cards);
      const remainingHp = Math.max(0, stats.hp - (g.damage[targetId] ?? 0));
      const lethalSwing = action.stat === "hp" && action.amount < 0 && magnitude >= remainingHp;
      return magnitude * 3 + (lethalSwing ? 20 + visibleCardValue(parent, targetId) : 0);
    }
    case "grantKeyword": {
      if (definition?.type !== "unit") return 0;
      if (getEffectiveStats(targetId, g, parent.cards).keywords.includes(action.keyword)) return 0;
      if (action.keyword === "FirstStrike" || action.keyword === "Blocker") return 6;
      if (action.keyword === "HighManeuver" || action.keyword === "Breach") return 5;
      return 3;
    }
    default:
      return 0;
  }
}

function scoreAction(
  parent: CandidateStrategyContext,
  action: EffectAction,
  targets: readonly string[],
): number {
  if ("target" in action && targets.length > 0) {
    return targets.reduce(
      (sum, targetId) => sum + scoreTargetedAction(parent, action, targetId),
      0,
    );
  }
  switch (action.action) {
    case "draw":
      return action.count * 4;
    case "drawThenDiscard":
      return Math.max(0, action.drawCount * 4 - action.discardCount * 2);
    case "drawAll":
      return action.count * 4;
    case "addShieldToHand":
      return action.count * 5;
    case "placeResource":
      return 7;
    case "deployToken":
    case "deploySelf":
      return 8;
    default:
      return 1;
  }
}

function scoreDirectives(
  parent: CandidateStrategyContext,
  directives: readonly Directive[],
  targets: readonly string[],
): number {
  let score = 0;
  for (const directive of directives) {
    if ("action" in directive) {
      const value = scoreAction(parent, directive.action, targets);
      score += directive.optional ? Math.max(0, value) : value;
    } else if ("options" in directive) {
      score += Math.max(
        0,
        ...directive.options.map((option) => scoreDirectives(parent, option.directives, targets)),
      );
    } else {
      score += Math.max(
        scoreDirectives(parent, directive.thenDirectives, targets),
        directive.elseDirectives ? scoreDirectives(parent, directive.elseDirectives, targets) : 0,
      );
    }
  }
  return score;
}

/** Target-aware estimate of the Command's immediate board impact. */
export function commandUtility(
  parent: CandidateStrategyContext,
  candidate: PlayCommandCandidate,
): number {
  const command = findVisibleDefinition(parent, candidate.cardId);
  if (command?.type !== "command") return 0;
  return ((command as CommandCard).effects ?? [])
    .filter((effect) => effect.type === "command")
    .reduce(
      (sum, effect) => sum + scoreDirectives(parent, effect.directives, candidate.targets ?? []),
      0,
    );
}

/** Reject immediate no-ops and rank legal Command targets by realized value. */
export const rankImpactfulCommands: FamilyPolicy<"playCommand"> = (context) =>
  context.candidates
    .map((candidate, index) => ({
      candidate,
      index,
      score: commandUtility(context.parent, candidate),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .map(({ candidate }) => candidate);

const TEMPO_ACTIONS = new Set<EffectAction["action"]>([
  "deploy",
  "deployFromTrash",
  "deploySelf",
  "deployToken",
  "destroy",
  "exile",
  "placeInTrash",
  "returnToDeck",
  "returnToHand",
]);

function directivesCreateTempo(directives: readonly Directive[]): boolean {
  return directives.some((directive) => {
    if ("action" in directive) return TEMPO_ACTIONS.has(directive.action.action);
    if ("options" in directive) {
      return directive.options.some((option) => directivesCreateTempo(option.directives));
    }
    return (
      directivesCreateTempo(directive.thenDirectives) ||
      (directive.elseDirectives ? directivesCreateTempo(directive.elseDirectives) : false)
    );
  });
}

function commandCreatesTempo(parent: CandidateStrategyContext, cardId: string): boolean {
  const card = findVisibleDefinition(parent, cardId);
  return (
    card?.type === "command" &&
    ((card as CommandCard).effects ?? [])
      .filter((effect) => effect.type === "command")
      .some((effect) => directivesCreateTempo(effect.directives))
  );
}

/**
 * Wrap a strategy so Main-phase attrition/setup Commands wait until persistent
 * Unit/Base development is exhausted. Removal, board creation, and lethal
 * effect damage retain their tactical priority; Action-step Commands are
 * unaffected because deployment is not legal in that window.
 */
export function withTempoAwareCommandSequencing(
  name: string,
  inner: CandidateStrategy,
): CandidateStrategy {
  return {
    name,
    selectCandidates(parent) {
      const ordered = [...inner.selectCandidates(parent)];
      const commands = ordered.filter((candidate) => candidate.family === "playCommand");
      const hasDevelopment = ordered.some(
        (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
      );
      if (!hasDevelopment || commands.length === 0) return ordered;

      const immediate: typeof commands = [];
      const deferred: typeof commands = [];
      for (const command of commands) {
        if (commandCreatesTempo(parent, command.cardId) || commandUtility(parent, command) >= 20) {
          immediate.push(command);
        } else {
          deferred.push(command);
        }
      }
      if (deferred.length === 0) return ordered;

      const commandSet = new Set<GundamBotCandidate>(commands);
      const ranked = ordered.filter((candidate) => !commandSet.has(candidate));
      const firstDevelopment = ranked.findIndex(
        (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
      );
      ranked.splice(firstDevelopment, 0, ...immediate);
      const lastDevelopment = ranked.findLastIndex(
        (candidate) => candidate.family === "deployUnit" || candidate.family === "deployBase",
      );
      ranked.splice(lastDevelopment + 1, 0, ...deferred);
      return ranked;
    },
  };
}
