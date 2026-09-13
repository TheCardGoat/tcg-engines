import type { GrandArchiveCommand } from "../../commands/commands.ts";
import type {
  GrandArchiveObjectId,
  GrandArchivePlayerId,
  GrandArchiveTargetId,
} from "../../game/identity.ts";
import type { GrandArchiveLegalCommand } from "../../commands/legal-commands.ts";
import { grandArchiveHeuristicCardById } from "./snapshot.ts";
import type {
  GrandArchiveCompiledLine,
  GrandArchiveCompiledLineKind,
  GrandArchiveHeuristicCard,
  GrandArchiveHeuristicSnapshot,
  GrandArchiveLineRankingHint,
  GrandArchiveLineRankingInput,
} from "./types.ts";

const REQUIRED_DECISION = 10_000;
const PREGAME_PROGRESS = 9_000;
const PRESERVE_PROGRESS = 8_500;
const ATTACK_BASE = 900;
const PLAY_BASE = 700;
const ABILITY_BASE = 650;
const MATERIALIZE_BASE = 600;
const HINT_MATCH = 520;

export function rankGrandArchiveLines(
  snapshot: GrandArchiveHeuristicSnapshot,
  legalCommands: readonly GrandArchiveLegalCommand[],
  ranking: GrandArchiveLineRankingInput = {},
): readonly GrandArchiveCompiledLine[] {
  return legalCommands
    .map((command, index) => {
      const base = scoreCommand(snapshot, command);
      const adjustment = ranking.adjustScore?.(base, snapshot) ?? 0;
      if (!Number.isFinite(adjustment)) {
        throw new Error("Grand Archive heuristic score adjustments must be finite numbers.");
      }
      const score = base.score + scoreHint(base, snapshot, ranking.hint) + adjustment;
      return { line: score === base.score ? base : { ...base, score }, index };
    })
    .sort((left, right) => right.line.score - left.line.score || left.index - right.index)
    .map(({ line }) => line);
}

export function compileGrandArchiveLine(
  snapshot: GrandArchiveHeuristicSnapshot,
  legalCommands: readonly GrandArchiveLegalCommand[],
  ranking: GrandArchiveLineRankingInput = {},
): GrandArchiveCompiledLine | null {
  return rankGrandArchiveLines(snapshot, legalCommands, ranking)[0] ?? null;
}

export function chooseGrandArchiveCompiledLineCommand(
  line: GrandArchiveCompiledLine | null,
  legalCommands: readonly GrandArchiveLegalCommand[],
): GrandArchiveLegalCommand | null {
  if (!line) return null;
  const key = JSON.stringify(line.command.command);
  return legalCommands.find((candidate) => JSON.stringify(candidate.command) === key) ?? null;
}

function scoreCommand(
  snapshot: GrandArchiveHeuristicSnapshot,
  command: GrandArchiveLegalCommand,
): GrandArchiveCompiledLine {
  const move = command.command;
  switch (move.move) {
    case "answer-decision":
      return line("decision", command, REQUIRED_DECISION);
    case "start-pregame-card":
      return line("pregame", command, PREGAME_PROGRESS, move.cardId);
    case "complete-pregame-actions":
      return line("pregame", command, PREGAME_PROGRESS - 1);
    case "return-preserved-card":
      return line("preserve", command, PRESERVE_PROGRESS, move.cardId);
    case "materialize":
      return scoreObjectAction(snapshot, command, "materialize", move.cardId, MATERIALIZE_BASE, {
        modeIds: move.modeIds,
        targets: move.targets,
      });
    case "skip-materialization":
      return line("materialize", command, 100);
    case "activate-card":
      return scoreObjectAction(snapshot, command, "play", move.cardId, PLAY_BASE, {
        modeIds: move.modeIds,
        targets: move.targets,
      });
    case "bestow-boon":
      return scoreObjectAction(snapshot, command, "play", move.cardId, PLAY_BASE + 25, {
        modeIds: move.modeIds,
        targets: move.targets,
      });
    case "activate-ability":
      return scoreObjectAction(snapshot, command, "ability", move.sourceId, ABILITY_BASE, {
        abilityId: move.abilityId,
        modeIds: move.modeIds,
        targets: move.targets,
      });
    case "declare-attack":
      return scoreAttack(snapshot, command, move);
    case "pass":
      // Passing while a stack item exists advances its rules-defined resolution cycle.
      return line("pass", command, snapshot.stackDepth > 0 ? 500 : 0);
    case "concede":
      return line("concede", command, Number.NEGATIVE_INFINITY);
    default:
      return assertNever(move);
  }
}

function scoreObjectAction(
  snapshot: GrandArchiveHeuristicSnapshot,
  command: GrandArchiveLegalCommand,
  kind: Extract<GrandArchiveCompiledLineKind, "materialize" | "play" | "ability">,
  sourceId: GrandArchiveObjectId,
  base: number,
  declaration: {
    readonly abilityId?: string;
    readonly modeIds?: readonly string[];
    readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
  },
): GrandArchiveCompiledLine {
  const card = grandArchiveHeuristicCardById(snapshot, sourceId);
  const value = card ? permanentValue(card) : 0;
  const reservePenalty = reserveCardsSpent(command.command) * 8;
  return line(kind, command, base + value - reservePenalty, sourceId, declaration);
}

