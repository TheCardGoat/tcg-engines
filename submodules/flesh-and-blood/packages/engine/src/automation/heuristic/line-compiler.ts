import { activationQuoteForCommand, type FabLegalCommand } from "../legal-commands.ts";
import { evaluateDefendSet, scoreDefendSet } from "./defend.ts";
import { arsenalValue, planHandOffense } from "./hand-value.ts";
import { isMirrorDisruption } from "./profiles/names.ts";
import { cardByInstance } from "./snapshot.ts";
import type {
  FabCardRole,
  FabCompiledLine,
  FabCompiledLineKind,
  FabHeuristicCard,
  FabHeuristicSnapshot,
  FabLineRankingHint,
  FabLineRankingInput,
} from "./types.ts";

const PLAY_ATTACK = 400;
const PLAY_NON_ATTACK = 180;
const ACTIVATE_ATTACK = 360;
/** Tap-opt equipment (Compass, Dead Threads) must not outrank ending the turn. */
const ACTIVATE_UTILITY = 70;
const END_TURN_BASE = 120;
const ARSENAL_BASE = 45;
const HINT_MATCH = 520;
const DEFEND_COVER = 420;
const PROMPT_BASE = 900;
const PASS_ACTIVE = 15;
const PASS_OTHER = 50;
const NEVER_DEFEND_NONEMPTY = -10_000;
const DEFEND_ONLY_OFFENSE = -10_000;
const ON_CURVE_END_TURN_PENALTY = 280;

export function rankTurnLines(
  snapshot: FabHeuristicSnapshot,
  legalCommands: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
): readonly FabCompiledLine[] {
  const legal = legalCommands.filter((command) => command.move !== "concede");
  if (legal.length === 0) return [];

  const heads = legal.map((command) => {
    const scored = scoreCommandAsLine(snapshot, command, legal, ranking);
    const bonus =
      (ranking.adjustScore?.(scored, snapshot) ?? 0) + mirrorLineBonus(scored, snapshot);
    return bonus === 0 ? scored : { ...scored, score: scored.score + bonus };
  });
  // CR 7.5.2 / 4.5.3a: retaining a strong hand cannot compensate for dying.
  // Keep this outside additive hero hints so a combo preference cannot undo it.
  const lethal =
    ranking.persona !== "never-defend" &&
    snapshot.life > 0 &&
    (snapshot.remainingDamage ?? 0) >= snapshot.life;
  return heads
    .map((head) => ({ head, priority: lethal ? survivalPriority(snapshot, head) : 0 }))
    .sort((left, right) => right.priority - left.priority || right.head.score - left.head.score)
    .map(({ head }) => head);
}

function survivalPriority(snapshot: FabHeuristicSnapshot, head: FabCompiledLine): number {
  if (head.kind === "defend" || head.kind === "pass") {
    return evaluateDefendSet(snapshot, head.defendInstanceIds ?? []).survives ? 2 : 0;
  }
  if (head.playInstanceId) {
    const card = cardByInstance(snapshot, head.playInstanceId);
    if (card?.isDefenseReaction && canAffordCard(snapshot, card)) {
      return Math.max(0, (snapshot.remainingDamage ?? 0) - card.defense) < snapshot.life ? 2 : 1;
    }
  }
  // Instants, payments, and other setup may still unlock a defensive line.
  return 1;
}

export function compileTurnLine(
  snapshot: FabHeuristicSnapshot,
  legalCommands: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
): FabCompiledLine | null {
  const ranked = rankTurnLines(snapshot, legalCommands, ranking);
  ranking.onRanked?.(ranked);
  return ranked[0] ?? null;
}

export function chooseCompiledLineCommand(
  line: FabCompiledLine | null,
  legalCommands: readonly FabLegalCommand[],
): FabLegalCommand | null {
  if (!line) return legalCommands.find((command) => command.move !== "concede") ?? null;
  const match = legalCommands.find((command) => sameCommand(command, line.command));
  return match ?? line.command;
}

