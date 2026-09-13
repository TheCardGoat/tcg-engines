/**
 * Zyggy Starlight profile from Michael Jaszczur's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-zyggy/).
 *
 * Drop a ward aura, swing Reality Refractor, and only over-protect auras when
 * they will stick. Phantasmaclasm is the premium two-card haymaker.
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
  isAstralEtchings,
  isIllusionistAura,
  isIrisOfReality,
  isPhantasmaclasm,
  isRealityRefractor,
  isZyggyHero,
} from "./names.ts";

export interface ZyggyBoardRead {
  readonly auras: readonly FabHeuristicCard[];
  readonly handAura: FabHeuristicCard | undefined;
  readonly phantasmaclasm: FabHeuristicCard | undefined;
  readonly refractor: FabHeuristicCard | undefined;
  readonly iris: FabHeuristicCard | undefined;
  readonly etchings: FabHeuristicCard | undefined;
}

export function readZyggyBoard(snapshot: FabHeuristicSnapshot): ZyggyBoardRead {
  return {
    auras: snapshot.arena.filter(isIllusionistAura),
    handAura: snapshot.hand.find(isIllusionistAura),
    phantasmaclasm: snapshot.hand.find(isPhantasmaclasm),
    refractor: snapshot.equipment.find(isRealityRefractor),
    iris: snapshot.equipment.find(isIrisOfReality),
    etchings: snapshot.hand.find(isAstralEtchings),
  };
}

export function zyggyRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readZyggyBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    if (read.handAura && read.auras.length === 0) {
      return {
        preferPlayInstanceId: read.handAura.instanceId,
        preferred: {
          instanceId: read.handAura.instanceId,
          name: read.handAura.name,
          role: "play",
          comboRole: "ward-aura",
        },
      };
    }
    if (read.phantasmaclasm) {
      return {
        preferPlayInstanceId: read.phantasmaclasm.instanceId,
        preferred: {
          instanceId: read.phantasmaclasm.instanceId,
          name: read.phantasmaclasm.name,
          role: "play",
          comboRole: "phantasmaclasm",
        },
      };
    }
    if (read.etchings && read.auras.length > 0) {
      return {
        preferPlayInstanceId: read.etchings.instanceId,
        preferred: {
          instanceId: read.etchings.instanceId,
          name: read.etchings.name,
          role: "play",
          comboRole: "astral-etchings",
        },
      };
    }
    const weapon =
      read.auras.length >= 2 ? (read.iris ?? read.refractor) : (read.refractor ?? read.iris);
    if (
      weapon &&
      snapshot.combatOpen === false &&
      snapshot.actionPoints > 0 &&
      read.auras.length > 0
    ) {
      return {
        preferPlayInstanceId: weapon.instanceId,
        preferred: {
          instanceId: weapon.instanceId,
          name: weapon.name,
          role: "play",
          comboRole: "aura-weapon",
        },
      };
    }
  }
  return {};
}

export function zyggyAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readZyggyBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isIllusionistAura(play)) bonus += read.auras.length === 0 ? 170 : 90;
    if (isPhantasmaclasm(play)) bonus += 160;
    if (isAstralEtchings(play) && read.auras.length > 0) bonus += 140;
    if (isRealityRefractor(play) && read.auras.length > 0) bonus += 130;
    if (isIrisOfReality(play) && read.auras.length >= 2) bonus += 150;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (isPhantasmaclasm(card) || isAstralEtchings(card)) bonus -= 180;
      if (isIllusionistAura(card) && !card.isEquipment) bonus -= 80;
    }
  }
  return bonus;
}

export const zyggyStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...zyggyRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: zyggyAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function zyggyProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isZyggyHero(snapshot);
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
