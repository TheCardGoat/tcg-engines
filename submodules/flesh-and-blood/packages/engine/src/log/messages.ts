/**
 * FAB player-facing log message registry.
 *
 * Every key here must have a template in `messages/en.json`; the translation
 * contract (`src/log/translation-contract.ts`) fails loudly when the registry
 * and the catalog drift. Key strings and placeholder names ride the persisted
 * `FabMoveLogMessage` wire record — treat renames as wire breaks.
 *
 * Emitted messages carry the rendered `en` template as `defaultMessage`, so
 * canonical records stay self-describing for consumers without the catalog.
 */

/** Primitive value shapes allowed in a log message's interpolation values. */
export type FabLogValuePrimitive = string | number | boolean;

/** Coarse grouping used by consumers to filter or tag log lines. */
export type FabLogCategory = "action" | "combat" | "ability" | "rules" | "system";

/** Production-history treatment. Exhaustive registry below owns every log key. */
export type FabLogNarrativeRole = "activity" | "detail" | "outcome" | "transient" | "diagnostic";

export const FAB_LOG_KEYS = [
  // Command acknowledgment lines (one per accepted command).
  "flesh-and-blood.command.begin-play",
  "flesh-and-blood.command.set-optional-trigger-automation",
  "flesh-and-blood.command.set-automation-preferences",
  "flesh-and-blood.command.play-and-skip-hold-enabled",
  "flesh-and-blood.command.play-and-skip-hold-disabled",
  "flesh-and-blood.command.opponent-trigger-auto-yield-enabled",
  "flesh-and-blood.command.opponent-trigger-auto-yield-disabled",
  "flesh-and-blood.command.instant-auto-yield-enabled",
  "flesh-and-blood.command.instant-auto-yield-disabled",
  "flesh-and-blood.command.arm-priority-hold",
  "flesh-and-blood.command.answer-decision",
  "flesh-and-blood.command.activate",
  "flesh-and-blood.command.defend",
  "flesh-and-blood.command.pass",
  "flesh-and-blood.command.end-turn",
  "flesh-and-blood.command.concede",
  "flesh-and-blood.trigger-automation.auto-pass",
  "flesh-and-blood.priority-automation.auto-pass",
  "flesh-and-blood.decision-automation.auto-order",
  "flesh-and-blood.decision-automation.auto-target",

  // Core play facts.
  "flesh-and-blood.play",
  "flesh-and-blood.play.from-zone",
  "flesh-and-blood.bind",
  "flesh-and-blood.modal.modes-chosen",
  "flesh-and-blood.activate",
  "flesh-and-blood.activate.targeting",
  "flesh-and-blood.pitch",
  "flesh-and-blood.defend",

  // Draw (count public, identities private — CR 3.7.1).
  "flesh-and-blood.draw",
  "flesh-and-blood.draw.cards",
  "flesh-and-blood.draw.private",
  "flesh-and-blood.draw.replaced",
  "flesh-and-blood.draw.replaced.cards",

  // Search / look / opt / reveal (CR 3.0.4a-d, glossary Reveal, Opt).
  "flesh-and-blood.search",
  "flesh-and-blood.search.found",
  "flesh-and-blood.look",
  "flesh-and-blood.look.private",
  "flesh-and-blood.opt",
  "flesh-and-blood.opt.cards",
  "flesh-and-blood.opt.private",
  "flesh-and-blood.reveal",

  // Zone transitions and card-identity mechanics.
  "flesh-and-blood.discard",
  "flesh-and-blood.discard.random",
  "flesh-and-blood.banish",
  "flesh-and-blood.banish.hidden",
  "flesh-and-blood.banish.hidden.by-source",
  "flesh-and-blood.banish.hidden-identity",
  "flesh-and-blood.banish.hidden-identity.by-source",
  "flesh-and-blood.deck-bottom",
  "flesh-and-blood.deck-bottom.private",
  "flesh-and-blood.destroy",
  "flesh-and-blood.destroy.by-source",
  "flesh-and-blood.dies",
  "flesh-and-blood.put-into-graveyard",
  "flesh-and-blood.enter-arena",
  "flesh-and-blood.enter-arena.tapped",
  "flesh-and-blood.leave-arena",
  "flesh-and-blood.move-zone",
  "flesh-and-blood.move-zone.hidden",
  "flesh-and-blood.shuffle-zone",
  "flesh-and-blood.turn-face-up",
  "flesh-and-blood.turn-face-down",
  "flesh-and-blood.equip",
  "flesh-and-blood.create",
  "flesh-and-blood.create.by-source",
  "flesh-and-blood.become",
  "flesh-and-blood.gain-name",
  "flesh-and-blood.lose-names",
  "flesh-and-blood.name-gain-restricted",
  "flesh-and-blood.transform",
  "flesh-and-blood.boost",
  "flesh-and-blood.boost.banish",
  "flesh-and-blood.charge",
  "flesh-and-blood.fuse",
  "flesh-and-blood.fragment",
  "flesh-and-blood.usurp",
  "flesh-and-blood.crank",
  "flesh-and-blood.transcend",
  "flesh-and-blood.complete-contract",
  "flesh-and-blood.beat-chest",
  "flesh-and-blood.awaken",
  "flesh-and-blood.change-active-face",

  // Combat narrative: one merged outcome line per hit or miss.
  "flesh-and-blood.attack",
  "flesh-and-blood.attack.by-source",
  "flesh-and-blood.combat.hit",
  "flesh-and-blood.combat.blocked",
  "flesh-and-blood.combat.missed",
  "flesh-and-blood.combat.miss",
  "flesh-and-blood.combat.chain-close",
  "flesh-and-blood.damage",
  "flesh-and-blood.damage.typed",
  "flesh-and-blood.damage.with-source",
  "flesh-and-blood.damage.with-source.typed",
  "flesh-and-blood.prevent",

  // Wagers, clashes, rolls.
  "flesh-and-blood.wager",
  "flesh-and-blood.wager.win",
  "flesh-and-blood.wager.loss",
  "flesh-and-blood.clash.outcome",
  "flesh-and-blood.clash.win",
  "flesh-and-blood.clash.tie",
  "flesh-and-blood.roll",

  // Resources, life totals, counters, statuses.
  "flesh-and-blood.cost-life",
  "flesh-and-blood.cost-chi",
  "flesh-and-blood.assets.granted",
  "flesh-and-blood.assets.granted.action-points",
  "flesh-and-blood.assets.granted.chi",
  "flesh-and-blood.assets.granted.amp",
  "flesh-and-blood.gain-life",
  "flesh-and-blood.lose-life",
  "flesh-and-blood.lose-life.blood-debt",
  "flesh-and-blood.go-again",
  "flesh-and-blood.may-attack",
  "flesh-and-blood.crowd-cheers",
  "flesh-and-blood.crowd-boos",
  "flesh-and-blood.protect",
  "flesh-and-blood.counter-added",
  "flesh-and-blood.counter-removed",
  "flesh-and-blood.numeric-counter-added",
  "flesh-and-blood.numeric-counter-removed",
  "flesh-and-blood.gain-keyword",
  "flesh-and-blood.gave-keyword",
  "flesh-and-blood.gave-power",
  "flesh-and-blood.name-card",
  "flesh-and-blood.sharpen",
  "flesh-and-blood.modify-power",
  "flesh-and-blood.next-attack-power-bonus",
  "flesh-and-blood.next-attack-keyword",
  "flesh-and-blood.next-attack-of-keyword",
  "flesh-and-blood.next-attack-of-go-again",
  "flesh-and-blood.set-tapped",
  "flesh-and-blood.set-tapped.by-source",

  // Ability resolution lines.
  "flesh-and-blood.ability.triggered",
  "flesh-and-blood.ability.layer",

  // Turn, phase, and decision system lines.
  "flesh-and-blood.turn.started",
  "flesh-and-blood.game.ended",
  "flesh-and-blood.decision.awaiting",
  "flesh-and-blood.decision.private",
  "flesh-and-blood.phase.start",
] as const;

