import { getCard } from "../../../cards/src/index.ts";
import type { Condition, LeaderCard, Target } from "@tcg/op-types";
import {
  cardName,
  getCardCost,
  getCardPower,
  getInstance,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import { candidatesForTarget } from "./targeting.ts";
import type { MatchSeat, MatchState } from "../types.ts";

function evaluateCondition(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  condition: Condition,
): { supported: boolean; matches: boolean } {
  const source = getInstance(state, sourceInstanceId);
  const controllerPlayer = getPlayer(state, controller);
  const opponentPlayer = getPlayer(state, otherSeat(controller));
  const leader = getCard(controllerPlayer.leaderCardId) as LeaderCard;

  switch (condition.condition) {
    case "donAttached":
      return { supported: true, matches: source.attachedDon >= condition.amount };
    case "turn":
      return {
        supported: true,
        matches:
          condition.value === "your"
            ? state.activeSeat === controller
            : state.activeSeat !== controller,
      };
    case "leaderName":
      return { supported: true, matches: cardName(leader) === condition.name };
    case "leaderTrait":
      return { supported: true, matches: (leader.traits ?? []).includes(condition.trait) };
    case "leaderMulticolored":
      return { supported: true, matches: leader.color.length > 1 };
    case "leaderColor":
      return { supported: true, matches: leader.color.includes(condition.color) };
    case "zoneCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const total =
        condition.zone === "hand"
          ? player.hand.length
          : condition.zone === "life"
            ? player.life.length
            : condition.zone === "deck"
              ? player.deck.length
              : condition.zone === "trash"
                ? player.trash.length
                : condition.zone === "character"
                  ? player.characterArea.filter(Boolean).length
                  : 0;
      switch (condition.comparison) {
        case "eq":
          return { supported: true, matches: total === condition.value };
        case "lt":
          return { supported: true, matches: total < condition.value };
        case "lte":
          return { supported: true, matches: total <= condition.value };
        case "gt":
          return { supported: true, matches: total > condition.value };
        case "gte":
          return { supported: true, matches: total >= condition.value };
      }
      break;
    }
    case "handCount": {
      const total =
        condition.player === "self" ? controllerPlayer.hand.length : opponentPlayer.hand.length;
      switch (condition.comparison) {
        case "eq":
          return { supported: true, matches: total === condition.value };
        case "lt":
          return { supported: true, matches: total < condition.value };
        case "lte":
          return { supported: true, matches: total <= condition.value };
        case "gt":
          return { supported: true, matches: total > condition.value };
        case "gte":
          return { supported: true, matches: total >= condition.value };
      }
      break;
    }
    case "lifeCount": {
      const total =
        condition.player === "self" ? controllerPlayer.life.length : opponentPlayer.life.length;
      switch (condition.comparison) {
        case "eq":
          return { supported: true, matches: total === condition.value };
        case "lt":
          return { supported: true, matches: total < condition.value };
        case "lte":
          return { supported: true, matches: total <= condition.value };
        case "gt":
          return { supported: true, matches: total > condition.value };
        case "gte":
          return { supported: true, matches: total >= condition.value };
      }
      break;
    }
    case "cardState":
      if (condition.target !== "this") {
        return { supported: false, matches: false };
      }
      if (condition.property === "state") {
        return {
          supported: true,
          matches: condition.value === (source.rested ? "rested" : "active"),
        };
      }
      if (condition.property === "power" && typeof condition.value === "number") {
        const value = getCardPower(state, sourceInstanceId);
        switch (condition.comparison) {
          case "eq":
            return { supported: true, matches: value === condition.value };
          case "lt":
            return { supported: true, matches: value < condition.value };
          case "lte":
            return { supported: true, matches: value <= condition.value };
          case "gt":
            return { supported: true, matches: value > condition.value };
          case "gte":
            return { supported: true, matches: value >= condition.value };
        }
      }
      if (condition.property === "cost" && typeof condition.value === "number") {
        const value = getCardCost(state, sourceInstanceId);
        switch (condition.comparison) {
          case "eq":
            return { supported: true, matches: value === condition.value };
          case "lt":
            return { supported: true, matches: value < condition.value };
          case "lte":
            return { supported: true, matches: value <= condition.value };
          case "gt":
            return { supported: true, matches: value > condition.value };
          case "gte":
            return { supported: true, matches: value >= condition.value };
        }
      }
      return { supported: false, matches: false };
    case "hasCard":
    case "notHasCard": {
      const target: Target = {
        player: condition.player,
        zones: [condition.zone],
        count: { amount: "all" },
        filters: condition.filters,
      };
      const candidates = candidatesForTarget(state, controller, sourceInstanceId, target);
      if (candidates === null) {
        return { supported: false, matches: false };
      }
      return {
        supported: true,
        matches:
          condition.condition === "hasCard" ? candidates.length > 0 : candidates.length === 0,
      };
    }
    case "donFieldCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const total = player.activeDon + player.restedDon;
      switch (condition.comparison) {
        case "eq":
          return { supported: true, matches: total === condition.value };
        case "lt":
          return { supported: true, matches: total < condition.value };
        case "lte":
          return { supported: true, matches: total <= condition.value };
        case "gt":
          return { supported: true, matches: total > condition.value };
        case "gte":
          return { supported: true, matches: total >= condition.value };
      }
      break;
    }
    case "lifeComparison":
      return {
        supported: true,
        matches:
          condition.selfComparison === "gt"
            ? controllerPlayer.life.length > opponentPlayer.life.length
            : condition.selfComparison === "gte"
              ? controllerPlayer.life.length >= opponentPlayer.life.length
              : condition.selfComparison === "lt"
                ? controllerPlayer.life.length < opponentPlayer.life.length
                : condition.selfComparison === "lte"
                  ? controllerPlayer.life.length <= opponentPlayer.life.length
                  : controllerPlayer.life.length === opponentPlayer.life.length,
      };
    case "playedThisTurn":
      return { supported: true, matches: source.playedOnTurn === state.turnNumber };
    case "existsOnField": {
      const target: Target = {
        player: "self",
        zones: [condition.zone],
        count: { amount: "all" },
        filters: condition.filters,
      };
      const candidates = candidatesForTarget(state, controller, sourceInstanceId, target);
      if (candidates === null) {
        return { supported: false, matches: false };
      }
      return { supported: true, matches: candidates.length > 0 };
    }
    case "compound": {
      if (condition.operator === "and") {
        let allSupported = true;
        for (const inner of condition.conditions) {
          const result = evaluateCondition(state, controller, sourceInstanceId, inner);
          allSupported &&= result.supported;
          if (!result.matches) {
            return { supported: allSupported, matches: false };
          }
        }
        return { supported: allSupported, matches: true };
      }

      let anySupported = false;
      for (const inner of condition.conditions) {
        const result = evaluateCondition(state, controller, sourceInstanceId, inner);
        anySupported ||= result.supported;
        if (result.matches) {
          return { supported: anySupported, matches: true };
        }
      }
      return { supported: anySupported, matches: false };
    }
    case "compareHands":
    case "donFieldComparison":
    case "donGiven":
    case "faceUpLife":
    case "replacement":
    case "triggerEvent":
    case "zoneCountComparison":
      return { supported: false, matches: false };
  }

  return { supported: false, matches: false };
}

export function evaluateConditions(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  conditions: Condition[] | undefined,
): { supported: boolean; matches: boolean } {
  if (!conditions?.length) {
    return { supported: true, matches: true };
  }

  let supported = true;
  for (const condition of conditions) {
    const result = evaluateCondition(state, controller, sourceInstanceId, condition);
    supported &&= result.supported;
    if (!result.matches) {
      return { supported, matches: false };
    }
  }

  return { supported, matches: true };
}
