import { getCard } from "../../../cards/src/runtime-catalog.ts";
import type { Condition, LeaderCard, Target } from "@tcg/op-types";
import {
  cardNames,
  donCardsOnField,
  getCardCost,
  getCardPower,
  getInstance,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import { candidatesForTarget } from "./targeting.ts";
import { matchesTargetFilter } from "./targeting.ts";
import type { MatchSeat, MatchState, ResolutionItem } from "../types.ts";

type TriggerEvent = Extract<ResolutionItem, { kind: "effectBlock" }>["triggerEvent"];

function evaluateCondition(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  condition: Condition,
  previousActionTargetIds: string[],
  triggerEvent?: TriggerEvent,
): { supported: boolean; matches: boolean } {
  const source = getInstance(state, sourceInstanceId);
  const controllerPlayer = getPlayer(state, controller);
  const opponentPlayer = getPlayer(state, otherSeat(controller));
  const leader = getCard(controllerPlayer.leaderCardId) as LeaderCard;

  switch (condition.condition) {
    case "donAttached":
      return {
        supported: true,
        matches:
          (triggerEvent?.instanceId === sourceInstanceId && triggerEvent.attachedDon !== undefined
            ? triggerEvent.attachedDon
            : source.attachedDon) >= condition.amount,
      };
    case "turn":
      return {
        supported: true,
        matches:
          condition.value === "your"
            ? state.activeSeat === controller
            : state.activeSeat !== controller,
      };
    case "leaderName":
      return { supported: true, matches: cardNames(leader).includes(condition.name) };
    case "leaderAttribute":
      return { supported: true, matches: leader.attribute === condition.attribute };
    case "leaderTrait":
      return {
        supported: true,
        matches:
          condition.match === "exact"
            ? (leader.traits ?? []).includes(condition.trait)
            : (leader.traits ?? []).some((trait) => trait.includes(condition.trait)),
      };
    case "leaderMulticolored":
      return { supported: true, matches: leader.color.length > 1 };
    case "leaderColor":
      return { supported: true, matches: leader.color.includes(condition.color) };
    case "zoneCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const seat = condition.player === "self" ? controller : otherSeat(controller);
      const instanceIds =
        condition.zone === "hand"
          ? player.hand
          : condition.zone === "life"
            ? player.life
            : condition.zone === "deck"
              ? player.deck
              : condition.zone === "trash"
                ? player.trash
                : condition.zone === "character"
                  ? player.characterArea.filter(
                      (instanceId): instanceId is string => instanceId !== null,
                    )
                  : condition.zone === "leader"
                    ? [player.leaderInstanceId]
                    : condition.zone === "stage"
                      ? player.stageArea
                        ? [player.stageArea]
                        : []
                      : condition.zone === "field"
                        ? [
                            player.leaderInstanceId,
                            ...player.characterArea.filter(
                              (instanceId): instanceId is string => instanceId !== null,
                            ),
                            ...(player.stageArea ? [player.stageArea] : []),
                          ]
                        : [];
      let total =
        condition.zone === "costArea"
          ? player.activeDon + player.restedDon
          : condition.zone === "don"
            ? donCardsOnField(state, seat)
            : condition.zone === "donDeck"
              ? player.donDeckCount
              : condition.zone === "field"
                ? 1 + player.characterArea.filter(Boolean).length + (player.stageArea ? 1 : 0)
                : instanceIds.length;
      if (condition.filters?.length) {
        if (
          condition.zone === "costArea" ||
          condition.zone === "don" ||
          condition.zone === "donDeck"
        ) {
          return { supported: false, matches: false };
        }
        let supported = true;
        total = instanceIds.filter((instanceId) =>
          condition.filters!.every((filter) => {
            const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
            supported &&= result.supported;
            return result.matches;
          }),
        ).length;
        if (!supported) {
          return { supported: false, matches: false };
        }
      }
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
    case "zoneValueTotal": {
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
      const total = candidates.reduce(
        (sum, instanceId) =>
          sum +
          (condition.property === "cost"
            ? getCardCost(state, instanceId)
            : getCardPower(state, instanceId)),
        0,
      );
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
    case "combinedZoneCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const seat = condition.player === "self" ? controller : otherSeat(controller);
      const countForZone = (zone: (typeof condition.zones)[number]) => {
        switch (zone) {
          case "hand":
            return player.hand.length;
          case "life":
            return player.life.length;
          case "deck":
            return player.deck.length;
          case "trash":
            return player.trash.length;
          case "character":
            return player.characterArea.filter(Boolean).length;
          case "leader":
            return 1;
          case "stage":
            return player.stageArea ? 1 : 0;
          case "costArea":
            return player.activeDon + player.restedDon;
          case "don":
            return donCardsOnField(state, seat);
          case "donDeck":
            return player.donDeckCount;
          case "field":
            return 1 + player.characterArea.filter(Boolean).length + (player.stageArea ? 1 : 0);
        }
      };
      const total = condition.zones.reduce((sum, zone) => sum + countForZone(zone), 0);
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
    case "givenDonCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const fieldIds = [
        player.leaderInstanceId,
        ...player.characterArea.filter((id): id is string => Boolean(id)),
        ...(player.stageArea ? [player.stageArea] : []),
      ];
      const total = fieldIds.reduce(
        (sum, instanceId) => sum + getInstance(state, instanceId).attachedDon,
        0,
      );
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
    case "totalLifeCount": {
      const total = controllerPlayer.life.length + opponentPlayer.life.length;
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
    case "restedCardCount": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      const fieldIds = [
        player.leaderInstanceId,
        ...player.characterArea.filter((instanceId): instanceId is string => Boolean(instanceId)),
        ...(player.stageArea ? [player.stageArea] : []),
      ];
      const total =
        player.restedDon +
        fieldIds.filter((instanceId) => getInstance(state, instanceId).rested).length;
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
      const seat = condition.player === "self" ? controller : otherSeat(controller);
      const total =
        condition.state === "active"
          ? getPlayer(state, seat).activeDon
          : condition.state === "rested"
            ? getPlayer(state, seat).restedDon
            : donCardsOnField(state, seat);
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
    case "donFieldComparison": {
      const selfTotal = donCardsOnField(state, controller);
      const opponentTotal = donCardsOnField(state, otherSeat(controller));
      const difference = condition.difference ?? 0;
      return {
        supported: true,
        matches:
          condition.selfComparison === "gt"
            ? selfTotal > opponentTotal + difference
            : condition.selfComparison === "gte"
              ? selfTotal >= opponentTotal + difference
              : condition.selfComparison === "lt"
                ? selfTotal < opponentTotal - difference
                : condition.selfComparison === "lte"
                  ? selfTotal <= opponentTotal - difference
                  : Math.abs(selfTotal - opponentTotal) === difference,
      };
    }
    case "zoneCountComparison": {
      if (condition.zone !== "character" || condition.selfComparison !== "lt") {
        return { supported: false, matches: false };
      }
      const selfTotal = controllerPlayer.characterArea.filter(Boolean).length;
      const opponentTotal = opponentPlayer.characterArea.filter(Boolean).length;
      return {
        supported: true,
        matches: selfTotal <= opponentTotal - condition.difference,
      };
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
        player: condition.player ?? "any",
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
    case "previousActionTarget": {
      let supported = true;
      const matches = previousActionTargetIds.some((instanceId) =>
        condition.filters.every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          supported &&= result.supported;
          return result.matches;
        }),
      );
      return { supported, matches };
    }
    case "compound": {
      if (condition.operator === "and") {
        let allSupported = true;
        for (const inner of condition.conditions) {
          const result = evaluateCondition(
            state,
            controller,
            sourceInstanceId,
            inner,
            previousActionTargetIds,
            triggerEvent,
          );
          allSupported &&= result.supported;
          if (!result.matches) {
            return { supported: allSupported, matches: false };
          }
        }
        return { supported: allSupported, matches: true };
      }

      let anySupported = false;
      for (const inner of condition.conditions) {
        const result = evaluateCondition(
          state,
          controller,
          sourceInstanceId,
          inner,
          previousActionTargetIds,
          triggerEvent,
        );
        anySupported ||= result.supported;
        if (result.matches) {
          return { supported: anySupported, matches: true };
        }
      }
      return { supported: anySupported, matches: false };
    }
    case "compareHands": {
      const selfCount = controllerPlayer.hand.length;
      const opponentCount = opponentPlayer.hand.length;
      const adjustedOpponent = opponentCount - condition.difference;
      switch (condition.selfComparison) {
        case "eq":
          return { supported: true, matches: selfCount === adjustedOpponent };
        case "lt":
          return { supported: true, matches: selfCount < adjustedOpponent };
        case "lte":
          return { supported: true, matches: selfCount <= adjustedOpponent };
        case "gt":
          return { supported: true, matches: selfCount > adjustedOpponent };
        case "gte":
          return { supported: true, matches: selfCount >= adjustedOpponent };
      }
      break;
    }
    case "donGiven": {
      const seat = condition.player === "self" ? controller : otherSeat(controller);
      const player = getPlayer(state, seat);
      return {
        supported: true,
        matches: [
          player.leaderInstanceId,
          ...player.characterArea.filter((instanceId): instanceId is string => Boolean(instanceId)),
        ].some((instanceId) => getInstance(state, instanceId).attachedDon > 0),
      };
    }
    case "battledOpponentCharacterThisTurn":
      return {
        supported: true,
        matches: source.battledOpponentCharacterOnTurn === state.turnNumber,
      };
    case "activeDonCount": {
      const value = controllerPlayer.activeDon;
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
    case "faceUpLife": {
      const player = condition.player === "self" ? controllerPlayer : opponentPlayer;
      return {
        supported: true,
        matches: player.life.some((instanceId) => getInstance(state, instanceId).faceUp),
      };
    }
    case "triggerEventCard": {
      const instanceId = triggerEvent?.instanceId;
      if (!instanceId || !state.cards[instanceId]) {
        return { supported: true, matches: false };
      }
      return {
        supported: true,
        matches: condition.filters.every((filter) => {
          const result = matchesTargetFilter(state, sourceInstanceId, instanceId, filter);
          return result.supported && result.matches;
        }),
      };
    }
    case "replacement":
    case "triggerEvent":
      return { supported: false, matches: false };
  }

  return { supported: false, matches: false };
}

export function evaluateConditions(
  state: MatchState,
  controller: MatchSeat,
  sourceInstanceId: string,
  conditions: Condition[] | undefined,
  previousActionTargetIds: string[] = [],
  triggerEvent?: TriggerEvent,
): { supported: boolean; matches: boolean } {
  if (!conditions?.length) {
    return { supported: true, matches: true };
  }

  let supported = true;
  for (const condition of conditions) {
    const result = evaluateCondition(
      state,
      controller,
      sourceInstanceId,
      condition,
      previousActionTargetIds,
      triggerEvent,
    );
    supported &&= result.supported;
    if (!result.matches) {
      return { supported, matches: false };
    }
  }

  return { supported, matches: true };
}
