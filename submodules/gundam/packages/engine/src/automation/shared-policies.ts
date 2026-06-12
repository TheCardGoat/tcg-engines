/**
 * Shared sub-policies for candidate strategies.
 *
 * A `CandidateStrategy` produces an ordered list of legal candidates; the
 * planner submits them head-first and falls back to pass / concede on
 * failure. Most "what should the bot do here?" decisions split cleanly
 * by candidate family — `resolveEffect` answers a typed
 * `PendingChoicePrompt`, `chooseFirstPlayer` is a coin flip, `passTurn`
 * has no decision at all. Bundling each family's choice into its own
 * `FamilyPolicy` lets multiple strategies share canonical defaults
 * (every strategy benefits from the same `resolveEffect` decision tree)
 * while still overriding only the families they care about
 * differentiating on (a control-oriented strategy might rewrite the
 * `enterBattle` ranker without touching anything else).
 *
 * The policy bundle is keyed on `GundamBotCandidateFamily` (the
 * discriminator of the candidate union, in 1:1 correspondence with
 * `GundamMoveName`), so adding a candidate variant breaks the
 * `DEFAULT_POLICIES` literal at `tsc --noEmit` time and forces every
 * downstream `composeStrategy` caller to handle the new family.
 */

import { assertNever } from "../utils/assert-never.ts";

import type { GundamG } from "../gundam/types.ts";
import { findChoiceDirective, priorityHead } from "../gundam/effects/pending-effects.ts";

import { hasKeyword } from "../gundam/rules/derived-state.ts";

import type { GundamBotCandidate, GundamBotCandidateFamily } from "./candidate-types.ts";
import { classifyDirectiveIntent } from "./directive-intent.ts";
import type { CandidateStrategy, CandidateStrategyContext } from "./types.ts";

/**
 * Decision context handed to a single family's policy. The `candidates`
 * field is the slice of `ctx.candidates` that share this family — the
 * generic parameter `F` propagates the discriminator so the policy gets
 * the narrow variant type without manual `as` casts.
 */
export interface FamilyPolicyContext<F extends GundamBotCandidateFamily> {
  readonly parent: CandidateStrategyContext;
  readonly candidates: readonly Extract<GundamBotCandidate, { family: F }>[];
}

/**
 * A family policy returns the ordered subset of its candidates the
 * strategy wants to try at this decision point. Returning fewer
 * candidates than received is the policy's way of *vetoing* options
 * (e.g. `pass-only` rejects every aggressive family). Returning the
 * empty array means "emit nothing for this family" — the family is
 * dropped from the strategy output for this decision point and the
 * planner advances down the priority chain.
 */
export type FamilyPolicy<F extends GundamBotCandidateFamily> = (
  ctx: FamilyPolicyContext<F>,
) => readonly Extract<GundamBotCandidate, { family: F }>[];

/**
 * Bundle of per-family policies. The mapped type forces an entry per
 * family — omissions surface as compile errors, not as silent "this
 * family won't ever appear in the strategy output" runtime bugs.
 */
export type SharedPolicies = {
  readonly [F in GundamBotCandidateFamily]: FamilyPolicy<F>;
};

/**
 * Identity policy — returns the candidates in the order the enumerator
 * produced them. Used as the default for families whose ordering doesn't
 * meaningfully change between strategies (most card-play moves: the
 * enumerator already orders by `selectableCardIds` which the move's
 * `enumerateCandidates` hook curated).
 */
const passthrough = <F extends GundamBotCandidateFamily>(
  ctx: FamilyPolicyContext<F>,
): readonly Extract<GundamBotCandidate, { family: F }>[] => ctx.candidates;

/**
 * Default `resolveEffect` policy — the canonical decision tree shared by
 * every strategy unless explicitly overridden. Branches exhaustively on
 * the typed `PendingChoicePrompt`:
 *
 *   - `optional`        → classify the directive's action via
 *                         `classifyDirectiveIntent` and pick the
 *                         accept/decline candidate the enumerator
 *                         emitted. Falls back to accept on ambiguous
 *                         directives (most "you may" text is
 *                         beneficial).
 *   - `targetSelection` → submit the candidate the enumerator picked
 *                         first. Enumerator already capped by
 *                         `singleTargetOptions`, so the head is the
 *                         smallest legal pick available.
 *   - `ordering`        → resolve the priority head (`pendingEffectId`
 *                         is encoded into the candidate by the
 *                         enumerator).
 *
 * No prompt → fall back to passthrough. Strategies that want bespoke
 * resolve logic (e.g. value-based target selection) override only this
 * policy and inherit everything else.
 */
