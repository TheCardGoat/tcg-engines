/**
 * FAB Log Translation Contract
 *
 * Enforces:
 * - Every FAB log key exists in every required locale file.
 * - Every locale string uses the expected interpolation placeholders.
 */

import type { FabLogKey, FabLogMessageValuesByName } from "./messages.ts";

import en from "../../messages/en.json" with { type: "json" };

export const REQUIRED_FAB_LOG_LOCALES = ["en"] as const;

export type FabLogLocale = (typeof REQUIRED_FAB_LOG_LOCALES)[number];

type FabLogCatalog = Record<FabLogKey, string>;

const EN_MESSAGES = en as unknown as FabLogCatalog;

export const FAB_LOG_TRANSLATIONS_BY_LOCALE = {
  en: EN_MESSAGES,
} as const satisfies Record<FabLogLocale, FabLogCatalog>;

const PLACEHOLDER_PATTERN = /\{([a-zA-Z0-9_]+)\}/g;

/**
 * Placeholder names each key interpolates. `satisfies` correlates every entry
 * with the typed values map at compile time, so a value interface rename
 * fails here until this list follows.
 */
export const FAB_LOG_TRANSLATION_VALUE_KEYS = {
  "flesh-and-blood.command.begin-play": ["actorId"],
  "flesh-and-blood.command.set-optional-trigger-automation": ["actorId", "cardName"],
  "flesh-and-blood.command.set-automation-preferences": ["actorId"],
  "flesh-and-blood.command.play-and-skip-hold-enabled": ["actorId", "cardName"],
  "flesh-and-blood.command.play-and-skip-hold-disabled": ["actorId", "cardName"],
  "flesh-and-blood.command.opponent-trigger-auto-yield-enabled": ["actorId", "cardName"],
  "flesh-and-blood.command.opponent-trigger-auto-yield-disabled": ["actorId", "cardName"],
  "flesh-and-blood.command.instant-auto-yield-enabled": ["actorId", "cardName"],
  "flesh-and-blood.command.instant-auto-yield-disabled": ["actorId", "cardName"],
  "flesh-and-blood.command.arm-priority-hold": ["actorId"],
  "flesh-and-blood.command.answer-decision": ["actorId"],
  "flesh-and-blood.command.activate": ["actorId"],
  "flesh-and-blood.command.defend": ["actorId"],
  "flesh-and-blood.command.pass": ["actorId"],
  "flesh-and-blood.command.end-turn": ["actorId"],
  "flesh-and-blood.command.concede": ["actorId"],
  "flesh-and-blood.trigger-automation.auto-pass": ["actorId", "cardName"],
  "flesh-and-blood.priority-automation.auto-pass": ["actorId"],
  "flesh-and-blood.decision-automation.auto-order": ["actorId", "decisionKind"],
  "flesh-and-blood.decision-automation.auto-target": ["actorId"],
  "flesh-and-blood.decision-automation.auto-decline": ["actorId"],

  "flesh-and-blood.play": ["actorId", "cardName"],
  "flesh-and-blood.play.from-zone": ["actorId", "cardName", "from"],
  "flesh-and-blood.bind": ["auraName", "hostName"],
  "flesh-and-blood.modal.modes-chosen": [
    "actorId",
    "cardName",
    "modeCount",
    "modePlural",
    "modeText",
  ],
  "flesh-and-blood.activate": ["actorId", "cardName"],
  "flesh-and-blood.activate.targeting": ["actorId", "cardName", "targetName"],
  "flesh-and-blood.pitch": ["playerId", "cardName", "resources"],
  "flesh-and-blood.defend": ["actorId", "cardName"],

  "flesh-and-blood.draw": ["playerId"],
  "flesh-and-blood.draw.cards": ["playerId", "count"],
  "flesh-and-blood.draw.private": ["playerId", "cardNames"],
  "flesh-and-blood.draw.replaced": ["playerId"],
  "flesh-and-blood.draw.replaced.cards": ["playerId", "count"],

  "flesh-and-blood.search": ["playerId"],
  "flesh-and-blood.search.found": ["playerId", "cardName"],
  "flesh-and-blood.look": ["playerId"],
  "flesh-and-blood.look.private": ["playerId", "cardName"],
  "flesh-and-blood.opt": ["playerId"],
  "flesh-and-blood.opt.cards": ["playerId", "topCount", "topPlural", "bottomCount", "bottomPlural"],
  "flesh-and-blood.opt.private": ["playerId", "topNames", "bottomNames"],
  "flesh-and-blood.reveal": ["playerId", "cardName"],

  "flesh-and-blood.discard": ["playerId", "cardName"],
  "flesh-and-blood.discard.random": ["playerId", "cardName"],
  "flesh-and-blood.banish": ["playerId", "cardName"],
  "flesh-and-blood.banish.hidden": ["playerId"],
  "flesh-and-blood.banish.hidden.by-source": ["playerId", "sourceName", "from"],
  "flesh-and-blood.banish.hidden-identity": ["playerId"],
  "flesh-and-blood.banish.hidden-identity.by-source": ["playerId", "sourceName", "from"],
  "flesh-and-blood.deck-bottom": ["playerId", "from"],
  "flesh-and-blood.deck-bottom.private": ["playerId", "cardName", "from"],
  "flesh-and-blood.deck-top": ["playerId", "cardName", "from"],
  "flesh-and-blood.destroy": ["cardName"],
  "flesh-and-blood.destroy.by-source": ["sourceName", "cardName"],
  "flesh-and-blood.dies": ["cardName"],
  "flesh-and-blood.put-into-graveyard": ["cardName"],
  "flesh-and-blood.enter-arena": ["playerId", "cardName"],
  "flesh-and-blood.enter-arena.tapped": ["playerId", "cardName"],
  "flesh-and-blood.leave-arena": ["playerId", "cardName"],
  "flesh-and-blood.move-zone": ["playerId", "cardName", "from", "to"],
  "flesh-and-blood.move-zone.hidden": ["playerId", "from", "to"],
  "flesh-and-blood.shuffle-zone": ["playerId", "zone"],
  "flesh-and-blood.turn-face-up": ["playerId", "cardName"],
  "flesh-and-blood.turn-face-down": ["playerId", "cardName"],
  "flesh-and-blood.equip": ["playerId", "cardName"],
  "flesh-and-blood.create": ["playerId", "cardName"],
  "flesh-and-blood.create.by-source": ["sourceName", "playerId", "cardName"],
  "flesh-and-blood.become": ["cardName", "previousName"],
  "flesh-and-blood.gain-name": ["cardName", "gainedName", "sourceName"],
  "flesh-and-blood.lose-names": ["cardName", "sourceName"],
  "flesh-and-blood.name-gain-restricted": ["sourceName", "playerId"],
  "flesh-and-blood.transform": ["cardName", "intoName"],
  "flesh-and-blood.boost": ["actorId", "cardName"],
  "flesh-and-blood.boost.banish": ["actorId", "cardName", "banishedName"],
  "flesh-and-blood.charge": ["actorId", "cardName", "chargedName"],
  "flesh-and-blood.fuse": ["actorId", "cardName", "revealedNames"],
  "flesh-and-blood.fragment": ["actorId", "cardName"],
  "flesh-and-blood.usurp": ["actorId", "cardName", "usurpedName"],
  "flesh-and-blood.crank": ["actorId", "cardName"],
  "flesh-and-blood.transcend": ["actorId", "cardName"],
  "flesh-and-blood.complete-contract": ["actorId", "cardName"],
  "flesh-and-blood.beat-chest": ["actorId", "chestOwner", "cardNames"],
  "flesh-and-blood.awaken": ["playerId", "cardName"],
  "flesh-and-blood.change-active-face": ["cardName", "faceId"],

  "flesh-and-blood.attack": ["actorId", "cardName", "targetName"],
  "flesh-and-blood.attack.by-source": ["sourceName", "cardName", "targetName"],
  "flesh-and-blood.combat.hit": ["cardName", "targetName", "damage"],
  "flesh-and-blood.combat.blocked": ["cardName", "targetName"],
  "flesh-and-blood.combat.missed": ["cardName", "targetName"],
  "flesh-and-blood.combat.miss": ["cardName", "targetName", "result"],
  "flesh-and-blood.combat.chain-close": [],
  "flesh-and-blood.damage": ["playerId", "amount"],
  "flesh-and-blood.damage.typed": ["playerId", "amount", "damageType"],
  "flesh-and-blood.damage.with-source": ["playerId", "amount", "sourceName"],
  "flesh-and-blood.damage.with-source.typed": ["playerId", "amount", "damageType", "sourceName"],
  "flesh-and-blood.prevent": ["playerId", "amount", "sourceName"],

  "flesh-and-blood.wager": ["actorId", "cardName"],
  "flesh-and-blood.wager.win": ["playerId", "cardName"],
  "flesh-and-blood.wager.loss": ["playerId", "cardName"],
  "flesh-and-blood.clash.outcome": [
    "firstPlayerId",
    "firstCardName",
    "firstPowerLabel",
    "secondPlayerId",
    "secondCardName",
    "secondPowerLabel",
  ],
  "flesh-and-blood.clash.win": ["winnerId", "winnerPowerLabel", "loserPowerLabel"],
  "flesh-and-blood.clash.tie": ["firstPowerLabel", "secondPowerLabel"],
  "flesh-and-blood.roll": ["playerId", "sides", "result"],

  "flesh-and-blood.cost-life": ["playerId", "life"],
  "flesh-and-blood.cost-chi": ["playerId", "chi"],
  "flesh-and-blood.assets.granted": ["playerId", "resources", "plural", "cardName"],
  "flesh-and-blood.assets.granted.action-points": [
    "playerId",
    "actionPoints",
    "plural",
    "cardName",
  ],
  "flesh-and-blood.assets.granted.chi": ["playerId", "chi", "cardName"],
  "flesh-and-blood.assets.granted.amp": ["playerId", "amp", "cardName"],
  "flesh-and-blood.gain-life": ["playerId", "amount"],
  "flesh-and-blood.lose-life": ["playerId", "amount"],
  "flesh-and-blood.lose-life.blood-debt": ["playerId", "amount", "sourceName"],
  "flesh-and-blood.go-again": ["cardName"],
  "flesh-and-blood.may-attack": ["sourceName", "cardName", "timesLabel"],
  "flesh-and-blood.crowd-cheers": ["playerId"],
  "flesh-and-blood.crowd-boos": ["playerId"],
  "flesh-and-blood.protect": ["playerId", "protectedPlayerId"],
  "flesh-and-blood.counter-added": ["cardName", "counter", "amount", "plural"],
  "flesh-and-blood.counter-removed": ["cardName", "counter", "amount", "plural"],
  "flesh-and-blood.numeric-counter-added": ["cardName", "counter", "count", "plural"],
  "flesh-and-blood.numeric-counter-removed": ["cardName", "counter", "count", "plural"],
  "flesh-and-blood.gain-keyword": ["cardName", "keyword"],
  "flesh-and-blood.gave-keyword": ["sourceName", "cardName", "keyword"],
  "flesh-and-blood.gave-power": ["sourceName", "cardName", "amount"],
  "flesh-and-blood.marked": ["sourceName", "playerId"],
  "flesh-and-blood.name-card": ["playerId", "cardName"],
  "flesh-and-blood.sharpen": ["playerId", "cardName", "count", "plural"],
  "flesh-and-blood.modify-power": ["cardName", "from", "to"],
  "flesh-and-blood.next-attack-power-bonus": ["sourceName", "amount"],
  "flesh-and-blood.next-attack-keyword": ["sourceName", "keyword"],
  "flesh-and-blood.next-attack-of-keyword": ["sourceName", "cardName", "keyword"],
  "flesh-and-blood.next-attack-of-go-again": ["sourceName", "cardName", "playerId"],
  "flesh-and-blood.set-tapped": ["cardName", "state"],
  "flesh-and-blood.set-tapped.by-source": ["sourceName", "cardName"],

  "flesh-and-blood.ability.triggered": ["cardName"],
  "flesh-and-blood.ability.layer": ["cardName"],

  "flesh-and-blood.turn.started": ["turnNumber"],
  "flesh-and-blood.game.ended": ["playerId", "reason"],
  "flesh-and-blood.decision.awaiting": ["actorId"],
  "flesh-and-blood.decision.chosen": ["actorId", "choice"],
  "flesh-and-blood.decision.private": ["label"],
  "flesh-and-blood.phase.start": ["turnPlayerId", "phase"],
} as const satisfies {
  readonly [TKey in FabLogKey]: readonly (keyof FabLogMessageValuesByName[TKey] & string)[];
};