export type FabLogKey = (typeof FAB_LOG_KEYS)[number];

/**
 * Typed interpolation values per key. Placeholder sets must match the
 * `en.json` templates exactly (enforced by the translation contract).
 */
export interface FabLogMessageValuesByName {
  readonly "flesh-and-blood.command.begin-play": { readonly actorId: string };
  readonly "flesh-and-blood.command.set-optional-trigger-automation": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.set-automation-preferences": { readonly actorId: string };
  readonly "flesh-and-blood.command.play-and-skip-hold-enabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.play-and-skip-hold-disabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.opponent-trigger-auto-yield-enabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.opponent-trigger-auto-yield-disabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.instant-auto-yield-enabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.instant-auto-yield-disabled": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.command.arm-priority-hold": { readonly actorId: string };
  readonly "flesh-and-blood.command.answer-decision": { readonly actorId: string };
  readonly "flesh-and-blood.command.activate": { readonly actorId: string };
  readonly "flesh-and-blood.command.defend": { readonly actorId: string };
  readonly "flesh-and-blood.command.pass": { readonly actorId: string };
  readonly "flesh-and-blood.command.end-turn": { readonly actorId: string };
  readonly "flesh-and-blood.command.concede": { readonly actorId: string };
  readonly "flesh-and-blood.trigger-automation.auto-pass": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.priority-automation.auto-pass": { readonly actorId: string };
  readonly "flesh-and-blood.decision-automation.auto-order": {
    readonly actorId: string;
    readonly decisionKind: string;
  };
  readonly "flesh-and-blood.decision-automation.auto-target": {
    readonly actorId: string;
  };

