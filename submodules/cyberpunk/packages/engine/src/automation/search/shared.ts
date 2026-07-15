import type { PlayerId } from "../../types/branded.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type {
  AbilityCandidate,
  AvailableMove,
  ChoicePrompt,
  PlayerPrompt,
} from "../../view/player-prompt.ts";
import type { AIStrategy, EngineHandle, MoveDecision } from "../types.ts";
import { decisionFromMove } from "../strategies/move-args.ts";
import { runResolver } from "../ai-player.ts";
import { createSemanticCycleDetector, stableBotHash } from "@tcg/bot-core";

/**
 * Map every available move to one or more concrete `MoveDecision`s. For
 * multi-candidate moves (selectCard / selectAbility / playCard) this
 * expands one decision per candidate so a search ranks "play card A" vs
 * "play card B" independently. Concede is filtered out unless it's the
 * only legal action.
 */
export function enumerateCandidateActions(
  prompt: PlayerPrompt,
): (MoveDecision & { kind: "command" })[] {
  const out: (MoveDecision & { kind: "command" })[] = [];
  for (const move of prompt.availableMoves) {
    if (move.moveId === "concede") continue;
    out.push(...expandMove(move));
  }
  if (out.length === 0) {
    const concede = prompt.availableMoves.find((m) => m.moveId === "concede");
    if (concede) {
      const decision = decisionFromMove(concede, defaultPicker());
      if (decision.kind === "command") out.push(decision);
    }
  }
  return out;
}

export function enumerateChoiceActions(
  choice: ChoicePrompt,
): (MoveDecision & { kind: "command" })[] {
  switch (choice.type) {
    case "scry":
      return [];
    case "revealDestination":
      return choice.payload.destinations.map((destination) =>
        command("resolveRevealDestination", { destination }),
      );
    case "chooseTarget":
      return enumerateTargetChoices(choice);
    case "chooseEffect":
      return [];
    case "chooseTrigger": {
      const actions = choice.payload.options.map((option) =>
        command("resolveTrigger", { triggerId: option.triggerId }),
      );
      if (choice.payload.canPass) actions.push(command("resolveTrigger", { pass: true }));
      return actions;
    }
    case "chooseGigsToSteal":
      return combinations(
        choice.payload.eligibleDice.map((die) => die.dieId),
        choice.payload.count,
      ).map((dieIds) => command("resolveStealGigs", { dieIds }));
    case "chooseCardToPlay":
      return choice.payload.cardIds.map((cardId) => command("resolveCardToPlay", { cardId }));
    case "chooseCardToMove": {
      const actions = choice.payload.cardIds.map((cardId) =>
        command("resolveCardToMove", { cardId }),
      );
      if (choice.payload.canDecline) actions.push(command("resolveCardToMove", { pass: true }));
      return actions;
    }
    case "chooseCardType":
      return choice.payload.cardTypes.map((cardType) =>
        command("resolveCardTypeChoice", { cardType }),
      );
    case "gainGig":
      return choice.payload.allowedDieIds.map((dieId) => command("gainGig", { dieId }));
  }
}

function enumerateTargetChoices(
  choice: Extract<ChoicePrompt, { type: "chooseTarget" }>,
): (MoveDecision & { kind: "command" })[] {
  const payload = choice.payload;
  if (payload.type === "adjustGig") {
    if (
      payload.currentValue === undefined ||
      payload.maxFaceValue === undefined ||
      payload.maxAmount === undefined
    ) {
      return [];
    }
    const min =
      payload.direction === "increase"
        ? payload.currentValue
        : Math.max(1, payload.currentValue - payload.maxAmount);
    const max =
      payload.direction === "decrease"
        ? payload.currentValue
        : Math.min(payload.maxFaceValue, payload.currentValue + payload.maxAmount);
    const actions: (MoveDecision & { kind: "command" })[] = [];
    for (let value = min; value <= max; value++) {
      actions.push(command("resolveAdjustGig", { value }));
    }
    return actions;
  }

  const eligible = (payload.eligibleIds ?? []).filter((id) => {
    if (payload.targetPurpose !== "playCard") return true;
    const available = payload.availableEddiesAfterCosts ?? 0;
    return (payload.effectiveCostsByCardId?.[id] ?? Number.POSITIVE_INFINITY) <= available;
  });
  if (payload.type === "discardFromHand") {
    const amount = payload.amount ?? 1;
    const actions = combinations(eligible, amount).map((cardIds) =>
      command("resolveDiscardFromHand", { cardIds }),
    );
    if (payload.canDecline) actions.push(command("resolveDiscardFromHand", { pass: true }));
    return actions;
  }

  const min = payload.min ?? 1;
  const max = Math.min(payload.max ?? 1, eligible.length);
  const actions: (MoveDecision & { kind: "command" })[] = [];
  for (let count = min; count <= max; count++) {
    for (const targetIds of combinations(eligible, count)) {
      actions.push(command("resolveEffectTarget", { targetIds }));
    }
  }
  if (payload.canDecline) actions.push(command("resolveEffectTarget", { pass: true }));
  return actions;
}

