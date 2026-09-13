import type { GrandArchiveEventId } from "../game/identity.ts";

export type GrandArchiveLogValue = string | number | boolean;
export type GrandArchiveLogCategory = "action" | "combat" | "ability" | "rules" | "system";

export const GRAND_ARCHIVE_LOG_KEYS = [
  "grand-archive.card.moved",
  "grand-archive.card.moved.hidden",
  "grand-archive.card.revealed",
  "grand-archive.cards.looked-at",
  "grand-archive.cards.looked-at.private",
  "grand-archive.cards.searched",
  "grand-archive.cards.searched.private",
  "grand-archive.cards.recollected",
  "grand-archive.cards.recollected.private",
  "grand-archive.zone.reordered",
  "grand-archive.tokens.summoned",
  "grand-archive.object.face-up",
  "grand-archive.object.face-down",
  "grand-archive.object.transformed",
  "grand-archive.object.controller-changed",
  "grand-archive.champion.leveled-up",
  "grand-archive.champion.deleveled",
  "grand-archive.boon.gained",
  "grand-archive.mastery.changed",
  "grand-archive.mastery.counter-changed",
  "grand-archive.damage.marked",
  "grand-archive.damage.prevented",
  "grand-archive.damage.removed",
  "grand-archive.counter.changed",
  "grand-archive.combat.started",
  "grand-archive.combat.ended",
  "grand-archive.stack.added",
  "grand-archive.stack.fizzled",
  "grand-archive.stack.negated",
  "grand-archive.stack.resolved",
  "grand-archive.keyword-action",
  "grand-archive.random.roll",
  "grand-archive.phase.skip",
  "grand-archive.opportunity.passed",
  "grand-archive.phase.started",
  "grand-archive.turn.started",
  "grand-archive.player.lost",
  "grand-archive.match.finished",
  "grand-archive.decision.awaiting",
  "grand-archive.decision.private",
] as const;

export type GrandArchiveLogKey = (typeof GRAND_ARCHIVE_LOG_KEYS)[number];

export interface GrandArchiveLogValuesByKey {
  readonly "grand-archive.card.moved": {
    readonly playerId: string;
    readonly cardName: string;
    readonly from: string;
    readonly to: string;
  };
  readonly "grand-archive.card.moved.hidden": {
    readonly playerId: string;
    readonly from: string;
    readonly to: string;
  };
  readonly "grand-archive.card.revealed": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "grand-archive.cards.looked-at": {
    readonly playerId: string;
    readonly count: number;
  };
  readonly "grand-archive.cards.looked-at.private": {
    readonly playerId: string;
    readonly cardNames: string;
  };
  readonly "grand-archive.cards.searched": {
    readonly playerId: string;
    readonly count: number;
  };
  readonly "grand-archive.cards.searched.private": {
    readonly playerId: string;
    readonly cardNames: string;
  };
  readonly "grand-archive.cards.recollected": {
    readonly playerId: string;
    readonly count: number;
  };
  readonly "grand-archive.cards.recollected.private": {
    readonly playerId: string;
    readonly cardNames: string;
  };
  readonly "grand-archive.zone.reordered": {
    readonly playerId: string;
    readonly zone: string;
    readonly count: number;
  };
  readonly "grand-archive.tokens.summoned": {
    readonly playerId: string;
    readonly cardNames: string;
  };
  readonly "grand-archive.object.face-up": { readonly cardName: string };
  readonly "grand-archive.object.face-down": Record<string, never>;
  readonly "grand-archive.object.transformed": { readonly cardName: string };
  readonly "grand-archive.object.controller-changed": {
    readonly cardName: string;
    readonly playerId: string;
  };
  readonly "grand-archive.champion.leveled-up": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "grand-archive.champion.deleveled": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "grand-archive.boon.gained": {
    readonly playerId: string;
    readonly cardName: string;
  };
  readonly "grand-archive.mastery.changed": {
    readonly playerId: string;
    readonly mastery: string;
  };
  readonly "grand-archive.mastery.counter-changed": {
    readonly playerId: string;
    readonly mastery: string;
    readonly counter: string;
    readonly delta: number;
  };
  readonly "grand-archive.damage.marked": {
    readonly cardName: string;
    readonly amount: number;
  };
  readonly "grand-archive.damage.prevented": {
    readonly cardName: string;
    readonly amount: number;
  };
  readonly "grand-archive.damage.removed": {
    readonly cardName: string;
    readonly amount: number;
  };
  readonly "grand-archive.counter.changed": {
    readonly cardName: string;
    readonly counter: string;
    readonly delta: number;
  };
  readonly "grand-archive.combat.started": {
    readonly playerId: string;
    readonly attackerName: string;
    readonly targetNames: string;
  };
  readonly "grand-archive.combat.ended": Record<string, never>;
  readonly "grand-archive.stack.added": {
    readonly playerId: string;
    readonly sourceName: string;
  };
  readonly "grand-archive.stack.fizzled": {
    readonly sourceName: string;
    readonly reason: string;
  };
  readonly "grand-archive.stack.negated": { readonly sourceName: string };
  readonly "grand-archive.stack.resolved": Record<string, never>;
  readonly "grand-archive.keyword-action": {
    readonly playerId: string;
    readonly action: string;
  };
  readonly "grand-archive.random.roll": {
    readonly playerId: string;
    readonly sides: number;
    readonly results: string;
    readonly total: number;
  };
  readonly "grand-archive.phase.skip": {
    readonly playerId: string;
    readonly phase: string;
    readonly action: "added" | "consumed";
  };
  readonly "grand-archive.opportunity.passed": { readonly playerId: string };
  readonly "grand-archive.phase.started": {
    readonly playerId: string;
    readonly phase: string;
  };
  readonly "grand-archive.turn.started": {
    readonly playerId: string;
    readonly turnNumber: number;
  };
  readonly "grand-archive.player.lost": {
    readonly playerId: string;
    readonly reason: string;
  };
  readonly "grand-archive.match.finished": { readonly winnerIds: string };
  readonly "grand-archive.decision.awaiting": { readonly playerId: string };
  readonly "grand-archive.decision.private": {
    readonly playerId: string;
    readonly label: string;
  };
}