  readonly "flesh-and-blood.play": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.play.from-zone": {
    readonly actorId: string;
    readonly cardName: string;
    readonly from: string;
  };
  readonly "flesh-and-blood.bind": { readonly auraName: string; readonly hostName: string };
  readonly "flesh-and-blood.modal.modes-chosen": {
    readonly actorId: string;
    readonly cardName: string;
    readonly modeCount: number;
    readonly modePlural: string;
    readonly modeText: string;
  };
  readonly "flesh-and-blood.activate": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.activate.targeting": {
    readonly actorId: string;
    readonly cardName: string;
    readonly targetName: string;
  };
  readonly "flesh-and-blood.pitch": {
    readonly playerId: string;
    readonly cardName: string;
    readonly resources: number;
  };
  readonly "flesh-and-blood.defend": { readonly actorId: string; readonly cardName: string };

  readonly "flesh-and-blood.draw": { readonly playerId: string };
  readonly "flesh-and-blood.draw.cards": { readonly playerId: string; readonly count: number };
  readonly "flesh-and-blood.draw.private": {
    readonly playerId: string;
    readonly cardNames: string;
  };
  readonly "flesh-and-blood.draw.replaced": { readonly playerId: string };
  readonly "flesh-and-blood.draw.replaced.cards": {
    readonly playerId: string;
    readonly count: number;
  };

  readonly "flesh-and-blood.search": { readonly playerId: string };
  readonly "flesh-and-blood.search.found": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.look": { readonly playerId: string };
  readonly "flesh-and-blood.look.private": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.opt": { readonly playerId: string };
  readonly "flesh-and-blood.opt.cards": {
    readonly playerId: string;
    readonly topCount: number;
    readonly topPlural: string;
    readonly bottomCount: number;
    readonly bottomPlural: string;
  };
  readonly "flesh-and-blood.opt.private": {
    readonly playerId: string;
    readonly topNames: string;
    readonly bottomNames: string;
  };
  readonly "flesh-and-blood.reveal": { readonly playerId: string; readonly cardName: string };

  readonly "flesh-and-blood.discard": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.discard.random": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.banish": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.banish.hidden": { readonly playerId: string };
  readonly "flesh-and-blood.banish.hidden.by-source": {
    readonly playerId: string;
    readonly sourceName: string;
    readonly from: string;
  };
  /** Face-up banish whose origin identity stays hidden (deck). */
  readonly "flesh-and-blood.banish.hidden-identity": { readonly playerId: string };
  readonly "flesh-and-blood.banish.hidden-identity.by-source": {
    readonly playerId: string;
    readonly sourceName: string;
    readonly from: string;
  };
  readonly "flesh-and-blood.deck-bottom": { readonly playerId: string; readonly from: string };
  readonly "flesh-and-blood.deck-bottom.private": {
    readonly playerId: string;
    readonly cardName: string;
    readonly from: string;
  };
  readonly "flesh-and-blood.destroy": { readonly cardName: string };
  readonly "flesh-and-blood.destroy.by-source": {
    readonly sourceName: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.dies": { readonly cardName: string };
  readonly "flesh-and-blood.put-into-graveyard": { readonly cardName: string };
  readonly "flesh-and-blood.enter-arena": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.enter-arena.tapped": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.leave-arena": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.move-zone": {
    readonly playerId: string;
    readonly cardName: string;
    readonly from: string;
    readonly to: string;
  };
  readonly "flesh-and-blood.move-zone.hidden": {
    readonly playerId: string;
    readonly from: string;
    readonly to: string;
  };
  readonly "flesh-and-blood.shuffle-zone": { readonly playerId: string; readonly zone: string };
  readonly "flesh-and-blood.turn-face-up": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.turn-face-down": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.equip": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.create": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.create.by-source": {
    readonly sourceName: string;
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.become": { readonly cardName: string; readonly previousName: string };
  readonly "flesh-and-blood.gain-name": {
    readonly cardName: string;
    readonly gainedName: string;
    readonly sourceName: string;
  };
  readonly "flesh-and-blood.lose-names": {
    readonly cardName: string;
    readonly sourceName: string;
  };
  readonly "flesh-and-blood.name-gain-restricted": {
    readonly sourceName: string;
    readonly playerId: string;
  };
  readonly "flesh-and-blood.transform": { readonly cardName: string; readonly intoName: string };
  readonly "flesh-and-blood.boost": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.boost.banish": {
    readonly actorId: string;
    readonly cardName: string;
    readonly banishedName: string;
  };
  readonly "flesh-and-blood.charge": {
    readonly actorId: string;
    readonly cardName: string;
    readonly chargedName: string;
  };
  readonly "flesh-and-blood.fuse": {
    readonly actorId: string;
    readonly cardName: string;
    readonly revealedNames: string;
  };
  readonly "flesh-and-blood.fragment": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.usurp": {
    readonly actorId: string;
    readonly cardName: string;
    readonly usurpedName: string;
  };
  readonly "flesh-and-blood.crank": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.transcend": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.complete-contract": {
    readonly actorId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.beat-chest": {
    readonly actorId: string;
    readonly chestOwner: string;
    readonly cardNames: string;
  };
  readonly "flesh-and-blood.awaken": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.change-active-face": {
    readonly cardName: string;
    readonly faceId: string;
  };

  readonly "flesh-and-blood.attack": {
    readonly actorId: string;
    readonly cardName: string;
    readonly targetName: string;
  };
  readonly "flesh-and-blood.attack.by-source": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly targetName: string;
  };
  readonly "flesh-and-blood.combat.hit": {
    readonly cardName: string;
    readonly targetName: string;
    readonly damage: number;
  };
  readonly "flesh-and-blood.combat.blocked": {
    readonly cardName: string;
    readonly targetName: string;
  };
  readonly "flesh-and-blood.combat.missed": {
    readonly cardName: string;
    readonly targetName: string;
  };
  /** Legacy persisted key. New logs use the fully localizable keys above. */
  readonly "flesh-and-blood.combat.miss": {
    readonly cardName: string;
    readonly targetName: string;
    readonly result: string;
  };
  readonly "flesh-and-blood.combat.chain-close": Record<string, never>;
  readonly "flesh-and-blood.damage": { readonly playerId: string; readonly amount: number };
  readonly "flesh-and-blood.damage.typed": {
    readonly playerId: string;
    readonly amount: number;
    readonly damageType: string;
  };
  readonly "flesh-and-blood.damage.with-source": {
    readonly playerId: string;
    readonly amount: number;
    readonly sourceName: string;
  };
  readonly "flesh-and-blood.damage.with-source.typed": {
    readonly playerId: string;
    readonly amount: number;
    readonly damageType: string;
    readonly sourceName: string;
  };
  readonly "flesh-and-blood.prevent": {
    readonly playerId: string;
    readonly amount: number;
    readonly sourceName: string;
  };

  readonly "flesh-and-blood.wager": { readonly actorId: string; readonly cardName: string };
  readonly "flesh-and-blood.wager.win": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.wager.loss": { readonly playerId: string; readonly cardName: string };
  readonly "flesh-and-blood.clash.outcome": {
    readonly firstPlayerId: string;
    readonly firstCardName: string;
    readonly firstPowerLabel: string;
    readonly secondPlayerId: string;
    readonly secondCardName: string;
    readonly secondPowerLabel: string;
  };
  readonly "flesh-and-blood.clash.win": {
    readonly winnerId: string;
    readonly winnerPowerLabel: string;
    readonly loserPowerLabel: string;
  };
  readonly "flesh-and-blood.clash.tie": {
    readonly firstPowerLabel: string;
    readonly secondPowerLabel: string;
  };
  readonly "flesh-and-blood.roll": {
    readonly playerId: string;
    readonly sides: number;
    readonly result: number;
  };

  readonly "flesh-and-blood.cost-life": { readonly playerId: string; readonly life: number };
  readonly "flesh-and-blood.cost-chi": { readonly playerId: string; readonly chi: number };
  readonly "flesh-and-blood.assets.granted": {
    readonly playerId: string;
    readonly resources: number;
    readonly plural: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.assets.granted.action-points": {
    readonly playerId: string;
    readonly actionPoints: number;
    readonly plural: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.assets.granted.chi": {
    readonly playerId: string;
    readonly chi: number;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.assets.granted.amp": {
    readonly playerId: string;
    readonly amp: number;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.gain-life": { readonly playerId: string; readonly amount: number };
  readonly "flesh-and-blood.lose-life": { readonly playerId: string; readonly amount: number };
  readonly "flesh-and-blood.lose-life.blood-debt": {
    readonly playerId: string;
    readonly amount: number;
    readonly sourceName: string;
  };
  readonly "flesh-and-blood.go-again": { readonly cardName: string };
  readonly "flesh-and-blood.may-attack": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly timesLabel: string;
  };
  readonly "flesh-and-blood.crowd-cheers": { readonly playerId: string };
  readonly "flesh-and-blood.crowd-boos": { readonly playerId: string };
  readonly "flesh-and-blood.protect": {
    readonly playerId: string;
    readonly protectedPlayerId: string;
  };
  readonly "flesh-and-blood.counter-added": {
    readonly cardName: string;
    readonly counter: string;
    readonly amount: number;
    readonly plural: string;
  };
  readonly "flesh-and-blood.counter-removed": {
    readonly cardName: string;
    readonly counter: string;
    readonly amount: number;
    readonly plural: string;
  };
  readonly "flesh-and-blood.numeric-counter-added": {
    readonly cardName: string;
    readonly counter: string;
    readonly count: number;
    readonly plural: string;
  };
  readonly "flesh-and-blood.numeric-counter-removed": {
    readonly cardName: string;
    readonly counter: string;
    readonly count: number;
    readonly plural: string;
  };
  readonly "flesh-and-blood.gain-keyword": { readonly cardName: string; readonly keyword: string };
  readonly "flesh-and-blood.gave-keyword": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly keyword: string;
  };
  readonly "flesh-and-blood.gave-power": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly amount: string;
  };
  readonly "flesh-and-blood.name-card": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "flesh-and-blood.sharpen": {
    readonly playerId: string;
    readonly cardName: string;
    readonly count: number;
    readonly plural: string;
  };
  readonly "flesh-and-blood.modify-power": {
    readonly cardName: string;
    readonly from: number;
    readonly to: number;
  };
  readonly "flesh-and-blood.next-attack-power-bonus": {
    readonly sourceName: string;
    readonly amount: number;
  };
  readonly "flesh-and-blood.next-attack-keyword": {
    readonly sourceName: string;
    readonly keyword: string;
  };
  readonly "flesh-and-blood.next-attack-of-keyword": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly keyword: string;
  };
  readonly "flesh-and-blood.next-attack-of-go-again": {
    readonly sourceName: string;
    readonly cardName: string;
    readonly playerId: string;
  };
  readonly "flesh-and-blood.set-tapped": { readonly cardName: string; readonly state: string };
  readonly "flesh-and-blood.set-tapped.by-source": {
    readonly sourceName: string;
    readonly cardName: string;
  };

  readonly "flesh-and-blood.ability.triggered": { readonly cardName: string };
  readonly "flesh-and-blood.ability.layer": { readonly cardName: string };

  readonly "flesh-and-blood.turn.started": {
    readonly turnNumber: number;
  };
  readonly "flesh-and-blood.game.ended": { readonly playerId: string; readonly reason: string };
  readonly "flesh-and-blood.decision.awaiting": { readonly actorId: string };
  readonly "flesh-and-blood.decision.private": { readonly label: string };
  readonly "flesh-and-blood.phase.start": { readonly turnPlayerId: string; readonly phase: string };
}

