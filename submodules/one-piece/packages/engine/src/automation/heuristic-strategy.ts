import type { Action, OPCard } from "@tcg/op-types";
import type {
  EngineCommand,
  LegalCommandDescriptor,
  MatchSeat,
  MatchState,
  PromptState,
} from "../types.ts";
import {
  baseCost,
  basePower,
  effectBlocksFor,
  getCardCounter,
  getCardForInstance,
  getCardPower,
  getInstance,
  getKeywords,
  getPlayer,
  otherSeat,
} from "../shared.ts";
import {
  commandFromDescriptor,
  type OnePieceBotAgent,
  type OnePieceBotPromptResolver,
  type OnePieceBotStrategy,
} from "./bot-strategies.ts";

// ─────────────────────────────────────────────────────────────────────────────
// Heuristic constants (single-pass scoring, no search). Calibrated by feel and
// kept here so the benchmark harness can drive tuning.
// ─────────────────────────────────────────────────────────────────────────────

/** Expected counter power available per card in the defending hand. */
const COUNTER_PER_HAND_CARD = 400;
/** Cap on expected opposing counter power for a normal attack. */
const EXPECTED_COUNTER_CAP = 2000;
/** Deficit (power missing to win a defensive battle) worth countering. */
const COUNTABLE_DEFICIT = 2000;
/** Minimum counter cards held before spending any on a non-lethal defense. */
const MIN_COUNTER_CARDS_TO_DEFEND = 2;
/** Fallback power estimate for a [Counter] Event with no parseable modifyPower. */
const EVENT_COUNTER_VALUE_ESTIMATE = 2000;
/** Rested characters at or above this power count as threats worth attacking. */
const THREAT_POWER = 4000;
/** Character cost at/above which a rested character is worth countering for. */
const VALUABLE_CHARACTER_COST = 4;
/** Leader attack overwhelmed when attacker out-powers the leader by this much. */
const BLOCK_OVERWHELM_MARGIN = 4000;
/** Life total at/below which we block leader attacks with anything. */
const LOW_LIFE = 2;
/** Blockers at/above this cost are too valuable to throw away at high life. */
const VALUABLE_BLOCKER_COST = 4;
/** Expendable blocker cost ceiling (needs a wide board, see blocker logic). */
const EXPENDABLE_BLOCKER_COST = 2;
/** Board width at which a cheap blocker counts as expendable. */
const WIDE_BOARD = 3;
/** Life-trigger cards at/above this cost are kept for later instead of activated. */
const TRIGGER_KEEP_COST = 5;
/** Mulligan when no hand card costs this or less. */
const MULLIGAN_MAX_COST = 4;
/** Hand cards at/above this cost count as top-end clump for the mulligan. */
const MULLIGAN_HEAVY_COST = 5;
/** Mulligan hands holding this many top-end cards even with a cheap play. */
const MULLIGAN_HEAVY_CARDS = 4;
/** DON!! kept active for defensive [Counter] Events when one is in hand. */
const COUNTER_EVENT_DON_RESERVE_CAP = 3;
/** Going first is only preferred with this many cheap plays in the opener. */
const AGGRO_HAND_CHEAP_CARDS = 3;
const AGGRO_HAND_CHEAP_COST = 2;

// ─────────────────────────────────────────────────────────────────────────────
// Policy profiles: two distinct challenging heuristics over shared machinery.
//
// - balanced (id: "heuristic"): board control / value — on-curve development,
//   threat removal, careful life-for-card trades, counter reserve for defense.
// - aggressive (id: "aggressive"): life-race tempo — prefer leader pressure,
//   rush attackers, spend more DON!! on offense, counter/block life more often.
// ─────────────────────────────────────────────────────────────────────────────

export type HeuristicStyle = "balanced" | "aggressive";

export interface HeuristicPolicy {
  readonly style: HeuristicStyle;
  /** Multiplier on leader-attack scores (1 = baseline). */
  readonly leaderAttackBias: number;
  /** Multiplier on character-attack scores (1 = baseline). */
  readonly characterAttackBias: number;
  /** Extra points for Rush when scoring character plays. */
  readonly rushPlayBonus: number;
  /** Extra points for Blocker when scoring character plays. */
  readonly blockerPlayBonus: number;
  /** Cap on active DON!! reserved for [Counter] Events (0–3). */
  readonly counterDonReserveCap: number;
  /** Prefer going first when cheap openers >= this count (lower = more first). */
  readonly firstPlayerCheapThreshold: number;
  /** Max cost treated as a playable opener for mulligan (lower = tighter curve). */
  readonly mulliganMaxCost: number;
  /** Heavy top-end cost threshold for mulligan clump detection. */
  readonly mulliganHeavyCost: number;
  /** Heavy-card count that forces a mulligan even with an opener. */
  readonly mulliganHeavyCards: number;
  /** Life at/below which non-lethal leader hits are worth countering. */
  readonly counterWorthLife: number;
  /** Life at/below which any leader attack is blocked. */
  readonly blockLowLife: number;
  /** When true, block leader attacks more liberally (expendable blockers). */
  readonly aggressiveBlocking: boolean;
  /** When true, prefer leader targets even when character KOs are available. */
  readonly preferLeaderPressure: boolean;
}

