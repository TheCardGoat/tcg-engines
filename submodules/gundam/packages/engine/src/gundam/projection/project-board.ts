/**
 * Gundam TCG — Board Projection
 *
 * Transforms the raw MatchState into a GundamBoardView for UI consumption.
 * Filters private information based on player role.
 */

import type { MatchState } from "../../types/match-state.ts";
import type { MatchStaticResources } from "../../runtime/static-resources.ts";
import type { ViewRoleContext } from "../../types/projection.ts";
import type { Card, UnitCard } from "@tcg/gundam-types";
import type {
  GundamG,
  GundamBoardView,
  GundamPlayerBoardView,
  GundamRuntimeCard,
} from "../types.ts";
import { getDamage } from "../rules/derived-state.ts";
import { buildPendingChoicePrompt } from "../effects/pending-effects.ts";
import { buildReadAPI } from "../../runtime/match-runtime.queries.ts";
import { projectTimerView } from "../../runtime/view-filter.ts";

export function projectGundamBoardView(
  state: MatchState<GundamG>,
  roleCtx: ViewRoleContext,
  staticResources: MatchStaticResources,
): GundamBoardView {
  const g = state.G;
  const ctx = state.ctx;

  const playerViews: Record<string, GundamPlayerBoardView> = {};

  for (const playerId of ctx.playerIds) {
    playerViews[playerId as string] = buildPlayerView(
      playerId as string,
      g,
      ctx,
      roleCtx,
      staticResources,
    );
  }

  // Role-scoped: pendingChoice can expose hidden card IDs (hand, deck) via
  // legalTargetIds when the filter's zone reaches into a private zone, so we
  // only surface it to the effect's controller (the only actor that can
  // answer the prompt) or to a judge. Spectators and the non-controller
  // opponent already know that a choice is pending via pendingEffectCount.
  const pendingChoice = computeRoleScopedPendingChoice(g, state, roleCtx, staticResources);

  return {
    players: playerViews,
    gameSegment: ctx.status.gameSegment,
    phase: ctx.status.phase,
    step: ctx.status.step,
    activePlayer: ctx.status.activePlayer as string | undefined,
    turnPlayer: ctx.status.turnPlayer as string | undefined,
    pendingDecision: (ctx.status.pendingDecision ?? []) as string[],
    pendingCombat: g.turnMetadata.pendingCombat,
    pendingEffectCount: g.pendingEffects.length,
    pendingChoice,
    timerView: projectTimerView(state, Date.now()),
    winner: ctx.status.winner as string | undefined,
    stateId: ctx._stateID,
  };
}

function computeRoleScopedPendingChoice(
  g: GundamG,
  state: MatchState<GundamG>,
  roleCtx: ViewRoleContext,
  staticResources: MatchStaticResources,
) {
  if (g.pendingEffects.length === 0) return undefined;
  if (roleCtx.role === "spectator") return undefined;
  const activePlayerId = state.ctx.status.activePlayer as unknown as string;
  const prompt = buildPendingChoicePrompt(g, buildReadAPI(state, staticResources), activePlayerId);
  if (!prompt) return undefined;
  if (roleCtx.role === "judge") return prompt;
  if ((roleCtx.playerId as string) === prompt.controllerId) return prompt;
  return undefined;
}

function buildPlayerView(
  playerId: string,
  g: GundamG,
  ctx: MatchState<GundamG>["ctx"],
  roleCtx: ViewRoleContext,
  staticResources: MatchStaticResources,
): GundamPlayerBoardView {
  const isOwner = roleCtx.role === "player" && (roleCtx.playerId as string) === playerId;
  const isJudge = roleCtx.role === "judge";
  const canSeePrivate = isOwner || isJudge;

  const zoneSummaries = ctx.zones.public.zoneSummaries;

  const deckKey = `deck:${playerId}`;
  const handKey = `hand:${playerId}`;
  const battlefieldKey = `battleArea:${playerId}`;
  const baseSectionKey = `baseSection:${playerId}`;
  const trashKey = `trash:${playerId}`;
  const shieldKey = `shieldArea:${playerId}`;
  const resourceAreaKey = `resourceArea:${playerId}`;

  const deckCount = zoneSummaries[deckKey]?.count ?? 0;
  const handCount = zoneSummaries[handKey]?.count ?? 0;
  const trashCount = zoneSummaries[trashKey]?.count ?? 0;
  const shieldCount = zoneSummaries[shieldKey]?.count ?? 0;

  // Battlefield (always public)
  const battlefieldIds = ctx.zones.private.zoneCards[battlefieldKey] ?? [];
  const battlefield = battlefieldIds.map((id) =>
    buildRuntimeCard(id, battlefieldKey, g, staticResources),
  );

  // Base section (always public — Rule 4-6-3)
  const baseSectionIds = ctx.zones.private.zoneCards[baseSectionKey] ?? [];
  const baseSection = baseSectionIds.map((id) =>
    buildRuntimeCard(id, baseSectionKey, g, staticResources),
  );

  // Resource area (always public per Rule 4-4-3)
  const resourceAreaIds = ctx.zones.private.zoneCards[resourceAreaKey] ?? [];
  const resourceArea = resourceAreaIds.map((id) =>
    buildRuntimeCard(id, resourceAreaKey, g, staticResources),
  );
  const resourceCount = resourceAreaIds.length;

  // Hand (private to owner/judge)
  let hand: GundamRuntimeCard[] | undefined;
  if (canSeePrivate) {
    const handIds = ctx.zones.private.zoneCards[handKey] ?? [];
    hand = handIds.map((id) => buildRuntimeCard(id, handKey, g, staticResources));
  }

  return {
    playerId,
    resourceCount,
    handCount,
    deckCount,
    trashCount,
    shieldCount,
    battlefield,
    baseSection,
    resourceArea,
    hand,
  };
}

function buildRuntimeCard(
  instanceId: string,
  zoneKey: string,
  g: GundamG,
  staticResources: MatchStaticResources,
): GundamRuntimeCard {
  const instanceData = staticResources.cardsMaps.instances.get(instanceId);
  // Use cardsMaps.definitions (not catalog) so runtime-registered tokens are found.
  // catalog only contains deck cards defined at startup; tokens are registered at runtime
  // via framework.cards.registerDefinition() which writes to cardsMaps.definitions.
  const definition = instanceData
    ? (staticResources.cardsMaps.definitions.get(instanceData.definitionId) as Card | undefined)
    : undefined;

  const damage = getDamage(instanceId, g);
  const exhausted = g.exhausted[instanceId] ?? false;
  const pilotId = g.pilotAssignments[instanceId];

  // For projection, use base stats (no CardReadAPI available here for effective stats)
  const isUnit = definition?.type === "unit";
  const isBase = definition?.type === "base";
  const baseAp = isUnit ? (definition as UnitCard).ap : 0;
  const baseHp = isUnit
    ? (definition as UnitCard).hp
    : isBase
      ? (definition as import("@tcg/gundam-types").BaseCard).hp
      : 0;

  return {
    instanceId,
    definitionId: instanceData?.definitionId ?? "",
    ownerId: instanceData?.ownerID ?? "",
    controllerId: instanceData?.ownerID ?? "",
    zoneId: zoneKey,
    effectiveAp: baseAp,
    effectiveHp: baseHp,
    effectiveCost: definition?.cost ?? 0,
    damage,
    exhausted,
    pilotId,
    keywords: definition ? definition.keywordEffects.map((k) => k.keyword) : [],
    restrictions: [],
  };
}
