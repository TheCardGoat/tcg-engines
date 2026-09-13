/**
 * Viserai, the Forsaken profile — validated against the "New vis who dis"
 * Runechant/Ursur list (FaBrary).
 *
 * Start the Runechant engine with a go-again aura before spending the action
 * point on attacks, convert with Usurp Gloomblades while auras are live,
 * recycle the arena with Deadwood Dirge / Revel in Runeblood, and keep the
 * Gloomblades off the block.
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
  isAuraPermanent,
  isBecomeTheShadowLord,
  isCaptainsCall,
  isDeadwoodDirge,
  isEmbraceUrsur,
  isGloomblade,
  isGoreBelching,
  isGateToIArathael,
  isInvertExistence,
  isPainfulPassage,
  isRevelInRuneblood,
  isRuneragerSwarm,
  isRunechantIncantation,
  isSevenSinNebula,
  isShadowPuppetry,
  isViseraiForsakenHero,
} from "./names.ts";

export interface ViseraiForsakenBoardRead {
  /** Arena aura count — Usurp fuel for the Gloomblades and hero triggers. */
  readonly auraFuel: number;
  readonly gloomblade: FabHeuristicCard | undefined;
  readonly embraceUrsur: FabHeuristicCard | undefined;
  readonly runeragerSwarm: FabHeuristicCard | undefined;
  readonly becomeShadowLord: FabHeuristicCard | undefined;
  readonly deadwoodDirge: FabHeuristicCard | undefined;
  readonly revelInRuneblood: FabHeuristicCard | undefined;
  readonly runechantIncantation: FabHeuristicCard | undefined;
  readonly sevenSinNebula: FabHeuristicCard | undefined;
  readonly shadowPuppetry: FabHeuristicCard | undefined;
  readonly painfulPassage: FabHeuristicCard | undefined;
  readonly goreBelching: FabHeuristicCard | undefined;
  readonly captainsCall: FabHeuristicCard | undefined;
}

export function readViseraiForsakenBoard(snapshot: FabHeuristicSnapshot): ViseraiForsakenBoardRead {
  return {
    auraFuel: snapshot.arena.filter(isAuraPermanent).length,
    gloomblade: snapshot.hand.find(isGloomblade),
    embraceUrsur: snapshot.hand.find(isEmbraceUrsur),
    runeragerSwarm: snapshot.hand.find(isRuneragerSwarm),
    becomeShadowLord: snapshot.hand.find(isBecomeTheShadowLord),
    deadwoodDirge: snapshot.hand.find(isDeadwoodDirge),
    revelInRuneblood: snapshot.hand.find(isRevelInRuneblood),
    runechantIncantation: snapshot.hand.find(isRunechantIncantation),
    sevenSinNebula: snapshot.equipment.find(isSevenSinNebula),
    shadowPuppetry: snapshot.hand.find(isShadowPuppetry),
    painfulPassage: snapshot.hand.find(isPainfulPassage),
    goreBelching: snapshot.hand.find(isGoreBelching),
    captainsCall: snapshot.hand.find(isCaptainsCall),
  };
}

/**
 * A payable attack card the go-again pumps should precede: the compiler ranks
 * one command at a time, so the pump only earns its keep when the attack it
 * boosts can still follow this turn.
 */
function findPumpableAttack(snapshot: FabHeuristicSnapshot): FabHeuristicCard | undefined {
  return [...snapshot.hand, ...snapshot.arsenal].find(
    (card) => card.isAttack && card.cost <= snapshot.resourcePoints,
  );
}

/** Fires the go-again pump before the attack it should boost. */
function pumpBeforeAttack(
  snapshot: FabHeuristicSnapshot,
  read: ViseraiForsakenBoardRead,
): FabHeuristicCard | undefined {
  if (snapshot.actionPoints <= 0 || !findPumpableAttack(snapshot)) return undefined;
  return read.captainsCall ?? read.shadowPuppetry ?? read.painfulPassage;
}