function combinations(values: string[], count: number, limit = 24): string[][] {
  if (count === 0) return [[]];
  if (count < 0 || count > values.length) return [];
  const out: string[][] = [];
  const visit = (start: number, selected: string[]) => {
    if (out.length >= limit) return;
    if (selected.length === count) {
      out.push([...selected]);
      return;
    }
    for (let index = start; index < values.length; index++) {
      selected.push(values[index]!);
      visit(index + 1, selected);
      selected.pop();
      if (out.length >= limit) return;
    }
  };
  visit(0, []);
  return out;
}

function command(
  move: Extract<MoveDecision, { kind: "command" }>["move"],
  args?: Record<string, unknown>,
): MoveDecision & { kind: "command" } {
  return { kind: "command", move, ...(args ? { args } : {}) };
}

function expandMove(move: AvailableMove): (MoveDecision & { kind: "command" })[] {
  const out: (MoveDecision & { kind: "command" })[] = [];
  switch (move.inputSpec.type) {
    case "none": {
      const d = decisionFromMove(move, defaultPicker());
      if (d.kind === "command") out.push(d);
      return out;
    }
    case "selectCard": {
      for (const cardId of move.inputSpec.candidates) {
        const d = decisionFromMove(move, fixedCardPicker(cardId));
        if (d.kind === "command") out.push(d);
      }
      return out;
    }
    case "selectPair": {
      for (const from of move.inputSpec.fromCandidates) {
        for (const to of move.inputSpec.toCandidates) {
          const d = decisionFromMove(move, fixedPairPicker(from, to));
          if (d.kind === "command") out.push(d);
        }
      }
      return out;
    }
    case "selectAbility": {
      for (const candidate of move.inputSpec.candidates) {
        const d = decisionFromMove(move, fixedAbilityPicker(candidate));
        if (d.kind === "command") out.push(d);
      }
      return out;
    }
    case "playCard": {
      for (const candidate of move.inputSpec.candidates) {
        if (candidate.attachTargets === undefined) {
          const d = decisionFromMove(move, fixedPlayCardPicker({ cardId: candidate.cardId }));
          if (d.kind === "command") out.push(d);
        } else {
          for (const target of candidate.attachTargets) {
            const d = decisionFromMove(
              move,
              fixedPlayCardPicker({ cardId: candidate.cardId, attachToId: target }),
            );
            if (d.kind === "command") out.push(d);
          }
        }
      }
      return out;
    }
  }
}

function defaultPicker() {
  return {
    pickFromCandidates: (cands: string[]) => cands[0] ?? null,
    pickPair: () => null,
  };
}

function fixedCardPicker(cardId: string) {
  return {
    pickFromCandidates: () => cardId,
    pickPair: () => null,
  };
}

function fixedPairPicker(from: string, to: string) {
  return {
    pickFromCandidates: () => null,
    pickPair: () => ({ from, to }),
  };
}

function fixedAbilityPicker(candidate: AbilityCandidate) {
  return {
    pickFromCandidates: () => null,
    pickPair: () => null,
    pickAbility: () => candidate,
  };
}

function fixedPlayCardPicker(pick: { cardId: string; attachToId?: string }) {
  return {
    pickFromCandidates: () => null,
    pickPair: () => null,
    pickPlayCard: () => pick,
  };
}

export type RolloutFailureReason = "stuck" | "illegal" | "repeatedState" | "noAction" | "maxSteps";