/** Typed values payload for a single key. */
export type FabLogValuesFor<TKey extends FabLogKey> = FabLogMessageValuesByName[TKey];

/**
 * Category per key. `Record<FabLogKey, ...>` makes a new key fail compilation
 * here until it is classified, so downstream projections (simulator log
 * panel tags) can never observe an unclassified key.
 */
export const FAB_LOG_KEY_CATEGORIES = {
  "flesh-and-blood.command.begin-play": "action",
  "flesh-and-blood.command.set-optional-trigger-automation": "action",
  "flesh-and-blood.command.set-automation-preferences": "action",
  "flesh-and-blood.command.play-and-skip-hold-enabled": "action",
  "flesh-and-blood.command.play-and-skip-hold-disabled": "action",
  "flesh-and-blood.command.opponent-trigger-auto-yield-enabled": "action",
  "flesh-and-blood.command.opponent-trigger-auto-yield-disabled": "action",
  "flesh-and-blood.command.instant-auto-yield-enabled": "action",
  "flesh-and-blood.command.instant-auto-yield-disabled": "action",
  "flesh-and-blood.command.arm-priority-hold": "action",
  "flesh-and-blood.command.answer-decision": "action",
  "flesh-and-blood.command.activate": "action",
  "flesh-and-blood.command.defend": "action",
  "flesh-and-blood.command.pass": "action",
  "flesh-and-blood.command.end-turn": "action",
  "flesh-and-blood.command.concede": "action",
  "flesh-and-blood.trigger-automation.auto-pass": "rules",
  "flesh-and-blood.priority-automation.auto-pass": "rules",
  "flesh-and-blood.decision-automation.auto-order": "rules",
  "flesh-and-blood.decision-automation.auto-target": "rules",

  "flesh-and-blood.play": "action",
  "flesh-and-blood.play.from-zone": "action",
  "flesh-and-blood.bind": "action",
  "flesh-and-blood.modal.modes-chosen": "ability",
  "flesh-and-blood.activate": "action",
  "flesh-and-blood.activate.targeting": "action",
  "flesh-and-blood.pitch": "action",
  "flesh-and-blood.defend": "combat",

  "flesh-and-blood.draw": "action",
  "flesh-and-blood.draw.cards": "action",
  "flesh-and-blood.draw.private": "action",
  "flesh-and-blood.draw.replaced": "action",
  "flesh-and-blood.draw.replaced.cards": "action",

  "flesh-and-blood.search": "action",
  "flesh-and-blood.search.found": "action",
  "flesh-and-blood.look": "action",
  "flesh-and-blood.look.private": "action",
  "flesh-and-blood.opt": "action",
  "flesh-and-blood.opt.cards": "action",
  "flesh-and-blood.opt.private": "action",
  "flesh-and-blood.reveal": "action",

  "flesh-and-blood.discard": "action",
  "flesh-and-blood.discard.random": "action",
  "flesh-and-blood.banish": "action",
  "flesh-and-blood.banish.hidden": "action",
  "flesh-and-blood.banish.hidden.by-source": "action",
  "flesh-and-blood.banish.hidden-identity": "action",
  "flesh-and-blood.banish.hidden-identity.by-source": "action",
  "flesh-and-blood.deck-bottom": "action",
  "flesh-and-blood.deck-bottom.private": "action",
  "flesh-and-blood.destroy": "action",
  "flesh-and-blood.destroy.by-source": "action",
  "flesh-and-blood.dies": "action",
  "flesh-and-blood.put-into-graveyard": "action",
  "flesh-and-blood.enter-arena": "action",
  "flesh-and-blood.enter-arena.tapped": "action",
  "flesh-and-blood.leave-arena": "action",
  "flesh-and-blood.move-zone": "action",
  "flesh-and-blood.move-zone.hidden": "action",
  "flesh-and-blood.shuffle-zone": "action",
  "flesh-and-blood.turn-face-up": "action",
  "flesh-and-blood.turn-face-down": "action",
  "flesh-and-blood.equip": "action",
  "flesh-and-blood.create": "action",
  "flesh-and-blood.create.by-source": "action",
  "flesh-and-blood.become": "action",
  "flesh-and-blood.gain-name": "rules",
  "flesh-and-blood.lose-names": "rules",
  "flesh-and-blood.name-gain-restricted": "rules",
  "flesh-and-blood.transform": "action",
  "flesh-and-blood.boost": "action",
  "flesh-and-blood.boost.banish": "action",
  "flesh-and-blood.charge": "action",
  "flesh-and-blood.fuse": "action",
  "flesh-and-blood.fragment": "action",
  "flesh-and-blood.usurp": "action",
  "flesh-and-blood.crank": "action",
  "flesh-and-blood.transcend": "action",
  "flesh-and-blood.complete-contract": "action",
  "flesh-and-blood.beat-chest": "action",
  "flesh-and-blood.awaken": "action",
  "flesh-and-blood.change-active-face": "action",

  "flesh-and-blood.attack": "combat",
  "flesh-and-blood.attack.by-source": "combat",
  "flesh-and-blood.combat.hit": "combat",
  "flesh-and-blood.combat.blocked": "combat",
  "flesh-and-blood.combat.missed": "combat",
  "flesh-and-blood.combat.miss": "combat",
  "flesh-and-blood.combat.chain-close": "combat",
  "flesh-and-blood.damage": "combat",
  "flesh-and-blood.damage.typed": "combat",
  "flesh-and-blood.damage.with-source": "combat",
  "flesh-and-blood.damage.with-source.typed": "combat",
  "flesh-and-blood.prevent": "combat",

  "flesh-and-blood.wager": "combat",
  "flesh-and-blood.wager.win": "combat",
  "flesh-and-blood.wager.loss": "combat",
  "flesh-and-blood.clash.outcome": "combat",
  "flesh-and-blood.clash.win": "combat",
  "flesh-and-blood.clash.tie": "combat",
  "flesh-and-blood.roll": "combat",

  "flesh-and-blood.cost-life": "rules",
  "flesh-and-blood.cost-chi": "rules",
  "flesh-and-blood.assets.granted": "rules",
  "flesh-and-blood.assets.granted.action-points": "rules",
  "flesh-and-blood.assets.granted.chi": "rules",
  "flesh-and-blood.assets.granted.amp": "rules",
  "flesh-and-blood.gain-life": "rules",
  "flesh-and-blood.lose-life": "rules",
  "flesh-and-blood.lose-life.blood-debt": "rules",
  "flesh-and-blood.go-again": "rules",
  "flesh-and-blood.may-attack": "rules",
  "flesh-and-blood.crowd-cheers": "rules",
  "flesh-and-blood.crowd-boos": "rules",
  "flesh-and-blood.protect": "rules",
  "flesh-and-blood.counter-added": "rules",
  "flesh-and-blood.counter-removed": "rules",
  "flesh-and-blood.numeric-counter-added": "rules",
  "flesh-and-blood.numeric-counter-removed": "rules",
  "flesh-and-blood.gain-keyword": "rules",
  "flesh-and-blood.gave-keyword": "rules",
  "flesh-and-blood.gave-power": "rules",
  "flesh-and-blood.name-card": "rules",
  "flesh-and-blood.sharpen": "rules",
  "flesh-and-blood.modify-power": "rules",
  "flesh-and-blood.next-attack-power-bonus": "rules",
  "flesh-and-blood.next-attack-keyword": "rules",
  "flesh-and-blood.next-attack-of-keyword": "rules",
  "flesh-and-blood.next-attack-of-go-again": "rules",
  "flesh-and-blood.set-tapped": "rules",
  "flesh-and-blood.set-tapped.by-source": "rules",

  "flesh-and-blood.ability.triggered": "ability",
  "flesh-and-blood.ability.layer": "ability",

  "flesh-and-blood.turn.started": "system",
  "flesh-and-blood.game.ended": "system",
  "flesh-and-blood.decision.awaiting": "system",
  "flesh-and-blood.decision.private": "system",
  "flesh-and-blood.phase.start": "system",
} as const satisfies Readonly<Record<FabLogKey, FabLogCategory>>;