function scoreCommandAsLine(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  legal: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
): FabCompiledLine {
  switch (command.move) {
    case "answer-decision":
      return scorePrompt(snapshot, command, ranking.hint);
    case "begin-play":
      return scorePlay(snapshot, command, legal, ranking, "play");
    case "activate":
      return scorePlay(snapshot, command, legal, ranking, "activate");
    case "defend":
      return scoreDefend(snapshot, command, ranking);
    case "end-turn":
      return scoreEndTurn(snapshot, command, legal, ranking);
    case "pass":
      return scorePass(snapshot, command, ranking);
    default:
      return line("prompt", command, 0, snapshot);
  }
}

function scorePrompt(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  hint: FabLineRankingHint | undefined,
): FabCompiledLine {
  const answer = command.payload.answer;
  if (!isRecord(answer)) return line("prompt", command, PROMPT_BASE, snapshot);

  if (answer.kind === "payment" && Array.isArray(answer.instanceIds)) {
    const pitched = answer.instanceIds.filter((id): id is string => typeof id === "string");
    let score = PROMPT_BASE;
    for (const instanceId of pitched) {
      score += scorePitchChoice(cardByInstance(snapshot, instanceId), instanceId, hint);
    }
    const payment = snapshot.pendingAttackPayment;
    if (payment) {
      const spent = new Set(payment.pitchedInstanceIds);
      const priced = (card: FabHeuristicCard) =>
        card.instanceId === payment.sourceInstanceId
          ? { ...card, cost: payment.remainingCost }
          : card;
      const plan = planHandOffense({
        hand: snapshot.hand.filter((card) => !spent.has(card.instanceId)).map(priced),
        arsenal: snapshot.arsenal.map(priced),
        arsenalHasRoom: snapshot.arsenalHasRoom,
        resourcePoints: 0,
        actionPoints: snapshot.actionPoints,
        firstPlayInstanceId: payment.sourceInstanceId,
        requiredFirstPitchInstanceIds: pitched,
      });
      // Value the retained line, including floating pitch. Static pitch value
      // remains a tie-breaker; profile hints retain their explicit priority.
      if (Number.isFinite(plan.value)) score += plan.value * 40;
    }
    return { ...line("pitch", command, score, snapshot), pitchInstanceIds: pitched };
  }

  if (answer.kind === "boolean") {
    return line(
      "prompt",
      command,
      answer.value === true ? PROMPT_BASE + 10 : PROMPT_BASE - 10,
      snapshot,
    );
  }

  if (answer.kind === "cancel") {
    return line("prompt", command, -8_000, snapshot);
  }

  if (answer.kind === "entity-target" && Array.isArray(answer.instanceIds)) {
    const selected = answer.instanceIds.filter((id): id is string => typeof id === "string");
    // Empty any-number answers are legal, but a required discard/target left
    // unbound bricks the stack (Gravy loot auto-pass: unresolved discard).
    if (selected.length === 0) return line("prompt", command, PROMPT_BASE - 80, snapshot);
    // Prefer a singleton. "All candidates" outranking one card made Beseech
    // submit a 5-target answer for a choose-1 on-stack parameter.
    return line(
      "prompt",
      command,
      selected.length === 1 ? PROMPT_BASE + 20 : PROMPT_BASE + 10,
      snapshot,
    );
  }

  return line("prompt", command, PROMPT_BASE, snapshot);
}

