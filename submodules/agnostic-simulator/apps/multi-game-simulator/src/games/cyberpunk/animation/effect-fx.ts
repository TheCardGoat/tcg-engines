import type { AnimationStepV2 } from "@tcg/protocol";

/**
 * Pure classification of compiled V2 animation steps into Cyberpunk card-effect
 * FX moments: defeats, cannot-attack lock-ons, Go Solo deploys, and Adam
 * Smasher-style board wipes. The FX layer renders these on top of the standard
 * card motion; classification never mutates the plan.
 *
 * Detection channels (all stamped by the cyberpunk animation adapter or the
 * engine builder — no inference from raw zone heuristics where avoidable):
 * - defeat: `entityTransfer` steps carrying the `card.destroy` cue, which the
 *   adapter sets exactly for `exitReason: "defeated"` exits.
 * - cannot attack: `emphasize` steps with a negative tone, emitted by the
 *   engine builder for `ruleGranted: cantAttack` and labeled for display.
 * - go solo: the legend's own `legendArea` → `field` transfer.
 * - board wipe: two or more simultaneous defeats that combat steps cannot
 *   account for, attributable to Adam Smasher. Combat carries
 *   `defeatedCardIds`, so ordinary fights never even reach the detection, and
 *   anything the detection cannot pin on Smasher (anonymous mass defeats,
 *   defeats leaking past a combat step's coverage) stays a per-card defeat
 *   moment instead of sweeping the board.
 */

export interface CyberpunkCompiledFxStep {
  readonly step: AnimationStepV2;
  readonly startAtMs: number;
  readonly durationMs: number;
}

export interface CyberpunkFxEntityIdentity {
  readonly canonicalId?: string;
  readonly cardType?: string;
  readonly title?: string;
}

export type CyberpunkFxIdentityResolver = (
  entityId: string,
) => CyberpunkFxEntityIdentity | undefined;

export interface CyberpunkDefeatFx {
  readonly key: string;
  readonly entityId: string;
  readonly startAtMs: number;
  readonly durationMs: number;
}

export interface CyberpunkLockOnFx {
  readonly key: string;
  readonly entityId: string;
  readonly startAtMs: number;
  readonly durationMs: number;
  readonly label: string;
}

export interface CyberpunkGoSoloFx {
  readonly key: string;
  readonly entityId: string;
  readonly startAtMs: number;
  readonly durationMs: number;
}

export interface CyberpunkBoardWipeFx {
  readonly key: string;
  /** Card whose effect caused the wipe; shockwave origin when anchorable. */
  readonly sourceEntityId: string | null;
  /** Display name when the wipe is attributable (e.g. Adam Smasher). */
  readonly sourceTitle: string | null;
  /** Charge/flash begins (the negative effect beat). */
  readonly startAtMs: number;
  /** First defeated unit dies — the impact beat. */
  readonly impactAtMs: number;
  readonly endAtMs: number;
  readonly targets: readonly CyberpunkDefeatFx[];
}

export interface CyberpunkEffectFxPlan {
  readonly defeats: readonly CyberpunkDefeatFx[];
  readonly lockOns: readonly CyberpunkLockOnFx[];
  readonly goSolos: readonly CyberpunkGoSoloFx[];
  readonly wipe: CyberpunkBoardWipeFx | null;
  readonly endAtMs: number;
}

/** Adapter-stamped audio cue that marks a defeated exit. */
export const DEFEAT_AUDIO_CUE = "card.destroy";

const SMASHER_CANONICAL_PREFIX = "adam-smasher";
/** Fewer simultaneous defeats than this stays a per-card defeat moment. */
const WIPE_MIN_DEFEATS = 2;
/** Extra spectacle tail after the last defeat in a wipe. */
const WIPE_TAIL_MS = 900;
const DEFAULT_LOCK_ON_LABEL = "CAN'T ATTACK";

interface NegativeEffectBeat {
  readonly sourceEntityId: string | null;
  readonly targetEntityIds: ReadonlySet<string>;
  readonly startAtMs: number;
}