/**
 * Player-history policy for every persisted key. The explicit Record is a
 * compile-time tripwire: a new key cannot ship without a product decision.
 */
export const FAB_LOG_KEY_NARRATIVE_ROLES: Readonly<Record<FabLogKey, FabLogNarrativeRole>> = {
  "flesh-and-blood.command.begin-play": "diagnostic",
  "flesh-and-blood.command.set-optional-trigger-automation": "diagnostic",
  "flesh-and-blood.command.set-automation-preferences": "diagnostic",
  "flesh-and-blood.command.play-and-skip-hold-enabled": "diagnostic",
  "flesh-and-blood.command.play-and-skip-hold-disabled": "diagnostic",
  "flesh-and-blood.command.opponent-trigger-auto-yield-enabled": "diagnostic",
  "flesh-and-blood.command.opponent-trigger-auto-yield-disabled": "diagnostic",
  "flesh-and-blood.command.instant-auto-yield-enabled": "diagnostic",
  "flesh-and-blood.command.instant-auto-yield-disabled": "diagnostic",
  "flesh-and-blood.command.arm-priority-hold": "diagnostic",
  "flesh-and-blood.command.answer-decision": "diagnostic",
  "flesh-and-blood.command.activate": "diagnostic",
  "flesh-and-blood.command.defend": "diagnostic",
  "flesh-and-blood.command.pass": "transient",
  "flesh-and-blood.command.end-turn": "diagnostic",
  "flesh-and-blood.command.concede": "diagnostic",
  "flesh-and-blood.trigger-automation.auto-pass": "diagnostic",
  "flesh-and-blood.priority-automation.auto-pass": "diagnostic",
  "flesh-and-blood.decision-automation.auto-order": "diagnostic",
  "flesh-and-blood.decision-automation.auto-target": "diagnostic",
  "flesh-and-blood.play": "activity",
  "flesh-and-blood.play.from-zone": "activity",
  "flesh-and-blood.bind": "detail",
  "flesh-and-blood.modal.modes-chosen": "detail",
  "flesh-and-blood.activate": "activity",
  "flesh-and-blood.activate.targeting": "activity",
  "flesh-and-blood.pitch": "detail",
  "flesh-and-blood.defend": "activity",
  "flesh-and-blood.draw": "activity",
  "flesh-and-blood.draw.cards": "activity",
  "flesh-and-blood.draw.private": "activity",
  "flesh-and-blood.draw.replaced": "outcome",
  "flesh-and-blood.draw.replaced.cards": "outcome",
  "flesh-and-blood.search": "activity",
  "flesh-and-blood.search.found": "activity",
  "flesh-and-blood.look": "activity",
  "flesh-and-blood.look.private": "activity",
  "flesh-and-blood.opt": "activity",
  "flesh-and-blood.opt.cards": "activity",
  "flesh-and-blood.opt.private": "activity",
  "flesh-and-blood.reveal": "activity",
  "flesh-and-blood.discard": "detail",
  "flesh-and-blood.discard.random": "detail",
  "flesh-and-blood.banish": "activity",
  "flesh-and-blood.banish.hidden": "activity",
  "flesh-and-blood.banish.hidden.by-source": "activity",
  "flesh-and-blood.banish.hidden-identity": "activity",
  "flesh-and-blood.banish.hidden-identity.by-source": "activity",
  "flesh-and-blood.deck-bottom": "activity",
  "flesh-and-blood.deck-bottom.private": "activity",
  "flesh-and-blood.destroy": "activity",
  "flesh-and-blood.destroy.by-source": "activity",
  "flesh-and-blood.dies": "activity",
  "flesh-and-blood.put-into-graveyard": "activity",
  "flesh-and-blood.enter-arena": "activity",
  "flesh-and-blood.enter-arena.tapped": "activity",
  "flesh-and-blood.leave-arena": "activity",
  "flesh-and-blood.move-zone": "activity",
  "flesh-and-blood.move-zone.hidden": "activity",
  "flesh-and-blood.shuffle-zone": "activity",
  "flesh-and-blood.turn-face-up": "activity",
  "flesh-and-blood.turn-face-down": "activity",
  "flesh-and-blood.equip": "activity",
  "flesh-and-blood.create": "activity",
  "flesh-and-blood.create.by-source": "activity",
  "flesh-and-blood.become": "activity",
  "flesh-and-blood.gain-name": "activity",
  "flesh-and-blood.lose-names": "activity",
  "flesh-and-blood.name-gain-restricted": "activity",
  "flesh-and-blood.transform": "activity",
  "flesh-and-blood.boost": "activity",
  "flesh-and-blood.boost.banish": "activity",
  "flesh-and-blood.charge": "activity",
  "flesh-and-blood.fuse": "activity",
  "flesh-and-blood.fragment": "activity",
  "flesh-and-blood.usurp": "activity",
  "flesh-and-blood.crank": "activity",
  "flesh-and-blood.transcend": "activity",
  "flesh-and-blood.complete-contract": "activity",
  "flesh-and-blood.beat-chest": "activity",
  "flesh-and-blood.awaken": "activity",
  "flesh-and-blood.change-active-face": "activity",
  "flesh-and-blood.attack": "activity",
  "flesh-and-blood.attack.by-source": "activity",
  "flesh-and-blood.combat.hit": "outcome",
  "flesh-and-blood.combat.blocked": "outcome",
  "flesh-and-blood.combat.missed": "outcome",
  "flesh-and-blood.combat.miss": "outcome",
  "flesh-and-blood.combat.chain-close": "diagnostic",
  "flesh-and-blood.damage": "activity",
  "flesh-and-blood.damage.typed": "activity",
  "flesh-and-blood.damage.with-source": "activity",
  "flesh-and-blood.damage.with-source.typed": "activity",
  "flesh-and-blood.prevent": "activity",
  "flesh-and-blood.wager": "activity",
  "flesh-and-blood.wager.win": "activity",
  "flesh-and-blood.wager.loss": "activity",
  "flesh-and-blood.clash.outcome": "activity",
  "flesh-and-blood.clash.win": "activity",
  "flesh-and-blood.clash.tie": "activity",
  "flesh-and-blood.roll": "activity",
  "flesh-and-blood.cost-life": "detail",
  "flesh-and-blood.cost-chi": "detail",
  "flesh-and-blood.assets.granted": "activity",
  "flesh-and-blood.assets.granted.action-points": "activity",
  "flesh-and-blood.assets.granted.chi": "activity",
  "flesh-and-blood.assets.granted.amp": "activity",
  "flesh-and-blood.gain-life": "activity",
  "flesh-and-blood.lose-life": "activity",
  "flesh-and-blood.lose-life.blood-debt": "activity",
  "flesh-and-blood.go-again": "activity",
  "flesh-and-blood.may-attack": "activity",
  "flesh-and-blood.crowd-cheers": "activity",
  "flesh-and-blood.crowd-boos": "activity",
  "flesh-and-blood.protect": "activity",
  "flesh-and-blood.counter-added": "activity",
  "flesh-and-blood.counter-removed": "activity",
  "flesh-and-blood.numeric-counter-added": "activity",
  "flesh-and-blood.numeric-counter-removed": "activity",
  "flesh-and-blood.gain-keyword": "activity",
  "flesh-and-blood.gave-keyword": "activity",
  "flesh-and-blood.gave-power": "activity",
  "flesh-and-blood.name-card": "activity",
  "flesh-and-blood.sharpen": "activity",
  "flesh-and-blood.modify-power": "activity",
  "flesh-and-blood.next-attack-power-bonus": "activity",
  "flesh-and-blood.next-attack-keyword": "activity",
  "flesh-and-blood.next-attack-of-keyword": "activity",
  "flesh-and-blood.next-attack-of-go-again": "activity",
  "flesh-and-blood.set-tapped": "activity",
  "flesh-and-blood.set-tapped.by-source": "activity",
  "flesh-and-blood.ability.triggered": "activity",
  "flesh-and-blood.ability.layer": "diagnostic",
  "flesh-and-blood.turn.started": "activity",
  "flesh-and-blood.game.ended": "outcome",
  "flesh-and-blood.decision.awaiting": "diagnostic",
  "flesh-and-blood.decision.private": "diagnostic",
  "flesh-and-blood.phase.start": "diagnostic",
};