export const GRAND_ARCHIVE_LOG_CATEGORIES = {
  "grand-archive.card.moved": "action",
  "grand-archive.card.moved.hidden": "action",
  "grand-archive.card.revealed": "action",
  "grand-archive.cards.looked-at": "action",
  "grand-archive.cards.looked-at.private": "action",
  "grand-archive.cards.searched": "action",
  "grand-archive.cards.searched.private": "action",
  "grand-archive.cards.recollected": "action",
  "grand-archive.cards.recollected.private": "action",
  "grand-archive.zone.reordered": "rules",
  "grand-archive.tokens.summoned": "action",
  "grand-archive.object.face-up": "action",
  "grand-archive.object.face-down": "action",
  "grand-archive.object.transformed": "action",
  "grand-archive.object.controller-changed": "rules",
  "grand-archive.champion.leveled-up": "action",
  "grand-archive.champion.deleveled": "action",
  "grand-archive.boon.gained": "action",
  "grand-archive.mastery.changed": "rules",
  "grand-archive.mastery.counter-changed": "rules",
  "grand-archive.damage.marked": "combat",
  "grand-archive.damage.prevented": "combat",
  "grand-archive.damage.removed": "combat",
  "grand-archive.counter.changed": "rules",
  "grand-archive.combat.started": "combat",
  "grand-archive.combat.ended": "combat",
  "grand-archive.stack.added": "ability",
  "grand-archive.stack.fizzled": "ability",
  "grand-archive.stack.negated": "ability",
  "grand-archive.stack.resolved": "ability",
  "grand-archive.keyword-action": "action",
  "grand-archive.random.roll": "rules",
  "grand-archive.phase.skip": "rules",
  "grand-archive.opportunity.passed": "rules",
  "grand-archive.phase.started": "system",
  "grand-archive.turn.started": "system",
  "grand-archive.player.lost": "system",
  "grand-archive.match.finished": "system",
  "grand-archive.decision.awaiting": "system",
  "grand-archive.decision.private": "system",
} as const satisfies Record<GrandArchiveLogKey, GrandArchiveLogCategory>;

