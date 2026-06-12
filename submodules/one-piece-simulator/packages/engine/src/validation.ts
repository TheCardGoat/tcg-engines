import type { CardZone, MatchState } from "./types.ts";

function pushMembership(memberships: Map<string, string[]>, instanceId: string, location: string) {
  const existing = memberships.get(instanceId) ?? [];
  existing.push(location);
  memberships.set(instanceId, existing);
}

function validateLinearZone(
  state: MatchState,
  seat: "north" | "south",
  zone: "deck" | "hand" | "life" | "trash",
  errors: string[],
  memberships: Map<string, string[]>,
) {
  for (const [index, instanceId] of state.players[seat][zone].entries()) {
    pushMembership(memberships, instanceId, `${seat}:${zone}:${index}`);
    const instance = state.cards[instanceId];
    if (!instance) {
      errors.push(`Instance ${instanceId} in ${seat} ${zone} at index ${index} is missing.`);
      continue;
    }
    if (instance.owner !== seat || instance.zone !== zone || instance.zoneIndex !== index) {
      errors.push(`Instance ${instanceId} is inconsistent in ${seat} ${zone} at index ${index}.`);
    }
  }
}

function validateBattle(state: MatchState, errors: string[]) {
  if (!state.battle) {
    return;
  }

  for (const instanceId of [
    state.battle.attackerId,
    state.battle.originalTargetId,
    state.battle.targetId,
    ...(state.battle.blockerId ? [state.battle.blockerId] : []),
    ...state.battle.counterCardIds,
  ]) {
    if (!state.cards[instanceId]) {
      errors.push(`Battle references missing instance ${instanceId}.`);
    }
  }
}

function validatePrompts(state: MatchState, errors: string[]) {
  for (const prompt of state.promptQueue) {
    if (prompt.sourceInstanceId && !state.cards[prompt.sourceInstanceId]) {
      errors.push(
        `Prompt ${prompt.id} references missing source instance ${prompt.sourceInstanceId}.`,
      );
    }
  }
}

export function validateState(state: MatchState): string[] {
  const errors: string[] = [];
  const memberships = new Map<string, string[]>();

  for (const seat of ["north", "south"] as const) {
    const player = state.players[seat];
    validateLinearZone(state, seat, "deck", errors, memberships);
    validateLinearZone(state, seat, "hand", errors, memberships);
    validateLinearZone(state, seat, "life", errors, memberships);
    validateLinearZone(state, seat, "trash", errors, memberships);

    pushMembership(memberships, player.leaderInstanceId, `${seat}:leader`);
    const leader = state.cards[player.leaderInstanceId];
    if (!leader) {
      errors.push(`Leader ${player.leaderInstanceId} is missing for ${seat}.`);
      continue;
    }
    if (leader.owner !== seat || leader.zone !== "leader" || leader.zoneIndex !== 0) {
      errors.push(`Leader ${player.leaderInstanceId} is inconsistent for ${seat}.`);
    }

    if (player.stageArea) {
      pushMembership(memberships, player.stageArea, `${seat}:stage`);
      const stage = state.cards[player.stageArea];
      if (!stage) {
        errors.push(`Stage ${player.stageArea} is missing for ${seat}.`);
        continue;
      }
      if (stage.owner !== seat || stage.zone !== "stage" || stage.zoneIndex !== 0) {
        errors.push(`Stage ${player.stageArea} is inconsistent for ${seat}.`);
      }
    }

    for (const [index, instanceId] of player.characterArea.entries()) {
      if (!instanceId) {
        continue;
      }
      pushMembership(memberships, instanceId, `${seat}:character:${index}`);
      const instance = state.cards[instanceId];
      if (!instance) {
        errors.push(`Character ${instanceId} is missing in slot ${index} for ${seat}.`);
        continue;
      }
      if (
        instance.owner !== seat ||
        instance.zone !== "character" ||
        instance.zoneIndex !== index
      ) {
        errors.push(`Character ${instanceId} is inconsistent in slot ${index} for ${seat}.`);
      }
    }

    if (player.activeDon < 0 || player.restedDon < 0 || player.donDeckCount < 0) {
      errors.push(`DON counts are negative for ${seat}.`);
    }
  }

  for (const [instanceId, locations] of memberships.entries()) {
    if (locations.length !== 1) {
      errors.push(
        `Instance ${instanceId} appears in ${locations.length} locations: ${locations.join(", ")}.`,
      );
    }
  }

  for (const [instanceId, instance] of Object.entries(state.cards)) {
    if (!memberships.has(instanceId) && instance.zone !== "leader") {
      errors.push(`Instance ${instanceId} is not present in any owning zone.`);
    }
    const expectedZone: CardZone = instance.zone;
    if (!["leader", "deck", "hand", "life", "character", "stage", "trash"].includes(expectedZone)) {
      errors.push(`Instance ${instanceId} has invalid zone ${expectedZone}.`);
    }
  }

  validateBattle(state, errors);
  validatePrompts(state, errors);

  return errors;
}