function uniqueSorted(values: readonly string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

function extractPlaceholders(message: string): string[] {
  return uniqueSorted([...message.matchAll(PLACEHOLDER_PATTERN)].map((match) => match[1]!));
}

export function collectFabLogTranslationIssues(): string[] {
  const issues: string[] = [];
  const logKeys = Object.keys(FAB_LOG_TRANSLATION_VALUE_KEYS) as FabLogKey[];

  for (const locale of REQUIRED_FAB_LOG_LOCALES) {
    const catalog = FAB_LOG_TRANSLATIONS_BY_LOCALE[locale];

    for (const key of logKeys) {
      const message = catalog[key];
      if (message === undefined) {
        issues.push(`[${locale}] ${key}: missing from locale file`);
        continue;
      }

      const expectedPlaceholders = uniqueSorted([...FAB_LOG_TRANSLATION_VALUE_KEYS[key]!]);
      const actualPlaceholders = extractPlaceholders(message);

      const missing = expectedPlaceholders.filter((p) => !actualPlaceholders.includes(p));
      const extra = actualPlaceholders.filter((p) => !expectedPlaceholders.includes(p));

      if (missing.length > 0) {
        issues.push(`[${locale}] ${key}: missing placeholders [${missing.join(", ")}]`);
      }
      if (extra.length > 0) {
        issues.push(`[${locale}] ${key}: extra placeholders [${extra.join(", ")}]`);
      }
    }
  }

  return issues;
}

export function assertFabLogTranslationContract(): void {
  const issues = collectFabLogTranslationIssues();
  if (issues.length === 0) return;

  const message = [
    "FAB log translation contract failed:",
    ...issues.map((issue) => `- ${issue}`),
  ].join("\n");

  throw new Error(message);
}