function scorePlay(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  legal: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
  kind: "play" | "activate",
): FabCompiledLine {
  const instanceId = stringPayload(command.payload.instanceId);
  const sourceCard = instanceId ? cardByInstance(snapshot, instanceId) : undefined;
  const activation = activationQuoteForCommand(command);
  const card =
    sourceCard && activation
      ? {
          ...sourceCard,
          cost: activation.quote.resourceCost ?? sourceCard.cost,
          // Activating a permanent does not pay its card-play additional costs.
          additionalHandDiscard: 0,
        }
      : sourceCard;
  const isAttack = card?.isAttack === true;
  const persona = ranking.persona;

  const attackActivate =
    activation?.isAttack ??
    (isAttack ||
      Boolean(
        card &&
        (card.types.includes("Weapon") ||
          card.types.includes("Ally") ||
          card.subtypes.includes("Ally")),
      ));
  if (
    persona === "defend-only" &&
    ((kind === "activate" && attackActivate) || (kind === "play" && !card?.isDefenseReaction))
  ) {
    return line(kind, command, DEFEND_ONLY_OFFENSE, snapshot, instanceId);
  }
  const utilityEquipment = kind === "activate" && Boolean(card?.isEquipment) && !attackActivate;
  let score = utilityEquipment
    ? -250
    : kind === "activate"
      ? attackActivate
        ? ACTIVATE_ATTACK
        : ACTIVATE_UTILITY
      : isAttack
        ? PLAY_ATTACK
        : PLAY_NON_ATTACK;
  if (card) {
    score += card.power * 10 - Math.max(0, card.cost - snapshot.resourcePoints) * 3;
    if (
      kind === "play" &&
      isAttack &&
      [...snapshot.hand, ...snapshot.arsenal].some((held) => held.instanceId === instanceId)
    ) {
      const plan = planHandOffense({
        hand: snapshot.hand,
        arsenal: snapshot.arsenal,
        arsenalHasRoom: snapshot.arsenalHasRoom,
        resourcePoints: snapshot.resourcePoints,
        actionPoints: snapshot.actionPoints,
        firstPlayInstanceId: card.instanceId,
      });
      score += Math.max(0, plan.damage - card.power) * 10;
    }
    if (!canAffordCard(snapshot, card)) score -= 10_000;
    if (card.isDefenseReaction && !snapshot.defending) score -= 180;
    if (snapshot.defending && card.isDefenseReaction) {
      return scoreDefenseReactionPlay(snapshot, command, card, ranking, kind, instanceId);
    }
  }
  if (instanceId && prefers(ranking.hint, card, instanceId, "play")) score += HINT_MATCH;
  if (instanceId && prefers(ranking.hint, card, instanceId, "arsenal")) score -= HINT_MATCH;

  const leftover = intendedArsenal(snapshot, legal, ranking, instanceId);
  if (leftover) score += ARSENAL_BASE + leftover.pitch;

  return {
    ...line(kind, command, score, snapshot, instanceId),
    arsenalInstanceId: leftover?.instanceId ?? null,
  };
}

function scoreDefend(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  ranking: FabLineRankingInput,
): FabCompiledLine {
  const ids = arrayPayload(command.payload.instanceIds);
  const score = scoreDefendSet(snapshot, ids, ranking);
  return { ...line("defend", command, score, snapshot), defendInstanceIds: ids };
}

function scoreDefenseReactionPlay(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  card: FabHeuristicCard,
  ranking: FabLineRankingInput,
  kind: "play" | "activate",
  instanceId: string | null,
): FabCompiledLine {
  if (ranking.persona === "never-defend") {
    return line(kind, command, NEVER_DEFEND_NONEMPTY, snapshot, instanceId);
  }
  if (!canAffordCard(snapshot, card)) return line(kind, command, -10_000, snapshot, instanceId);
  const remaining = snapshot.remainingDamage ?? 0;
  const covers = card.defense >= remaining;
  const lethal = remaining >= snapshot.life && snapshot.life > 0;
  let score = PLAY_NON_ATTACK;
  if (lethal || (snapshot.attackOnHitValue > 0 && covers) || remaining >= 6) {
    score = DEFEND_COVER + card.defense * 20 + (covers ? snapshot.attackOnHitValue * 20 : 0);
  } else {
    score = 60;
  }
  if (ranking.persona === "defend-only") score += 120;
  return line(kind, command, score, snapshot, instanceId);
}

