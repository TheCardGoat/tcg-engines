import type { DevRuntime } from "../dev-runtime.ts";

// Static import for the single production path — `/vs-ai` with no
// `?fixture=` override defaults to `vs-ai-demo`, so keeping this
// eager avoids an extra roundtrip on the common case. Every other
// fixture is dev/test-only; they're lazy-loaded via dynamic
// `import()` so each becomes its own bundle chunk.
import { loadVsAiDemo } from "./vs-ai-demo.ts";

/**
 * Fixture factories may be parameter-less (the common case for
 * hand-seeded dev scenarios) or accept a bag of args (the
 * `"vs-ai-match"` factory, which takes `{ playerDeckId,
 * opponentDeckId, opponentStrategy }`). The arg shape is erased at
 * the registry boundary — factories validate their own inputs.
 */
export type FixtureFactory = (args?: unknown) => DevRuntime;
type LazyFixture = () => Promise<FixtureFactory>;

/**
 * Named fixtures the App can boot into. Keyed by the `?fixture=…`
 * URL parameter + the name RTL/Playwright specs reference.
 *
 * Each value is a lazy loader returning a Promise<factory>. The
 * default production fixture (`vs-ai-demo`) is statically imported
 * upstream and wrapped in `Promise.resolve` so it resolves in a
 * microtask; all others are `import()` calls that split the
 * bundler's chunk graph. The vs-ai production route pays no extra
 * roundtrip; dev `?fixture=X` overrides fetch a small per-fixture
 * chunk only when requested.
 *
 * Add new fixtures here as specs need them; keep each one a
 * deterministic pure function returning a {@link DevRuntime}.
 */
export const FIXTURES = {
  "vs-ai-demo": () => Promise.resolve(loadVsAiDemo),
  "vs-ai-match": () =>
    // The factory expects a typed `VsAiMatchArgs`; at the registry
    // boundary we erase that down to `(args?: unknown) => DevRuntime`
    // because other fixtures are arg-less. The loader validates the
    // args shape before calling this factory.
    import("./vs-ai-match.ts").then((m) => m.loadVsAiMatch as FixtureFactory),
  "bot-vs-bot": () =>
    // Takes optional `BotVsBotArgs` (deck + strategy per seat + seed)
    // but every field has a default, so the route can call it with
    // `{}` and get a sensible match. Treated as parameterised below
    // only so the `?fixture=` override path validates URL args; the
    // /bot-vs-bot route itself calls the factory directly with its
    // own arg construction.
    import("./bot-vs-bot.ts").then((m) => m.loadBotVsBot as FixtureFactory),
  "setup-default": () => import("./setup-default.ts").then((m) => m.loadSetupDefault),
  "setup-default-opponent-keeps": () =>
    import("./setup-default-opponent-keeps.ts").then((m) => m.loadSetupDefaultOpponentKeeps),
  "main-phase-demo": () => import("./main-phase-demo.ts").then((m) => m.loadMainPhaseDemo),
  "battle-ready-demo": () => import("./battle-ready-demo.ts").then((m) => m.loadBattleReadyDemo),
  "pilot-pair-demo": () => import("./pilot-pair-demo.ts").then((m) => m.loadPilotPairDemo),
  "command-rest-demo": () => import("./command-rest-demo.ts").then((m) => m.loadCommandRestDemo),
  "activate-ability-demo": () =>
    import("./activate-ability-demo.ts").then((m) => m.loadActivateAbilityDemo),
  "block-step-demo": () => import("./block-step-demo.ts").then((m) => m.loadBlockStepDemo),
  "first-strike-demo": () => import("./first-strike-demo.ts").then((m) => m.loadFirstStrikeDemo),
  "high-maneuver-demo": () => import("./high-maneuver-demo.ts").then((m) => m.loadHighManeuverDemo),
  "suppression-demo": () => import("./suppression-demo.ts").then((m) => m.loadSuppressionDemo),
  "deploy-base-demo": () => import("./deploy-base-demo.ts").then((m) => m.loadDeployBaseDemo),
  "deploy-unit-demo": () => import("./deploy-unit-demo.ts").then((m) => m.loadDeployUnitDemo),
  "attack-trigger-draw-demo": () =>
    import("./attack-trigger-draw-demo.ts").then((m) => m.loadAttackTriggerDrawDemo),
  "mutual-destruction-demo": () =>
    import("./mutual-destruction-demo.ts").then((m) => m.loadMutualDestructionDemo),
  "attack-trigger-buff-demo": () =>
    import("./attack-trigger-buff-demo.ts").then((m) => m.loadAttackTriggerBuffDemo),
  "when-paired-trigger-demo": () =>
    import("./when-paired-trigger-demo.ts").then((m) => m.loadWhenPairedTriggerDemo),
  "link-unit-deploy-demo": () =>
    import("./link-unit-deploy-demo.ts").then((m) => m.loadLinkUnitDeployDemo),
  "support-ability-demo": () =>
    import("./support-ability-demo.ts").then((m) => m.loadSupportAbilityDemo),
  "insufficient-resources-demo": () =>
    import("./insufficient-resources-demo.ts").then((m) => m.loadInsufficientResourcesDemo),
  "discard-limit-demo": () => import("./discard-limit-demo.ts").then((m) => m.loadDiscardLimitDemo),
  "newly-deployed-cannot-attack-demo": () =>
    import("./newly-deployed-cannot-attack-demo.ts").then(
      (m) => m.loadNewlyDeployedCannotAttackDemo,
    ),
  "when-linked-non-link-demo": () =>
    import("./when-linked-non-link-demo.ts").then((m) => m.loadWhenLinkedNonLinkDemo),
  "action-only-command-demo": () =>
    import("./action-only-command-demo.ts").then((m) => m.loadActionOnlyCommandDemo),
  "command-multi-target-demo": () =>
    import("./command-multi-target-demo.ts").then((m) => m.loadCommandMultiTargetDemo),
  "burst-shield-demo": () => import("./burst-shield-demo.ts").then((m) => m.loadBurstShieldDemo),
  "step-interrupt-demo": () =>
    import("./step-interrupt-demo.ts").then((m) => m.loadStepInterruptDemo),
  "multi-turn-demo": () => import("./multi-turn-demo.ts").then((m) => m.loadMultiTurnDemo),
  "pending-effect-click-guard-demo": () =>
    import("./pending-effect-click-guard-demo.ts").then((m) => m.loadPendingEffectClickGuardDemo),
} as const satisfies Record<string, LazyFixture>;

export type FixtureName = keyof typeof FIXTURES;

export const DEFAULT_FIXTURE: FixtureName = "vs-ai-demo";

/**
 * Resolve a fixture name to its factory. Unknown or missing names fall
 * back to {@link DEFAULT_FIXTURE} so a stray `?fixture=` string in the
 * URL can never brick the app.
 *
 * `Object.hasOwn` instead of `in` — the latter walks the prototype
 * chain, so a stray `?fixture=__proto__` / `?fixture=constructor`
 * would return a non-loader value.
 */
export async function resolveFixture(name: string | null | undefined): Promise<FixtureFactory> {
  if (name && Object.hasOwn(FIXTURES, name)) {
    return await FIXTURES[name as FixtureName]();
  }
  return await FIXTURES[DEFAULT_FIXTURE]();
}

/**
 * Names of fixtures whose factories require arguments. The loader
 * gates access to these so an empty `?fixture=vs-ai-match` query
 * (with no deck/opponent/strategy params) can't boot a half-built
 * match.
 */
export const PARAMETERIZED_FIXTURES: ReadonlySet<FixtureName> = new Set(["vs-ai-match"]);