// Deliberate compile-time tripwire. When FAB_LOG_KEYS grows, this fails until
// the author reviews the narrative classifier above and acknowledges the new
// key by updating the audited count.
const FAB_LOG_NARRATIVE_KEY_COUNT: 138 = FAB_LOG_KEYS.length;
void FAB_LOG_NARRATIVE_KEY_COUNT;

/**
 * Grammatical usage of an actor-id slot, driving label morphology in
 * projections ("You" subject vs "Your" possessive). Unlisted slots are
 * subjects.
 */
export type FabLogActorLabelUsage = "subject" | "possessive" | "possessive-lower";

/** Compile-time-valid `${key}::${slot}` references for the usage table. */
type FabLogActorSlotRef = {
  readonly [TKey in FabLogKey]: `${TKey}::${keyof FabLogMessageValuesByName[TKey] & string}`;
}[FabLogKey];

const FAB_LOG_ACTOR_SLOT_USAGES: Readonly<
  Partial<Record<FabLogActorSlotRef, FabLogActorLabelUsage>>
> = {
  "flesh-and-blood.enter-arena::playerId": "possessive",
  "flesh-and-blood.enter-arena.tapped::playerId": "possessive",
  "flesh-and-blood.leave-arena::playerId": "possessive",
  "flesh-and-blood.banish.hidden.by-source::playerId": "possessive",
  "flesh-and-blood.banish.hidden-identity.by-source::playerId": "possessive",
  "flesh-and-blood.name-gain-restricted::playerId": "possessive-lower",
  "flesh-and-blood.beat-chest::chestOwner": "possessive-lower",
};