export function classifyCyberpunkEffectFx(
  steps: readonly CyberpunkCompiledFxStep[],
  resolveIdentity: CyberpunkFxIdentityResolver = () => undefined,
): CyberpunkEffectFxPlan {
  const defeats: CyberpunkDefeatFx[] = [];
  const lockOns: CyberpunkLockOnFx[] = [];
  const goSolos: CyberpunkGoSoloFx[] = [];
  const negativeEffects: NegativeEffectBeat[] = [];
  const combatCovered = new Set<string>();
  let playEntryEntityId: string | null = null;

  for (const compiled of steps) {
    const { step } = compiled;
    if (step.type === "entityTransfer") {
      if (step.audioCue === DEFEAT_AUDIO_CUE) {
        defeats.push({
          key: `defeat:${step.id}`,
          entityId: step.entity.id,
          startAtMs: compiled.startAtMs,
          durationMs: compiled.durationMs,
        });
      }
      const fromZoneId = step.from?.kind === "zone" ? step.from.id : null;
      const toZoneId = step.to?.kind === "zone" ? step.to.id : null;
      if (
        fromZoneId?.endsWith("legendArea") &&
        toZoneId?.endsWith("field") &&
        isLegendEntity(step.entity.id, resolveIdentity)
      ) {
        goSolos.push({
          key: `goSolo:${step.id}`,
          entityId: step.entity.id,
          startAtMs: compiled.startAtMs,
          durationMs: compiled.durationMs,
        });
      }
      if (!playEntryEntityId && fromZoneId?.endsWith("hand") && toZoneId?.endsWith("field")) {
        playEntryEntityId = step.entity.id;
      }
    } else if (step.type === "emphasize" && step.tone === "negative") {
      if (step.at.kind === "entity") {
        lockOns.push({
          key: `lockOn:${step.id}`,
          entityId: step.at.id,
          startAtMs: compiled.startAtMs,
          durationMs: compiled.durationMs,
          label: step.label ?? DEFAULT_LOCK_ON_LABEL,
        });
      }
    } else if (step.type === "effect" && step.tone === "negative") {
      negativeEffects.push({
        sourceEntityId: step.source?.kind === "entity" ? step.source.id : null,
        targetEntityIds: new Set(
          step.targets.flatMap((target) => (target.kind === "entity" ? [target.id] : [])),
        ),
        startAtMs: compiled.startAtMs,
      });
    } else if (step.type === "combat") {
      for (const defeatedId of step.defeatedCardIds ?? []) {
        combatCovered.add(String(defeatedId));
      }
    }
  }

  const hasNonCombatDefeats = defeats.some((defeat) => !combatCovered.has(defeat.entityId));
  const wipe = hasNonCombatDefeats
    ? detectBoardWipe(defeats, negativeEffects, resolveIdentity, playEntryEntityId)
    : null;
  const ends = [
    ...defeats.map((item) => item.startAtMs + item.durationMs),
    ...lockOns.map((item) => item.startAtMs + item.durationMs),
    ...goSolos.map((item) => item.startAtMs + item.durationMs),
    ...(wipe ? [wipe.endAtMs] : []),
  ];
  return {
    defeats,
    lockOns,
    goSolos,
    wipe,
    endAtMs: ends.length > 0 ? Math.max(...ends) : 0,
  };
}

/**
 * Audio cues whose generic simulator blip is replaced by the cyberpunk FX
 * soundscape; the shared scheduler must not play both.
 */
export const CYBERPUNK_FX_OWNED_AUDIO_CUES: ReadonlySet<string> = new Set([DEFEAT_AUDIO_CUE]);

export function omitCyberpunkOwnedAudioCues<T extends { readonly cue: string }>(
  cues: readonly T[],
): T[] {
  return cues.filter((item) => !CYBERPUNK_FX_OWNED_AUDIO_CUES.has(item.cue));
}

function isLegendEntity(entityId: string, resolveIdentity: CyberpunkFxIdentityResolver): boolean {
  const identity = resolveIdentity(entityId);
  // Only legends live in the legend area, so an unresolvable identity keeps
  // the zone-based classification; a resolvable non-legend vetoes it.
  return !identity?.cardType || identity.cardType === "legend";
}

function detectBoardWipe(
  defeats: readonly CyberpunkDefeatFx[],
  negativeEffects: readonly NegativeEffectBeat[],
  resolveIdentity: CyberpunkFxIdentityResolver,
  playEntryEntityId: string | null,
): CyberpunkBoardWipeFx | null {
  if (defeats.length < WIPE_MIN_DEFEATS) return null;
  // The sweep spectacle is Adam Smasher's signature: attribution prefers the
  // negative effect beat overlapping the defeats (targeted defeat effects),
  // then the card played onto the field in this same plan (untargeted
  // PLAY-trigger mass defeats). Anything else — combat leftovers, anonymous
  // mass defeats — must not sweep the board, so an unattributable detection
  // collapses back to the per-card defeat moments.
  const defeatEntityIds = new Set(defeats.map((defeat) => defeat.entityId));
  let sourceEntityId: string | null = null;
  let chargeStartAtMs: number | null = null;
  for (const effect of negativeEffects) {
    const overlapsDefeats = [...effect.targetEntityIds].some((id) => defeatEntityIds.has(id));
    if (!overlapsDefeats) continue;
    sourceEntityId = effect.sourceEntityId;
    chargeStartAtMs = effect.startAtMs;
    break;
  }
  sourceEntityId ??= playEntryEntityId;

  const identity = sourceEntityId ? resolveIdentity(sourceEntityId) : undefined;
  if (!identity?.canonicalId?.startsWith(SMASHER_CANONICAL_PREFIX)) return null;
  const impactAtMs = Math.min(...defeats.map((defeat) => defeat.startAtMs));
  const endAtMs =
    Math.max(...defeats.map((defeat) => defeat.startAtMs + defeat.durationMs)) + WIPE_TAIL_MS;
  return {
    key: `wipe:${chargeStartAtMs ?? impactAtMs}:${defeats.length}`,
    sourceEntityId,
    sourceTitle: identity.title?.toUpperCase() ?? "ADAM SMASHER",
    startAtMs: Math.min(chargeStartAtMs ?? impactAtMs, impactAtMs),
    impactAtMs,
    endAtMs,
    targets: defeats,
  };
}
