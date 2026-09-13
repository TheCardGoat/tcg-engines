/**
 * Kayo, Underhanded Cheat profile from Sam Sutherland's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-kayo/).
 *
 * Play weak attacks so Kayo can set base 6, resolve Big Bully / Mocking Blow
 * while ahead on life, and keep Nimby / Outside Interference off the block.
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
  isBigBully,
  isKayoHero,
  isLookingForAScrap,
  isMockingBlow,
  isNimby,
  isOutsideInterference,
  isPremiumRedThreat,
  isVigorToken,
} from "./names.ts";

export interface KayoBoardRead {
  readonly lifeLead: boolean;
  readonly vigor: boolean;
  readonly goAgainAttack: FabHeuristicCard | undefined;
  readonly bigBully: FabHeuristicCard | undefined;
  readonly mockingBlow: FabHeuristicCard | undefined;
  readonly nimby: FabHeuristicCard | undefined;
  readonly scrap: FabHeuristicCard | undefined;
  readonly bruteHaymaker: FabHeuristicCard | undefined;
  readonly interference: FabHeuristicCard | undefined;
}

export function readKayoBoard(snapshot: FabHeuristicSnapshot): KayoBoardRead {
  const opponentLife = snapshot.opponentLife;
  return {
    lifeLead: opponentLife === null || snapshot.life > opponentLife,
    vigor: snapshot.arena.some(isVigorToken),
    goAgainAttack: snapshot.hand.find((card) => card.isAttack && card.hasGoAgain),
    bigBully: snapshot.hand.find(isBigBully),
    mockingBlow: snapshot.hand.find(isMockingBlow),
    nimby: snapshot.hand.find(isNimby),
    scrap: snapshot.hand.find(isLookingForAScrap),
    bruteHaymaker: snapshot.hand.find(isPremiumRedThreat),
    interference: snapshot.hand.find(isOutsideInterference),
  };
}

export function kayoRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readKayoBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    // Race: open on a go-again attack so the action point refunds and a second
    // attack can follow. Without this Kayo opens on a non-go-again signature
    // (Mocking Blow / Big Bully), plays one attack per turn, and cannot out-damage
    // a turtling opponent's healing before the action budget runs out.
    if (read.goAgainAttack) {
      return {
        preferPlayInstanceId: read.goAgainAttack.instanceId,
        preferred: {
          instanceId: read.goAgainAttack.instanceId,
          name: read.goAgainAttack.name,
          role: "play",
          comboRole: "go-again-opener",
        },
      };
    }
    if (read.bigBully) {
      return {
        preferPlayInstanceId: read.bigBully.instanceId,
        preferred: {
          instanceId: read.bigBully.instanceId,
          name: read.bigBully.name,
          role: "play",
          comboRole: "big-bully",
        },
      };
    }
    if (read.mockingBlow) {
      return {
        preferPlayInstanceId: read.mockingBlow.instanceId,
        preferred: {
          instanceId: read.mockingBlow.instanceId,
          name: read.mockingBlow.name,
          role: "play",
          comboRole: "mocking-blow",
        },
      };
    }
    if (read.nimby) {
      return {
        preferPlayInstanceId: read.nimby.instanceId,
        preferred: {
          instanceId: read.nimby.instanceId,
          name: read.nimby.name,
          role: "play",
          comboRole: "nimby",
        },
      };
    }
    if (read.bruteHaymaker) {
      return {
        preferPlayInstanceId: read.bruteHaymaker.instanceId,
        preferred: {
          instanceId: read.bruteHaymaker.instanceId,
          name: read.bruteHaymaker.name,
          role: "play",
          comboRole: "swing-big",
        },
      };
    }
    if (read.scrap) {
      return {
        preferPlayInstanceId: read.scrap.instanceId,
        preferred: {
          instanceId: read.scrap.instanceId,
          name: read.scrap.name,
          role: "play",
          comboRole: "looking-for-a-scrap",
        },
      };
    }
    if (read.interference) {
      return {
        preferPlayInstanceId: read.interference.instanceId,
        preferred: {
          instanceId: read.interference.instanceId,
          name: read.interference.name,
          role: "play",
          comboRole: "outside-interference",
        },
      };
    }
  }
  return {};
}

export function kayoAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readKayoBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (play.isAttack && play.hasGoAgain) bonus += 170;
    if (isBigBully(play)) bonus += read.lifeLead ? 180 : 140;
    if (isMockingBlow(play)) bonus += read.lifeLead ? 170 : 110;
    if (isNimby(play)) bonus += 150;
    if (isPremiumRedThreat(play)) bonus += 160;
    if (isLookingForAScrap(play)) bonus += 130;
    if (isOutsideInterference(play)) bonus += 140;
    if (isVigorToken(play)) bonus += 40;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (isBigBully(card) || isMockingBlow(card) || isNimby(card) || isOutsideInterference(card)) {
        bonus -= 180;
      }
    }
  }
  return bonus;
}

export const kayoStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...kayoRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: kayoAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function kayoProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isKayoHero(snapshot);
}
