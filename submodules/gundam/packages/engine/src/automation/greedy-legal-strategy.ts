/**
 * Greedy "play-a-normal-Gundam-turn" strategy. Inherits every default
 * sub-policy from {@link composeStrategy} unchanged:
 *
 *   - Setup / forced-response families resolve first (the engine is
 *     blocking on them).
 *   - `resolveEffect` uses the canonical `PendingChoicePrompt` decision
 *     tree shared by every strategy.
 *   - Card-play / combat families fall through in enumerator order; the
 *     family priority below ranks attack > develop > pass.
 *
 * Customising this file means rewriting either:
 *   - A single family policy (override one entry, keep the rest), or
 *   - The family priority (e.g. a control variant bumping `declareBlock`
 *     above `enterBattle`).
 *
 * The planner and enumerator stay untouched.
 */

import { composeStrategy } from "./shared-policies.ts";

export const greedyLegalStrategy = composeStrategy("greedy-legal");