export const BALANCED_POLICY: HeuristicPolicy = {
  style: "balanced",
  leaderAttackBias: 1,
  characterAttackBias: 1,
  rushPlayBonus: 60,
  blockerPlayBonus: 40,
  counterDonReserveCap: COUNTER_EVENT_DON_RESERVE_CAP,
  firstPlayerCheapThreshold: AGGRO_HAND_CHEAP_CARDS,
  mulliganMaxCost: MULLIGAN_MAX_COST,
  mulliganHeavyCost: MULLIGAN_HEAVY_COST,
  mulliganHeavyCards: MULLIGAN_HEAVY_CARDS,
  // Counter at life ≤3; block at ≤2 (keep valuable blockers on the board at
  // higher life). Race closing is handled by adaptive DON!! / attach scoring.
  counterWorthLife: LOW_LIFE + 1,
  blockLowLife: LOW_LIFE,
  aggressiveBlocking: false,
  preferLeaderPressure: false,
};

export const AGGRESSIVE_POLICY: HeuristicPolicy = {
  style: "aggressive",
  leaderAttackBias: 1.25,
  characterAttackBias: 0.75,
  rushPlayBonus: 120,
  blockerPlayBonus: 20,
  counterDonReserveCap: 1,
  firstPlayerCheapThreshold: 2,
  mulliganMaxCost: 3,
  mulliganHeavyCost: 5,
  mulliganHeavyCards: 3,
  counterWorthLife: 4,
  // Block earlier than balanced so life-race decks do not get chipped out.
  blockLowLife: 3,
  aggressiveBlocking: true,
  preferLeaderPressure: true,
};

// ─────────────────────────────────────────────────────────────────────────────
// Generic effect-shape helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Actions that hurt the targeted card's controller when they resolve. */
const HARMFUL_ACTIONS = new Set<Action["action"]>([
  "ko",
  "rest",
  "freeze",
  "returnToHand",
  "returnToDeck",
  "trashFromField",
  "negateEffects",
  "cannotAttack",
  "removeFromLife",
  "turnLifeFaceDown",
]);

/** Actions that help the targeted card's controller when they resolve. */
const BENEFICIAL_ACTIONS = new Set<Action["action"]>([
  "setActive",
  "grantKeyword",
  "addToLife",
  "turnLifeFaceUp",
  "battleKoReplacement",
]);

function flattenActions(actions: readonly Action[]): Action[] {
  const flattened: Action[] = [];
  for (const action of actions) {
    flattened.push(action);
    switch (action.action) {
      case "sequence":
      case "optional":
      case "delayed":
      case "scheduleAtEndOfTurn":
        flattened.push(...flattenActions(action.actions));
        break;
      case "choice":
        for (const option of action.options) {
          flattened.push(...flattenActions(option));
        }
        break;
      case "conditional":
        flattened.push(...flattenActions(action.whenTrue));
        if (action.whenFalse) {
          flattened.push(...flattenActions(action.whenFalse));
        }
        break;
      default:
        break;
    }
  }
  return flattened;
}

function actionHitsOpposingCharacters(action: Action): boolean {
  if (!("target" in action) || !action.target) {
    return false;
  }
  const target = action.target;
  const aimsOpponent =
    target.player === "opponent" || target.player === "any" || target.player === "both";
  const hitsCharacters = target.zones.some((zone) => zone === "character" || zone === "field");
  if (!aimsOpponent || !hitsCharacters) {
    return false;
  }
  if (action.action === "modifyPower") {
    return action.value < 0;
  }
  return HARMFUL_ACTIONS.has(action.action);
}

/** True when the card's [Main] blocks include removal-style actions that need
 * an opposing character on board to do anything useful. */
function mainEffectNeedsOpposingCharacter(card: OPCard): boolean {
  const blocks = effectBlocksFor(card, "main");
  if (blocks.length === 0) {
    return false;
  }
  return blocks.some((block) => flattenActions(block.actions).some(actionHitsOpposingCharacters));
}

/** First thisBattle modifyPower value inside [Counter] blocks, if parseable. */
export function eventCounterPower(card: OPCard): number {
  for (const block of effectBlocksFor(card, "counter")) {
    for (const action of flattenActions(block.actions)) {
      if (action.action === "modifyPower" && action.value > 0) {
        return action.value;
      }
    }
  }
  return EVENT_COUNTER_VALUE_ESTIMATE;
}

function cheapestCounterEventCost(state: MatchState, seat: MatchSeat): number | null {
  let cheapest: number | null = null;
  for (const instanceId of getPlayer(state, seat).hand) {
    const card = getCardForInstance(state, instanceId);
    if (card.cardType !== "event" || effectBlocksFor(card, "counter").length === 0) {
      continue;
    }
    const cost = baseCost(card);
    if (cheapest === null || cost < cheapest) {
      cheapest = cost;
    }
  }
  return cheapest;
}

