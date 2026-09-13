import type { FabGameAnalytics } from "@tcg/flesh-and-blood-server-adapter";

export const FAB_ANALYTICS_METHODOLOGY_URL = "/flesh-and-blood/simulator/analytics-methodology";
export const FAB_COMBAT_VALUE_METHOD = "Pilot v1";
export const FAB_COMBAT_VALUE_FORMULA =
  "Attack power presented + other damage dealt + effective defense + damage prevented";

export interface FabCombatValue {
  readonly attack: number;
  readonly otherDamage: number;
  readonly defense: number;
  readonly prevention: number;
  readonly total: number;
}

export interface FabCombatStats {
  readonly attackPowerThreatened: number;
  readonly totalDamageDealt: number;
  readonly attackDamageDealt: number;
  readonly effectiveDefense: number;
  readonly damagePrevented: number;
}

/** Descriptive output only: never infer card efficiency or a quality-of-play grade. */
export function calculateFabCombatValue(stats: FabCombatStats): FabCombatValue | null {
  const {
    attackPowerThreatened: attack,
    totalDamageDealt,
    attackDamageDealt,
    effectiveDefense: defense,
    damagePrevented: prevention,
  } = stats;
  if (
    ![attack, totalDamageDealt, attackDamageDealt, defense, prevention].every(
      (n) => Number.isFinite(n) && n >= 0,
    ) ||
    totalDamageDealt < attackDamageDealt
  )
    return null;
  const otherDamage = totalDamageDealt - attackDamageDealt;
  const total = attack + otherDamage + defense + prevention;
  return Number.isFinite(total) ? { attack, otherDamage, defense, prevention, total } : null;
}

export interface FabCombatValueReport {
  readonly source: "backend" | "mock";
  readonly viewer: FabCombatValue;
  readonly opponent: FabCombatValue;
  readonly turns: readonly {
    readonly turn: number;
    readonly completed: boolean;
    readonly viewer: FabCombatValue;
    readonly opponent: FabCombatValue;
  }[];
}

export function buildFabCombatValueReport(
  analytics: FabGameAnalytics,
  viewerId: string,
  opponentId: string,
): FabCombatValueReport | null {
  if (viewerId === opponentId || analytics.turns.length === 0) return null;
  const viewerStats = analytics.players[viewerId];
  const opponentStats = analytics.players[opponentId];
  if (!viewerStats || !opponentStats) return null;
  const viewer = calculateFabCombatValue(viewerStats);
  const opponent = calculateFabCombatValue(opponentStats);
  if (!viewer || !opponent) return null;
  const turns: FabCombatValueReport["turns"][number][] = [];
  for (const turn of analytics.turns) {
    const left = turn.players[viewerId];
    const right = turn.players[opponentId];
    if (!left || !right) return null;
    const viewerTurn = calculateFabCombatValue(left);
    const opponentTurn = calculateFabCombatValue(right);
    if (!viewerTurn || !opponentTurn) return null;
    turns.push({
      turn: turn.turn,
      completed: turn.completed,
      viewer: viewerTurn,
      opponent: opponentTurn,
    });
  }
  // A partial or mismatched aggregate must not look like a complete calculation.
  for (const side of ["viewer", "opponent"] as const) {
    const total = side === "viewer" ? viewer : opponent;
    for (const key of ["attack", "otherDamage", "defense", "prevention"] as const) {
      if (turns.reduce((sum, turn) => sum + turn[side][key], 0) !== total[key]) return null;
    }
  }
  return { source: "backend", viewer, opponent, turns };
}
