import type { FabRulesSnapshot } from "../kernel/transaction-kernel.ts";
import type { FabLegalCommandSource } from "./legal-commands/index.ts";
import { botEligibleFabCommands, listLegalCommands } from "./legal-commands/index.ts";
import { FAB_DEFAULT_AUTOMATION_PREFERENCES, type FabScopedAutoPassScope } from "../state.ts";

/**
 * The one authoritative answer to "may automation close this priority
 * window?". The engine computes it; clients consume the projected
 * {@link fabPriorityWindowManualOnly} stop-points instead of re-deriving
 * them, so a new stop rule can never drift between engine and client.
 */
export interface FabPriorityWindowVerdict {
  /** True when pass (and concede) is the seat's only legal action in this window. */
  readonly passOnly: boolean;
  /** True when this window is a deliberate player decision that no automation may close. */
  readonly manualOnly: boolean;
}

/**
 * Viewer-owned meaning of the current priority window. Presentation and
 * automation consume this rules-native classification instead of inferring
 * intent from the combat step alone.
 */
export type FabPriorityWindowContext =
  | { readonly kind: "none" }
  | { readonly kind: "ordinary-priority" }
  | { readonly kind: "defense-declaration" }
  | { readonly kind: "combat-chain-continuation"; readonly role: "attacker" }
  | { readonly kind: "combat-resolution-response"; readonly role: "defender" }
  | { readonly kind: "terminal-action-phase" }
  | { readonly kind: "decision" };

export function fabPriorityWindowContext(
  state: FabRulesSnapshot,
  seat: string,
): FabPriorityWindowContext {
  if (state.decision) return { kind: "decision" };
  const combat = state.combat;
  if (
    combat?.open === true &&
    combat.step === "defend" &&
    combat.defenseDeclarationPending &&
    combat.activeLink?.defendingPlayerId === seat
  ) {
    return { kind: "defense-declaration" };
  }
  if (state.priority?.holderPlayerId !== seat) return { kind: "none" };
  if (state.rulesStack.length === 0 && !combat?.open && state.phase === "action") {
    return { kind: "terminal-action-phase" };
  }
  if (combat?.open === true && combat.step === "resolution" && state.rulesStack.length === 0) {
    const continuationPlayerId = combat.activeLink?.attackingPlayerId ?? state.activePlayerId;
    return continuationPlayerId === seat
      ? { kind: "combat-chain-continuation", role: "attacker" }
      : { kind: "combat-resolution-response", role: "defender" };
  }
  return { kind: "ordinary-priority" };
}

/**
 * The stop-point doctrine, evaluated from state alone so the viewer
 * projection can carry it without a runtime:
 *
 * - the pending Defend-Step declaration (priority is closed there; the
 *   defender's declaration is never a priority window to automate);
 * - the terminal Action-Phase window (an empty stack with a closed chain,
 *   where a full pass cycle would end the phase — CR 1.11.4a, 4.3.4);
 * - the attacker's Resolution-step window, where a completing pass cycle
 *   closes the attacker's own combat chain (the defender's Resolution pass
 *   stays automatable).
 */
export function fabPriorityWindowManualOnly(state: FabRulesSnapshot, seat: string): boolean {
  switch (fabPriorityWindowContext(state, seat).kind) {
    case "decision":
    case "defense-declaration":
    case "combat-chain-continuation":
    case "terminal-action-phase":
      return true;
    case "none":
    case "ordinary-priority":
    case "combat-resolution-response":
      return false;
  }
}

/**
 * True while the seat's stored auto-pass scope is armed AND inside its natural
 * boundary: `combat` only while a chain link is open, `opponent-turn` only
 * while another seat is active. Boundary reducers retire the arm eagerly; this
 * state-alone check is the fail-closed second gate so a missed clear can never
 * revive an expired scope, and stale arms project as unarmed to viewers.
 */
export function fabScopedAutoPassActive(state: FabRulesSnapshot, seat: string): boolean {
  const scope = (state.automationPreferences[seat] ?? FAB_DEFAULT_AUTOMATION_PREFERENCES)
    .scopedAutoPass;
  if (scope === "combat") return state.combat?.open === true;
  if (scope === "opponent-turn") return state.activePlayerId !== seat;
  return false;
}

/**
 * True when the seat may arm {@link scope} right now: an open chain for
 * `combat`, another active seat for `opponent-turn`. Arming is deliberately
 * not priority-gated — a defender arms from the defense declaration, the only
 * interactive moment their drained windows leave them.
 */
export function fabScopedAutoPassArmable(
  state: FabRulesSnapshot,
  seat: string,
  scope: FabScopedAutoPassScope,
): boolean {
  return scope === "combat" ? state.combat?.open === true : state.activePlayerId !== seat;
}

/**
 * Full verdict for the drain policies: the manual-only stop-points plus the
 * pass-only proof over the seat's bot-eligible legal commands. Returns null
 * when a decision is pending (automation never answers those here) or the
 * seat holds no window and no stop-point applies.
 */
export function fabPriorityWindowVerdict(
  runtime: FabLegalCommandSource,
  seat: string,
): FabPriorityWindowVerdict | null {
  const state = runtime.getState();
  if (state.decision) return null;
  if (fabPriorityWindowManualOnly(state, seat)) {
    return { passOnly: false, manualOnly: true };
  }
  if (state.priority?.holderPlayerId !== seat) return null;
  const legal = botEligibleFabCommands(listLegalCommands(runtime, seat, { includeConcede: true }));
  const passOnly =
    legal.some((command) => command.move === "pass") &&
    legal.every((command) => command.move === "pass" || command.move === "concede");
  return { passOnly, manualOnly: false };
}
