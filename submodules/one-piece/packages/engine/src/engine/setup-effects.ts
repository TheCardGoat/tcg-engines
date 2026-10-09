import { playCardFromEffect } from "../effects/actions.ts";
import { matchesTargetFilter } from "../effects/targeting.ts";
import {
  cardName,
  emitLog,
  enqueueResolution,
  getCardForInstance,
  getInstance,
  getPlayer,
  otherSeat,
  shuffle,
} from "../shared.ts";
import { createChoicePrompt, drawTopCard, formatCardList } from "../state.ts";
import type { EngineCommand, MatchSeat, MatchState, PromptState } from "../types.ts";

function stageCandidates(state: MatchState, seat: MatchSeat): string[] {
  const player = getPlayer(state, seat);
  const rule = getCardForInstance(state, player.leaderInstanceId).effects?.startOfGame
    ?.playStageFromDeck;
  if (!rule) return [];
  return player.deck.filter(
    (id) =>
      getCardForInstance(state, id).cardType === "stage" &&
      rule.filters.every((filter) => {
        const result = matchesTargetFilter(state, player.leaderInstanceId, id, filter);
        return result.supported && result.matches;
      }),
  );
}

export function beginStartOfGameEffects(state: MatchState): void {
  // Current CR 5-2-1-5-1: the chooser resolves first, even after choosing to go second.
  const chooser = state.setup.joKenPo.winner ?? state.config.firstPlayer;
  state.setup.pendingStartOfGameSeats = [chooser, otherSeat(chooser)];
  advanceStartOfGameEffects(state);
}

export function advanceStartOfGameEffects(state: MatchState): void {
  while (state.setup.pendingStartOfGameSeats.length) {
    const seat = state.setup.pendingStartOfGameSeats.shift()!;
    const player = getPlayer(state, seat);
    if (!getCardForInstance(state, player.leaderInstanceId).effects?.startOfGame) continue;
    createChoicePrompt(state, {
      choiceKind: "chooseOption",
      seat,
      label: "Search your deck for a starting Stage?",
      details: "If you search, play up to one eligible Stage and shuffle your deck.",
      sourceCardId: player.leaderCardId,
      sourceInstanceId: player.leaderInstanceId,
      eventId: null,
      options: [
        { id: "yes", value: "yes", label: "Search" },
        { id: "no", value: "no", label: "Skip" },
      ],
      minSelections: 1,
      maxSelections: 1,
      context: { action: "play", role: "startOfGame" },
      resolutionContext: { intent: "startOfGameSearch", controller: seat },
    });
    return;
  }
  if (state.setup.openingHandsDrawn) return;
  state.setup.openingHandsDrawn = true;
  for (const seat of [state.config.firstPlayer, otherSeat(state.config.firstPlayer)]) {
    const player = getPlayer(state, seat);
    for (let index = 0; index < state.config.openingHandSize; index += 1) {
      if (!drawTopCard(state, seat, { suppressLog: true })) break;
    }
    emitLog(
      state,
      "system",
      `${player.playerName} draws ${state.config.openingHandSize} opening cards.`,
      {
        visibility: "private",
        privateMessages: { [seat]: `Cards drawn: ${formatCardList(state, player.hand)}.` },
        judgeMessage: `${player.playerName} opening hand: ${formatCardList(state, player.hand)}.`,
      },
    );
  }
}

function finishStartingSearch(state: MatchState, seat: MatchSeat): void {
  const player = getPlayer(state, seat);
  player.deck = shuffle(player.deck, `${state.config.seed ?? "0"}:startOfGame:${seat}`);
  player.deck.forEach((id, index) => {
    getInstance(state, id).zoneIndex = index;
  });
  emitLog(state, seat, `${player.playerName} shuffles their deck.`, { visibility: "public" });
  enqueueResolution(state, { kind: "startOfGameContinue" });
}

export function resolveStartOfGameStage(
  state: MatchState,
  prompt: PromptState,
  command: Extract<EngineCommand, { type: "resolvePrompt" }>,
): boolean {
  const context = prompt.resolutionContext;
  if (
    (context?.intent !== "startOfGameStage" && context?.intent !== "startOfGameSearch") ||
    state.status !== "setup" ||
    state.setup.openingHandsDrawn
  )
    return false;
  const seat = context.controller;
  const player = getPlayer(state, seat);
  if (context.intent === "startOfGameSearch") {
    if (command.optionId !== "yes" && command.optionId !== "no") return false;
    if (command.optionId === "no") {
      enqueueResolution(state, { kind: "startOfGameContinue" });
      return true;
    }
    const candidateIds = stageCandidates(state, seat);
    if (!candidateIds.length) {
      finishStartingSearch(state, seat);
      return true;
    }
    createChoicePrompt(state, {
      choiceKind: "selectCards",
      seat,
      label: "Play up to one starting Stage from your deck.",
      details: "After choosing, shuffle your deck before drawing your opening hand.",
      sourceCardId: player.leaderCardId,
      sourceInstanceId: player.leaderInstanceId,
      eventId: null,
      options: candidateIds.map((id) => ({
        id,
        value: id,
        targetId: id,
        label: cardName(getCardForInstance(state, id)),
      })),
      minSelections: 0,
      maxSelections: 1,
      context: { action: "play", role: "startOfGame" },
      resolutionContext: { intent: "startOfGameStage", controller: seat, candidateIds },
    });
    return true;
  }
  const ids = command.selectedIds ?? [];
  const liveCandidates = stageCandidates(state, seat);
  if (
    ids.length > 1 ||
    ids.some((id) => !context.candidateIds.includes(id) || !liveCandidates.includes(id))
  )
    return false;
  if (ids[0] && !playCardFromEffect(state, seat, ids[0], "active", player.leaderInstanceId))
    return false;
  finishStartingSearch(state, seat);
  return true;
}