function scoreAttack(
  snapshot: GrandArchiveHeuristicSnapshot,
  command: GrandArchiveLegalCommand,
  move: Extract<GrandArchiveCommand, { readonly move: "declare-attack" }>,
): GrandArchiveCompiledLine {
  const attacker = grandArchiveHeuristicCardById(snapshot, move.attackerId);
  const targets = move.targetIds.flatMap((id) => {
    const card = grandArchiveHeuristicCardById(snapshot, id);
    return card ? [card] : [];
  });
  const attackPower = Math.max(0, attacker?.power ?? 0);
  const targetScore = targets.reduce((score, target) => {
    const remainingLife = target.life === null ? null : Math.max(0, target.life - target.damage);
    const lethal = remainingLife !== null && attackPower >= remainingLife;
    return score + (target.types.includes("CHAMPION") ? 80 : 0) + (lethal ? 180 : 0);
  }, 0);
  return line(
    "attack",
    command,
    ATTACK_BASE + attackPower * 20 + targetScore - reserveCardsSpent(move) * 8,
    move.attackerId,
    {
      targetIds: move.targetIds,
      attackCardId: move.attackCardId,
      weaponIds: move.weaponIds,
      delegatePlayerId: move.delegatePlayerId,
      cleavePlayerId: move.cleavePlayerId,
    },
  );
}

function permanentValue(card: GrandArchiveHeuristicCard): number {
  const stats =
    Math.max(0, card.power ?? 0) * 12 +
    Math.max(0, card.life ?? 0) * 4 +
    Math.max(0, card.durability ?? 0) * 4 +
    Math.max(0, card.level ?? 0) * 10;
  const objectBonus = card.types.some((type) =>
    ["ALLY", "CHAMPION", "DOMAIN", "ITEM", "PHANTASIA", "WEAPON"].includes(type),
  )
    ? 60
    : 0;
  return stats + objectBonus - Math.max(0, card.cost ?? 0) * 2;
}

function reserveCardsSpent(command: GrandArchiveCommand): number {
  if (!("reservePayment" in command) || !command.reservePayment) return 0;
  return command.reservePayment.filter((source) => source.kind === "card").length;
}

function scoreHint(
  line: GrandArchiveCompiledLine,
  snapshot: GrandArchiveHeuristicSnapshot,
  hint: GrandArchiveLineRankingHint | undefined,
): number {
  if (!hint) return 0;
  let score = 0;
  const source = line.sourceId ? grandArchiveHeuristicCardById(snapshot, line.sourceId) : undefined;
  if (source && hint.preferredSource) {
    const preferred = hint.preferredSource;
    if (
      preferred.objectId === source.id ||
      preferred.definitionId === source.definitionId ||
      (preferred.name !== undefined &&
        normalizedName(preferred.name) === normalizedName(source.name))
    ) {
      score += HINT_MATCH;
    }
  }
  if (hint.preferredAbilityId !== undefined && line.abilityId === hint.preferredAbilityId) {
    score += HINT_MATCH;
  }
  if (hint.preferredModeId !== undefined && line.modeIds.includes(hint.preferredModeId)) {
    score += HINT_MATCH;
  }
  if (hint.preferredTarget) {
    const preferred = hint.preferredTarget;
    const candidates = preferred.binding ? (line.targets[preferred.binding] ?? []) : line.targetIds;
    if (candidates.includes(preferred.id)) score += HINT_MATCH;
  }
  if (hint.preferredAttack && attackPreferenceMatches(line, hint.preferredAttack)) {
    score += HINT_MATCH;
  }
  const protectedIds = new Set(hint.preserveFromReservePaymentIds ?? []);
  if (protectedIds.size > 0 && "reservePayment" in line.command.command) {
    for (const source of line.command.command.reservePayment ?? []) {
      const objectId = source.kind === "card" ? source.cardId : source.objectId;
      if (protectedIds.has(objectId)) score -= HINT_MATCH;
    }
  }
  return score;
}

function normalizedName(value: string): string {
  return value.normalize("NFKC").trim().toLocaleLowerCase("en-US");
}

function attackPreferenceMatches(
  line: GrandArchiveCompiledLine,
  preference: NonNullable<GrandArchiveLineRankingHint["preferredAttack"]>,
): boolean {
  return (
    line.kind === "attack" &&
    (preference.attackCardId === undefined || line.attackCardId === preference.attackCardId) &&
    (preference.weaponId === undefined || line.weaponIds.includes(preference.weaponId)) &&
    (preference.delegatePlayerId === undefined ||
      line.delegatePlayerId === preference.delegatePlayerId) &&
    (preference.cleavePlayerId === undefined || line.cleavePlayerId === preference.cleavePlayerId)
  );
}

function line(
  kind: GrandArchiveCompiledLineKind,
  command: GrandArchiveLegalCommand,
  score: number,
  sourceId: GrandArchiveObjectId | null = null,
  declaration: {
    readonly abilityId?: string;
    readonly modeIds?: readonly string[];
    readonly targets?: Readonly<Record<string, readonly GrandArchiveTargetId[]>>;
    readonly targetIds?: readonly GrandArchiveTargetId[];
    readonly attackCardId?: GrandArchiveObjectId;
    readonly weaponIds?: readonly GrandArchiveObjectId[];
    readonly delegatePlayerId?: GrandArchivePlayerId;
    readonly cleavePlayerId?: GrandArchivePlayerId;
  } = {},
): GrandArchiveCompiledLine {
  const targets = declaration.targets ?? {};
  return {
    kind,
    command,
    score,
    sourceId,
    abilityId: declaration.abilityId ?? null,
    modeIds: declaration.modeIds ?? [],
    targets,
    targetIds: declaration.targetIds ?? Object.values(targets).flat(),
    attackCardId: declaration.attackCardId ?? null,
    weaponIds: declaration.weaponIds ?? [],
    delegatePlayerId: declaration.delegatePlayerId ?? null,
    cleavePlayerId: declaration.cleavePlayerId ?? null,
  };
}

function assertNever(value: never): never {
  throw new Error(`Unhandled Grand Archive heuristic command: ${JSON.stringify(value)}`);
}
