import type { FabCost, FabEffect } from "@tcg/flesh-and-blood-types";

export type FabEffectProductionSupport =
  | { readonly status: "partial"; readonly supported: string; readonly unsupported: string }
  | { readonly status: "unsupported"; readonly mechanic: string };

const partial = (supported: string, unsupported: string): FabEffectProductionSupport => ({
  status: "partial",
  supported,
  unsupported,
});
const unsupported = (mechanic: string): FabEffectProductionSupport => ({
  status: "unsupported",
  mechanic,
});

/**
 * Exhaustive migration ledger for the canonical effect DSL. "Partial" is
 * deliberate: only the named typed shapes execute; every other shape fails
 * closed instead of inspecting text or weakening a target/count type.
 */
export const FAB_EFFECT_PRODUCTION_SUPPORT = {
  sequence: partial("ordered child event groups", "unsupported child leaves"),
  "if-you-do": partial(
    "principal events then continuation when the principal produced events",
    "unsupported child leaves",
  ),
  "self-replacement": partial(
    "CR 6.4.7 preceding-effect replacement in sequences (condition at generation, full event replacement)",
    "parameter-dependent conditions resolved when a future card's parameters are determined (6.4.7b, Weave Earth)",
  ),
  choice: partial("persisted option decision", "unsupported chosen leaves"),
  conditional: partial("canonical condition branches", "unmodeled conditions"),
  optional: partial("persisted boolean decision and then branch", "unsupported child leaves"),
  "for-each": partial(
    "deterministic hero sets with iteration-subject binding + nested effects",
    "object-cohort iteration beyond hero sets",
  ),
  "remove-counters": partial(
    "constant count and deterministic targets",
    "dynamic counts or targets",
  ),
  repeat: partial("bounded constant repetitions", "dynamic or unbounded repetitions"),
  "delayed-trigger": partial(
    "one-shot (default) or multi-fire window via duration this-turn",
    "non-event or unsupported child shapes",
  ),
  "deal-damage": partial("constant damage to deterministic targets", "dynamic amounts or targets"),
  "gain-life": partial(
    "constant amount and deterministic hero targets",
    "dynamic amounts or targets",
  ),
  "lose-life": partial(
    "constant amount and deterministic hero targets",
    "dynamic amounts or targets",
  ),
  "gain-action-points": partial(
    "constant amount and deterministic player",
    "dynamic amount or player",
  ),
  "gain-resources": partial(
    "constant or layer-bound dynamic amount and deterministic player",
    "unresolved dynamic amount or player",
  ),
  "gain-chi": partial("constant amount and deterministic player", "dynamic amount or player"),
  draw: partial("constant count", "dynamic counts"),
  "take-extra-turn": partial(
    "queue extraTurnsQueued + end-turn consumes for same-seat active",
    "multi-extra stacking UI",
  ),
  "lose-game": partial("one deterministic losing player", "unresolved player"),
  discard: partial(
    "declared or deterministic object targets",
    "unresolved and unsupported random sets",
  ),
  banish: partial(
    "declared or deterministic object targets",
    "unresolved and unsupported random sets",
  ),
  destroy: partial("declared or deterministic object targets", "delayed and unresolved targets"),
  negate: partial("targeted card stack-layer negation", "activated and triggered layers"),
  "turn-face-down": partial("deterministic object targets", "unresolved targets"),
  "turn-face-up": partial("deterministic object targets", "unresolved targets"),
  unless: partial(
    "principal when escape declined/unaffordable; interactive escape pay for the payer",
    "complex escape effects beyond constant resource/life pay",
  ),
  "move-card": partial(
    "deterministic objects and supported zones",
    "dynamic destinations or targets",
  ),
  "bind-aura": partial("a resolving Aura bound to one controlled Ally", "invalid sources or hosts"),
  "reorder-deck": partial(
    "known binding cohorts returning to their controller's deck",
    "unresolved bindings and cross-player deck ownership",
  ),
  search: partial("persisted selection, move, and shuffle", "dynamic count/filter binding shapes"),
  shuffle: partial("deterministic player and zone", "unresolved player or zone"),
  reveal: partial("deterministic object targets", "look/choice-filter continuations"),
  look: partial(
    "deterministic at-resolution object targets (deck top/hand) with outputBinding",
    "dynamic player sets, star counts without auto-pick, and private UI visibility",
  ),
  opt: partial("constant count and persisted partition", "dynamic counts"),
  amp: partial("constant amp amount", "dynamic amounts"),
  sharpen: partial(
    "numeric +1{p} counter + sharpened-this-turn status (CR 8.5.58)",
    "dynamic times and unresolved targets",
  ),
  "crowd-boos": partial("deterministic player target", "filtered player sets"),
  "crowd-cheers": partial("deterministic player target", "filtered player sets"),
  awaken: partial(
    "CR 8.5.43 awaken: flip to permanent (back) face + awakened status (Prism Awakener)",
    "dynamic multi-target awaken and back-face ability swap catalogs",
  ),
  "win-clash": partial("clash-win force lastClashWinnerId", "replacement-relative prize wiring"),
  guess: partial(
    "yes/no chosen-color relationship guess + binding on guesser hero",
    "generic hidden-property relationship guesses",
  ),
  "choose-color": partial(
    "public effect-resolution Red/Yellow/Blue chooser + chose-<color> status + chosen-color binding",
    "platform-specific color chooser chrome",
  ),
  "choose-option": partial(
    "chose-<option> status + binding on chooser hero",
    "interactive option chooser UI",
  ),
  "choose-and-create-token": partial(
    "random token choice in for-each",
    "player-selected token choice",
  ),
  "choose-number": partial(
    "chosen-number binding + chose-number status",
    "interactive number chooser UI",
  ),
  "choose-card": partial(
    "chosen-card object binding + chosen-card status",
    "interactive multi-card chooser UI",
  ),
  "choose-new-targets": partial(
    "CR 1.8.5f retarget of the live attack to original legal targets (unique auto-bind, empty no-op, public chooser)",
    "retarget of non-attack targeted sources (arcane pings still on the stack)",
  ),
  "choose-same-name-group": partial(
    "bounded at-resolution pool, nonempty exact-name cohort, and ordered remainder",
    "dynamic or unbounded source pools",
  ),
  "contract-task": partial(
    "complete-contract observation when task already satisfied",
    "persistent contract progress tracking",
  ),
  "contract-watch": unsupported("condition+effect contract watch"),
  "start-game": unsupported("pregame effect procedure"),
  "remove-all-counters": partial(
    "named counter clear + outputBinding amount",
    "numeric counter wipe without named kind",
  ),
  // 1v1 product: sole opponent is auto-bound (opponentOf); no multiplayer chooser.
  "choose-opponent": partial(
    "1v1 auto-bind sole opponent via opponentOf + choose-opponent observation",
    "multiplayer opponent candidate sets (out of product scope)",
  ),
  "create-token": partial(
    "constant count, fixed destination, and amongExposed equipment seats (CR 3.0.1a)",
    "dynamic count, copies, and interactive exposed-zone choice",
  ),
  "create-card": partial(
    "create event for named/registered definitions",
    "full catalog pitch variants",
  ),
  "cancel-event": partial(
    "continuous application replacement cancellation",
    "use outside a supported replacement modification",
  ),
  ignore: partial(
    "CR 8.5.33 whole-event replacement ignore (considered to never have happened)",
    "part-of-event ignore (8.5.33b) deferred",
  ),
  "create-extra": partial(
    "create N tokens (Gold default outside replacement)",
    "replacement-relative base count composition",
  ),
  "add-counter": partial("constant count and deterministic targets", "dynamic counts or targets"),

  "move-counter": partial("named counter remove+add transfer", "numeric counter transfer"),
  "distribute-counters": partial(
    "even named-counter distribution among targets",
    "interactive distribution chooser",
  ),
  roll: partial("fixed-sided deterministic roll", "dynamic or compound roll shapes"),
  clash: partial(
    "top-deck power comparison with clash-win/lose events",
    "prize branching beyond bindings",
  ),
  reclash: partial(
    "typed replacement-only continuation of an exact provisional clash outcome",
    "standalone resolution outside a clash-outcome replacement",
  ),
  "swap-clash-reveals": partial(
    "replacement-only clash reveal swap (you reveal their top, they reveal yours)",
    "standalone resolution outside a clash replacement",
  ),
  "name-card": partial(
    "named-card binding + named-card status on hero",
    "interactive name chooser UI",
  ),
  intimidate: partial("one random hand object", "multi-object and dynamic intimidate"),
  charge: partial(
    "hand→soul move + charge observation",
    "play-time optional charge cost path is separate",
  ),
  "pitch-card": partial("declared deterministic card", "unresolved card selection"),
  equip: partial("declared deterministic equipment", "unsupported equipment transformations"),
  retrieve: partial(
    "CR 8.5.51 pay-to-equip composition (pay + equip) with equippability gate",
    "GY->hand salvage label reconciliation",
  ),
  transform: partial("transform observation with into binding", "full evo equip transform paths"),
  transcend: partial(
    "CR 8.5.48 transcend: back-face + move-to-hand + transcended flag",
    "label-path retirement",
  ),
  "transform-into-resolving-card": partial(
    "typed Invocation/Construct resolving-card host with atomic declared sources",
    "non-Invocation/Construct layouts",
  ),
  copy: partial("continuous copy atoms with duration", "full LKI ability-only copy variants"),
  "return-to-brood": partial(
    "cease Become/copy instances on controller hero",
    "copy effects on non-hero subjects",
  ),
  exchange: partial("cross-player zone swap of two objects", "equipment seat exchange edge cases"),
  "gain-control": partial(
    "continuous controller atom + discrete zone move",
    "duration expiry reclaim",
  ),
  give: partial(
    "shares gain-control primitive; move-zone reason 'give' (CR 8.5.53)",
    "equip-on-give edge cases",
  ),
  steal: partial(
    "shares gain-control primitive; move-zone reason 'steal' (CR 8.5.54)",
    "equip-on-steal edge cases",
  ),
  mark: partial("player.marked + set-status marked on hero", "unmark / mark replacement"),
  "set-status": partial("deterministic object status", "unresolved targets"),
  freeze: partial(
    "frozen marker via set-status + continuous restrict path with duration",
    "while-in-arena continuous freeze",
  ),
  unfreeze: partial(
    "clear frozen marker via set-status unfrozen",
    "duration-scoped continuous unfreeze",
  ),
  tap: partial("deterministic object target", "unresolved target"),
  untap: partial("deterministic object target", "unresolved target"),
  "add-defending": partial("declared arsenal defender", "other defending-source shapes"),
  "attack-with": partial(
    "weapon ready+AP grant and attack-action chain open",
    "nested multi-attack times edge cases",
  ),
  "play-card": partial(
    "serialized continuous play permission",
    "immediate play and broad permissions",
  ),
  pay: partial(
    "constant resource asset payment",
    "dynamic amounts, mixed costs, and non-resource costs",
  ),
  wager: partial(
    "combat-chain wager observation + stake token create (might/vigor/gold/…)",
    "stake token consumption on hit and prize resolution",
  ),
  "win-wager": unsupported(
    "standalone wager outcome; supported only as the typed continuation of a replaceable wager-loss event",
  ),
  become: partial("become observation event with previous LKI", "full identity/ally form swap"),
  "modify-numeric": partial(
    "serialized continuous modifier",
    "unsupported amounts, targets, and durations",
  ),
  "modify-activation-cost": partial(
    "serialized activation-cost modifier",
    "unsupported amounts, targets, and durations",
  ),
  "modify-activation-limit": partial(
    "persisted exact attack-ability limit modifier through CR 5.2.3 event",
    "non-attack ability limits and durations beyond this turn",
  ),
  "grant-property": partial(
    "serialized continuous grant",
    "unsupported properties, targets, and durations",
  ),
  "remove-property": partial(
    "serialized continuous removal",
    "unsupported properties, targets, and durations",
  ),
  "can-be-attacked": partial(
    "serialized continuous permission",
    "unsupported targets and durations",
  ),
  replacement: partial("audited canonical replacement shapes", "noncanonical replacement shapes"),
  prevention: partial(
    "fixed canonical prevention shapes; shielding carryover (CR 6.4.10j) via the consumption protocol",
    "redirection, costs, and dynamic counts",
  ),
  "rule-modification": partial(
    "serialized continuous rule modification",
    "unsupported actions and durations",
  ),
  "inline-trigger": unsupported("generation-boundary inline trigger registration"),
} satisfies Record<FabEffect["type"], FabEffectProductionSupport>;

