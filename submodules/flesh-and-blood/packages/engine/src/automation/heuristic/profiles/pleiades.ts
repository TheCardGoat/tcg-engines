/**
 * Pleiades, Superstar profile from Pablo Pintor's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-pleiades/).
 *
 * Land What Happens Next?, play suspense auras, then swing Cries of Encore /
 * Boulder Drop off a single blue. Do not block the auras or Cries.
 */
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import type { FabBotStrategy } from "../../bot-strategies.ts";
import { rulesViewForLegalCommands } from "../../legal-commands.ts";
import { chooseCompiledLineCommand, compileTurnLine } from "../line-compiler.ts";
import { buildHeuristicSnapshot, cardByInstance } from "../snapshot.ts";
import type {
  FabCompiledLine,
  FabHeuristicCard,
  FabHeuristicSnapshot,
  FabLineRankingHint,
} from "../types.ts";
import {
  isPleiadesHaymaker,
  isPleiadesHero,
  isPummel,
  isSuspenseAura,
  isThespianCharm,
  isWhatHappensNext,
} from "./names.ts";

export interface PleiadesBoardRead {
  readonly whatHappensNextLive: boolean;
  readonly whatHappensNext: FabHeuristicCard | undefined;
  readonly aura: FabHeuristicCard | undefined;
  readonly haymaker: FabHeuristicCard | undefined;
  readonly thespian: FabHeuristicCard | undefined;
}

export function readPleiadesBoard(snapshot: FabHeuristicSnapshot): PleiadesBoardRead {
  return {
    whatHappensNextLive: snapshot.arena.some(isWhatHappensNext),
    whatHappensNext: snapshot.hand.find(isWhatHappensNext),
    aura: snapshot.hand.find((card) => isSuspenseAura(card) && !isWhatHappensNext(card)),
    haymaker: snapshot.hand.find(isPleiadesHaymaker),
    thespian: snapshot.hand.find(isThespianCharm),
  };
}

export function pleiadesRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readPleiadesBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.whatHappensNext && !read.whatHappensNextLive) {
      return {
        preferPlayInstanceId: read.whatHappensNext.instanceId,
        preferred: {
          instanceId: read.whatHappensNext.instanceId,
          name: read.whatHappensNext.name,
          role: "play",
          comboRole: "what-happens-next",
        },
      };
    }
    if (read.aura) {
      return {
        preferPlayInstanceId: read.aura.instanceId,
        preferred: {
          instanceId: read.aura.instanceId,
          name: read.aura.name,
          role: "play",
          comboRole: "suspense-aura",
        },
      };
    }
    if (read.haymaker) {
      return {
        preferPlayInstanceId: read.haymaker.instanceId,
        preferred: {
          instanceId: read.haymaker.instanceId,
          name: read.haymaker.name,
          role: "play",
          comboRole: "cries-of-encore",
        },
      };
    }
  }
  if (read.thespian && snapshot.arsenalHasRoom) {
    return {
      preferArsenalInstanceId: read.thespian.instanceId,
      preferred: {
        instanceId: read.thespian.instanceId,
        name: read.thespian.name,
        role: "arsenal",
        comboRole: "thespian-charm",
      },
    };
  }
  return {};
}

export function pleiadesAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readPleiadesBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isWhatHappensNext(play)) bonus += read.whatHappensNextLive ? 80 : 180;
    if (isSuspenseAura(play) && !isWhatHappensNext(play)) bonus += 150;
    if (isPleiadesHaymaker(play)) bonus += 160;
    if (isThespianCharm(play) && snapshot.arena.some(isSuspenseAura)) bonus += 130;
    if (isPummel(play) && snapshot.combatOpen) bonus += 120;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (isWhatHappensNext(card) || isPleiadesHaymaker(card)) bonus -= 180;
      if (isSuspenseAura(card)) bonus -= 80;
    }
  }
  return bonus;
}

export const pleiadesStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...pleiadesRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: pleiadesAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function pleiadesProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isPleiadesHero(snapshot);
}