/** Resolve the grammatical usage of one actor slot (default "subject"). */
export function fabLogActorSlotUsage(key: string, slot: string): FabLogActorLabelUsage {
  return FAB_LOG_ACTOR_SLOT_USAGES[`${key}::${slot}` as FabLogActorSlotRef] ?? "subject";
}

/** Any value name used by at least one registered log key. */
type FabLogValueName = {
  readonly [TKey in FabLogKey]: keyof FabLogMessageValuesByName[TKey] & string;
}[FabLogKey];

/**
 * Value names that interpolate seat ids — the actor slots. The engine owns
 * this classification so projections and audits never keep a hand copy: the
 * translation contract owns the vocabulary, `fabLogActorSlotUsage` owns the
 * morphology, and this set owns which slots are seat references. Membership
 * is compile-checked against the values map, so a value rename fails here
 * until the list follows.
 */
const FAB_LOG_ACTOR_VALUE_KEY_NAMES = [
  "actorId",
  "playerId",
  // Combat hero targets (`attack` / `combat.*`); object
  // targets carry display names, which value-matched labeling passes through.
  "targetName",
  "chestOwner",
  "firstPlayerId",
  "secondPlayerId",
  "winnerId",
  "protectedPlayerId",
  "turnPlayerId",
] as const satisfies readonly FabLogValueName[];

