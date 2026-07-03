import type { MatchSeat, MatchState, EngineCommand, LegalCommandDescriptor } from "../types.ts";
import { getCardForInstance, getPlayer } from "../shared.ts";

export type OnePieceBotStrategy = (
  state: MatchState,
  seat: MatchSeat,
  legalCommands: LegalCommandDescriptor[],
) => EngineCommand | null;

function randomItem<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

export function commandFromDescriptor(
  state: MatchState,
  seat: MatchSeat,
  descriptor: LegalCommandDescriptor,
): EngineCommand | null {
  switch (descriptor.type) {
    case "mulligan":
      return { type: "mulligan", seat };
    case "startGame":
      return { type: "startGame", seat };
    case "endTurn":
      return { type: "endTurn", seat };
    case "playCard": {
      if (!descriptor.sourceId) return null;
      if (descriptor.slotChoices !== undefined && descriptor.slotChoices.length === 0) {
        return null;
      }
      return {
        type: "playCard",
        seat,
        instanceId: descriptor.sourceId,
        slotIndex: descriptor.slotChoices?.[0],
      };
    }
    case "attachDon":
      if (!descriptor.sourceId) return null;
      return {
        type: "attachDon",
        seat,
        targetId: descriptor.sourceId,
        amount: 1,
      };
    case "declareAttack":
      if (!descriptor.sourceId || !descriptor.targetIds?.length) return null;
      return {
        type: "declareAttack",
        seat,
        attackerId: descriptor.sourceId,
        targetId: descriptor.targetIds[0]!,
      };
    case "activateEffect":
      if (!descriptor.sourceId) return null;
      return {
        type: "activateEffect",
        seat,
        sourceInstanceId: descriptor.sourceId,
        trigger: "activateMain",
      };
    case "resolvePrompt":
      if (!descriptor.promptId) return null;
      return {
        type: "resolvePrompt",
        seat,
        promptId: descriptor.promptId,
      };
    default:
      return null;
  }
}

export const firstLegalStrategy: OnePieceBotStrategy = (state, seat, legalCommands) => {
  const actionCommands = legalCommands.filter(
    (c) => c.seat === seat && c.type !== "endTurn" && c.type !== "resolvePrompt",
  );
  for (const descriptor of actionCommands) {
    const cmd = commandFromDescriptor(state, seat, descriptor);
    if (cmd) return cmd;
  }
  const fallback = legalCommands.find((c) => c.seat === seat);
  if (!fallback) return null;
  return commandFromDescriptor(state, seat, fallback);
};

export const randomStrategy: OnePieceBotStrategy = (state, seat, legalCommands) => {
  const myCommands = legalCommands
    .filter((c) => c.seat === seat)
    .map((c) => commandFromDescriptor(state, seat, c))
    .filter((c): c is NonNullable<typeof c> => c !== null);
  if (myCommands.length === 0) return null;
  return randomItem(myCommands);
};

export const passOnlyStrategy: OnePieceBotStrategy = (state, seat, legalCommands) => {
  // Setup phase: must start game if first player
  const startGame = legalCommands.find((c) => c.seat === seat && c.type === "startGame");
  if (startGame) return commandFromDescriptor(state, seat, startGame);

  const endTurn = legalCommands.find((c) => c.seat === seat && c.type === "endTurn");
  if (endTurn) return commandFromDescriptor(state, seat, endTurn);

  const resolvePrompt = legalCommands.find((c) => c.seat === seat && c.type === "resolvePrompt");
  if (resolvePrompt) return commandFromDescriptor(state, seat, resolvePrompt);

  return null;
};

function cardValue(state: MatchState, instanceId: string): number {
  const card = getCardForInstance(state, instanceId);
  const baseCost =
    card.cardType === "character" || card.cardType === "event" || card.cardType === "stage"
      ? card.cost
      : 0;
  let value = baseCost * 10;
  if (card.cardType === "character" && "power" in card && card.power !== undefined) {
    value += card.power / 100;
  }
  return value;
}

function getTotalPower(state: MatchState, instanceId: string): number {
  const card = getCardForInstance(state, instanceId);
  const base = card.cardType === "leader" || card.cardType === "character" ? (card.power ?? 0) : 0;
  const instance = state.cards[instanceId];
  const donBonus = instance ? instance.attachedDon * 1000 : 0;
  return base + donBonus;
}