export const GRAND_ARCHIVE_LOG_TEMPLATES = {
  "grand-archive.card.moved": "{playerId} moved {cardName} from {from} to {to}.",
  "grand-archive.card.moved.hidden": "{playerId} moved a card from {from} to {to}.",
  "grand-archive.card.revealed": "{playerId} revealed {cardName}.",
  "grand-archive.cards.looked-at": "{playerId} looked at {count} card(s).",
  "grand-archive.cards.looked-at.private": "{playerId} looked at {cardNames}.",
  "grand-archive.cards.searched": "{playerId} searched {count} card(s).",
  "grand-archive.cards.searched.private": "{playerId} searched {cardNames}.",
  "grand-archive.cards.recollected": "{playerId} recollected {count} card(s).",
  "grand-archive.cards.recollected.private": "{playerId} recollected {cardNames}.",
  "grand-archive.zone.reordered": "{playerId} reordered {count} card(s) in {zone}.",
  "grand-archive.tokens.summoned": "{playerId} summoned {cardNames}.",
  "grand-archive.object.face-up": "{cardName} was turned face up.",
  "grand-archive.object.face-down": "A card was turned face down.",
  "grand-archive.object.transformed": "{cardName} transformed.",
  "grand-archive.object.controller-changed": "{playerId} gained control of {cardName}.",
  "grand-archive.champion.leveled-up": "{playerId} leveled up into {cardName}.",
  "grand-archive.champion.deleveled": "{playerId} deleveled from {cardName}.",
  "grand-archive.boon.gained": "{playerId} gained {cardName} as a Boon.",
  "grand-archive.mastery.changed": "{playerId}'s mastery became {mastery}.",
  "grand-archive.mastery.counter-changed":
    "{playerId}'s {mastery} {counter} counters changed by {delta}.",
  "grand-archive.damage.marked": "{cardName} was dealt {amount} damage.",
  "grand-archive.damage.prevented": "{amount} damage to {cardName} was prevented.",
  "grand-archive.damage.removed": "{amount} damage was removed from {cardName}.",
  "grand-archive.counter.changed": "{cardName}'s {counter} counters changed by {delta}.",
  "grand-archive.combat.started": "{playerId} attacked {targetNames} with {attackerName}.",
  "grand-archive.combat.ended": "Combat ended.",
  "grand-archive.stack.added": "{playerId} added {sourceName} to the Effects Stack.",
  "grand-archive.stack.fizzled": "{sourceName} fizzled: {reason}.",
  "grand-archive.stack.negated": "{sourceName} was negated.",
  "grand-archive.stack.resolved": "The top item of the Effects Stack resolved.",
  "grand-archive.keyword-action": "{playerId} performed {action}.",
  "grand-archive.random.roll": "{playerId} rolled {results} on {sides}-sided dice (total {total}).",
  "grand-archive.phase.skip": "{playerId}'s {phase} phase skip was {action}.",
  "grand-archive.opportunity.passed": "{playerId} passed Opportunity.",
  "grand-archive.phase.started": "{playerId} entered the {phase} phase.",
  "grand-archive.turn.started": "{playerId} started turn {turnNumber}.",
  "grand-archive.player.lost": "{playerId} lost the game: {reason}.",
  "grand-archive.match.finished": "The match ended. Winner(s): {winnerIds}.",
  "grand-archive.decision.awaiting": "{playerId} is making a choice.",
  "grand-archive.decision.private": "{playerId} must choose: {label}.",
} as const satisfies Record<GrandArchiveLogKey, string>;

