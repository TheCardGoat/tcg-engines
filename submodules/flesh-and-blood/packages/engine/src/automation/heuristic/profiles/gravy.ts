/**
 * Gravy Bones, Shipwrecked Looter profile from Yuki Lee Bender's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-gravy-bones/).
 *
 * Put a blue in the graveyard to open Watery Grave, replay GY allies (Compass
 * go again on the first), chain go-again Pirates, and convert rather than
 * over-blocking the crew.
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
  isBlueWateryGraveEnabler,
  isCompassOfSunkenDepths,
  isCrownOfDominion,
  isDeadThreads,
  isGoAgainPirate,
  isGoldBaitedHook,
  isGoldToken,
  isGravyAllyFinisher,
  isGravyHero,
  isMageMasterBoots,
  isWateryGraveCard,
} from "./names.ts";

export interface GravyBoardRead {
  readonly wateryGraveLive: boolean;
  readonly gold: FabHeuristicCard | undefined;
  readonly gyAllies: readonly FabHeuristicCard[];
  readonly gyWateryGrave: readonly FabHeuristicCard[];
  readonly goAgainPirates: readonly FabHeuristicCard[];
  readonly blueEnablers: readonly FabHeuristicCard[];
  readonly compass: FabHeuristicCard | undefined;
  readonly crown: FabHeuristicCard | undefined;
  readonly deadThreads: FabHeuristicCard | undefined;
  readonly hook: FabHeuristicCard | undefined;
  readonly mageMasterBoots: FabHeuristicCard | undefined;
}

export function readGravyBoard(snapshot: FabHeuristicSnapshot): GravyBoardRead {
  return {
    wateryGraveLive: snapshot.bluePutIntoGraveyardThisTurn,
    gold: snapshot.arena.find(isGoldToken),
    gyAllies: snapshot.graveyard.filter(isGravyAllyFinisher),
    gyWateryGrave: snapshot.graveyard.filter(isWateryGraveCard),
    goAgainPirates: snapshot.hand.filter(isGoAgainPirate),
    blueEnablers: snapshot.hand.filter(isBlueWateryGraveEnabler),
    compass: snapshot.equipment.find(isCompassOfSunkenDepths),
    crown: snapshot.equipment.find(isCrownOfDominion),
    deadThreads: snapshot.equipment.find(isDeadThreads),
    hook: snapshot.equipment.find(isGoldBaitedHook),
    mageMasterBoots: snapshot.equipment.find(isMageMasterBoots),
  };
}

export function gravyRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readGravyBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.wateryGraveLive) {
      const gyPlay = read.gyAllies[0] ?? read.gyWateryGrave[0];
      if (gyPlay) {
        return {
          preferPlayInstanceId: gyPlay.instanceId,
          preferred: {
            instanceId: gyPlay.instanceId,
            name: gyPlay.name,
            role: "play",
            comboRole: "watery-grave-ally",
          },
        };
      }
    }
    const pirate = read.goAgainPirates[0];
    if (pirate) {
      return {
        preferPlayInstanceId: pirate.instanceId,
        preferred: {
          instanceId: pirate.instanceId,
          name: pirate.name,
          role: "play",
          comboRole: "go-again-pirate",
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
    if (!read.wateryGraveLive) {
      const enabler = read.blueEnablers[0];
      if (enabler) {
        return {
          preferPlayInstanceId: enabler.instanceId,
          preferred: {
            instanceId: enabler.instanceId,
            name: enabler.name,
            role: "play",
            comboRole: "watery-grave-enabler",
          },
        };
      }
    }
  }
  return {};
}

export function gravyAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readGravyBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const from = playFrom(line);

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (from === "graveyard" && isWateryGraveCard(play)) {
      bonus += read.wateryGraveLive ? 180 : -80;
      if (isGravyAllyFinisher(play)) bonus += 20;
      if (read.compass) bonus += 20;
    }
    if (isGoAgainPirate(play)) bonus += 160;
    if (isBlueWateryGraveEnabler(play) && !read.wateryGraveLive) bonus += 90;
    if (isCrownOfDominion(play) && !read.gold) bonus += 140;
    if (isGoldBaitedHook(play) && read.goAgainPirates.length > 0) bonus += 100;
    if (isDeadThreads(play) && (read.gyAllies.length > 0 || read.gyWateryGrave.length > 0)) {
      bonus += 80;
    }
    if (isMageMasterBoots(play) && read.wateryGraveLive) bonus += 70;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (isGoAgainPirate(card) || isGravyAllyFinisher(card)) bonus -= 180;
      if (isBlueWateryGraveEnabler(card) && !read.wateryGraveLive) bonus -= 80;
    }
  }
  return bonus;
}

export const gravyStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...gravyRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: gravyAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function gravyProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isGravyHero(snapshot);
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
    snapshot.arena.find((card) => card.instanceId === instanceId) ??
    snapshot.graveyard.find((card) => card.instanceId === instanceId)
  );
}
