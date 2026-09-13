/**
 * Teklovossen, Esteemed Magnate profile from Yuki Lee Bender's Masterclass
 * (https://fabtcg.com/articles/masterclass-teklovossen/).
 *
 * Boost to put Evos in banished, play Evos from banished (not hand), deplete
 * Evo defense before overwriting, arsenal Fabricate, and turn the corner with
 * Tank / War Machine / Blast Rig / Singularity once the suit is online.
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
  evoSlot,
  isBetaBase,
  isBoostAttack,
  isEvo,
  isFabricate,
  isFirewall,
  isHaymaker,
  isSingularityOrRecall,
  isSteelSoul,
  isTeklovossenHero,
  isTwinDrive,
} from "./names.ts";

export interface TekloBoardRead {
  readonly banishedEvos: readonly FabHeuristicCard[];
  readonly handEvos: readonly FabHeuristicCard[];
  readonly equippedEvos: readonly FabHeuristicCard[];
  readonly fabricate: FabHeuristicCard | undefined;
  readonly boostAttacks: readonly FabHeuristicCard[];
  readonly shouldBoost: boolean;
}

export function readTekloBoard(snapshot: FabHeuristicSnapshot): TekloBoardRead {
  const banishedEvos = snapshot.banished.filter(isEvo);
  const handEvos = snapshot.hand.filter(isEvo);
  const equippedEvos = snapshot.equipment.filter(isEvo);
  const fabricate = snapshot.hand.find(isFabricate) ?? snapshot.arsenal.find(isFabricate);
  const boostAttacks = snapshot.hand.filter(isBoostAttack);
  const shouldBoost = banishedEvos.length < 3 || equippedEvos.length < 3;
  return { banishedEvos, handEvos, equippedEvos, fabricate, boostAttacks, shouldBoost };
}

export function tekloRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readTekloBoard(snapshot);
  const boost = read.boostAttacks.find(isTwinDrive) ?? read.boostAttacks[0];
  if (boost && snapshot.isActive && !snapshot.defending && read.shouldBoost) {
    return {
      preferPlayInstanceId: boost.instanceId,
      preferred: {
        instanceId: boost.instanceId,
        name: boost.name,
        role: "play",
        comboRole: "boost",
      },
    };
  }
  const preferredBanished = preferredBanishedEvo(read.banishedEvos);
  if (
    preferredBanished &&
    snapshot.isActive &&
    !snapshot.defending &&
    snapshot.actionPoints > 0 &&
    snapshot.turnNumber > 1
  ) {
    return {
      preferPlayInstanceId: preferredBanished.instanceId,
      preferred: {
        instanceId: preferredBanished.instanceId,
        name: preferredBanished.name,
        role: "play",
        comboRole: "evo-from-banished",
      },
    };
  }
  if (read.fabricate && snapshot.arsenalHasRoom && snapshot.hand.includes(read.fabricate)) {
    return {
      preferArsenalInstanceId: read.fabricate.instanceId,
      preferred: {
        instanceId: read.fabricate.instanceId,
        name: read.fabricate.name,
        role: "arsenal",
        comboRole: "fabricate",
      },
    };
  }
  return {};
}

export function tekloAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readTekloBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;
  const from = playFrom(line);

  if (line.kind === "play" && play && isBoostAttack(play)) {
    bonus += read.shouldBoost ? 120 : -40;
    if (isTwinDrive(play) && read.shouldBoost) bonus += 40;
  }
  if (line.kind === "play" && play && isEvo(play)) {
    if (from === "banished") {
      bonus += 180;
      if (isPreferredBanishedPlay(play, read.banishedEvos)) bonus += 50;
    } else if (snapshot.turnNumber > 1) {
      bonus -= 240;
    }
  }
  if (line.kind === "end-turn" && arsenal && isFabricate(arsenal)) bonus += 200;
  if (line.kind === "play" && play && isFabricate(play) && snapshot.defending) bonus += 90;
  if (line.kind === "play" && play && isHaymaker(play) && read.equippedEvos.length >= 3) {
    bonus += 90;
  }
  if (line.kind === "activate" && snapshot.isActive && read.banishedEvos.length > 0) {
    bonus += 40;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (isSingularityOrRecall(card)) bonus -= 220;
      if (read.shouldBoost && isBoostAttack(card) && !card.isEquipment) bonus -= 80;
      if (isEvo(card) && card.isEquipment) bonus += 25;
      if (isFirewall(card)) bonus += 20;
    }
    if (!read.shouldBoost && (snapshot.remainingDamage ?? 0) >= 3 && spent.size > 0) {
      bonus += 40;
    }
  }

  if (line.kind === "pitch") {
    for (const id of line.pitchInstanceIds) {
      const card = cardById(snapshot, id);
      if (card && isBetaBase(card)) bonus += 30;
      if (card && isHaymaker(card)) bonus -= 80;
    }
  }
  return bonus;
}

export const teklovossenStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...tekloRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: tekloAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function teklovossenProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isTeklovossenHero(snapshot);
}

function preferredBanishedEvo(
  banishedEvos: readonly FabHeuristicCard[],
): FabHeuristicCard | undefined {
  const souls = banishedEvos.filter(isSteelSoul);
  const bases = banishedEvos.filter(isBetaBase);
  const matchingBase = bases.find((base) =>
    souls.some((soul) => evoSlot(soul) !== null && evoSlot(soul) === evoSlot(base)),
  );
  if (matchingBase) return matchingBase;
  return (
    bases.find((base) => evoSlot(base) === "chest") ??
    bases.find((base) => evoSlot(base) === "head") ??
    bases[0] ??
    souls[0] ??
    banishedEvos[0]
  );
}

function isPreferredBanishedPlay(
  play: FabHeuristicCard,
  banishedEvos: readonly FabHeuristicCard[],
): boolean {
  return preferredBanishedEvo(banishedEvos)?.instanceId === play.instanceId;
}

function playFrom(line: FabCompiledLine): string {
  const from = line.command.payload.from;
  return typeof from === "string" ? from : "hand";
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