/** Exhaustive declaration/payment ledger shared by play and activation. */
export const FAB_COST_PRODUCTION_SUPPORT = {
  resources: partial("constant resource asset payment", "dynamic resource amounts"),
  chi: partial("constant chi asset payment", "dynamic chi amounts"),
  life: partial("constant life asset payment", "dynamic life amounts"),
  "action-points": partial("one action point", "noncanonical action-point amounts"),
  power: unsupported("power asset payment"),
  discard: partial(
    "one random play discard or one declared activation discard",
    "other counts, zones, and random activation discards",
  ),
  banish: partial(
    "one declared activation object from supported zones",
    "deck, soul, under-card, dynamic, and random banish",
  ),
  "destroy-self": partial("immediate destroy-self", "delayed destruction costs"),
  "banish-self": partial("immediate banish-self", "delayed or optional banish-self costs"),
  destroy: unsupported("selected permanent destruction cost"),
  "tap-self": partial("untapped activation source", "optional cost form"),
  "tap-hero": partial("untapped controller hero", "optional cost form"),
  tap: unsupported("selected cog tap cost"),
  untap: unsupported("selected cog untap cost"),
  "discard-self": partial("activation source in hand", "optional cost form"),
  "remove-counters": partial(
    "constant named counters on the source",
    "dynamic, filtered, and selected counter costs",
  ),
  "add-counter": partial("constant named counters on self", "dynamic counters or other targets"),
  reveal: unsupported("reveal-as-cost declaration"),
  "move-to-deck": partial(
    "one card from hand or arsenal to deck top/bottom",
    "self, hand-and-arsenal, shuffle, and other counts",
  ),
  "turn-face-down": partial("one declared object", "other target shapes"),
  "turn-face-up": partial("self or one declared object with binding", "other target shapes"),
  "create-token": partial(
    "activation create-token cost (Chane Soul Shackle) + effect leaf create",
    "opponent-controller / multi-count cost variants",
  ),
  charge: unsupported("charge declaration and repeated charge"),
  all: partial("all supported child costs", "any unsupported child cost"),
  alternative: unsupported("alternative cost selection"),
} satisfies Record<FabCost["type"], FabEffectProductionSupport>;
