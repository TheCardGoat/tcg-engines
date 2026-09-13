/**
 * Rhinar, Reckless Rampage profile from Yuki Lee Bender's Masterclass
 * (https://fabtcg.com/articles/masterclass-rhinar/).
 *
 * Slow midrange until a power turn (Bloodrush / Bare Destruction / Wild Ride /
 * Tear Limb). Arsenal the enabler when the hand cannot convert; defend
 * in-between turns; keep 6-power fuel off the block.
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
  isBareDestruction,
  isBeastWithin,
  isBloodrush,
  isBlueFivePower,
  isDisruption,
  isMandibleClaw,
  isPower6Fuel,
  isPremiumRedThreat,
  isRhinarHero,
  isSavageFeast,
  isSavageSash,
  isScabskin,
  isSmashback,
  isTearLimb,
  isWildRide,
} from "./names.ts";

export interface RhinarHandRead {
  readonly cards: readonly FabHeuristicCard[];
  readonly bloodrush: FabHeuristicCard | undefined;
  readonly wildRide: FabHeuristicCard | undefined;
  readonly bareDestruction: FabHeuristicCard | undefined;
  readonly tearLimb: FabHeuristicCard | undefined;
  readonly beastWithin: readonly FabHeuristicCard[];
  readonly fuel: readonly FabHeuristicCard[];
  readonly blues: readonly FabHeuristicCard[];
  readonly yellows: readonly FabHeuristicCard[];
  readonly threats: readonly FabHeuristicCard[];
  readonly disruption: readonly FabHeuristicCard[];
  readonly bloodrushLive: boolean;
  readonly powerTurnReady: boolean;
}

export function readRhinarHand(snapshot: FabHeuristicSnapshot): RhinarHandRead {
  const cards = [...snapshot.hand, ...snapshot.arsenal];
  const bloodrush = cards.find(isBloodrush);
  const wildRide = cards.find(isWildRide);
  const bareDestruction = cards.find(isBareDestruction);
  const tearLimb = cards.find(isTearLimb);
  const beastWithin = cards.filter(isBeastWithin);
  const fuel = cards.filter(isPower6Fuel);
  const blues = cards.filter((card) => card.pitch === 3);
  const yellows = cards.filter((card) => card.pitch === 2 && !isBloodrush(card));
  const threats = cards.filter(
    (card) => isPremiumRedThreat(card) || (card.isAttack && card.cost === 2 && card.power >= 6),
  );
  const disruption = cards.filter(isDisruption);
  const bloodrushLive = isBloodrushLive({
    bloodrush,
    fuel,
    blues,
    yellows,
    threats,
    beastWithin,
    cardCount: cards.length,
  });
  const wildRideLive =
    Boolean(wildRide) && blues.length > 0 && fuel.length >= (cards.length >= 5 ? 2 : 2);
  const tearLimbLive = Boolean(tearLimb) && blues.length > 0 && cards.length >= 4;
  const bareDestructionLive = Boolean(bareDestruction) && (blues.length > 0 || threats.length > 0);
  return {
    cards,
    bloodrush,
    wildRide,
    bareDestruction,
    tearLimb,
    beastWithin,
    fuel,
    blues,
    yellows,
    threats,
    disruption,
    bloodrushLive,
    powerTurnReady: bloodrushLive || wildRideLive || tearLimbLive || bareDestructionLive,
  };
}

export function rhinarRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readRhinarHand(snapshot);
  if (read.bloodrush && !read.bloodrushLive) {
    return {
      preferArsenalInstanceId: read.bloodrush.instanceId,
      preferArsenalName: read.bloodrush.name,
      preferred: {
        instanceId: read.bloodrush.instanceId,
        name: read.bloodrush.name,
        role: "arsenal",
        comboRole: "enabler",
      },
    };
  }
  if (read.bloodrush && read.bloodrushLive) {
    const pitch =
      read.blues[0] ?? snapshot.hand.find((card) => !isPower6Fuel(card) && !isBloodrush(card));
    return {
      preferPlayInstanceId: read.bloodrush.instanceId,
      preferPitchInstanceId: pitch?.instanceId,
      preferred: {
        instanceId: read.bloodrush.instanceId,
        name: read.bloodrush.name,
        role: "play",
        comboRole: "enabler",
      },
    };
  }
  const premium =
    read.wildRide ??
    read.bareDestruction ??
    read.tearLimb ??
    snapshot.hand.find(isPremiumRedThreat);
  if (premium && snapshot.arsenalHasRoom && !snapshot.defending) {
    return {
      preferArsenalInstanceId: premium.instanceId,
      preferred: {
        instanceId: premium.instanceId,
        name: premium.name,
        role: "arsenal",
        comboRole: "setup",
      },
    };
  }
  const sash = snapshot.equipment.find(isSavageSash);
  if (snapshot.defending && sash && (snapshot.remainingDamage ?? 0) > 0) {
    return { preferred: { instanceId: sash.instanceId, name: sash.name, role: "defend" } };
  }
  return {};
}

export function rhinarAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readRhinarHand(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const arsenal = line.arsenalInstanceId ? cardById(snapshot, line.arsenalInstanceId) : undefined;

  if (line.kind === "play" && play && isBloodrush(play)) {
    bonus += read.bloodrushLive ? 180 : -240;
  }
  if (line.kind === "end-turn" && arsenal && isBloodrush(arsenal)) {
    bonus += read.bloodrushLive ? -160 : 200;
  }
  if (
    line.kind === "end-turn" &&
    arsenal &&
    isBlueFivePower(arsenal) &&
    !isPremiumRedThreat(arsenal)
  ) {
    bonus -= 80;
  }
  if (line.kind === "end-turn" && arsenal && isBeastWithin(arsenal) && snapshot.defending) {
    bonus -= 40;
  }
  if (
    line.kind === "play" &&
    play &&
    isSmashback(play) &&
    !read.bloodrush &&
    !snapshot.arsenal.some(isSavageFeast)
  ) {
    bonus -= 90;
  }
  if (line.kind === "activate" && play && isMandibleClaw(play) && snapshot.discardedPower6) {
    bonus += 220;
  }
  if (line.kind === "activate" && play && isScabskin(play)) {
    const behind = snapshot.opponentLife !== null && snapshot.life + 6 < snapshot.opponentLife;
    bonus += behind ? 40 : -160;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    if (read.powerTurnReady) {
      for (const id of spent) {
        const card = cardById(snapshot, id);
        if (!card || card.isEquipment) continue;
        if (isBloodrush(card) || isPower6Fuel(card) || isPremiumRedThreat(card)) bonus -= 160;
      }
    } else if ((snapshot.remainingDamage ?? 0) >= 3 && (line.defendInstanceIds?.length ?? 0) > 0) {
      bonus += 50;
    }
  }

  if (line.kind === "pitch") {
    for (const id of line.pitchInstanceIds) {
      const card = cardById(snapshot, id);
      if (card && isPower6Fuel(card) && (read.bloodrush || read.wildRide || read.tearLimb)) {
        bonus -= 200;
      }
      if (card && card.pitch === 3 && !isPower6Fuel(card)) bonus += 40;
    }
  }

  if (line.kind === "play" && play && isDisruption(play) && !read.powerTurnReady) {
    bonus += 80;
  }
  if (line.kind === "end-turn" && arsenal && isDisruption(arsenal)) {
    bonus += 40;
  }
  return bonus;
}

export const rhinarStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...rhinarRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: rhinarAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function rhinarProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isRhinarHero(snapshot);
}

function cardById(
  snapshot: FabHeuristicSnapshot,
  instanceId: string,
): FabHeuristicCard | undefined {
  return (
    snapshot.hand.find((card) => card.instanceId === instanceId) ??
    snapshot.arsenal.find((card) => card.instanceId === instanceId) ??
    snapshot.equipment.find((card) => card.instanceId === instanceId)
  );
}

function isBloodrushLive(input: {
  readonly bloodrush: FabHeuristicCard | undefined;
  readonly fuel: readonly FabHeuristicCard[];
  readonly blues: readonly FabHeuristicCard[];
  readonly yellows: readonly FabHeuristicCard[];
  readonly threats: readonly FabHeuristicCard[];
  readonly beastWithin: readonly FabHeuristicCard[];
  readonly cardCount: number;
}): boolean {
  if (!input.bloodrush) return false;
  const fuelAside = input.fuel.filter((card) => card.instanceId !== input.bloodrush?.instanceId);
  if (fuelAside.length === 0) return false;
  if (input.beastWithin.length > 0 && input.blues.length > 0) return true;
  if (input.cardCount >= 5 && fuelAside.length > 0 && input.blues.length > 0) return true;
  if (input.blues.length > 0 && (input.threats.length > 0 || fuelAside.length >= 2)) return true;
  if (input.yellows.length >= 2 && fuelAside.length < 2) return false;
  return input.blues.length > 0 && fuelAside.length > 0;
}
