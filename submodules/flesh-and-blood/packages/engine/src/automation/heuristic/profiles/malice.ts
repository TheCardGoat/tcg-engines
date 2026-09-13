/**
 * Malice, Domina of the Dead profile for the "Domina on my Corpse until I'm
 * Dead" zombie list (FaBrary: https://fabrary.net/decks/01M23JMY0AY27JRGGJKYTRMS15).
 *
 * Strategy sources: the official "Rules Reprise: Usurp the Shadow Throne
 * Limited" (https://fabtcg.com/articles/rules-reprise-usurp-the-shadow-throne-limited/)
 * and Malice gameplay write-ups on tcg.online (Day-0 Control Malice, Shadow
 * Necromancer Malice Testing, Learning Malice Part Two).
 *
 * The loop: cheap Restless Zombies die (Decay, sac costs, blocks) → banished
 * face-down (no blood debt) + a Corrupted Corpse token lands in the banished
 * zone → Ominous Toll discards zombies into Gates, Gates + Incarnate deploy
 * corpses whose attacks have go again, and {r},{t} replays a graveyard Zombie
 * (Vox Necropolis makes replayed Zombies attack on entry). Corpses banked in
 * the banished zone bleed 1 life per end phase (blood debt), so deploy them
 * rather than hoarding. Go again is the deck's tempo bottleneck — cash
 * Ominous Toll, Toll-style attacks, Skeletal Puppetry, and Tome of Necrosis
 * into chained actions, and block with equipment + defensive instants.
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
  isBoneBarrier,
  isBondedBurial,
  isCarrionCrown,
  isCallToTheGrave,
  isCorruptedCorpse,
  isDigForSouls,
  isGateToIArathael,
  isMaliceHero,
  isMaliceMark,
  isOminousToll,
  isShadowrealmPump,
  isSkeletalPuppetry,
  isTomeOfNecrosis,
  isUndeadGrasp,
  isVoxNecropolis,
  isZombieCard,
} from "./names.ts";

/** Life at which blocking starts earning score again (full-health aggro). */
const LIFE_PRESSURE_FULL_HEALTH = 16;
/** Score per prevented damage per missing life point (calibrated vs pass lines). */
const LIFE_PRESSURE_PER_LIFE = 12;

export interface MaliceBoardRead {
  readonly handZombies: readonly FabHeuristicCard[];
  readonly arenaZombies: readonly FabHeuristicCard[];
  readonly gyZombies: readonly FabHeuristicCard[];
  readonly banishedCorpses: readonly FabHeuristicCard[];
  readonly gates: readonly FabHeuristicCard[];
  readonly vox: FabHeuristicCard | undefined;
  readonly undeadGrasp: FabHeuristicCard | undefined;
  readonly carrionCrown: FabHeuristicCard | undefined;
  readonly toll: FabHeuristicCard | undefined;
  readonly puppetry: readonly FabHeuristicCard[];
  readonly tome: readonly FabHeuristicCard[];
  readonly tutors: readonly FabHeuristicCard[];
  readonly corpseEngineLive: boolean;
}

export function readMaliceBoard(snapshot: FabHeuristicSnapshot): MaliceBoardRead {
  const handZombies = snapshot.hand.filter(isZombieCard);
  const arenaZombies = snapshot.arena.filter(isZombieCard);
  const gyZombies = snapshot.graveyard.filter(isZombieCard);
  const banishedCorpses = snapshot.banished.filter(isCorruptedCorpse);
  const tutors = snapshot.hand.filter((card) => isCallToTheGrave(card) || isDigForSouls(card));
  return {
    handZombies,
    arenaZombies,
    gyZombies,
    banishedCorpses,
    gates: snapshot.arena.filter(isGateToIArathael),
    vox: snapshot.equipment.find(isVoxNecropolis),
    undeadGrasp: snapshot.equipment.find(isUndeadGrasp),
    carrionCrown: snapshot.equipment.find(isCarrionCrown),
    toll: snapshot.hand.find(isOminousToll),
    puppetry: snapshot.hand.filter(isSkeletalPuppetry),
    tome: snapshot.hand.filter(isTomeOfNecrosis),
    tutors,
    corpseEngineLive: gyZombies.length > 0 || banishedCorpses.length > 0,
  };
}

export function maliceRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readMaliceBoard(snapshot);
  if (snapshot.isActive && !snapshot.defending) {
    // Arsenal a zombie tutor when the hand cannot otherwise convert; the loop
    // wants corpses in the graveyard next turn.
    if (read.tutors.length > 0 && !read.corpseEngineLive && snapshot.arsenalHasRoom) {
      const tutor = read.tutors[0]!;
      return {
        preferArsenalInstanceId: tutor.instanceId,
        preferred: {
          instanceId: tutor.instanceId,
          name: tutor.name,
          role: "arsenal",
          comboRole: "corpse-tutor",
        },
      };
    }
  }
  return {};
}

