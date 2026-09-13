import {
  botEligibleFabCommands,
  listLegalCommands,
  type FabLegalCommand,
  type FabLegalCommandSource,
} from "./legal-commands/index.ts";
import { fabPriorityWindowManualOnly, fabPriorityWindowVerdict } from "./automation-verdict.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES } from "../state.ts";

/**
 * Runtime surface the pass-only derivation needs beyond command enumeration:
 * the canonical priority holder id.
 */
export interface FabAutoPassSource extends FabLegalCommandSource {
  getPriorityPlayerId(): string | undefined;
}

/**
 * Which windows an automation policy may close. `pass-only` is the
 * `auto-pass` product behavior; `own-skip` is `play-and-skip` — it closes only
 * the holder's own follow-up window and never touches response windows (not
 * even pass-only ones, preserving bluff timing); `never` disables the
 * mode's drain entirely (always-hold seats). Per-card opponent-trigger
 * yields apply in EVERY mode and are evaluated before the mode policy.
 */
export type FabAutoPassPolicy =
  | { readonly kind: "pass-only" }
  | { readonly kind: "own-skip" }
  | { readonly kind: "never" };

/**
 * Return the one priority pass that automation may safely submit, if any.
 *
 * Per-card opponent-trigger yields run first and are unconditional while the
 * configured opposing triggered layer is the top of the stack — the exact
 * mirror of the owner-side `autoPassWhileTop` drain — so they apply in every
 * priority mode and regardless of the holder's remaining options.
 *
 * The mode policies then consult {@link fabPriorityWindowVerdict}: a
 * `manualOnly` window (defend declaration, terminal Action-Phase window, the
 * attacker's Resolution-step chain close) is never automated, and `pass-only`
 * passes only when the verdict proved pass is the holder's sole legal action
 * (the Defend-Step declaration and the terminal window are deliberate player
 * decisions, CR 1.11.4a, 4.3.4).
 *
 * `own-skip` passes only the holder's `own-action` follow-up window (the one
 * that opens immediately after their own play/activate/attack-declare) unless
 * the seat holds a one-shot arm or the played card is per-card excepted. The
 * decision is structural — window origin + arm/exception + the shared guards +
 * `pass` being enumerable — so it never pays the full legal-command
 * enumeration the pass-only proof requires: skipping a window that still has
 * real options is exactly the mode's contract. Pass-only *response* windows
 * are deliberately NOT drained here; holding them preserves bluff timing and
 * the client countdown resolves them.
 */
export function getFabAutoPassPriorityCommand(
  runtime: FabAutoPassSource,
  policy: FabAutoPassPolicy = { kind: "pass-only" },
): FabLegalCommand | null {
  const state = runtime.getState();
  if (state.decision) return null;

  const actorId = runtime.getPriorityPlayerId();
  if (!actorId) return null;

  const profile = state.automationPreferences[actorId] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES;

  // Per-card opponent-trigger yield: unconditional while the configured
  // opposing triggered layer is top, in every mode. Controller (not owner)
  // comparison keeps a stolen-control trigger honest.
  const topLayer = state.rulesStack.at(-1);
  if (
    topLayer?.kind === "triggered" &&
    topLayer.controllerId !== actorId &&
    topLayer.source.canonicalId != null &&
    profile.opponentTriggerYieldCardIds.includes(topLayer.source.canonicalId)
  ) {
    return runtime.enumerateMoves(actorId).includes("pass")
      ? { move: "pass", payload: {}, label: "Pass" }
      : null;
  }

  // Always-hold is absolute for Instant auto-yields. This deliberately differs
  // from the older opposing-trigger yield above, whose contract predates the
  // mode and remains unconditional.
  if (policy.kind === "never") return null;

  const instantYieldPass = instantYieldPassCommand(runtime, actorId, profile.instantYieldCardIds);

  if (policy.kind === "own-skip") {
    // Stop-points from state alone (defend declaration, terminal window,
    // attacker chain close) — never the full legal-command proof, which the
    // own-skip contract must not pay.
    if (fabPriorityWindowManualOnly(state, actorId)) return null;
    // Only the seat's own follow-up window; every response window — pass-only
    // or not — stays open for the seat to resolve.
    const origin = state.priority?.origin;
    if (origin?.kind !== "own-action") return instantYieldPass;
    if (state.priorityHoldArmed[actorId]) return null;
    // A per-card exception keeps this specific card's follow-up window held.
    const playedCanonicalId = state.objects[origin.sourceInstanceId]?.canonicalId;
    if (playedCanonicalId != null && profile.playAndSkipHoldCardIds.includes(playedCanonicalId)) {
      return null;
    }
    return runtime.enumerateMoves(actorId).includes("pass")
      ? { move: "pass", payload: {}, label: "Pass" }
      : null;
  }

  if (instantYieldPass) return instantYieldPass;
  const verdict = fabPriorityWindowVerdict(runtime, actorId);
  if (verdict?.manualOnly) return null;
  return verdict?.passOnly ? { move: "pass", payload: {}, label: "Pass" } : null;
}

/**
 * Prove that one or more configured Instant uses are the only non-pass legal
 * commands in this window. The proof is command metadata, never labels or
 * payload inference, and it cannot bypass deliberate manual stop-points.
 */
function instantYieldPassCommand(
  runtime: FabAutoPassSource,
  actorId: string,
  yieldedCanonicalIds: readonly string[],
): FabLegalCommand | null {
  if (yieldedCanonicalIds.length === 0) return null;
  const state = runtime.getState();
  if (fabPriorityWindowManualOnly(state, actorId)) return null;

  const yielded = new Set(yieldedCanonicalIds);
  const legal = botEligibleFabCommands(
    listLegalCommands(runtime, actorId, { includeConcede: true }),
  );
  let ignoredInstantUse = false;
  const remaining = legal.filter((command) => {
    const metadata = command.priorityYield;
    if (metadata?.kind !== "instant-use" || !yielded.has(metadata.canonicalId)) return true;
    ignoredInstantUse = true;
    return false;
  });
  if (!ignoredInstantUse) return null;
  return remaining.some((command) => command.move === "pass") &&
    remaining.every((command) => command.move === "pass" || command.move === "concede")
    ? { move: "pass", payload: {}, label: "Pass" }
    : null;
}