function scoreEndTurn(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  legal: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
): FabCompiledLine {
  const arsenalInstanceId = stringPayload(command.payload.arsenalInstanceId);
  const card = arsenalInstanceId ? cardByInstance(snapshot, arsenalInstanceId) : undefined;
  let score = END_TURN_BASE;
  if (snapshot.isActive && !snapshot.combatOpen && !snapshot.stackOpen) score += 20;

  if (arsenalInstanceId && card) {
    score += card.isResource ? -40 : ARSENAL_BASE + arsenalValue(card);
    if (prefers(ranking.hint, card, arsenalInstanceId, "arsenal")) score += HINT_MATCH;
  } else if (
    snapshot.arsenalHasRoom &&
    snapshot.hand.some((held) => arsenalValue(held) > 0) &&
    ranking.persona !== "defend-only"
  ) {
    score -= 25;
  }

  if (ranking.persona === "defend-only") score += 80;

  if (
    ranking.persona === "value-extract" &&
    hasOnCurveAttack(snapshot, legal) &&
    snapshot.actionPoints > 0
  ) {
    score -= ON_CURVE_END_TURN_PENALTY;
  }
  // Never rank below a raw Pass: passing the terminal window skips arsenal.
  if (score <= PASS_OTHER) score = PASS_OTHER + 20;

  return { ...line("end-turn", command, score, snapshot), arsenalInstanceId };
}

function scorePass(
  snapshot: FabHeuristicSnapshot,
  command: FabLegalCommand,
  ranking: FabLineRankingInput,
): FabCompiledLine {
  const remaining = snapshot.remainingDamage;
  if (remaining !== null) {
    const takeScore = scoreDefendSet(snapshot, [], ranking);
    return line("pass", command, takeScore + 1, snapshot);
  }
  if (snapshot.isActive && !snapshot.combatOpen && !snapshot.stackOpen) {
    return line("pass", command, PASS_ACTIVE, snapshot);
  }
  return line("pass", command, PASS_OTHER, snapshot);
}

function intendedArsenal(
  snapshot: FabHeuristicSnapshot,
  legal: readonly FabLegalCommand[],
  ranking: FabLineRankingInput,
  playingInstanceId: string | null,
): FabHeuristicCard | undefined {
  if (!snapshot.arsenalHasRoom) return undefined;
  const hinted = snapshot.hand.find(
    (card) =>
      card.instanceId !== playingInstanceId &&
      prefers(ranking.hint, card, card.instanceId, "arsenal"),
  );
  if (hinted) return hinted;

  const legalArsenalIds = new Set(
    legal
      .filter((command) => command.move === "end-turn")
      .map((command) => stringPayload(command.payload.arsenalInstanceId))
      .filter((id): id is string => Boolean(id)),
  );
  const leftovers = snapshot.hand.filter(
    (card) =>
      card.instanceId !== playingInstanceId &&
      legalArsenalIds.has(card.instanceId) &&
      arsenalValue(card) > 0,
  );
  return leftovers.slice().sort((a, b) => arsenalValue(b) - arsenalValue(a))[0];
}

function canAffordCard(snapshot: FabHeuristicSnapshot, card: FabHeuristicCard): boolean {
  const others = snapshot.hand.filter((held) => held.instanceId !== card.instanceId);
  const discardNeed = card.additionalHandDiscard;
  if (others.length < discardNeed) return false;
  let pitch = snapshot.resourcePoints;
  let used = 0;
  const richestFirst = others.slice().sort((left, right) => right.pitch - left.pitch);
  for (const held of richestFirst) {
    if (pitch >= card.cost) break;
    pitch += held.pitch;
    used += 1;
  }
  return pitch >= card.cost && others.length - used >= discardNeed;
}