interface ScoredCommand {
  descriptor: LegalCommandDescriptor;
  score: number;
  /**
   * attachDon only: the full amount the strategy intends to attach in ONE
   * command (active DON!! above the [Counter] reserve), so the log reads
   * "attaches N DON!!" once instead of N amount-1 repeats.
   */
  attachAmount?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Command-level policy (choose) — pure scoring helpers are exported for tests.
// ─────────────────────────────────────────────────────────────────────────────

export function scoreCharacterPlay(
  state: MatchState,
  instanceId: string,
  activeDon: number,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const card = getCardForInstance(state, instanceId);
  const keywords = getKeywords(state, instanceId);
  let score = 1000 + baseCost(card) * 25 + basePower(card) / 100;
  if (keywords.has("rush")) score += policy.rushPlayBonus;
  if (keywords.has("blocker")) score += policy.blockerPlayBonus;
  if (keywords.has("doubleAttack")) score += 80;
  if (keywords.has("banish")) score += 30;
  if (keywords.has("unblockable")) score += 30;
  score += (getCardCounter(state, instanceId) / 1000) * 5;
  // On-curve bonus: prefer spending down to 0-1 remaining DON!!.
  const cost = baseCost(card);
  if (cost === activeDon) score += 60;
  else if (cost === activeDon - 1) score += 30;
  // Aggressive: slight preference for cheaper plays that empty the hand faster.
  if (policy.style === "aggressive" && cost <= 3) {
    score += 25;
  }
  return score;
}

export function scoreEventPlay(
  state: MatchState,
  seat: MatchSeat,
  instanceId: string,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const card = getCardForInstance(state, instanceId);
  const opponent = getPlayer(state, otherSeat(seat));
  const opponentHasCharacters = opponent.characterArea.some((entry) => entry !== null);
  if (mainEffectNeedsOpposingCharacter(card) && !opponentHasCharacters) {
    return -1; // removal with no target on board — keep it in hand
  }
  // Aggressive: main-phase removal is lower priority than developing attackers.
  const base = policy.style === "aggressive" ? 820 : 900;
  return base + baseCost(card) * 20;
}

/**
 * Effective leader-attack bias: when we are strictly behind on life, tilt
 * toward racing the leader (slow decks were losing to red aggro by banking
 * too hard on board control).
 */
export function effectiveLeaderAttackBias(
  state: MatchState,
  seat: MatchSeat,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const myLife = getPlayer(state, seat).life.length;
  const oppLife = getPlayer(state, otherSeat(seat)).life.length;
  if (myLife < oppLife) {
    return policy.leaderAttackBias * 1.1;
  }
  return policy.leaderAttackBias;
}

export function scoreLeaderAttack(
  state: MatchState,
  seat: MatchSeat,
  _attackerId: string,
  attackerPower: number,
  attackerCount: number,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const opponent = getPlayer(state, otherSeat(seat));
  const oppLeaderPower = getCardPower(state, opponent.leaderInstanceId);
  const oppLife = opponent.life.length;
  const oppHandSize = opponent.hand.length;
  const bias = effectiveLeaderAttackBias(state, seat, policy);

  if (oppLife === 0) {
    // Lethal attempt: any landed hit wins the game, so every attack at or
    // above leader power is worth it — it either ends the game or drains a
    // counter card the opponent needs for the next swing.
    return attackerPower >= oppLeaderPower ? (940 + attackerPower / 100) * bias : -1;
  }

  const expectedCounter = Math.min(EXPECTED_COUNTER_CAP, COUNTER_PER_HAND_CARD * oppHandSize);
  if (attackerPower >= oppLeaderPower + expectedCounter) {
    return (660 + attackerPower / 100) * bias;
  }
  if (oppLife <= attackerCount && attackerPower >= oppLeaderPower) {
    // All-in press: more attackers than the opponent has Life. Every swing
    // forces a counter card or a life card, and the hand can't stop them all.
    return (670 + attackerPower / 100) * bias;
  }
  if (oppHandSize <= 2 && attackerPower >= oppLeaderPower) {
    return (600 + attackerPower / 100) * bias;
  }
  // Lethal window: at 1–2 life any hit at or above leader power forces a
  // counter card or ends the race — do not require the extra +1000 margin.
  if (oppLife <= 2 && attackerPower >= oppLeaderPower) {
    return (620 + attackerPower / 100) * bias;
  }
  if (oppHandSize <= 4 && attackerPower >= oppLeaderPower + 1000) {
    // Pressure window: the hit lands unless they spend real counter cards.
    return (570 + attackerPower / 100) * bias;
  }
  // Behind on board: chip attacks still apply pressure instead of passing.
  const myCharacters = getPlayer(state, seat).characterArea.filter((entry) => entry !== null);
  const oppCharacters = opponent.characterArea.filter((entry) => entry !== null);
  if (oppCharacters.length >= myCharacters.length + 2 && attackerPower >= oppLeaderPower) {
    return (560 + attackerPower / 100) * bias;
  }
  if (attackerPower >= oppLeaderPower) {
    // Chip attack: at or above leader power the swing always costs the
    // opponent something — a counter card or a life card.
    return (550 + attackerPower / 100) * bias;
  }
  // Underpowered leader swings deal 0 damage regardless of counters
  // (battle.ts requires attackPower >= defensePower). Do not score them.
  return -1;
}

/**
 * Score attaching one DON!! to an attacker. Prefers units that need the +1000
 * to clear the leader (or expected counter wall) over overkill stacks on an
 * already-dominant attacker — multi-attacker races were starving second swings.
 */
export function scoreAttachDon(
  state: MatchState,
  seat: MatchSeat,
  targetId: string,
  bestAttackerId: string | null,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const opponent = getPlayer(state, otherSeat(seat));
  const power = getCardPower(state, targetId);
  const oppLeaderPower = getCardPower(state, opponent.leaderInstanceId);
  const expectedCounter = Math.min(
    EXPECTED_COUNTER_CAP,
    COUNTER_PER_HAND_CARD * opponent.hand.length,
  );
  // Critical: one DON!! flips a failing swing into a life-or-counter demand.
  if (power < oppLeaderPower && power + 1000 >= oppLeaderPower) {
    return 780;
  }
  // Helpful: still short of the expected counter wall.
  if (power < oppLeaderPower + expectedCounter && power + 1000 >= oppLeaderPower) {
    return 740;
  }
  let score = targetId === bestAttackerId ? 700 : 640;
  if (policy.style === "aggressive" && targetId === bestAttackerId) {
    score += 40;
  }
  // Race mode: when opponent is nearly dead, any pump on an active attacker
  // is worth more than sitting on reserve DON!!.
  if (opponent.life.length <= 2) {
    score += 30;
  }
  return score;
}

/**
 * How much active DON!! to hold back for [Counter] Events. Zero when we are
 * racing for lethal — banked DON!! on a purple-ramp hand never fires if we
 * die first.
 */
export function computeDonReserve(
  state: MatchState,
  seat: MatchSeat,
  attackerCount: number,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const opponent = getPlayer(state, otherSeat(seat));
  const oppLife = opponent.life.length;
  // Spend every DON!! on the attack when a multi-swing can close or life is low.
  if (oppLife <= 2 || (attackerCount > 0 && oppLife <= attackerCount)) {
    return 0;
  }
  const counterEventCost = cheapestCounterEventCost(state, seat);
  if (counterEventCost === null) {
    return 0;
  }
  return Math.min(counterEventCost, policy.counterDonReserveCap);
}

export function scoreCharacterAttack(
  state: MatchState,
  attackerPower: number,
  targetId: string,
  policy: HeuristicPolicy = BALANCED_POLICY,
): number {
  const targetPower = getCardPower(state, targetId);
  if (attackerPower < targetPower) {
    return -1; // no guaranteed K.O.
  }
  const keywords = getKeywords(state, targetId);
  const card = getCardForInstance(state, targetId);
  const hasEffects = (card.effects?.effects?.length ?? 0) > 0;
  const isThreat =
    targetPower >= THREAT_POWER ||
    keywords.has("blocker") ||
    keywords.has("rush") ||
    keywords.has("doubleAttack") ||
    hasEffects;
  const bias = policy.characterAttackBias;
  if (!isThreat) {
    // Rested vanilla: still worth removing when the K.O. is guaranteed — it
    // denies future attackers and clears the way to the leader.
    // Aggressive: deprioritize vanillas so leader pressure wins the sort.
    return (540 + targetPower / 200) * bias;
  }
  let score = 620 + targetPower / 200;
  if (keywords.has("blocker")) {
    // blockers stop future attacks — remove them first (both styles)
    score += policy.style === "aggressive" ? 100 : 60;
  }
  return score * bias;
}

function handleSetupCommand(
  state: MatchState,
  seat: MatchSeat,
  legalCommands: LegalCommandDescriptor[],
  policy: HeuristicPolicy,
): EngineCommand | null {
  const joKenPo = legalCommands.find((c) => c.type === "chooseJoKenPo");
  if (joKenPo) {
    return commandFromDescriptor(state, seat, joKenPo);
  }

  const firstPlayerChoices = legalCommands.filter((c) => c.type === "chooseFirstPlayer");
  if (firstPlayerChoices.length > 0) {
    // Prefer second: the first player skips its draw and cannot attack turn 1.
    // Very low-curve aggro openers (several cheap plays) prefer the tempo of
    // going first instead. Aggressive uses a lower cheap-card threshold.
    const hand = getPlayer(state, seat).hand;
    const cheapPlays = hand.filter((instanceId) => {
      const card = getCardForInstance(state, instanceId);
      return (
        card.cardType !== "leader" && baseCost(card) > 0 && baseCost(card) <= AGGRO_HAND_CHEAP_COST
      );
    }).length;
    const wantFirst = cheapPlays >= policy.firstPlayerCheapThreshold;
    const preferred = firstPlayerChoices.find(
      (c) => c.targetIds?.[0] === (wantFirst ? seat : otherSeat(seat)),
    );
    const descriptor = preferred ?? firstPlayerChoices[0]!;
    return commandFromDescriptor(state, seat, descriptor);
  }

  const keepHand = legalCommands.find((c) => c.type === "keepHand");
  const mulligan = legalCommands.find((c) => c.type === "mulligan");
  if (keepHand || mulligan) {
    const costs = getPlayer(state, seat).hand.map((instanceId) =>
      baseCost(getCardForInstance(state, instanceId)),
    );
    const hasPlayableOpener = costs.some((cost) => cost <= policy.mulliganMaxCost);
    // Curve-less hands (one cheap card and a pile of top end) keep passing
    // until turn 4+ — a fresh five is worth more.
    const heavyCards = costs.filter((cost) => cost >= policy.mulliganHeavyCost).length;
    const keep = hasPlayableOpener && heavyCards < policy.mulliganHeavyCards;
    const descriptor = keep ? keepHand : mulligan;
    if (descriptor) {
      return commandFromDescriptor(state, seat, descriptor);
    }
  }

  const startGame = legalCommands.find((c) => c.type === "startGame");
  if (startGame) {
    return commandFromDescriptor(state, seat, startGame);
  }

  return null;
}

export function createHeuristicStrategy(policy: HeuristicPolicy): OnePieceBotStrategy {
  return (state, seat, legalCommands) => {
    const mine = legalCommands.filter((c) => c.seat === seat);
    if (mine.length === 0) {
      return null;
    }

    if (state.status === "setup") {
      const setupCommand = handleSetupCommand(state, seat, mine, policy);
      if (setupCommand) {
        return setupCommand;
      }
    }

    const player = getPlayer(state, seat);
    const activeDon = player.activeDon;

    // Planned attackers: every unit the engine says can attack right now. DON!!
    // only ever goes to these — attaching to a character played this turn
    // (without Rush) wastes the +1000, since the bonus only applies on our turn.
    const attackDescriptors = mine.filter(
      (c) => c.type === "declareAttack" && c.sourceId && c.targetIds?.length,
    );
    const attackerIds = new Set(attackDescriptors.map((c) => c.sourceId!));
    let bestAttackerId: string | null = null;
    let bestAttackerPower = -1;
    for (const attackerId of attackerIds) {
      const power = getCardPower(state, attackerId);
      if (power > bestAttackerPower) {
        bestAttackerPower = power;
        bestAttackerId = attackerId;
      }
    }

    // Adaptive DON!! reserve: bank for [Counter] Events unless we are racing
    // for lethal (opp life ≤2 or multi-attacker close) — see computeDonReserve.
    const donReserve = computeDonReserve(state, seat, attackerIds.size, policy);

    const scored: ScoredCommand[] = [];
    for (const descriptor of mine) {
      let score = -1;
      let attachAmount: number | undefined;
      switch (descriptor.type) {
        case "playCard": {
          if (!descriptor.sourceId) break;
          if (descriptor.slotChoices !== undefined && descriptor.slotChoices.length === 0) break;
          const card = getCardForInstance(state, descriptor.sourceId);
          if (card.cardType === "character") {
            score = scoreCharacterPlay(state, descriptor.sourceId, activeDon, policy);
          } else if (card.cardType === "event") {
            score = scoreEventPlay(state, seat, descriptor.sourceId, policy);
          } else if (card.cardType === "stage") {
            score = 850 + baseCost(card) * 20;
          }
          break;
        }
        case "activateEffect": {
          // Fire [Activate: Main] effects before DON!! assignment so their costs
          // are paid first and their effects (rests, draws) shape the attacks.
          // Aggressive slightly deprioritizes non-attack effects to spend more
          // time swinging.
          score = policy.style === "aggressive" ? 720 : 750;
          break;
        }
        case "attachDon": {
          if (!descriptor.sourceId || !attackerIds.has(descriptor.sourceId)) break;
          // Attach everything above the [Counter] reserve in one command so
          // the DON!! assignment reads as a single log line. The engine's
          // canAttachDon still validates the amount against active DON!!.
          if (activeDon <= donReserve) break;
          attachAmount = activeDon - donReserve;
          score = scoreAttachDon(state, seat, descriptor.sourceId, bestAttackerId, policy);
          break;
        }
        case "declareAttack": {
          if (!descriptor.sourceId || !descriptor.targetIds?.length) break;
          const attackerPower = getCardPower(state, descriptor.sourceId);
          const opponent = getPlayer(state, otherSeat(seat));
          let bestTargetScore = -1;
          let bestTargetId: string | null = null;
          for (const targetId of descriptor.targetIds) {
            const targetScore =
              targetId === opponent.leaderInstanceId
                ? scoreLeaderAttack(
                    state,
                    seat,
                    descriptor.sourceId,
                    attackerPower,
                    attackerIds.size,
                    policy,
                  )
                : scoreCharacterAttack(state, attackerPower, targetId, policy);
            if (targetScore > bestTargetScore) {
              bestTargetScore = targetScore;
              bestTargetId = targetId;
            }
          }
          if (bestTargetId !== null) {
            scored.push({
              descriptor: { ...descriptor, targetIds: [bestTargetId] },
              score: bestTargetScore,
            });
          }
          continue;
        }
        case "endTurn": {
          score = 10;
          break;
        }
        default: {
          // resolvePrompt and any unhandled descriptor: leave to the fallback.
          score = -1;
          break;
        }
      }
      if (score >= 0) {
        scored.push({ descriptor, score, ...(attachAmount !== undefined && { attachAmount }) });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    for (const candidate of scored) {
      const command = commandFromDescriptor(state, seat, candidate.descriptor);
      if (!command) {
        continue;
      }
      if (candidate.attachAmount !== undefined && command.type === "attachDon") {
        return { ...command, amount: candidate.attachAmount };
      }
      return command;
    }
    return null;
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Prompt-level policy (resolvePrompt)
// ─────────────────────────────────────────────────────────────────────────────

function confirmCommand(prompt: PromptState, accept: boolean): EngineCommand {
  const seat = prompt.seat as MatchSeat;
  const acceptOption = prompt.options.find((o) => o.id === "yes" || o.id === "activate");
  const declineOption = prompt.options.find((o) => o.id === "no" || o.id === "skip");
  const optionId = accept
    ? (acceptOption?.id ?? prompt.options[0]?.id)
    : (declineOption?.id ?? prompt.options[0]?.id);
  return { type: "resolvePrompt", seat, promptId: prompt.id, optionId };
}

function selectCommand(prompt: PromptState, selectedIds: string[]): EngineCommand {
  return {
    type: "resolvePrompt",
    seat: prompt.seat as MatchSeat,
    promptId: prompt.id,
    selectedIds,
  };
}

/** Cheapest-first ordering for cost payments and sacrifice picks. */
function byCheapest(state: MatchState, ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => {
    const cardA = getCardForInstance(state, a);
    const cardB = getCardForInstance(state, b);
    const costDiff = baseCost(cardA) - baseCost(cardB);
    if (costDiff !== 0) return costDiff;
    return basePower(cardA) - basePower(cardB);
  });
}

/** Strongest-first ordering for removal/buff target picks. */
function byStrongest(state: MatchState, ids: readonly string[]): string[] {
  return [...ids].sort((a, b) => getCardPower(state, b) - getCardPower(state, a));
}

function resolveBattleBlocker(
  state: MatchState,
  prompt: PromptState,
  policy: HeuristicPolicy,
): EngineCommand {
  const battle = state.battle;
  const blockerIds = prompt.options
    .filter((o) => o.id !== "skip" && o.enabled !== false)
    .map((o) => o.id)
    .filter((id) => state.cards[id] !== undefined);
  if (!battle || blockerIds.length === 0) {
    return selectCommand(prompt, []);
  }

  const seat = prompt.seat as MatchSeat;
  const me = getPlayer(state, seat);
  const life = me.life.length;
  const cheapest = byCheapest(state, blockerIds)[0]!;
  const cheapestCost = baseCost(getCardForInstance(state, cheapest));
  const attackerPower = getCardPower(state, battle.attackerId);
  const targetIsLeader = battle.targetId === me.leaderInstanceId;

  let shouldBlock: boolean;
  if (targetIsLeader) {
    const boardWidth = me.characterArea.filter((entry) => entry !== null).length;
    shouldBlock =
      life <= policy.blockLowLife ||
      attackerPower >= getCardPower(state, me.leaderInstanceId) + BLOCK_OVERWHELM_MARGIN ||
      (cheapestCost <= EXPENDABLE_BLOCKER_COST && boardWidth >= WIDE_BOARD) ||
      (policy.aggressiveBlocking && cheapestCost <= EXPENDABLE_BLOCKER_COST && life <= 4);
    if (life >= 4 && cheapestCost >= VALUABLE_BLOCKER_COST && !policy.aggressiveBlocking) {
      shouldBlock = false; // keep the valuable blocker, take the life card
    }
    // Aggressive still refuses to throw 5+ cost blockers at high life.
    if (policy.aggressiveBlocking && life >= 5 && cheapestCost >= VALUABLE_BLOCKER_COST) {
      shouldBlock = false;
    }
  } else {
    // Attacks into rested characters: only trade up (cheaper blocker than target).
    const targetCost = baseCost(getCardForInstance(state, battle.targetId));
    shouldBlock = cheapestCost < targetCost;
  }

  return selectCommand(prompt, shouldBlock ? [cheapest] : []);
}

function resolveBattleCounter(
  state: MatchState,
  prompt: PromptState,
  policy: HeuristicPolicy,
): EngineCommand {
  const empty = selectCommand(prompt, []);
  const battle = state.battle;
  if (!battle) {
    return empty;
  }
  const seat = prompt.seat as MatchSeat;
  const me = getPlayer(state, seat);

  interface CounterOption {
    id: string;
    cost: number;
    value: number;
  }
  const usable: CounterOption[] = [];
  for (const option of prompt.options) {
    if (option.enabled === false || state.cards[option.id] === undefined) continue;
    const card = getCardForInstance(state, option.id);
    if (card.cardType === "character") {
      const value = getCardCounter(state, option.id);
      if (value > 0) {
        usable.push({ id: option.id, cost: baseCost(card), value });
      }
    } else if (card.cardType === "event" && effectBlocksFor(card, "counter").length > 0) {
      usable.push({ id: option.id, cost: baseCost(card), value: eventCounterPower(card) });
    }
  }
  if (usable.length === 0) {
    return empty;
  }

  // Attack power includes the attacker's DON!! (their turn); our defender's
  // DON!! gives no power off-turn, plus counters already played this battle.
  const attackPower = getCardPower(state, battle.attackerId);
  const defensePower = getCardPower(state, battle.targetId) + battle.counterTotal;
  const deficit = attackPower - defensePower;
  if (deficit < 0) {
    return empty; // already winning the battle
  }
  const needed = deficit + 1; // ties go to the attacker

  const targetIsLeader = battle.targetId === me.leaderInstanceId;
  const lethal = targetIsLeader && me.life.length === 0;
  if (!lethal) {
    if (targetIsLeader) {
      // Countering a non-lethal hit trades a hand card for a life card the
      // opponent effectively hands us anyway — only worth it once damage
      // actually threatens. Aggressive counters earlier (higher life threshold).
      const worthDefending = me.life.length <= policy.counterWorthLife;
      const minCounters =
        policy.style === "aggressive"
          ? Math.min(1, MIN_COUNTER_CARDS_TO_DEFEND)
          : MIN_COUNTER_CARDS_TO_DEFEND;
      if (!worthDefending || needed > COUNTABLE_DEFICIT || usable.length < minCounters) {
        return empty; // take the life card instead of bleeding counters
      }
    } else {
      const targetCost = baseCost(getCardForInstance(state, battle.targetId));
      if (targetCost < VALUABLE_CHARACTER_COST || needed > COUNTABLE_DEFICIT) {
        return empty;
      }
    }
  }

  // Prefer cheap, low-value character counters over valuable cards: try the
  // smallest single card that covers the deficit, otherwise accumulate the
  // largest counters first to spend the fewest cards.
  const single = usable
    .filter((c) => c.value >= needed)
    .sort((a, b) => a.cost - b.cost || a.value - b.value)[0];
  if (single) {
    return selectCommand(prompt, [single.id]);
  }
  const descending = [...usable].sort((a, b) => b.value - a.value || a.cost - b.cost);
  const chosen: string[] = [];
  let total = 0;
  let donBudget = me.activeDon; // [Counter] Events each need their cost paid
  for (const counter of descending) {
    if (total >= needed) break;
    const isEvent = getCardForInstance(state, counter.id).cardType === "event";
    if (isEvent && counter.cost > donBudget) continue;
    chosen.push(counter.id);
    total += counter.value;
    if (isEvent) donBudget -= counter.cost;
  }
  if (total >= needed || lethal) {
    // Lethal with an unsurvivable wall: go down fighting (spec).
    return selectCommand(prompt, chosen);
  }
  return empty;
}

function resolveLifeTrigger(state: MatchState, prompt: PromptState): EngineCommand {
  const context = prompt.resolutionContext;
  if (context?.intent === "lifeTrigger") {
    const card = getCardForInstance(state, context.sourceInstanceId);
    // Free effect by default; keep expensive characters for the board instead.
    if (card.cardType === "character" && baseCost(card) >= TRIGGER_KEEP_COST) {
      return confirmCommand(prompt, false);
    }
  }
  return confirmCommand(prompt, true);
}

function resolveOptionalConfirm(state: MatchState, prompt: PromptState): EngineCommand {
  const context = prompt.resolutionContext;
  if (
    (context?.intent === "effectOptional" || context?.intent === "effectActionOptional") &&
    state.cards[context.sourceInstanceId]
  ) {
    // Defensive declines only: skip effects an opponent's card makes us choose.
    const effectController = getInstance(state, context.sourceInstanceId).controller;
    return confirmCommand(prompt, effectController === prompt.seat);
  }
  return confirmCommand(prompt, true);
}

/** Classify an effectTargetSelection-style prompt and pick targets. */
function resolveEffectSelection(state: MatchState, prompt: PromptState): EngineCommand | null {
  const context = prompt.resolutionContext;
  const seat = prompt.seat as MatchSeat;

  const candidateIds = prompt.options
    .map((o) => o.targetId ?? o.id)
    .filter((id) => state.cards[id] !== undefined);
  if (candidateIds.length === 0) {
    return null; // opaque/hidden candidates — leave to the naive resolver
  }

  let action: Action | null = null;
  if (
    context?.intent === "effectTargetSelection" ||
    context?.intent === "effectPlaySelection" ||
    context?.intent === "effectGroupedPlaySelection" ||
    context?.intent === "effectSearchSelection"
  ) {
    action = context.action;
  }

  // Search prompts list every looked card as an option, but only the effect's
  // eligible cards are legal picks — intersect before choosing.
  let legalCandidateIds =
    context?.intent === "effectSearchSelection"
      ? candidateIds.filter((id) => context.eligibleIds.includes(id))
      : candidateIds;
  if (context?.intent === "effectSearchSelection") {
    // The engine capacity-checks character picks against open character slots;
    // with a full area a character pick is rejected, so decline those instead.
    const openSlots = getPlayer(state, context.controller).characterArea.filter(
      (entry) => entry === null,
    ).length;
    if (openSlots === 0) {
      legalCandidateIds = legalCandidateIds.filter(
        (id) => getCardForInstance(state, id).cardType !== "character",
      );
    }
  }
  if (legalCandidateIds.length === 0) {
    return selectCommand(prompt, []);
  }

  const allMine = legalCandidateIds.every((id) => getInstance(state, id).controller === seat);
  const allOpponents = legalCandidateIds.every(
    (id) => getInstance(state, id).controller === otherSeat(seat),
  );

  const harmful = action !== null && HARMFUL_ACTIONS.has(action.action);
  const beneficial =
    action !== null &&
    (BENEFICIAL_ACTIONS.has(action.action) ||
      (action.action === "modifyPower" && action.value > 0) ||
      action.action === "play" ||
      action.action === "playGrouped" ||
      action.action === "search");

  // Good-for-us: removal pointed at enemy cards, or buffs pointed at ours.
  const goodForUs = (harmful && allOpponents) || (beneficial && allMine);

  let ordered: string[];
  if (goodForUs) {
    ordered = byStrongest(state, legalCandidateIds);
  } else if ((harmful && allMine) || (beneficial && allOpponents)) {
    ordered = byCheapest(state, legalCandidateIds); // lose/give the least
  } else {
    ordered = byStrongest(state, legalCandidateIds);
  }

  let count = prompt.minSelections;
  if (count === 0) {
    // Optional pick: take one only when it is clearly beneficial.
    count = goodForUs ? Math.min(1, prompt.maxSelections) : 0;
  }
  return selectCommand(prompt, ordered.slice(0, count));
}

function resolveCostSelection(state: MatchState, prompt: PromptState): EngineCommand | null {
  const context = prompt.resolutionContext;
  const candidateIds = prompt.options
    .map((o) => o.targetId ?? o.id)
    .filter((id) => state.cards[id] !== undefined);
  if (candidateIds.length === 0) {
    return null;
  }

  let ordered: string[];
  if (context?.intent === "effectCostGiveDon" || context?.intent === "effectCostReturnDon") {
    // DON!! costs: strip DON!! from rested characters first (their +1000 is
    // already spent), then from the lowest-power attackers.
    ordered = [...candidateIds].sort((a, b) => {
      const restDiff = Number(getInstance(state, b).rested) - Number(getInstance(state, a).rested);
      if (restDiff !== 0) return restDiff;
      return getCardPower(state, a) - getCardPower(state, b);
    });
  } else {
    ordered = byCheapest(state, candidateIds);
  }

  const count = Math.min(Math.max(prompt.minSelections, 1), ordered.length);
  return selectCommand(prompt, ordered.slice(0, count));
}

export function createHeuristicPromptResolver(policy: HeuristicPolicy): OnePieceBotPromptResolver {
  return (state, prompt) => {
    if (prompt.kind === "judge" || prompt.seat === "judge") {
      return null;
    }
    const intent = prompt.resolutionContext?.intent;

    if (prompt.choiceKind === "confirm") {
      if (intent === "lifeTrigger") {
        return resolveLifeTrigger(state, prompt);
      }
      return resolveOptionalConfirm(state, prompt);
    }

    if (prompt.choiceKind === "costPayment") {
      return resolveCostSelection(state, prompt);
    }

    if (prompt.choiceKind === "orderCards") {
      // Deck ordering (search remainders, returned-to-deck cards): put the most
      // valuable cards first so the best of them is drawn soonest.
      const ids = prompt.options.map((o) => o.id);
      if (ids.some((id) => state.cards[id] === undefined)) {
        return null;
      }
      const ordered = [...ids].sort((a, b) => {
        const cardA = getCardForInstance(state, a);
        const cardB = getCardForInstance(state, b);
        const valueDiff =
          baseCost(cardB) * 10 +
          basePower(cardB) / 100 -
          (baseCost(cardA) * 10 + basePower(cardA) / 100);
        return valueDiff !== 0 ? valueDiff : ids.indexOf(a) - ids.indexOf(b);
      });
      return selectCommand(prompt, ordered);
    }

    if (prompt.choiceKind === "selectCards" || prompt.choiceKind === "selectTargets") {
      switch (intent) {
        case "battleBlocker":
          return resolveBattleBlocker(state, prompt, policy);
        case "battleCounter":
          return resolveBattleCounter(state, prompt, policy);
        case "playCharacterReplacement":
        case "effectPlayCharacterReplacement": {
          // 3-7-6-1: full character area — trash the weakest character.
          const candidates = prompt.options
            .map((o) => o.targetId ?? o.id)
            .filter((id) => state.cards[id] !== undefined);
          if (candidates.length === 0) return null;
          return selectCommand(prompt, byCheapest(state, candidates).slice(0, 1));
        }
        case "battleAttackHandTrashCost":
        case "effectCostTrashFromHand":
        case "effectCostRestCards":
        case "effectCostKoCharacter":
        case "effectCostTrashCharacter":
        case "effectCostPlayCard":
        case "effectCostTrashCard":
        case "effectCostReturnCharacter":
        case "effectCostReturnCharacterToDeck":
        case "effectCostGiveDon":
        case "effectCostReturnDon":
        case "effectCostReturnTrashToDeck":
        case "effectCostReturnThisAndHandToDeck":
        case "effectCostRevealFromHand":
        case "effectTrashFromHandSelection":
        case "effectRevealFromHandSelection":
          return resolveCostSelection(state, prompt);
        case "effectTargetSelection":
        case "effectPlaySelection":
        case "effectGroupedPlaySelection":
        case "effectSearchSelection":
          return resolveEffectSelection(state, prompt);
        default:
          // Generic selectCards/selectTargets with no context: try the effect
          // selection heuristic; unknown shapes fall back to the naive resolver.
          return resolveEffectSelection(state, prompt);
      }
    }

    return null;
  };
}

export function createHeuristicAgent(id: string, policy: HeuristicPolicy): OnePieceBotAgent {
  return {
    id,
    choose: createHeuristicStrategy(policy),
    resolvePrompt: createHeuristicPromptResolver(policy),
  };
}

/** Balanced board-control / value heuristic (promoted production strategy). */
export const heuristicStrategy: OnePieceBotStrategy = createHeuristicStrategy(BALANCED_POLICY);
export const heuristicPromptResolver: OnePieceBotPromptResolver =
  createHeuristicPromptResolver(BALANCED_POLICY);
export const heuristicAgent: OnePieceBotAgent = createHeuristicAgent("heuristic", BALANCED_POLICY);

/** Aggressive life-race heuristic: leader pressure, rush, offensive DON!!, early counters. */
export const aggressiveStrategy: OnePieceBotStrategy = createHeuristicStrategy(AGGRESSIVE_POLICY);
export const aggressivePromptResolver: OnePieceBotPromptResolver =
  createHeuristicPromptResolver(AGGRESSIVE_POLICY);
export const aggressiveAgent: OnePieceBotAgent = createHeuristicAgent(
  "aggressive",
  AGGRESSIVE_POLICY,
);
