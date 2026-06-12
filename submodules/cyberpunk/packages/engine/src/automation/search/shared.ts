import type { PlayerId } from "../../types/branded.ts";
import type { CommandEnvelope } from "../../types/commands.ts";
import type { AvailableMove, PlayerPrompt } from "../../view/player-prompt.ts";
import type { AIStrategy, EngineHandle, MoveDecision } from "../types.ts";
import { decisionFromMove } from "../strategies/move-args.ts";
import { runResolver } from "../ai-player.ts";

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

function fixedAbilityPicker(candidate: { cardId: string; abilityIndex: number }) {
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

/**
 * Run two strategies against each other from the engine's current state
 * until the game ends or `maxSteps` is hit. Returns the winning player id,
 * or `null` for a draw / step-cap exit. Mutates the supplied engine — pass
 * a fork if you need the original to remain untouched.
 */
export function runRollout(
  engine: EngineHandle,
  ownPlayerId: PlayerId,
  rolloutStrategy: AIStrategy,
  rng: () => number,
  maxSteps: number,
): string | null {
  const view = engine.getFilteredView(ownPlayerId);
  const playerIds = Object.keys(view.players) as PlayerId[];
  for (let step = 0; step < maxSteps; step++) {
    const v = engine.getFilteredView(ownPlayerId);
    if (v.gameEnded) return v.winnerId;
    const ordered = [...playerIds].sort((a, b) => {
      const aActive = (a as string) === v.activePlayerId ? 0 : 1;
      const bActive = (b as string) === v.activePlayerId ? 0 : 1;
      return aActive - bActive;
    });
    let acted = false;
    for (const pid of ordered) {
      const prompt = engine.getPrompt(pid);
      if (prompt.status !== "action" && prompt.status !== "choice") continue;
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
      if (decision.kind !== "command") continue;
      const command: CommandEnvelope = {
        commandID: `rollout-${pid}-${step}`,
        move: decision.move,
        input: decision.args ? { args: decision.args } : undefined,
      };
      const r = engine.processCommand(command, pid);
      if (r.success) {
        acted = true;
        break;
      }
    }
    if (!acted) return null;
  }
  return null;
}
