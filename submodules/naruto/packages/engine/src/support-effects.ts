/**
 * Reviewed support-card behavior keyed by stable card id.
 *
 * Card text is scraped catalog data and must remain display-only. Updating a
 * source snapshot cannot silently change executable engine behavior; effect
 * changes require an explicit, reviewed edit to this registry.
 */
export type SupportTiming = "counter" | "main" | "quick" | "response" | "unknown";

export interface SupportEffectDefinition {
  readonly timing: SupportTiming;
  readonly negate?: {
    readonly lifeCost?: number;
    readonly chakraLock?: boolean;
  };
  readonly interrupt?: boolean;
  readonly lifeGain?: number;
  readonly doublePower?: boolean;
  readonly supportImmunity?: boolean;
  readonly summonThisCard?: boolean;
  readonly koAll?: boolean;
  readonly koChosen?: {
    readonly count: number;
    readonly upTo?: boolean;
    readonly restedOnly?: boolean;
    readonly nonEx?: boolean;
  };
  readonly bounce?: boolean;
}

export const SUPPORT_EFFECTS = {
  "N-004": { timing: "main", koAll: true },
  "N-006": { timing: "counter", koChosen: { count: 2, upTo: true, restedOnly: true } },
  "N-008": { timing: "counter", interrupt: true, summonThisCard: true },
  "N-010": { timing: "counter", lifeGain: 2, summonThisCard: true },
  "N-015": { timing: "main", koAll: true },
  "N-016": { timing: "response", negate: { chakraLock: true } },
  "N-021": { timing: "quick", supportImmunity: true, summonThisCard: true },
  "K-039": { timing: "response", negate: { lifeCost: 2 } },
  "N-choji": { timing: "quick", doublePower: true, summonThisCard: true },
  "N-hinata": { timing: "counter", koChosen: { count: 1, nonEx: true } },
  "N-orochimaru": {
    timing: "counter",
    koChosen: { count: 2, upTo: true, restedOnly: true },
  },
  "N-sakura": { timing: "counter", bounce: true },
} as const satisfies Readonly<Record<string, SupportEffectDefinition>>;

export function supportEffectOf(cardId: string): SupportEffectDefinition | undefined {
  return (SUPPORT_EFFECTS as Readonly<Record<string, SupportEffectDefinition>>)[cardId];
}

export function supportEffectSummonsCard(cardId: string): boolean {
  return supportEffectOf(cardId)?.summonThisCard === true;
}