export const GRAND_ARCHIVE_LOG_VALUE_KEYS = {
  "grand-archive.card.moved": ["playerId", "cardName", "from", "to"],
  "grand-archive.card.moved.hidden": ["playerId", "from", "to"],
  "grand-archive.card.revealed": ["playerId", "cardName"],
  "grand-archive.cards.looked-at": ["playerId", "count"],
  "grand-archive.cards.looked-at.private": ["playerId", "cardNames"],
  "grand-archive.cards.searched": ["playerId", "count"],
  "grand-archive.cards.searched.private": ["playerId", "cardNames"],
  "grand-archive.cards.recollected": ["playerId", "count"],
  "grand-archive.cards.recollected.private": ["playerId", "cardNames"],
  "grand-archive.zone.reordered": ["playerId", "zone", "count"],
  "grand-archive.tokens.summoned": ["playerId", "cardNames"],
  "grand-archive.object.face-up": ["cardName"],
  "grand-archive.object.face-down": [],
  "grand-archive.object.transformed": ["cardName"],
  "grand-archive.object.controller-changed": ["cardName", "playerId"],
  "grand-archive.champion.leveled-up": ["playerId", "cardName"],
  "grand-archive.champion.deleveled": ["playerId", "cardName"],
  "grand-archive.boon.gained": ["playerId", "cardName"],
  "grand-archive.mastery.changed": ["playerId", "mastery"],
  "grand-archive.mastery.counter-changed": ["playerId", "mastery", "counter", "delta"],
  "grand-archive.damage.marked": ["cardName", "amount"],
  "grand-archive.damage.prevented": ["cardName", "amount"],
  "grand-archive.damage.removed": ["cardName", "amount"],
  "grand-archive.counter.changed": ["cardName", "counter", "delta"],
  "grand-archive.combat.started": ["playerId", "attackerName", "targetNames"],
  "grand-archive.combat.ended": [],
  "grand-archive.stack.added": ["playerId", "sourceName"],
  "grand-archive.stack.fizzled": ["sourceName", "reason"],
  "grand-archive.stack.negated": ["sourceName"],
  "grand-archive.stack.resolved": [],
  "grand-archive.keyword-action": ["playerId", "action"],
  "grand-archive.random.roll": ["playerId", "sides", "results", "total"],
  "grand-archive.phase.skip": ["playerId", "phase", "action"],
  "grand-archive.opportunity.passed": ["playerId"],
  "grand-archive.phase.started": ["playerId", "phase"],
  "grand-archive.turn.started": ["playerId", "turnNumber"],
  "grand-archive.player.lost": ["playerId", "reason"],
  "grand-archive.match.finished": ["winnerIds"],
  "grand-archive.decision.awaiting": ["playerId"],
  "grand-archive.decision.private": ["playerId", "label"],
} as const satisfies {
  readonly [TKey in GrandArchiveLogKey]: readonly (keyof GrandArchiveLogValuesByKey[TKey] &
    string)[];
};

function uniqueSorted(values: readonly string[]): readonly string[] {
  return [...new Set(values)].sort((left, right) => left.localeCompare(right));
}

function templatePlaceholders(template: string): readonly string[] {
  return uniqueSorted([...template.matchAll(/\{([a-zA-Z0-9_]+)\}/g)].map((match) => match[1]!));
}

/** Returns every registry/template placeholder mismatch without throwing early. */
export function collectGrandArchiveLogContractIssues(): readonly string[] {
  const issues: string[] = [];
  for (const key of GRAND_ARCHIVE_LOG_KEYS) {
    const expected = uniqueSorted(GRAND_ARCHIVE_LOG_VALUE_KEYS[key]);
    const actual = templatePlaceholders(GRAND_ARCHIVE_LOG_TEMPLATES[key]);
    const missing = expected.filter((value) => !actual.includes(value));
    const extra = actual.filter((value) => !expected.includes(value));
    if (missing.length > 0) issues.push(`${key}: missing [${missing.join(", ")}]`);
    if (extra.length > 0) issues.push(`${key}: extra [${extra.join(", ")}]`);
  }
  return issues;
}

export interface GrandArchiveLogMessageFor<TKey extends GrandArchiveLogKey> {
  readonly eventId: GrandArchiveEventId;
  readonly stateVersion: number;
  readonly key: TKey;
  readonly category: (typeof GRAND_ARCHIVE_LOG_CATEGORIES)[TKey];
  readonly values: GrandArchiveLogValuesByKey[TKey];
  readonly defaultMessage: string;
}

export type GrandArchiveLogMessage = {
  readonly [TKey in GrandArchiveLogKey]: GrandArchiveLogMessageFor<TKey>;
}[GrandArchiveLogKey];

const TEMPLATE_TOKEN_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

export function renderGrandArchiveLogTemplate<TKey extends GrandArchiveLogKey>(
  key: TKey,
  values: GrandArchiveLogValuesByKey[TKey],
): string {
  return GRAND_ARCHIVE_LOG_TEMPLATES[key].replaceAll(
    TEMPLATE_TOKEN_PATTERN,
    (_match, valueKey: string) =>
      String((values as Readonly<Record<string, GrandArchiveLogValue>>)[valueKey] ?? ""),
  );
}

export function createGrandArchiveLogMessage<TKey extends GrandArchiveLogKey>(
  eventId: GrandArchiveEventId,
  stateVersion: number,
  key: TKey,
  values: GrandArchiveLogValuesByKey[TKey],
): GrandArchiveLogMessageFor<TKey> {
  return {
    eventId,
    stateVersion,
    key,
    category: GRAND_ARCHIVE_LOG_CATEGORIES[key],
    values,
    defaultMessage: renderGrandArchiveLogTemplate(key, values),
  };
}
