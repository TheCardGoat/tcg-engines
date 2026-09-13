/**
 * Puffin, Hightail profile from Sam Sutherland's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-puffin/).
 *
 * Crank twice (Cog in the Machine, Polly, Workshop) to draw, then convert
 * 2-cost on-hits and hide Pummel. Do not block Palantir, Zeppelin, or Pummel.
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
  isCogInTheMachine,
  isPuffinCrankItem,
  isPuffinHero,
  isPuffinOnHit,
  isPuffinSmallAttack,
  isPummel,
} from "./names.ts";

export interface PuffinBoardRead {
  readonly cogInTheMachine: FabHeuristicCard | undefined;
  readonly crankItem: FabHeuristicCard | undefined;
  readonly onHit: FabHeuristicCard | undefined;
  readonly smallAttack: FabHeuristicCard | undefined;
  readonly pummel: FabHeuristicCard | undefined;
}

export function readPuffinBoard(snapshot: FabHeuristicSnapshot): PuffinBoardRead {
  const cards = [...snapshot.hand, ...snapshot.arsenal];
  return {
    cogInTheMachine: snapshot.hand.find(isCogInTheMachine),
    crankItem: snapshot.hand.find(isPuffinCrankItem) ?? snapshot.equipment.find(isPuffinCrankItem),
    onHit: cards.find(isPuffinOnHit),
    smallAttack: snapshot.hand.find(isPuffinSmallAttack),
    pummel: snapshot.hand.find(isPummel),
  };
}

export function puffinRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readPuffinBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.cogInTheMachine) {
      return {
        preferPlayInstanceId: read.cogInTheMachine.instanceId,
        preferred: {
          instanceId: read.cogInTheMachine.instanceId,
          name: read.cogInTheMachine.name,
          role: "play",
          comboRole: "double-crank",
        },
      };
    }
    if (read.crankItem && snapshot.actionPoints > 0) {
      return {
        preferPlayInstanceId: read.crankItem.instanceId,
        preferred: {
          instanceId: read.crankItem.instanceId,
          name: read.crankItem.name,
          role: "play",
          comboRole: "crank",
        },
      };
    }
    if (read.onHit && snapshot.hand.includes(read.onHit)) {
      return {
        preferPlayInstanceId: read.onHit.instanceId,
        preferred: {
          instanceId: read.onHit.instanceId,
          name: read.onHit.name,
          role: "play",
          comboRole: "two-cost-on-hit",
        },
      };
    }
    if (read.smallAttack) {
      return {
        preferPlayInstanceId: read.smallAttack.instanceId,
        preferred: {
          instanceId: read.smallAttack.instanceId,
          name: read.smallAttack.name,
          role: "play",
          comboRole: "soup-up",
        },
      };
    }
  }
  if (read.onHit && snapshot.arsenalHasRoom && snapshot.hand.includes(read.onHit)) {
    return {
      preferArsenalInstanceId: read.onHit.instanceId,
      preferred: {
        instanceId: read.onHit.instanceId,
        name: read.onHit.name,
        role: "arsenal",
        comboRole: "two-cost-on-hit",
      },
    };
  }
  return {};
}

export function puffinAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId
    ? cardByInstance(snapshot, line.arsenalInstanceId)
    : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isCogInTheMachine(play)) bonus += 180;
    if (isPuffinCrankItem(play)) bonus += 140;
    if (isPuffinOnHit(play)) bonus += 160;
    if (isPuffinSmallAttack(play)) bonus += 120;
    if (isPummel(play) && snapshot.combatOpen) bonus += 150;
  }
  if (line.kind === "end-turn" && arsenal && isPuffinOnHit(arsenal)) bonus += 180;

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (isPuffinOnHit(card) || isPummel(card) || isCogInTheMachine(card)) bonus -= 180;
    }
  }
  return bonus;
}

export const puffinStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...puffinRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: puffinAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function puffinProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isPuffinHero(snapshot);
}
