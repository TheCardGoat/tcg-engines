import { canAttackWith, legalAttackTargets } from "../battle.ts";
import { baseCost, cardName, effectBlocksFor, getCardForInstance, getPlayer } from "../shared.ts";
import { getOpenCharacterSlots } from "../state.ts";
import type { LegalCommandDescriptor, MatchSeat, MatchState } from "../types.ts";
import { hasPendingNonJudgePrompt } from "./shared.ts";

export function getLegalCommands(
  state: MatchState,
  viewer: MatchSeat | "judge" = state.activeSeat,
): LegalCommandDescriptor[] {
  const legal: LegalCommandDescriptor[] = [];

  if (viewer === "judge") {
    for (const prompt of state.promptQueue.filter((candidate) => candidate.status === "pending")) {
      legal.push({
        type: "judgeResolvePrompt",
        seat: "judge",
        label: `Resolve ${prompt.label}`,
        promptId: prompt.id,
        options: prompt.options,
      });
    }
    legal.push({
      type: "judgeSetWinner",
      seat: "judge",
      label: "Declare a winner",
    });
  }

  if (state.status === "setup") {
    if (viewer !== "judge") {
      if (!state.setup.mulliganUsed[viewer]) {
        legal.push({
          type: "mulligan",
          seat: viewer,
          label: "Take a mulligan",
        });
      }
      if (viewer === state.config.firstPlayer) {
        legal.push({
          type: "startGame",
          seat: viewer,
          label: "Start the game",
        });
      }
    }
    return legal;
  }

  if (viewer !== "judge") {
    for (const prompt of state.promptQueue.filter((candidate) => candidate.status === "pending")) {
      if (prompt.seat !== viewer) {
        continue;
      }
      legal.push({
        type: "resolvePrompt",
        seat: viewer,
        label: prompt.label,
        promptId: prompt.id,
        options: prompt.options,
      });
    }
  }

  if (
    viewer === "judge" ||
    viewer !== state.activeSeat ||
    state.phase !== "main" ||
    hasPendingNonJudgePrompt(state)
  ) {
    return legal;
  }

  const player = getPlayer(state, viewer);
  legal.push({
    type: "endTurn",
    seat: viewer,
    label: "End turn",
  });

  for (const instanceId of player.hand) {
    const card = getCardForInstance(state, instanceId);
    const cost = baseCost(card);
    if (player.activeDon < cost || card.cardType === "leader") {
      continue;
    }
    legal.push({
      type: "playCard",
      seat: viewer,
      label: `Play ${cardName(card)}`,
      sourceId: instanceId,
      slotChoices: card.cardType === "character" ? getOpenCharacterSlots(state, viewer) : undefined,
    });
  }

  if (player.activeDon > 0) {
    legal.push({
      type: "attachDon",
      seat: viewer,
      label: "Attach DON!! to leader",
      sourceId: player.leaderInstanceId,
    });
    for (const instanceId of player.characterArea.filter((entry): entry is string =>
      Boolean(entry),
    )) {
      legal.push({
        type: "attachDon",
        seat: viewer,
        label: `Attach DON!! to ${cardName(getCardForInstance(state, instanceId))}`,
        sourceId: instanceId,
      });
    }
  }

  for (const attackerId of [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
  ]) {
    if (!canAttackWith(state, viewer, attackerId)) {
      continue;
    }
    legal.push({
      type: "declareAttack",
      seat: viewer,
      label: `Attack with ${cardName(getCardForInstance(state, attackerId))}`,
      sourceId: attackerId,
      targetIds: legalAttackTargets(state, viewer, attackerId),
    });
  }

  for (const instanceId of [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
    ...(player.stageArea ? [player.stageArea] : []),
  ]) {
    const card = getCardForInstance(state, instanceId);
    if (effectBlocksFor(card, "activateMain").length > 0) {
      legal.push({
        type: "activateEffect",
        seat: viewer,
        label: `Activate ${cardName(card)}`,
        sourceId: instanceId,
      });
    }
  }

  return legal;
}