const defaultResolveEffect: FamilyPolicy<"resolveEffect"> = (ctx) => {
  const prompt = ctx.parent.pendingChoice;
  if (!prompt) return ctx.candidates;

  switch (prompt.kind) {
    case "optional": {
      // Look up the directive on the priority-head pending effect and
      // classify its action. The enumerator emitted both accept and
      // decline candidate forms when this prompt is open; pick the one
      // that matches the classifier's verdict.
      const intent = classifyOptionalIntent(ctx.parent, prompt.effectId, prompt.directiveIndex);
      const wantAccept = intent !== "decline"; // accept + neutral both default to accept
      const matching = ctx.candidates.find(
        (c) => c.optionalAnswers?.[prompt.directiveIndex] === wantAccept,
      );
      if (matching) return [matching];
      // Enumerator didn't fan out (legacy path) — fall through to
      // whatever it produced.
      return ctx.candidates;
    }
    case "chooseOne": {
      // Modal "do A or B" — rank options by directive-intent of each
      // option's first action and pick the highest-ranked. Stable index
      // tiebreak (Array.find returns the first match in candidate order,
      // which mirrors enumerator order = option index ascending). Falls
      // back to candidate[0] when the enumerator didn't fan out (e.g.
      // strategies that vendor their own candidates).
      const bestIdx = pickBestChooseOneOption(
        ctx.parent,
        prompt.effectId,
        prompt.directiveIndex,
        prompt.options.length,
      );
      const matching = ctx.candidates.find(
        (c) => c.chooseOneAnswers?.[prompt.directiveIndex] === bestIdx,
      );
      if (matching) return [matching];
      return ctx.candidates;
    }
    case "targetSelection":
    case "ordering":
    case "deckLook":
      // Enumerator already orders these in priority-head / smallest-set
      // order; the strategy passthrough is the right default.
      return ctx.candidates;
    default:
      return assertNever(prompt, "defaultResolveEffect");
  }
};

/**
 * Pick the chooseOne option with the strongest directive-intent on its
 * first action. `accept` beats `neutral` beats `decline`; ties resolve to
 * the lowest option index for determinism. When the head can't be
 * located or has no chooseOne directive at the prompt index, falls back
 * to `0` so the bot still makes a legal pick.
 */