export function viseraiForsakenRankingHint(snapshot: FabHeuristicSnapshot): FabLineRankingHint {
  const read = readViseraiForsakenBoard(snapshot);
  if (!snapshot.isActive || snapshot.defending) return {};
  const prefer = (card: FabHeuristicCard, comboRole: string): FabLineRankingHint => ({
    preferPlayInstanceId: card.instanceId,
    preferred: {
      instanceId: card.instanceId,
      name: card.name,
      role: "play",
      comboRole,
    },
  });
  // No auras yet: start the go-again Runechant engine before spending the AP.
  if (read.auraFuel === 0) {
    if (read.runechantIncantation) return prefer(read.runechantIncantation, "runechant-engine");
    if (read.becomeShadowLord) return prefer(read.becomeShadowLord, "runechant-engine");
    return {};
  }
  // Auras live: keep the go-again chain alive, end on the Usurp attack. The
  // pump precedes the attack it boosts — Cross-test evidence (Gravy/Valda
  // races decided by 1-5 life) says the +2{p}/go-again must land on the
  // imminent swing, not the one after it.
  const pump = pumpBeforeAttack(snapshot, read);
  if (pump) return prefer(pump, "go-again-pump");
  if (read.runeragerSwarm) return prefer(read.runeragerSwarm, "go-again-attack");
  if (read.deadwoodDirge) return prefer(read.deadwoodDirge, "aura-recycle");
  if (read.gloomblade) return prefer(read.gloomblade, "usurp-finisher");
  if (read.revelInRuneblood) return prefer(read.revelInRuneblood, "runechant-chain");
  if (read.runechantIncantation) return prefer(read.runechantIncantation, "runechant-chain");
  if (read.becomeShadowLord) return prefer(read.becomeShadowLord, "runechant-chain");
  return {};
}

export function viseraiForsakenAdjustScore(
  line: FabCompiledLine,
  snapshot: FabHeuristicSnapshot,
): number {
  const read = readViseraiForsakenBoard(snapshot);
  let bonus = 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;

  if ((line.kind === "play" || line.kind === "activate") && play) {
    // Gate grants a normal action-play permission only for the current turn;
    // activating it on the opponent's turn destroys the resource without
    // creating a usable line. Invert likewise has no effect with an empty
    // opposing graveyard, so neither may outrank a plain pass.
    if (!snapshot.isActive && isGateToIArathael(play)) bonus -= 1_000;
    if (isInvertExistence(play) && (snapshot.opponentGraveyardCount ?? 0) === 0) bonus -= 1_000;

    if (read.auraFuel === 0) {
      if (isRunechantIncantation(play)) bonus += 300;
      if (isBecomeTheShadowLord(play)) bonus += 280;
      if (isGloomblade(play)) bonus += 60;
      if (isRuneragerSwarm(play)) bonus += 40;
    } else {
      if (isRuneragerSwarm(play)) bonus += 220;
      if (isDeadwoodDirge(play)) bonus += 300;
      if (isEmbraceUrsur(play)) bonus += 120;
      if (isGloomblade(play)) bonus += 20 + 20 * read.auraFuel;
      if (isRevelInRuneblood(play)) bonus += 240;
      if (isRunechantIncantation(play)) bonus += 240;
      if (isBecomeTheShadowLord(play)) bonus += 200;
      if (isSevenSinNebula(play)) bonus += 180;
      // The +2{p}/go-again pumps must outrank taking the unpumped attack now
      // (attack base ≈ 400 + power×10), but only when that attack can still
      // follow — a pump on an empty turn is a wasted block.
      if (isCaptainsCall(play) || isShadowPuppetry(play) || isPainfulPassage(play)) {
        if (pumpBeforeAttack(snapshot, read) === play) bonus += 260;
      }
    }
  }

  if (line.kind === "defend" || (line.kind === "pass" && snapshot.defending)) {
    for (const id of line.defendInstanceIds ?? []) {
      const card = cardByInstance(snapshot, id);
      if (!card) continue;
      if (
        isGloomblade(card) ||
        isEmbraceUrsur(card) ||
        isRuneragerSwarm(card) ||
        isGoreBelching(card)
      ) {
        bonus -= 160;
      }
      if (isRevelInRuneblood(card)) bonus -= 100;
    }
  }
  return bonus;
}

export const viseraiForsakenStrategy: FabBotStrategy = (
  runtime,
  actorId,
  legalCommands,
  context,
) => {
  const stateID = runtime.getStateID();
  const view =
    rulesViewForLegalCommands(legalCommands, stateID) ?? buildFabRulesView(runtime.getState());
  const snapshot = buildHeuristicSnapshot(runtime, actorId, view);
  const hint = { ...viseraiForsakenRankingHint(snapshot), ...context?.ranking };
  const line = compileTurnLine(snapshot, legalCommands, {
    onRanked: context?.onRanked,
    persona: "value-extract",
    hint,
    adjustScore: viseraiForsakenAdjustScore,
  });
  return chooseCompiledLineCommand(line, legalCommands);
};

export function viseraiForsakenProfileApplies(snapshot: FabHeuristicSnapshot): boolean {
  return isViseraiForsakenHero(snapshot);
}
