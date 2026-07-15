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
      if (!state.setup.joKenPo.winner) {
        if (!state.setup.joKenPo.pendingSeats.includes(viewer)) {
          for (const choice of ["rock", "paper", "scissors"] as const) {
            legal.push({
              type: "chooseJoKenPo",
              seat: viewer,
              label: `Choose ${choice}`,
              options: [{ id: choice, label: choice, value: choice }],
            });
          }
        }
        return legal;
      }
      if (!state.setup.joKenPo.firstPlayerDecided) {
        if (viewer === state.setup.joKenPo.winner) {
          legal.push({
            type: "chooseFirstPlayer",
            seat: viewer,
            label: "Take the first turn",
            targetIds: [viewer],
          });
          const other = viewer === "south" ? "north" : "south";
          legal.push({
            type: "chooseFirstPlayer",
            seat: viewer,
            label: `Let ${getPlayer(state, other).playerName} take the first turn`,
            targetIds: [other],
          });
        }
        return legal;
      }
      if (!state.setup.mulliganDecided[viewer]) {
        legal.push({
          type: "mulligan",
          seat: viewer,
          label: "Take a mulligan",
        });
        legal.push({
          type: "keepHand",
          seat: viewer,
          label: "Keep opening hand",
        });
      }
      if (
        viewer === state.config.firstPlayer &&
        state.setup.mulliganDecided.north &&
        state.setup.mulliganDecided.south
      ) {
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
    if (card.cardType === "event" && effectBlocksFor(card, "main").length === 0) {
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
    const instance = state.cards[instanceId];
    const hasUnsupportedActivationCost = state.capabilityHistory.some(
      (issue) =>
        issue.sourceInstanceId === instanceId &&
        issue.kind === "unsupportedCost" &&
        issue.code.startsWith("cost:activateMain:"),
    );
    const hasUnusedActivation = effectBlocksFor(card, "activateMain").some(
      (_block, index) => !instance?.usedEffectKeys.includes(`activateMain:${index}`),
    );
    if (hasUnusedActivation && !hasUnsupportedActivationCost) {
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
