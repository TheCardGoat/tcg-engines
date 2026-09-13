/**
 * Arakni, Marionette profile from Yuki Lee Bender's Masterclass
 * (https://fabtcg.com/articles/masterclass-arakni/).
 *
 * Mark, then convert daggers and stealth finishers. Keep reactions (Toxin,
 * Savor) and don't flick the last Klaive until the opponent is low.
 */
import { buildFabRulesView } from "../../../rules/state-rules-view.ts";
import type { FabBotStrategy } from "../../bot-strategies.ts";
import { rulesViewForLegalCommands } from "../../legal-commands.ts";
import { chooseCompiledLineCommand, compileTurnLine } from "../line-compiler.ts";
import { buildHeuristicSnapshot } from "../snapshot.ts";
import type {
  FabCompiledLine,
  FabHeuristicCard,
  FabHeuristicSnapshot,
  FabLineRankingHint,
} from "../types.ts";
import {
  isArakniHero,
  isAssassinTrap,
  isChelicera,
  isDaggerPump,
  isFlickKnives,
  isHunterKlaive,
  isMaskOfDeceit,
  isStealthFinisher,
  isTarantulaToxin,
} from "./names.ts";

export interface ArakniBoardRead {
  readonly opponentMarked: boolean;
  readonly klaives: readonly FabHeuristicCard[];
  readonly chelicerae: readonly FabHeuristicCard[];
  readonly stealthFinishers: readonly FabHeuristicCard[];
  readonly daggerPumps: readonly FabHeuristicCard[];
  readonly toxin: FabHeuristicCard | undefined;
}

export function readArakniBoard(snapshot: FabHeuristicSnapshot): ArakniBoardRead {
  const arena = [...snapshot.equipment, ...snapshot.hand];
  return {
    opponentMarked: snapshot.opponentMarked,
    klaives: snapshot.equipment.filter(isHunterKlaive),
    chelicerae: snapshot.equipment.filter(isChelicera),
    stealthFinishers: snapshot.hand.filter(isStealthFinisher),
    daggerPumps: snapshot.hand.filter(isDaggerPump),
    toxin: arena.find(isTarantulaToxin) ?? snapshot.hand.find(isTarantulaToxin),
  };
}

export function arakniRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readArakniBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending && read.opponentMarked) {
    const finisher = read.stealthFinishers[0];
    if (finisher) {
      return {
        preferPlayInstanceId: finisher.instanceId,
        preferred: {
          instanceId: finisher.instanceId,
          name: finisher.name,
          role: "play",
          comboRole: "stealth-finisher",
        },
      };
    }
  }
  if (
    snapshot.arsenalHasRoom &&
    read.toxin &&
    snapshot.hand.some((card) => card.instanceId === read.toxin?.instanceId)
  ) {
    return {
      preferArsenalInstanceId: read.toxin.instanceId,
      preferred: {
        instanceId: read.toxin.instanceId,
        name: read.toxin.name,
        role: "arsenal",
        comboRole: "tarantula-toxin",
      },
    };
  }
  const leftover =
    read.stealthFinishers[0] ?? snapshot.hand.find(isAssassinTrap) ?? read.daggerPumps[0];
  if (leftover && snapshot.arsenalHasRoom && !snapshot.defending && snapshot.actionPoints === 0) {
    return {
      preferArsenalInstanceId: leftover.instanceId,
      preferred: {
        instanceId: leftover.instanceId,
        name: leftover.name,
        role: "arsenal",
        comboRole: "hold-trick",
      },
    };
  }
  return {};
}

export function arakniAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readArakniBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;

  if (line.kind === "play" && play && isStealthFinisher(play)) {
    bonus += read.opponentMarked ? 160 : 50;
  }
  if (line.kind === "play" && play && isDaggerPump(play) && snapshot.combatOpen) {
    bonus += 80;
  }
  if (line.kind === "activate" && play && isHunterKlaive(play)) {
    bonus += read.opponentMarked ? 20 : 110;
  }
  if (line.kind === "activate" && play && isChelicera(play) && read.opponentMarked) {
    bonus += 140;
  }
  if (line.kind === "activate" && play && isFlickKnives(play)) {
    if (!read.opponentMarked && read.klaives.length >= 2) bonus += 90;
    if (read.klaives.length <= 1 && (snapshot.opponentLife ?? 40) >= 15) bonus -= 180;
  }
  if (line.kind === "activate" && play && isMaskOfDeceit(play) && read.opponentMarked) {
    bonus += 70;
  }

  if (line.kind === "end-turn" && arsenal && isTarantulaToxin(arsenal)) bonus += 180;
  if (line.kind === "end-turn" && arsenal && isStealthFinisher(arsenal)) bonus += 50;

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card || card.isEquipment) continue;
      if (isTarantulaToxin(card) || isDaggerPump(card) || isStealthFinisher(card)) bonus -= 180;
    }
    if (read.opponentMarked) {
      const mask = [...spent]
        .map((id) => cardById(snapshot, id))
        .find((card) => card && isMaskOfDeceit(card));
      if (mask) bonus += 40;
    }
  }
  return bonus;
}

export const arakniStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...arakniRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: arakniAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function arakniProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isArakniHero(snapshot);
}

function cardById(
  snapshot: FabHeuristicSnapshot,
  instanceId: string,
): FabHeuristicCard | undefined {
  return (
    snapshot.hand.find((card) => card.instanceId === instanceId) ??
    snapshot.arsenal.find((card) => card.instanceId === instanceId) ??
    snapshot.equipment.find((card) => card.instanceId === instanceId) ??
    snapshot.banished.find((card) => card.instanceId === instanceId)
  );
}
