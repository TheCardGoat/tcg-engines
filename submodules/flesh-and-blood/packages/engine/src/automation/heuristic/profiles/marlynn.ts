/**
 * Marlynn, Treasure Hunter profile from Pablo Pintor's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-marlynn/).
 *
 * Load harpoons into arsenal, fire them off Hammerhead, generate Gold off
 * Hook/pumps/Tipple, and do not throw the harpoons away on defense.
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
  isCodexOfFrailty,
  isCrownOfDominion,
  isGoldBaitedHook,
  isGoldToken,
  isGoAgainPirate,
  isHarpoon,
  isMarlynnHero,
  isMarlynnPump,
} from "./names.ts";

export interface MarlynnBoardRead {
  readonly gold: boolean;
  readonly arsenalHarpoon: FabHeuristicCard | undefined;
  readonly handHarpoon: FabHeuristicCard | undefined;
  readonly pump: FabHeuristicCard | undefined;
  readonly tipple: FabHeuristicCard | undefined;
  readonly hook: FabHeuristicCard | undefined;
  readonly crown: FabHeuristicCard | undefined;
}

export function readMarlynnBoard(snapshot: FabHeuristicSnapshot): MarlynnBoardRead {
  return {
    gold: snapshot.arena.some(isGoldToken),
    arsenalHarpoon: snapshot.arsenal.find(isHarpoon),
    handHarpoon: snapshot.hand.find(isHarpoon),
    pump: snapshot.hand.find(isMarlynnPump),
    tipple: snapshot.hand.find(isGoAgainPirate),
    hook: snapshot.equipment.find(isGoldBaitedHook),
    crown: snapshot.equipment.find(isCrownOfDominion),
  };
}

export function marlynnRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readMarlynnBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.arsenalHarpoon) {
      return {
        preferPlayInstanceId: read.arsenalHarpoon.instanceId,
        preferred: {
          instanceId: read.arsenalHarpoon.instanceId,
          name: read.arsenalHarpoon.name,
          role: "play",
          comboRole: "harpoon",
        },
      };
    }
    if (read.pump) {
      return {
        preferPlayInstanceId: read.pump.instanceId,
        preferred: {
          instanceId: read.pump.instanceId,
          name: read.pump.name,
          role: "play",
          comboRole: "arrow-pump",
        },
      };
    }
    if (read.tipple) {
      return {
        preferPlayInstanceId: read.tipple.instanceId,
        preferred: {
          instanceId: read.tipple.instanceId,
          name: read.tipple.name,
          role: "play",
          comboRole: "golden-tipple",
        },
      };
    }
    if (read.crown && !read.gold && snapshot.actionPoints > 0) {
      return {
        preferPlayInstanceId: read.crown.instanceId,
        preferred: {
          instanceId: read.crown.instanceId,
          name: read.crown.name,
          role: "play",
          comboRole: "first-gold",
        },
      };
    }
  }
  if (read.handHarpoon && snapshot.arsenalHasRoom) {
    return {
      preferArsenalInstanceId: read.handHarpoon.instanceId,
      preferred: {
        instanceId: read.handHarpoon.instanceId,
        name: read.handHarpoon.name,
        role: "arsenal",
        comboRole: "harpoon",
      },
    };
  }
  return {};
}

export function marlynnAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readMarlynnBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId
    ? cardByInstance(snapshot, line.arsenalInstanceId)
    : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isHarpoon(play)) bonus += 180;
    if (isMarlynnPump(play)) bonus += 150;
    if (isGoAgainPirate(play)) bonus += 140;
    if (isCodexOfFrailty(play)) bonus += 160;
    if (isCrownOfDominion(play) && !read.gold) bonus += 120;
    if (isGoldBaitedHook(play) && (read.arsenalHarpoon || read.tipple)) bonus += 90;
  }
  if (line.kind === "end-turn" && arsenal && isHarpoon(arsenal)) bonus += 200;

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (isHarpoon(card) || isCodexOfFrailty(card) || isMarlynnPump(card)) bonus -= 180;
    }
  }
  return bonus;
}

export const marlynnStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...marlynnRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: marlynnAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function marlynnProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isMarlynnHero(snapshot);
}