export function maliceAdjustScore(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  const read = readMaliceBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardById(snapshot, line.playInstanceId) : undefined;
  const from = playFrom(line);
  const activating =
    line.kind === "play" || line.kind === "activate"
      ? snapshot.isActive && !snapshot.defending
      : false;

  // Malice's zombie bodies have no defense property in the current catalog
  // (ingest gap), so spells and equipment are the only damage prevention the
  // model can buy. The bare value model prices those blocks below keeping the
  // card, which read as 127 unblocked 2-5 damage hits and a median final life
  // of 3 in the Malice↔Viserai bench. Pay for damage actually prevented once
  // life dips; at full health the factor is zero and aggro lines are untouched.
  const lifePressure =
    Math.max(0, LIFE_PRESSURE_FULL_HEALTH - snapshot.life) * LIFE_PRESSURE_PER_LIFE;

  if (snapshot.defending && play && play.isDefenseReaction) {
    const remaining = snapshot.remainingDamage ?? 0;
    if (remaining > 0) bonus += lifePressure * Math.min(play.defense, remaining);
  }

  if (activating && play) {
    // {r},{t}: replay a graveyard Zombie (go again refunds the action point).
    if (line.kind === "activate" && play.types.includes("Hero")) {
      bonus += read.gyZombies.length > 0 ? 220 : 0;
      if (read.vox) bonus += 60;
    }
    // The permission payoff itself: playing the Zombie out of the graveyard.
    if (from === "graveyard" && isZombieCard(play)) bonus += 180;
    // Deploy a banked corpse: go-again attacks + stops the blood-debt bleed.
    if (from === "banished" && isCorruptedCorpse(play)) bonus += 160;
    if (isZombieCard(play) && from === "hand") bonus += 120;
    // Ominous Toll is the every-turn Gate generator when a zombie can feed it.
    if (isOminousToll(play)) bonus += read.handZombies.length > 0 ? 100 : 40;
    if (isSkeletalPuppetry(play) && read.arenaZombies.length > 0) bonus += 100;
    if (isTomeOfNecrosis(play) && read.arenaZombies.length > 0) bonus += 90;
    if (isCallToTheGrave(play) && read.gyZombies.length < 2) bonus += 90;
    if (isDigForSouls(play) && read.gyZombies.length < 2) bonus += 70;
    if (isShadowrealmPump(play) && read.corpseEngineLive) bonus += 80;
    if (isMaliceMark(play) && read.arenaZombies.length > 0) bonus += 70;
    if (isBondedBurial(play) && read.arenaZombies.length > 0) bonus += 30;
    // Equipment activations: simple tempo per the gameplay write-ups.
    // Undead Grasp pumps "your next zombie attack" — only fire it when a
    // zombie attack can actually follow this turn (Vox-recruited body or a
    // deployable corpse whose attacks carry go again). The bonus must cover
    // the compiler's utility-activation penalty (-250) AND outrank taking the
    // unpumped attack immediately: cancel the penalty, add the attack's base
    // + the body's power (the pumped attack still gets chosen next), and a
    // go-again/on-hit value slack.
    if (line.kind === "activate" && isUndeadGrasp(play)) {
      const body = read.arenaZombies.reduce((max, zombie) => Math.max(max, zombie.power), 0);
      const zombieAttackPlausible =
        read.arenaZombies.length > 0 && (Boolean(read.vox) || read.banishedCorpses.length > 0);
      bonus +=
        zombieAttackPlausible && read.handZombies.length > 0 ? 250 + 360 + body * 10 + 200 : 0;
    }
    if (line.kind === "activate" && isCarrionCrown(play)) {
      bonus += read.handZombies.length > 0 ? 70 : 0;
    }
    // A live Gate deploys blood-debt actions (corpses) out of the banished zone.
    if (line.kind === "activate" && isGateToIArathael(play)) {
      bonus += read.banishedCorpses.length > 0 ? 170 : 0;
    }
  }

  if (line.kind === "play" && play && isBoneBarrier(play) && snapshot.defending) {
    // +2{d} via the ally sac — a real block when a zombie can feed it.
    if (read.arenaZombies.length > 0 && (snapshot.remainingDamage ?? 0) >= 3) bonus += 90;
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    const spent = new Set(line.defendInstanceIds ?? []);
    let prevented = 0;
    for (const id of spent) {
      const card = cardById(snapshot, id);
      if (!card) continue;
      // Keep the loop's tutors, pumps, and Gate generator off the block; their
      // defense is only bought with life pressure below.
      if (isCallToTheGrave(card) || isDigForSouls(card) || isSkeletalPuppetry(card)) {
        bonus -= 120;
        continue;
      }
      if (isTomeOfNecrosis(card)) {
        bonus -= 100;
        continue;
      }
      // Ominous Toll is the every-turn Gate generator; a blocked Toll is a
      // dead Gate. Shadowrealm pumps are the +3{p}/go-again setup.
      if (isOminousToll(card)) {
        bonus -= 80;
        continue;
      }
      if (isShadowrealmPump(card)) {
        bonus -= 60;
        continue;
      }
      prevented += card.defense;
    }
    const remaining = snapshot.remainingDamage ?? 0;
    if (remaining > 0 && prevented > 0) {
      bonus += lifePressure * Math.min(prevented, remaining);
    }
  }
  return bonus;
}

export const maliceStrategy: FabBotStrategy = (runtime, actorId, legalCommands, context) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...maliceRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: maliceAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function maliceProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isMaliceHero(snapshot);
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
    snapshot.banished.find((card) => card.instanceId === instanceId) ??
    snapshot.arena.find((card) => card.instanceId === instanceId) ??
    snapshot.graveyard.find((card) => card.instanceId === instanceId)
  );
}