export type RolloutOutcome =
  | { kind: "winner"; winnerId: string }
  | { kind: "draw"; winnerId: null }
  | {
      kind: "automationFailure";
      failedPlayerId: string;
      winnerId: string | null;
      reason: RolloutFailureReason;
    };

/**
 * Run two strategies against each other from the engine's current state.
 * Every non-terminal automation exit is a loss for the player that failed;
 * callers must never mistake a stuck/illegal/capped rollout for a draw.
 * Mutates the supplied engine — pass a fork if you need the original.
 */
export function runRollout(
  engine: EngineHandle,
  ownPlayerId: PlayerId,
  rolloutStrategy: AIStrategy,
  rng: () => number,
  maxSteps: number,
): RolloutOutcome {
  const view = engine.getFilteredView(ownPlayerId);
  const playerIds = Object.keys(view.players) as PlayerId[];
  const cycleDetector = createSemanticCycleDetector({ repeatThreshold: 8, windowSize: 64 });
  for (let step = 0; step < maxSteps; step++) {
    const v = engine.getFilteredView(ownPlayerId);
    if (v.gameEnded) return terminalRolloutOutcome(v.winnerId);
    const ordered = [...playerIds].sort((a, b) => {
      const aActive = (a as string) === v.activePlayerId ? 0 : 1;
      const bActive = (b as string) === v.activePlayerId ? 0 : 1;
      return aActive - bActive;
    });
    const nextPlayer = ordered.find((pid) => {
      const status = engine.getPrompt(pid).status;
      return status === "action" || status === "choice";
    });
    if (cycleDetector.observe(semanticRolloutHash(v)).repeated) {
      return automationFailure(playerIds, nextPlayer ?? ownPlayerId, "repeatedState");
    }
    if (!nextPlayer) {
      const activePlayer = playerIds.find((pid) => (pid as string) === v.activePlayerId);
      return automationFailure(playerIds, activePlayer ?? ownPlayerId, "noAction");
    }

    let acted = false;
    for (const pid of [nextPlayer]) {
      const prompt = engine.getPrompt(pid);
      const subCtx = {
        view: engine.getFilteredView(pid),
        playerId: pid,
        prompt,
        rng,
      };
      // Mirror what AIPlayer.step() does: route pending choices through the
      // resolver dispatch (default + strategy.decideChoice overrides). The
      // built-in pure-view strategies can't construct valid resolve* commands
      // for choice prompts via decideAction — without this routing, every
      // searchDeck / chooseTarget / chooseGigsToSteal mid-rollout would bail
      // and return a noisy null verdict, drowning the search signal.
      const decision: MoveDecision =
        prompt.status === "choice" && prompt.choice
          ? runResolver(prompt.choice, rolloutStrategy, subCtx)
          : rolloutStrategy.decideAction(subCtx);
      if (decision.kind !== "command") {
        return automationFailure(playerIds, pid, "stuck");
      }
      const command: CommandEnvelope = {
        commandID: `rollout-${pid}-${step}`,
        move: decision.move,
        input: decision.args ? { args: decision.args } : undefined,
      };
      const r = engine.processCommand(command, pid);
      if (!r.success) {
        return automationFailure(playerIds, pid, "illegal");
      }
      acted = true;
    }
    if (!acted) return automationFailure(playerIds, nextPlayer, "noAction");
  }
  return automationFailure(playerIds, ownPlayerId, "maxSteps");
}

function terminalRolloutOutcome(winnerId: string | null): RolloutOutcome {
  return winnerId ? { kind: "winner", winnerId } : { kind: "draw", winnerId: null };
}

function automationFailure(
  playerIds: PlayerId[],
  failedPlayerId: PlayerId,
  reason: RolloutFailureReason,
): RolloutOutcome {
  const rivals = playerIds.filter((playerId) => playerId !== failedPlayerId);
  return {
    kind: "automationFailure",
    failedPlayerId: failedPlayerId as string,
    winnerId: rivals.length === 1 ? (rivals[0] as string) : null,
    reason,
  };
}

function semanticRolloutHash(view: unknown): string {
  return stableBotHash(
    JSON.parse(
      JSON.stringify(view, (key, value) =>
        key === "stateID" || key === "_stateID" ? undefined : value,
      ),
    ),
  );
}