export const FAB_LOG_ACTOR_VALUE_KEYS: ReadonlySet<string> = new Set<string>(
  FAB_LOG_ACTOR_VALUE_KEY_NAMES,
);

export interface FabLogObjectReference {
  readonly instanceId: string;
  readonly canonicalId: string | null;
}

/**
 * Structural provenance for player-facing facts produced by the shared stack.
 * A command may resolve several layers, so this must live on each fact rather
 * than on the command receipt that happens to carry it.
 */
export type FabLogActivityReference =
  | {
      readonly kind: "stack-layer-opened";
      readonly stackWindowId: string;
      readonly layerId: string;
      /** Player who controls the causal layer, independent of the command that advances it. */
      readonly controllerId: string;
      /** Physical source identity retained while the layer changes zones. */
      readonly sourceInstanceId: string;
      readonly respondsToLayerId: string | null;
      readonly stackOrdinal: number;
    }
  | {
      readonly kind: "stack-layer-event";
      readonly layerId: string;
      /** Player who controlled the causal layer when this fact was emitted. */
      readonly controllerId: string;
      /** Physical source identity when the layer has a card or permanent source. */
      readonly sourceInstanceId: string | null;
    }
  | {
      readonly kind: "stack-window-event";
      readonly stackWindowId: string;
    };

/**
 * A single derived player-facing fact. Facts without `visibleTo` render into
 * the public message list; facts with `visibleTo` render only into the named
 * players' private appendix on the same canonical log record.
 */
export type FabLogFact = {
  readonly [TKey in FabLogKey]: {
    readonly key: TKey;
    readonly values: FabLogMessageValuesByName[TKey];
    readonly category: (typeof FAB_LOG_KEY_CATEGORIES)[TKey];
    /** Exact object identities keyed by the value slot rendered in the message. */
    readonly objectRefs?: Readonly<
      Partial<Record<keyof FabLogMessageValuesByName[TKey] & string, FabLogObjectReference>>
    >;
    /** Exact stack activity that owns this fact, independent of command batching. */
    readonly activityRef?: FabLogActivityReference;
    /** Event-specific override for keys whose narrative role depends on provenance. */
    readonly narrativeRole?: FabLogNarrativeRole;
    /** Game-native role for a card or ability used during a combat chain. */
    readonly combatRole?: import("../moves.ts").FabCombatLogRole;
    /** Evaluated combat values captured at the event boundary. */
    readonly combatState?: import("../moves.ts").FabCombatLogState;
    /** When set, the fact is private detail visible only to these players. */
    readonly visibleTo?: readonly string[];
  };
}[FabLogKey];

/**
 * Optional state-dependent resolution passed to fact emitters. Emitters must
 * degrade gracefully when a context is unavailable (kernel receipt path) by
 * falling back to generic wording.
 */
export interface FabLogContext {
  /** Resolve an object instance id to its display name; null when unknown. */
  readonly displayNameForInstanceId: (instanceId: string) => string | null;
  /** Resolve a face-up public object only, so logs never disclose private targets. */
  readonly publicDisplayNameForInstanceId?: (instanceId: string) => string | null;
  /** Resolve the sole opposing seat in the engine's 1v1 product scope. */
  readonly opponentIdForPlayerId?: (playerId: string) => string | null;
  /** Resolve a newly opened layer for this source and layer kind. */
  readonly stackLayerForInstanceId?: (
    instanceId: string,
    layerKind: "card" | "activated",
  ) => Extract<FabLogActivityReference, { readonly kind: "stack-layer-opened" }> | null;
  /** Resolve a newly declared triggered layer by its authoritative layer id. */
  readonly stackLayerForLayerId?: (
    layerId: string,
  ) => Extract<FabLogActivityReference, { readonly kind: "stack-layer-opened" }> | null;
}

/**
 * Canonical game-end reason tokens carried on `lose-game` events and persisted
 * as `endReason`. Tokens classify the ending for automation (termination
 * classification, platform persistence); player-facing wording is derived
 * from them at the log and presentation boundaries.
 */
const FAB_GAME_END_REASON_LABELS: Readonly<Record<string, string>> = {
  concede: "by concession",
  life: "reduced to 0 life",
  effect: "to a card effect",
};

/** Player-facing wording for a game-end reason; unknown reasons pass through. */
export function fabGameEndReasonLabel(reason: string): string {
  return FAB_GAME_END_REASON_LABELS[reason] ?? reason;
}
