import { legalAttackTargets } from "../battle.ts";
import { cardName, effectBlocksForInstance, getCardForInstance, getPlayer } from "../shared.ts";
import { getOpenCharacterSlots } from "../state.ts";
import type {
  LegalCommandDescriptor,
  MatchSeat,
  MatchState,
  OnePieceCardActionInvalidReasonCode,
  PotentialCardCommandDescriptor,
} from "../types.ts";
import {
  canActivateEffect,
  canAttachDon,
  canChooseFirstPlayer,
  canConcede,
  canDeclareAttack,
  canEndTurn,
  canKeepHand,
  canMulligan,
  canPlayCard,
  canStartGame,
} from "./legality.ts";
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

  if (viewer !== "judge" && canConcede(state).ok) {
    // 1-2-3: either player may concede at any point before the game is
    // finished — during setup, in any phase, mid-battle, or mid-prompt.
    legal.push({
      type: "concede",
      seat: viewer,
      label: "Concede the game",
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
        if (canChooseFirstPlayer(state, viewer).ok) {
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
      if (canMulligan(state, viewer).ok) {
        legal.push({
          type: "mulligan",
          seat: viewer,
          label: "Take a mulligan",
        });
      }
      if (canKeepHand(state, viewer).ok) {
        legal.push({
          type: "keepHand",
          seat: viewer,
          label: "Keep opening hand",
        });
      }
      if (canStartGame(state, viewer).ok) {
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
  if (canEndTurn(state, viewer).ok) {
    legal.push({
      type: "endTurn",
      seat: viewer,
      label: "End turn",
    });
  }

  for (const instanceId of player.hand) {
    if (!canPlayCard(state, viewer, instanceId).ok) {
      continue;
    }
    const card = getCardForInstance(state, instanceId);
    legal.push({
      type: "playCard",
      seat: viewer,
      label: `Play ${cardName(card)}`,
      sourceId: instanceId,
      slotChoices: card.cardType === "character" ? getOpenCharacterSlots(state, viewer) : undefined,
    });
  }

  for (const instanceId of [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
  ]) {
    if (!canAttachDon(state, viewer, instanceId).ok) {
      continue;
    }
    legal.push({
      type: "attachDon",
      seat: viewer,
      label:
        instanceId === player.leaderInstanceId
          ? "Attach DON!! to leader"
          : `Attach DON!! to ${cardName(getCardForInstance(state, instanceId))}`,
      sourceId: instanceId,
    });
  }

  for (const attackerId of [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
  ]) {
    if (!canDeclareAttack(state, viewer, attackerId).ok) {
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
    // Descriptor-only defense: a previously recorded unsupported activation
    // cost also keeps the command out of the projected list. The handler
    // would reject it through canActivateEffect's cost check regardless.
    const hasUnsupportedActivationCost = state.capabilityHistory.some(
      (issue) =>
        issue.sourceInstanceId === instanceId &&
        issue.kind === "unsupportedCost" &&
        issue.code.startsWith("cost:activateMain:"),
    );
    if (
      canActivateEffect(state, viewer, instanceId, "activateMain").ok &&
      !hasUnsupportedActivationCost
    ) {
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

/**
 * Return every action category that applies to one of the viewer's public
 * cards, preserving disabled entries and the engine's authoritative reason.
 * Setup/global actions remain in getLegalCommands and are intentionally not
 * represented as card actions.
 */
export function getPotentialCardCommands(
  state: MatchState,
  viewer: MatchSeat,
): PotentialCardCommandDescriptor[] {
  const player = getPlayer(state, viewer);
  const result: PotentialCardCommandDescriptor[] = [];

  for (const instanceId of player.hand) {
    const card = getCardForInstance(state, instanceId);
    if (card.cardType === "leader") continue;
    const legality = canPlayCard(state, viewer, instanceId);
    result.push(
      potentialDescriptor(
        {
          type: "playCard",
          seat: viewer,
          label: `Play ${cardName(card)}`,
          sourceId: instanceId,
          slotChoices:
            card.cardType === "character" ? getOpenCharacterSlots(state, viewer) : undefined,
        },
        legality,
      ),
    );
  }

  const attackers = [
    player.leaderInstanceId,
    ...player.characterArea.filter((entry): entry is string => Boolean(entry)),
  ];
  for (const instanceId of attackers) {
    const attachLegality = canAttachDon(state, viewer, instanceId);
    result.push(
      potentialDescriptor(
        {
          type: "attachDon",
          seat: viewer,
          label:
            instanceId === player.leaderInstanceId
              ? "Attach DON!! to Leader"
              : `Attach DON!! to ${cardName(getCardForInstance(state, instanceId))}`,
          sourceId: instanceId,
        },
        attachLegality,
      ),
    );

    const attackLegality = canDeclareAttack(state, viewer, instanceId);
    result.push(
      potentialDescriptor(
        {
          type: "declareAttack",
          seat: viewer,
          label: `Attack with ${cardName(getCardForInstance(state, instanceId))}`,
          sourceId: instanceId,
          targetIds: attackLegality.ok ? legalAttackTargets(state, viewer, instanceId) : [],
        },
        attackLegality,
      ),
    );
  }

  for (const instanceId of [...attackers, ...(player.stageArea ? [player.stageArea] : [])]) {
    if (!effectBlocksForInstance(state, instanceId, "activateMain").length) continue;
    const legality = canActivateEffect(state, viewer, instanceId, "activateMain");
    result.push(
      potentialDescriptor(
        {
          type: "activateEffect",
          seat: viewer,
          label: `Activate ${cardName(getCardForInstance(state, instanceId))}`,
          sourceId: instanceId,
        },
        legality,
      ),
    );
  }

  return result;
}

function potentialDescriptor(
  descriptor: LegalCommandDescriptor,
  legality: { readonly ok: boolean; readonly reason: string | null },
): PotentialCardCommandDescriptor {
  if (legality.ok) return { ...descriptor, enabled: true };
  const disabledReason = legality.reason ?? "Unavailable right now.";
  return {
    ...descriptor,
    enabled: false,
    disabledReason,
    disabledReasonCode: invalidReasonCode(disabledReason),
  };
}

function invalidReasonCode(reason: string): OnePieceCardActionInvalidReasonCode {
  const normalized = reason.toLocaleLowerCase();
  if (normalized.includes("pending prompt")) return "pending-prompt";
  if (normalized.includes("main phase")) return "wrong-phase";
  if (normalized.includes("not this player's turn")) return "not-active-player";
  if (normalized.includes("not enough active don")) return "insufficient-don";
  if (normalized.includes("prevents this card")) return "card-restriction";
  if (normalized.includes("slot")) return "no-open-slot";
  if (normalized.includes("playable [main]")) return "missing-main-effect";
  if (normalized.includes("cannot attack")) return "rested-or-restricted";
  if (normalized.includes("target")) return "missing-target";
  if (normalized.includes("already been used")) return "already-used";
  if (normalized.includes("conditions are not met")) return "conditions-unmet";
  if (normalized.includes("cost") || normalized.includes("trashing")) return "cost-unpayable";
  return "invalid-zone-or-controller";
}