function hasOnCurveAttack(
  snapshot: FabHeuristicSnapshot,
  legal: readonly FabLegalCommand[],
): boolean {
  const availablePitch = snapshot.hand.reduce((sum, card) => sum + card.pitch, 0);
  for (const command of legal) {
    if (command.move !== "begin-play") continue;
    const instanceId = stringPayload(command.payload.instanceId);
    const card = instanceId ? cardByInstance(snapshot, instanceId) : undefined;
    if (!card?.isAttack) continue;
    const payable =
      card.cost <= snapshot.resourcePoints || card.cost <= availablePitch - card.pitch;
    if (payable) return true;
  }
  return false;
}

function scorePitchChoice(
  card: FabHeuristicCard | undefined,
  instanceId: string,
  hint: FabLineRankingHint | undefined,
): number {
  let score = 0;
  if (card) {
    score += card.pitch * 20;
    if (card.isAttack) score -= 40 + card.power * 8;
    if (card.isResource || (!card.isAttack && !card.isDefenseReaction)) score += 50;
  }
  if (prefers(hint, card, instanceId, "pitch")) score += HINT_MATCH;
  if (prefers(hint, card, instanceId, "arsenal") || prefers(hint, card, instanceId, "play")) {
    score -= HINT_MATCH;
  }
  return score;
}

function prefers(
  hint: FabLineRankingHint | undefined,
  card: FabHeuristicCard | undefined,
  instanceId: string,
  role: FabCardRole,
): boolean {
  if (!hint) return false;
  if (role === "arsenal") {
    if (hint.preferArsenalInstanceId === instanceId) return true;
    if (card && hint.preferArsenalCanonicalId === card.canonicalId) return true;
    if (card && namesMatch(hint.preferArsenalName, card.name)) return true;
  }
  if (role === "play") {
    if (hint.preferPlayInstanceId === instanceId) return true;
    if (card && hint.preferPlayCanonicalId === card.canonicalId) return true;
  }
  if (role === "pitch") {
    if (hint.preferPitchInstanceId === instanceId) return true;
    if (card && hint.preferPitchCanonicalId === card.canonicalId) return true;
  }
  const preferred = hint.preferred;
  if (!preferred) return false;
  const preferredRole = preferred.role ?? (role === "arsenal" ? "arsenal" : role);
  if (preferredRole !== role) return false;
  if (preferred.instanceId === instanceId) return true;
  if (card && preferred.canonicalId === card.canonicalId) return true;
  if (card && namesMatch(preferred.name, card.name)) return true;
  return false;
}

function namesMatch(expected: string | undefined, actual: string): boolean {
  if (!expected) return false;
  return actual.toLowerCase().includes(expected.toLowerCase());
}

/** Masterclass: Mirror Matches — play disruption that attacks the shared plan. */
function mirrorLineBonus(line: FabCompiledLine, snapshot: FabHeuristicSnapshot): number {
  if (!snapshot.isMirror) return 0;
  if (line.kind !== "play" && line.kind !== "activate") return 0;
  const play = line.playInstanceId ? cardByInstance(snapshot, line.playInstanceId) : undefined;
  return play && isMirrorDisruption(play) ? 90 : 0;
}

function line(
  kind: FabCompiledLineKind,
  command: FabLegalCommand,
  score: number,
  _snapshot: FabHeuristicSnapshot,
  playInstanceId: string | null = null,
): FabCompiledLine {
  return {
    kind,
    command,
    score,
    playInstanceId,
    pitchInstanceIds: [],
    arsenalInstanceId: null,
    defendInstanceIds: null,
  };
}

function sameCommand(left: FabLegalCommand, right: FabLegalCommand): boolean {
  return left.move === right.move && JSON.stringify(left.payload) === JSON.stringify(right.payload);
}

function stringPayload(value: unknown): string | null {
  return typeof value === "string" && value.length > 0 ? value : null;
}

function arrayPayload(value: unknown): string[] {
  return Array.isArray(value) ? value.filter((id): id is string => typeof id === "string") : [];
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}