export const greedyStrategy: OnePieceBotStrategy = (state, seat, legalCommands) => {
  const myCommands = legalCommands.filter((c) => c.seat === seat);
  if (myCommands.length === 0) return null;

  // Find strongest active character to concentrate DON!! on
  let bestAttacker: string | null = null;
  let bestAttackerPower = 0;
  for (const cmd of myCommands) {
    if (cmd.type === "declareAttack" && cmd.sourceId) {
      const power = getTotalPower(state, cmd.sourceId);
      if (power > bestAttackerPower) {
        bestAttackerPower = power;
        bestAttacker = cmd.sourceId;
      }
    }
  }

  const scored = myCommands
    .map((cmd) => {
      let score = 0;
      switch (cmd.type) {
        case "playCard": {
          if (cmd.sourceId) {
            if (cmd.slotChoices !== undefined && cmd.slotChoices.length === 0) {
              score = -1;
              break;
            }
            score = 1000 + cardValue(state, cmd.sourceId);
          }
          break;
        }
        case "declareAttack": {
          score = 500;
          if (cmd.targetIds?.length) {
            const targetCard = getCardForInstance(state, cmd.targetIds[0]!);
            if (targetCard.cardType === "leader") {
              score += 200;
            }
            // Prefer attacking with the strongest unit
            if (cmd.sourceId === bestAttacker) {
              score += 100;
            }
          }
          break;
        }
        case "attachDon": {
          score = 300;
          if (cmd.sourceId) {
            const sourceCard = getCardForInstance(state, cmd.sourceId);
            const instance = state.cards[cmd.sourceId];
            if (sourceCard.cardType === "character") {
              score += 100;
              // Prefer active characters that can attack
              if (instance && !instance.rested) {
                score += 100;
              }
              // Concentrate DON!! on the best attacker
              if (cmd.sourceId === bestAttacker) {
                score += 300;
              }
            }
            // Deprioritize leader attachment
            if (sourceCard.cardType === "leader") {
              score -= 50;
            }
          }
          break;
        }
        case "activateEffect": {
          score = 200;
          break;
        }
        case "endTurn": {
          score = 10;
          break;
        }
        case "mulligan": {
          score = 50;
          break;
        }
        case "startGame": {
          score = 100;
          break;
        }
        default:
          score = 1;
      }
      return { cmd, score };
    })
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score);

  for (const best of scored) {
    const command = commandFromDescriptor(state, seat, best.cmd);
    if (command) return command;
  }
  return null;
};

export const valueRankedStrategy: OnePieceBotStrategy = (state, seat, legalCommands) => {
  const myCommands = legalCommands.filter((c) => c.seat === seat);
  if (myCommands.length === 0) return null;

  // Find strongest active character to concentrate DON!! on
  let bestAttacker: string | null = null;
  let bestAttackerPower = 0;
  for (const cmd of myCommands) {
    if (cmd.type === "declareAttack" && cmd.sourceId) {
      const power = getTotalPower(state, cmd.sourceId);
      if (power > bestAttackerPower) {
        bestAttackerPower = power;
        bestAttacker = cmd.sourceId;
      }
    }
  }

  const scored = myCommands
    .map((cmd) => {
      let score = 0;
      switch (cmd.type) {
        case "playCard": {
          if (cmd.sourceId) {
            if (cmd.slotChoices !== undefined && cmd.slotChoices.length === 0) {
              score = -1;
              break;
            }
            const card = getCardForInstance(state, cmd.sourceId);
            const cost =
              card.cardType === "character" ||
              card.cardType === "event" ||
              card.cardType === "stage"
                ? card.cost
                : 0;
            const player = getPlayer(state, seat);
            const efficiency = cost > 0 ? player.activeDon / cost : 1;
            score = 1000 + cost * 50 + efficiency * 100;
            if (card.cardType === "character" && "power" in card && card.power) {
              score += card.power / 50;
            }
          }
          break;
        }
        case "declareAttack": {
          score = 600;
          if (cmd.targetIds?.length) {
            const target = getCardForInstance(state, cmd.targetIds[0]!);
            if (target.cardType === "leader") score += 300;
            if (cmd.sourceId) {
              const attacker = getCardForInstance(state, cmd.sourceId);
              if ("power" in attacker && attacker.power && attacker.power >= 5000) {
                score += 100;
              }
              // Prefer attacking with the strongest unit
              if (cmd.sourceId === bestAttacker) {
                score += 150;
              }
            }
          }
          break;
        }
        case "attachDon": {
          score = 400;
          if (cmd.sourceId) {
            const card = getCardForInstance(state, cmd.sourceId);
            const instance = state.cards[cmd.sourceId];
            if (card.cardType === "character") {
              score += 150;
              if (instance && !instance.rested) {
                score += 100;
              }
              // Concentrate DON!! on the best attacker
              if (cmd.sourceId === bestAttacker) {
                score += 400;
              }
            }
            // Deprioritize leader attachment
            if (card.cardType === "leader") {
              score -= 100;
            }
          }
          break;
        }
        case "activateEffect": {
          score = 250;
          break;
        }
        case "endTurn": {
          score = 5;
          break;
        }
        case "mulligan": {
          score = 30;
          break;
        }
        case "startGame": {
          score = 80;
          break;
        }
        default:
          score = 1;
      }
      return { cmd, score };
    })
    .filter((s) => s.score >= 0)
    .sort((a, b) => b.score - a.score);

  for (const best of scored) {
    const command = commandFromDescriptor(state, seat, best.cmd);
    if (command) return command;
  }
  return null;
};
