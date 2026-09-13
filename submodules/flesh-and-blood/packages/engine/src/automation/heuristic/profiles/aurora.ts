/**
 * Aurora, Legacy of Tempest profile from Pablo Pintor's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-aurora/).
 *
 * Chain Lightning go-again attacks, convert quickstrike off Embodiment, send
 * Gone in a Flash with an instant, finish leftover AP on Scorpio — not Snatch.
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
  isAuroraHero,
  isEmbodimentOfLightning,
  isFacePurgatory,
  isFlowGenerator,
  isGoneInAFlash,
  isLightningArsenal,
  isLightningFlow,
  isLightningGoAgainAttack,
  isLightningGreaves,
  isLightningInstant,
  isOminousExcavation,
  isQuickstrikeAttack,
  isQuickSuccession,
  isRedlineFinisher,
  isScorpio,
} from "./names.ts";

export interface AuroraBoardRead {
  readonly lightningFlows: number;
  readonly embodimentReady: boolean;
  readonly goAgainAttacks: readonly FabHeuristicCard[];
  readonly quickstrike: readonly FabHeuristicCard[];
  readonly goneInAFlash: FabHeuristicCard | undefined;
  readonly instant: FabHeuristicCard | undefined;
  readonly arsenalEnabler: FabHeuristicCard | undefined;
  readonly scorpio: FabHeuristicCard | undefined;
  readonly greaves: FabHeuristicCard | undefined;
}

export function readAuroraBoard(snapshot: FabHeuristicSnapshot): AuroraBoardRead {
  const cards = [...snapshot.hand, ...snapshot.arsenal];
  return {
    lightningFlows: snapshot.arena.filter(isLightningFlow).length,
    embodimentReady: snapshot.arena.some(isEmbodimentOfLightning),
    goAgainAttacks: snapshot.hand.filter(isLightningGoAgainAttack),
    quickstrike: snapshot.hand.filter(isQuickstrikeAttack),
    goneInAFlash: snapshot.hand.find(isGoneInAFlash),
    instant: cards.find(isLightningInstant),
    arsenalEnabler: snapshot.hand.find(isLightningArsenal),
    scorpio: snapshot.equipment.find(isScorpio),
    greaves: snapshot.equipment.find(isLightningGreaves),
  };
}

export function auroraRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readAuroraBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    const goAgain = read.goAgainAttacks[0];
    if (goAgain) {
      return {
        preferPlayInstanceId: goAgain.instanceId,
        preferred: {
          instanceId: goAgain.instanceId,
          name: goAgain.name,
          role: "play",
          comboRole: "lightning-go-again",
        },
      };
    }
    if (read.goneInAFlash && read.instant) {
      return {
        preferPlayInstanceId: read.goneInAFlash.instanceId,
        preferred: {
          instanceId: read.goneInAFlash.instanceId,
          name: read.goneInAFlash.name,
          role: "play",
          comboRole: "gone-in-a-flash",
        },
      };
    }
    const quickstrike = read.quickstrike[0];
    if (quickstrike && (read.embodimentReady || snapshot.combatOpen)) {
      return {
        preferPlayInstanceId: quickstrike.instanceId,
        preferred: {
          instanceId: quickstrike.instanceId,
          name: quickstrike.name,
          role: "play",
          comboRole: "quickstrike",
        },
      };
    }
    if (read.scorpio && snapshot.combatOpen && snapshot.actionPoints > 0) {
      return {
        preferPlayInstanceId: read.scorpio.instanceId,
        preferred: {
          instanceId: read.scorpio.instanceId,
          name: read.scorpio.name,
          role: "play",
          comboRole: "scorpio",
        },
      };
    }
    const flow = snapshot.hand.find(isFlowGenerator);
    if (flow) {
      return {
        preferPlayInstanceId: flow.instanceId,
        preferred: {
          instanceId: flow.instanceId,
          name: flow.name,
          role: "play",
          comboRole: "flow",
        },
      };
    }
    const succession = snapshot.hand.find(isQuickSuccession);
    if (succession) {
      return {
        preferPlayInstanceId: succession.instanceId,
        preferred: {
          instanceId: succession.instanceId,
          name: succession.name,
          role: "play",
          comboRole: "quick-succession",
        },
      };
    }
  }
  if (
    read.arsenalEnabler &&
    snapshot.arsenalHasRoom &&
    snapshot.hand.some((card) => card.instanceId === read.arsenalEnabler?.instanceId)
  ) {
    return {
      preferArsenalInstanceId: read.arsenalEnabler.instanceId,
      preferred: {
        instanceId: read.arsenalEnabler.instanceId,
        name: read.arsenalEnabler.name,
        role: "arsenal",
        comboRole: "lightning-arsenal",
      },
    };
  }
  return {};
}

export function auroraAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readAuroraBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isLightningGoAgainAttack(play)) bonus += 170;
    if (isGoneInAFlash(play)) bonus += read.instant ? 180 : 40;
    if (isQuickstrikeAttack(play)) bonus += read.embodimentReady || snapshot.combatOpen ? 160 : 20;
    if (isQuickSuccession(play)) bonus += 110;
    if (isFlowGenerator(play) && read.goAgainAttacks.length === 0) bonus += 90;
    if (isRedlineFinisher(play)) bonus -= 100;
    if (isScorpio(play)) bonus += snapshot.combatOpen ? 150 : -50;
    if (isLightningGreaves(play) && read.goneInAFlash && read.instant) bonus += 140;
    if (isOminousExcavation(play) && read.goneInAFlash) bonus += 80;
  }

  if (line.kind === "end-turn" && arsenal && isLightningArsenal(arsenal)) bonus += 190;

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (
        isLightningGoAgainAttack(card) ||
        isGoneInAFlash(card) ||
        isQuickstrikeAttack(card) ||
        isLightningInstant(card)
      ) {
        bonus -= 180;
      }
      if (isFacePurgatory(card) && (snapshot.attackPower ?? 0) >= 6) bonus += 80;
    }
  }
  return bonus;
}

export const auroraStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...auroraRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: auroraAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function auroraProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isAuroraHero(snapshot);
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
