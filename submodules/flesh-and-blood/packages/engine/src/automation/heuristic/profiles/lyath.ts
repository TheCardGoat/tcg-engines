/**
 * Lyath Goldmane, Vile Savant profile from Yuki Lee Bender's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-lyath-goldmane/).
 *
 * Stack suspense auras and delayed pumps, then convert Tear Asunder / Short
 * Shrift / Mocking Blow. Prefer Titan's Fist over expensive haymakers.
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
  isLyathHero,
  isLyathPump,
  isMockingBlow,
  isShortShrift,
  isSuspenseAura,
  isTearAsunder,
  isTitansFist,
} from "./names.ts";

export interface LyathBoardRead {
  readonly lifeLead: boolean;
  readonly auras: readonly FabHeuristicCard[];
  readonly aura: FabHeuristicCard | undefined;
  readonly pump: FabHeuristicCard | undefined;
  readonly tearAsunder: FabHeuristicCard | undefined;
  readonly shortShrift: FabHeuristicCard | undefined;
  readonly mockingBlow: FabHeuristicCard | undefined;
  readonly hammer: FabHeuristicCard | undefined;
}

export function readLyathBoard(snapshot: FabHeuristicSnapshot): LyathBoardRead {
  const opponentLife = snapshot.opponentLife;
  return {
    lifeLead: opponentLife === null || snapshot.life > opponentLife,
    auras: snapshot.arena.filter(isSuspenseAura),
    aura: snapshot.hand.find(isSuspenseAura),
    pump: snapshot.hand.find(isLyathPump),
    tearAsunder: snapshot.hand.find(isTearAsunder),
    shortShrift: snapshot.hand.find(isShortShrift),
    mockingBlow: snapshot.hand.find(isMockingBlow),
    hammer: snapshot.equipment.find(isTitansFist),
  };
}

export function lyathRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readLyathBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
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
    if (read.tearAsunder && read.auras.length > 0) {
      return {
        preferPlayInstanceId: read.tearAsunder.instanceId,
        preferred: {
          instanceId: read.tearAsunder.instanceId,
          name: read.tearAsunder.name,
          role: "play",
          comboRole: "tear-asunder",
        },
      };
    }
    if (read.mockingBlow && read.lifeLead) {
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
    if (read.shortShrift) {
      return {
        preferPlayInstanceId: read.shortShrift.instanceId,
        preferred: {
          instanceId: read.shortShrift.instanceId,
          name: read.shortShrift.name,
          role: "play",
          comboRole: "short-shrift",
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
          comboRole: "delayed-pump",
        },
      };
    }
    if (read.tearAsunder) {
      return {
        preferPlayInstanceId: read.tearAsunder.instanceId,
        preferred: {
          instanceId: read.tearAsunder.instanceId,
          name: read.tearAsunder.name,
          role: "play",
          comboRole: "tear-asunder",
        },
      };
    }
    if (read.hammer && snapshot.actionPoints > 0 && snapshot.combatOpen === false) {
      return {
        preferPlayInstanceId: read.hammer.instanceId,
        preferred: {
          instanceId: read.hammer.instanceId,
          name: read.hammer.name,
          role: "play",
          comboRole: "titans-fist",
        },
      };
    }
  }
  return {};
}

export function lyathAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readLyathBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isSuspenseAura(play)) bonus += 160;
    if (isLyathPump(play)) bonus += 140;
    if (isTearAsunder(play)) bonus += read.auras.length > 0 ? 180 : 130;
    if (isShortShrift(play)) bonus += 150;
    if (isMockingBlow(play)) bonus += read.lifeLead ? 160 : 80;
    if (isTitansFist(play)) bonus += 110;
    if (play.cost >= 3 && play.isAttack && !isTearAsunder(play) && !isShortShrift(play)) {
      bonus -= 80;
    }
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (isTearAsunder(card) || isShortShrift(card) || isMockingBlow(card) || isLyathPump(card)) {
        bonus -= 180;
      }
      if (isSuspenseAura(card)) bonus -= 80;
    }
  }
  return bonus;
}

export const lyathStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...lyathRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: lyathAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function lyathProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isLyathHero(snapshot);
}
