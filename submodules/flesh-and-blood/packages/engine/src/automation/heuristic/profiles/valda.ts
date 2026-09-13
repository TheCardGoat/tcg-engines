/**
 * Valda, Seismic Impact profile from Yuki Lee Bender's Masterclass
 * (https://fabtcg.com/articles/masterclass-valda/).
 *
 * Bank Seismic Surges, dominate crush haymakers, arsenal Eruption, heave
 * Disenchantment instead of filling arsenal, and spend the fridge on on-hits.
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
  isBasaltBoots,
  isCivicPeak,
  isCrushHaymaker,
  isLeyLine,
  isPummel,
  isSeismicEruption,
  isTectonicPlating,
  isTestament,
  isValdaHero,
} from "./names.ts";

export interface ValdaBoardRead {
  readonly surges: number;
  readonly dominateReady: boolean;
  readonly crush: readonly FabHeuristicCard[];
  readonly eruption: FabHeuristicCard | undefined;
  readonly leyLine: FabHeuristicCard | undefined;
  readonly heave: readonly FabHeuristicCard[];
}

export function readValdaBoard(snapshot: FabHeuristicSnapshot): ValdaBoardRead {
  const cards = [...snapshot.hand, ...snapshot.arsenal];
  const eruption = cards.find(isSeismicEruption);
  return {
    surges: snapshot.seismicSurgeCount,
    dominateReady: snapshot.seismicSurgeCount >= 3 || Boolean(eruption),
    crush: cards.filter(isCrushHaymaker),
    eruption,
    leyLine: cards.find(isLeyLine),
    heave: snapshot.hand.filter((card) => card.hasHeave || namedHeave(card)),
  };
}

export function valdaRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readValdaBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.leyLine && snapshot.arena.every((card) => !isLeyLine(card))) {
      return {
        preferPlayInstanceId: read.leyLine.instanceId,
        preferred: {
          instanceId: read.leyLine.instanceId,
          name: read.leyLine.name,
          role: "play",
          comboRole: "ley-line",
        },
      };
    }
    const crush = read.crush.find((card) => snapshot.hand.includes(card));
    if (
      crush &&
      (read.dominateReady || crush.cost <= snapshot.resourcePoints + bluePitch(snapshot))
    ) {
      return {
        preferPlayInstanceId: crush.instanceId,
        preferred: {
          instanceId: crush.instanceId,
          name: crush.name,
          role: "play",
          comboRole: "crush",
        },
      };
    }
  }
  if (
    read.eruption &&
    snapshot.arsenalHasRoom &&
    snapshot.hand.some((card) => card.instanceId === read.eruption?.instanceId)
  ) {
    return {
      preferArsenalInstanceId: read.eruption.instanceId,
      preferred: {
        instanceId: read.eruption.instanceId,
        name: read.eruption.name,
        role: "arsenal",
        comboRole: "seismic-eruption",
      },
    };
  }
  const testament = snapshot.equipment.find(isTestament);
  if (snapshot.defending && testament && snapshot.seismicSurgeCount >= 6) {
    return {
      preferred: { instanceId: testament.instanceId, name: testament.name, role: "defend" },
    };
  }
  return {};
}

export function valdaAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readValdaBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;

  if (line.kind === "play" && play && isLeyLine(play)) bonus += 160;
  if (line.kind === "play" && play && isCrushHaymaker(play)) {
    bonus += read.dominateReady ? 180 : 80;
  }
  if (line.kind === "play" && play && isPummel(play) && snapshot.combatOpen) bonus += 90;
  if (line.kind === "end-turn" && arsenal && isSeismicEruption(arsenal)) bonus += 200;
  if (line.kind === "end-turn" && !arsenal && read.heave.length > 0 && snapshot.arsenalHasRoom) {
    bonus += 160;
  }
  if (
    line.kind === "end-turn" &&
    arsenal &&
    read.heave.some((card) => card.instanceId !== arsenal.instanceId)
  ) {
    bonus -= 80;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (isPummel(card) || isCrushHaymaker(card) || isSeismicEruption(card)) bonus -= 180;
      if (isBasaltBoots(card)) bonus += 25;
      if (isTectonicPlating(card) && snapshot.equipment.some(isBasaltBoots)) bonus -= 20;
      if (isTestament(card) && snapshot.seismicSurgeCount >= 6) bonus += 80;
      if (isCivicPeak(card) && snapshot.attackHasGoAgain) bonus -= 60;
    }
    if ((snapshot.remainingDamage ?? 0) >= 4 && spent.size > 0 && !read.dominateReady) {
      bonus += 30;
    }
  }
  return bonus;
}

export const valdaStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...valdaRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: valdaAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function valdaProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isValdaHero(snapshot);
}

function namedHeave(card: FabHeuristicCard): boolean {
  const key = `${card.name} ${card.canonicalId}`.toLowerCase();
  return (
    key.includes("disenchantment") || key.includes("thunder quake") || key.includes("thunder-quake")
  );
}

function bluePitch(snapshot: FabHeuristicSnapshot): number {
  return snapshot.hand.reduce((sum, card) => sum + (card.pitch === 3 ? 3 : 0), 0);
}

function cardById(
  snapshot: FabHeuristicSnapshot,
  instanceId: string,
): FabHeuristicCard | undefined {
  return (
    snapshot.hand.find((card) => card.instanceId === instanceId) ??
    snapshot.arsenal.find((card) => card.instanceId === instanceId) ??
    snapshot.equipment.find((card) => card.instanceId === instanceId) ??
    snapshot.arena.find((card) => card.instanceId === instanceId)
  );
}
