/**
 * Oscilio, Forked Continuum profile from Yuki Lee Bender's Zero to Eighty
 * (https://fabtcg.com/articles/zero-to-eighty-oscilio/).
 *
 * Make Lightning Flows, convert the hand, arsenal Gone in a Flash while
 * Greaves is live, then empty the arsenal so Ponder tokens can land.
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
  isAstralStrike,
  isGoneInAFlash,
  isLightningFlow,
  isLightningGreaves,
  isLightningInstant,
  isOscilioFlowAttack,
  isOscilioFlowSpell,
  isOscilioHero,
  isVolzar,
} from "./names.ts";

export interface OscilioBoardRead {
  readonly greavesLive: boolean;
  readonly goneInAFlash: FabHeuristicCard | undefined;
  readonly instant: FabHeuristicCard | undefined;
  readonly flowAttacks: readonly FabHeuristicCard[];
  readonly flowSpells: readonly FabHeuristicCard[];
  readonly astralStrike: FabHeuristicCard | undefined;
  readonly volzar: FabHeuristicCard | undefined;
}

export function readOscilioBoard(snapshot: FabHeuristicSnapshot): OscilioBoardRead {
  const cards = [...snapshot.hand, ...snapshot.arsenal];
  return {
    greavesLive: snapshot.equipment.some(isLightningGreaves),
    goneInAFlash: snapshot.hand.find(isGoneInAFlash) ?? snapshot.arsenal.find(isGoneInAFlash),
    instant: cards.find(isLightningInstant),
    flowAttacks: snapshot.hand.filter(isOscilioFlowAttack),
    flowSpells: snapshot.hand.filter(isOscilioFlowSpell),
    astralStrike: snapshot.hand.find(isAstralStrike),
    volzar: snapshot.equipment.find(isVolzar),
  };
}

export function oscilioRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readOscilioBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    const giafInHand = snapshot.hand.find(isGoneInAFlash);
    if (giafInHand && read.instant && (read.greavesLive || snapshot.combatOpen)) {
      return {
        preferPlayInstanceId: giafInHand.instanceId,
        preferred: {
          instanceId: giafInHand.instanceId,
          name: giafInHand.name,
          role: "play",
          comboRole: "gone-in-a-flash",
        },
      };
    }
    const flow = read.flowAttacks[0] ?? read.flowSpells[0];
    if (flow) {
      return {
        preferPlayInstanceId: flow.instanceId,
        preferred: {
          instanceId: flow.instanceId,
          name: flow.name,
          role: "play",
          comboRole: "lightning-flow",
        },
      };
    }
    if (read.astralStrike && snapshot.arena.some(isLightningFlow)) {
      return {
        preferPlayInstanceId: read.astralStrike.instanceId,
        preferred: {
          instanceId: read.astralStrike.instanceId,
          name: read.astralStrike.name,
          role: "play",
          comboRole: "astral-strike",
        },
      };
    }
    if (read.volzar && snapshot.actionPoints > 0) {
      return {
        preferPlayInstanceId: read.volzar.instanceId,
        preferred: {
          instanceId: read.volzar.instanceId,
          name: read.volzar.name,
          role: "play",
          comboRole: "volzar",
        },
      };
    }
  }
  const giafInHand = snapshot.hand.find(isGoneInAFlash);
  if (giafInHand && read.greavesLive && snapshot.arsenalHasRoom) {
    return {
      preferArsenalInstanceId: giafInHand.instanceId,
      preferred: {
        instanceId: giafInHand.instanceId,
        name: giafInHand.name,
        role: "arsenal",
        comboRole: "gone-in-a-flash",
      },
    };
  }
  return {};
}

export function oscilioAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readOscilioBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    if (isGoneInAFlash(play)) bonus += read.instant ? 180 : 50;
    if (isOscilioFlowAttack(play) || isOscilioFlowSpell(play)) bonus += 160;
    if (isAstralStrike(play)) bonus += 90;
    if (isVolzar(play)) bonus += 70;
    if (isLightningGreaves(play) && read.goneInAFlash && read.instant) bonus += 140;
  }

  if (line.kind === "end-turn" && arsenal && isGoneInAFlash(arsenal)) {
    bonus += read.greavesLive ? 200 : -80;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      if (isGoneInAFlash(card) || isOscilioFlowAttack(card) || isLightningInstant(card))
        bonus -= 180;
    }
  }
  return bonus;
}

export const oscilioStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...oscilioRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: oscilioAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function oscilioProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isOscilioHero(snapshot);
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