function pickBestChooseOneOption(
  parent: CandidateStrategyContext,
  effectId: string,
  directiveIndex: number,
  optionCount: number,
): number {
  const g = parent.state.G as unknown as GundamG;
  const activePlayerId = parent.state.ctx.status.activePlayer as unknown as string;
  const head = priorityHead(g, activePlayerId);
  const pe = head?.id === effectId ? head : g.pendingEffects.find((p) => p.id === effectId);
  if (!pe) return 0;
  const choice = findChoiceDirective(pe);
  if (!choice || choice.kind !== "chooseOne" || choice.directiveIndex !== directiveIndex) return 0;
  const intentRank = (intent: ReturnType<typeof classifyDirectiveIntent>): number => {
    if (intent === "accept") return 2;
    if (intent === "neutral") return 1;
    return 0;
  };
  let bestIdx = 0;
  let bestRank = -1;
  const upper = Math.min(optionCount, choice.directive.options.length);
  for (let i = 0; i < upper; i++) {
    const option = choice.directive.options[i];
    if (!option) continue;
    const firstAction = firstActionOf(option.directives);
    const rank = firstAction ? intentRank(classifyDirectiveIntent(firstAction)) : 0;
    if (rank > bestRank) {
      bestRank = rank;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Recursively find the first concrete `EffectAction` in a directive list,
 * descending into conditional branches and nested chooseOne options. Used
 * by `pickBestChooseOneOption` to feed the directive-intent classifier
 * with something representative of an option's effect.
 */
function firstActionOf(
  directives: readonly import("@tcg/gundam-types").Directive[],
): import("@tcg/gundam-types").EffectAction | null {
  for (const d of directives) {
    if ("condition" in d) {
      const found = firstActionOf(d.thenDirectives);
      if (found) return found;
      if (d.elseDirectives) {
        const elseFound = firstActionOf(d.elseDirectives);
        if (elseFound) return elseFound;
      }
      continue;
    }
    if ("kind" in d && (d as { kind?: string }).kind === "chooseOne") {
      const inner = (d as { options: { directives: import("@tcg/gundam-types").Directive[] }[] })
        .options;
      for (const opt of inner) {
        const found = firstActionOf(opt.directives);
        if (found) return found;
      }
      continue;
    }
    return (d as { action: import("@tcg/gundam-types").EffectAction }).action;
  }
  return null;
}

/**
 * Resolve the optional directive on the priority head and classify
 * its action. Returns `"neutral"` when the head can't be located or
 * the directive index is out of range — both indicate a stale prompt
 * relative to the current state, which the caller treats as "default
 * to accept" rather than crashing.
 */
function classifyOptionalIntent(
  parent: CandidateStrategyContext,
  effectId: string,
  directiveIndex: number,
): ReturnType<typeof classifyDirectiveIntent> {
  const g = parent.state.G as unknown as GundamG;
  const activePlayerId = parent.state.ctx.status.activePlayer as unknown as string;
  // Prefer the priority head when the prompt's effectId matches it
  // (saves a linear scan); fall back to the full queue otherwise.
  const head = priorityHead(g, activePlayerId);
  const pe = head?.id === effectId ? head : g.pendingEffects.find((p) => p.id === effectId);
  if (!pe) return "neutral";
  // Use `findChoiceDirective` to locate the directive at the index —
  // mirrors the engine's own resolution path so the classifier sees
  // exactly the action the runtime is asking about. Only `optional` and
  // `targetSelection` carry a single directive with an `action` field;
  // `chooseOne` is handled by `pickBestChooseOneOption` and never
  // reaches this helper (defaultResolveEffect dispatches by prompt kind
  // first), so any non-optional match here is a stale prompt.
  const choice = findChoiceDirective(pe);
  if (!choice || choice.directiveIndex !== directiveIndex) return "neutral";
  if (choice.kind !== "optional") return "neutral";
  return classifyDirectiveIntent(choice.directive.action);
}

/**
 * Default `chooseFirstPlayer` policy — picks the bot's own seat. Going
 * first in Gundam is generally weaker (no resource on turn 1, no draw
 * step), but in the absence of matchup data this is a reasonable
 * deterministic baseline. Strategies that want to optimise this
 * override the policy directly.
 */
const defaultChooseFirstPlayer: FamilyPolicy<"chooseFirstPlayer"> = (ctx) => {
  const self = ctx.candidates.find(
    (c) => c.playerId === (ctx.parent.playerId as unknown as string),
  );
  if (self) return [self];
  return ctx.candidates;
};

/**
 * Default `alterHand` policy — keeps the opening hand. Mulligan
 * heuristics depend on deck profile; without one, "keep" is a stable
 * baseline that lets the bot avoid over-mulliganing into worse hands.
 */
const defaultAlterHand: FamilyPolicy<"alterHand"> = (ctx) => {
  const keep = ctx.candidates.find((c) => c.wantsRedraw === false);
  if (keep) return [keep];
  return ctx.candidates;
};

/**
 * Default `discardToHandLimit` policy — discards the first legal
 * combination. The enumerator caps the combinatorial fan-out, so the
 * head is already a sensible-sized pick. Strategies optimising for
 * resource value override this.
 */
const defaultDiscardToHandLimit: FamilyPolicy<"discardToHandLimit"> = passthrough;

/**
 * Blocker-aware `declareBlock` policy — filters out candidates where the
 * blocking unit does not have the `<Blocker>` keyword. The Gundam enumerator
 * is intentionally optimistic (emits every battlefield unit as a block
 * candidate), which causes the runtime to reject non-Blocker units with
 * `MISSING_BLOCKER_KEYWORD` / `CANNOT_BLOCK_DIRECT`. Pre-filtering here
 * recovers planner attempt budget and reduces fallback-chain churn.
 */
const blockerAwareDeclareBlock: FamilyPolicy<"declareBlock"> = (ctx) => {
  const g = ctx.parent.state.G as unknown as GundamG;
  return ctx.candidates.filter((c) => hasKeyword(c.blockerId, "Blocker", g, ctx.parent.cards));
};

const DEFAULT_POLICIES: SharedPolicies = {
  chooseFirstPlayer: defaultChooseFirstPlayer,
  alterHand: defaultAlterHand,
  discardToHandLimit: defaultDiscardToHandLimit,
  resolveEffect: defaultResolveEffect,
  declareBlock: blockerAwareDeclareBlock,
  enterBattle: passthrough,
  activateAbility: passthrough,
  playCommand: passthrough,
  assignPilot: passthrough,
  playCommandAsPilot: passthrough,
  deployUnit: passthrough,
  deployBase: passthrough,
  passBlock: passthrough,
  passBattleAction: passthrough,
  passActionStep: passthrough,
  passTurn: passthrough,
  concede: passthrough,
  skipOpponentTurn: passthrough,
  dropOpponent: passthrough,
};

export { DEFAULT_POLICIES };

/**
 * Default ranking — the planner sweeps families low-to-high and tries
 * each non-empty bucket in order. Mirrors the priorities embedded in
 * the original `greedyLegalStrategy`:
 *
 *   - 0  setup / forced response (engine is blocking on these)
 *   - 1  declareBlock — the only way to swap a unit for a shield
 *   - 2  enterBattle  — closing a turn with damage beats developing
 *   - 3  activateAbility / playCommand
 *   - 5  assignPilot
 *   - 6  deploy
 *   - 8+ step / turn passes
 *   - 99 concede (never emitted by composeStrategy; planner fallback)
 */
export const DEFAULT_FAMILY_PRIORITY: Record<GundamBotCandidateFamily, number> = {
  chooseFirstPlayer: 0,
  alterHand: 0,
  discardToHandLimit: 0,
  resolveEffect: 0,
  declareBlock: 1,

  enterBattle: 2,
  activateAbility: 3,
  playCommand: 4,
  assignPilot: 5,
  playCommandAsPilot: 5,
  deployUnit: 6,
  deployBase: 7,

  passBlock: 8,
  passBattleAction: 9,
  passActionStep: 10,
  passTurn: 11,
  skipOpponentTurn: 97,
  dropOpponent: 98,
  concede: 99,
};

/**
 * Bucket candidates by family, preserving enumerator order within each
 * bucket. Returns a `Map` keyed on family because TypeScript cannot
 * infer a per-key narrow array type for an indexed object accumulator
 * — `runFamilyPolicy` re-narrows on dispatch via the typed switch.
 */
function bucketByFamily(
  candidates: readonly GundamBotCandidate[],
): ReadonlyMap<GundamBotCandidateFamily, readonly GundamBotCandidate[]> {
  const out = new Map<GundamBotCandidateFamily, GundamBotCandidate[]>();
  for (const candidate of candidates) {
    const existing = out.get(candidate.family);
    if (existing) {
      existing.push(candidate);
    } else {
      out.set(candidate.family, [candidate]);
    }
  }
  return out;
}

export interface ComposeStrategyOptions {
  /** Family priority — lower runs first. Defaults to {@link DEFAULT_FAMILY_PRIORITY}. */
  readonly priority?: Readonly<Record<GundamBotCandidateFamily, number>>;
}

/**
 * Build a `CandidateStrategy` from a name and a partial set of family
 * policy overrides. Missing families inherit `DEFAULT_POLICIES` —
 * including the canonical `resolveEffect` decision tree, so every
 * strategy reuses it for free unless it explicitly opts out.
 *
 * The output strategy:
 *   1. Buckets `ctx.candidates` by family.
 *   2. Calls each non-empty bucket's policy with the narrow slice +
 *      parent context.
 *   3. Concatenates the results in `priority` order.
 *
 * The result is fully deterministic for a fixed input: ties within a
 * priority tier follow enumerator order (which is itself deterministic
 * up to the candidate-search caps).
 */
export function composeStrategy(
  name: string,
  overrides: Partial<SharedPolicies> = {},
  options: ComposeStrategyOptions = {},
): CandidateStrategy {
  const policies: SharedPolicies = { ...DEFAULT_POLICIES, ...overrides };
  const priority = options.priority ?? DEFAULT_FAMILY_PRIORITY;

  return {
    name,
    selectCandidates(parent: CandidateStrategyContext): readonly GundamBotCandidate[] {
      const buckets = bucketByFamily(parent.candidates);

      // Walk every family — TypeScript's `for...of Object.entries`
      // widens to `string`, so iterate explicitly through the priority
      // record's keys to preserve the narrow `GundamBotCandidateFamily`
      // type without `as`-casts at the call site.
      const families = Object.keys(priority) as GundamBotCandidateFamily[];
      const ordered: {
        family: GundamBotCandidateFamily;
        candidates: readonly GundamBotCandidate[];
      }[] = [];

      for (const family of families) {
        const bucket = buckets.get(family);
        if (!bucket || bucket.length === 0) continue;

        // Each policy is typed for its specific family; the dispatch
        // table here does the per-family call so the return type is the
        // narrow variant. The accumulator widens to the union for the
        // final concat.
        const ranked = runFamilyPolicy(family, policies, {
          parent,
          candidates: bucket,
        });
        if (ranked.length > 0) {
          ordered.push({ family, candidates: ranked });
        }
      }

      ordered.sort((a, b) => priority[a.family] - priority[b.family]);
      return ordered.flatMap((entry) => entry.candidates);
    },
  };
}

/**
 * Per-family dispatch — the explicit switch keeps the narrow
 * `Extract<...>` types flowing through to each policy without unsafe
 * casts at the boundary. The `default` branch is `assertNever`, so a
 * new candidate family fails to compile here too.
 */
function runFamilyPolicy(
  family: GundamBotCandidateFamily,
  policies: SharedPolicies,
  ctx: FamilyPolicyContext<GundamBotCandidateFamily>,
): readonly GundamBotCandidate[] {
  switch (family) {
    case "chooseFirstPlayer":
      return policies.chooseFirstPlayer(ctx as FamilyPolicyContext<"chooseFirstPlayer">);
    case "alterHand":
      return policies.alterHand(ctx as FamilyPolicyContext<"alterHand">);
    case "discardToHandLimit":
      return policies.discardToHandLimit(ctx as FamilyPolicyContext<"discardToHandLimit">);
    case "resolveEffect":
      return policies.resolveEffect(ctx as FamilyPolicyContext<"resolveEffect">);
    case "declareBlock":
      return policies.declareBlock(ctx as FamilyPolicyContext<"declareBlock">);
    case "enterBattle":
      return policies.enterBattle(ctx as FamilyPolicyContext<"enterBattle">);
    case "activateAbility":
      return policies.activateAbility(ctx as FamilyPolicyContext<"activateAbility">);
    case "playCommand":
      return policies.playCommand(ctx as FamilyPolicyContext<"playCommand">);
    case "assignPilot":
      return policies.assignPilot(ctx as FamilyPolicyContext<"assignPilot">);
    case "playCommandAsPilot":
      return policies.playCommandAsPilot(ctx as FamilyPolicyContext<"playCommandAsPilot">);
    case "deployUnit":
      return policies.deployUnit(ctx as FamilyPolicyContext<"deployUnit">);
    case "deployBase":
      return policies.deployBase(ctx as FamilyPolicyContext<"deployBase">);
    case "passBlock":
      return policies.passBlock(ctx as FamilyPolicyContext<"passBlock">);
    case "passBattleAction":
      return policies.passBattleAction(ctx as FamilyPolicyContext<"passBattleAction">);
    case "passActionStep":
      return policies.passActionStep(ctx as FamilyPolicyContext<"passActionStep">);
    case "passTurn":
      return policies.passTurn(ctx as FamilyPolicyContext<"passTurn">);
    case "concede":
      return policies.concede(ctx as FamilyPolicyContext<"concede">);
    case "skipOpponentTurn":
      return policies.skipOpponentTurn(ctx as FamilyPolicyContext<"skipOpponentTurn">);
    case "dropOpponent":
      return policies.dropOpponent(ctx as FamilyPolicyContext<"dropOpponent">);
    default:
      return assertNever(family, "runFamilyPolicy");
  }
}

/**
 * Family-veto helper — returns a policy that emits `[]` for every
 * candidate of this family. Useful for "rookie" / pass-only strategies
 * that want to refuse to submit anything aggressive without manually
 * writing 7 stubs.
 */
export function vetoFamily<F extends GundamBotCandidateFamily>(): FamilyPolicy<F> {
  return () => [];
}
