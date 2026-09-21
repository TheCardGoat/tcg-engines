/**
 * Machine-checkable Grade A rubric for One Piece card behavior proofs.
 *
 * Grade A (primary proof for a non-vanilla ability card):
 * 1. Active command-driven proof (not pure validateCardAbility test.skip).
 * 2. Public player commands appropriate to the card (play / activate / attack /
 *    endTurn / attachDon as needed).
 * 3. Resolves at least one player choice when the file uses prompts, OR is a
 *    permanent/continuous-only path (fixture + turn handoff + multi-assert).
 * 4. Asserts player-visible outcomes via getView (or projected decisions).
 * 5. Includes at least one of: a second active test, explicit optional decline
 *    (decline / optionId "no"), negative/illegal path, or a thorough multi-assert
 *    happy path (≥4 expect calls). Do not mass-stamp a second theatrical test.
 * 6. When the primary already exercises an optional accept path (optionId "yes" /
 *    accept / returnDon payment) and the card has structured optional/returnDon,
 *    it MUST also include an explicit **meaningful** decline path: trigger-matched
 *    subject-bound open, optionId "no", and strict non-effect asserts — never
 *    try/catch no-op or wrong-subject playCard theater.
 */

import { readdirSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import type { OPCard } from "@tcg/op-types";

export type GradeAResult = {
  ok: boolean;
  grade: "A" | "B" | "C" | "D" | "F" | "SKIP";
  reasons: string[];
  path: string;
  cardId?: string;
};

const ENGINE_ROOT = join(fileURLToPath(new URL("../..", import.meta.url)));
export const TESTS_CARDS_ROOT = join(ENGINE_ROOT, "tests/cards");
export const SRC_CARDS_ROOT = join(ENGINE_ROOT, "src/cards");
export const CARDS_ROOT = join(ENGINE_ROOT, "../cards/src/cards");

const HARNESS_ONLY = new Set([
  "behavior-coverage-gate.test.ts",
  "grade-a-coverage.test.ts",
  "ergonomic-helpers.test.ts",
  "vanilla-character-catalog.test.ts",
  "vanilla-character-playthrough.test.ts",
  "effect-damage-order.test.ts",
  "general-faq.test.ts",
  "blocker-faq.test.ts",
  "potential-card-actions.test.ts",
  "review-regressions.test.ts",
  "review-on-block-regressions.test.ts",
  "review-don-activation-regressions.test.ts",
]);

const COMMAND_MARKERS = [
  "playCard(",
  "play(",
  "activateEffect(",
  "activateMain(",
  "declareAttack(",
  "attack(",
  "resolveDecision(",
  "choose(",
  "accept(",
  "decline(",
  "endTurn(",
  "attachDon(",
  "OnePieceTestEngine.create(",
  "OnePieceTestEngine.fromState(",
  "expectFailure(",
  "declineOptionalAfterPlay(",
  "declineOptionalOnAttack(",
  "declineOptionalEndOfTurn(",
  "declineOptionalOnActivate(",
  "declineOptionalOnOpponentPlay(",
  "declineOptionalOnRemoval(",
  "declineOptionalOnLifeTrigger(",
];

export function walkTestFiles(directory: string): string[] {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return walkTestFiles(path);
    return entry.isFile() && entry.name.endsWith(".test.ts") ? [path] : [];
  });
}

export function isCard(value: unknown): value is OPCard {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "cardType" in value &&
    typeof (value as OPCard).id === "string"
  );
}

function isBlank(text: string | undefined): boolean {
  return text === undefined || text.trim() === "" || /^(?:NULL|-)$/i.test(text.trim());
}

export function isVanilla(card: OPCard): boolean {
  if (card.cardType === "don") return true;
  const effect = card.effect ?? card.i18n?.en?.effect;
  const trigger = "trigger" in card ? (card as { trigger?: string }).trigger : undefined;
  return isBlank(effect) && isBlank(trigger) && !card.effects;
}

export function extractCardIds(text: string): Set<string> {
  const ids = new Set<string>();
  for (const match of text.matchAll(/\b([A-Z]{1,4}\d{0,2}-\d{3})(?:_[a-zA-Z0-9]+)?\b/g)) {
    ids.add(match[1]!.toUpperCase());
  }
  for (const match of text.matchAll(/\b([a-z]{1,4}\d{0,2}-\d{3})\b/g)) {
    ids.add(match[1]!.toUpperCase());
  }
  return ids;
}

export function isCommandDrivenProof(source: string): boolean {
  if (
    /validateCardAbility\s*\(/.test(source) &&
    !COMMAND_MARKERS.some((marker) => source.includes(marker)) &&
    !/define\w+Tests?\s*\(/.test(source)
  ) {
    return false;
  }
  if (COMMAND_MARKERS.some((marker) => source.includes(marker))) return true;
  if (/define\w+Tests?\s*\(/.test(source) && /from\s+["']\.\/.+\.shared/.test(source)) {
    return true;
  }
  // Shared factory definition files themselves
  if (/export\s+function\s+define\w+Tests?\s*\(/.test(source)) return true;
  return false;
}

export function isSkipOnlyPlaceholder(source: string): boolean {
  if (!/validateCardAbility\s*\(/.test(source)) return false;
  if (COMMAND_MARKERS.some((m) => source.includes(m))) return false;
  if (/define\w+Tests?\s*\(/.test(source)) return false;
  return /test\.skip\s*\(/.test(source);
}

function countActiveTests(source: string): number {
  // Active test( calls not preceded by .skip
  const all = [...source.matchAll(/(?<![\w.])test(?:\.(?:only))?\s*\(\s*(['"`])/g)];
  const skips = [...source.matchAll(/test\.skip\s*\(\s*(['"`])/g)];
  // Also count defineXTests factories as multi-test when shared defines multiple
  if (/define\w+Tests?\s*\(/.test(source) && /from\s+["']\.\/.+\.shared/.test(source)) {
    return Math.max(2, all.length); // factories typically export multi-test suites
  }
  if (/export\s+function\s+define\w+Tests?\s*\(/.test(source)) {
    const inner = [...source.matchAll(/(?<![\w.])test(?:\.(?:only))?\s*\(\s*(['"`])/g)];
    return Math.max(inner.length, 1);
  }
  return Math.max(0, all.length - skips.length);
}

function hasDecline(source: string): boolean {
  return (
    DECLINE_HELPER_CALL.test(source) ||
    /\bdecline\s*\(/.test(source) ||
    /optionId:\s*["']no["']/.test(source) ||
    /optionId:\s*["']decline["']/.test(source) ||
    // Optional "up to N" / addDon windows: amount 0 is an explicit decline of the grant.
    /resolveDecision\(\s*["']effectAddDon["']\s*,\s*\{\s*optionId:\s*["']0["']/.test(source) ||
    /resolveDecision\(\s*["']effectGiveDonCount["']\s*,\s*\{\s*optionId:\s*["']0["']/.test(source)
  );
}

/**
 * Strict outcome asserts for decline: exact economy/field equality, not soft
 * `toBeLessThanOrEqual(donPoolBefore + N)` theater.
 */
const STRICT_DECLINE_OUTCOME =
  /\bexpect\s*\([\s\S]{0,240}?(?:activeDon|restedDon|donDeckCount|deckCount|attachedDon|\.power\b|handCount|lifeCount|\.hand\b|\.trash\b|\.characters\b|faceUp|instanceId|\.rested\b)[\s\S]{0,100}?\.(?:toBe|toEqual|toMatchObject|toContain|not\.toContain)\s*\(|toMatchObject\s*\(\s*\{[\s\S]{0,120}?(?:activeDon|restedDon|donDeckCount)|\.(?:toBe|toEqual)\s*\(\s*(?:donPoolBefore|donDeckBefore|deckBefore|lifeBefore|trashBefore|handBefore|before\.|false|0|true)\b/;

/** Commands that can open *some* optional window (generic fallback only). */
const OPENS_OPTIONAL_WINDOW =
  /\b(?:playCard|play|activateEffect|activateMain|declareAttack|attack|endTurn|passTurn|attachDon)\s*\(/;

/**
 * Shared decline helpers under tests/cards/helpers/decline-optional.ts.
 * Calling these is always treated as a trigger-matched open + decline.
 */
const DECLINE_HELPER_CALL =
  /\b(?:declineOptionalAfterPlay|declineOptionalOnAttack|declineOptionalEndOfTurn|declineOptionalOnActivate|declineOptionalOnOpponentPlay|declineOptionalOnRemoval|declineOptionalOnLifeTrigger)\s*\(/;

/**
 * Opener families for optional triggers.
 * No "any" fallthrough — unmapped triggers fail Grade A with unknown-optional-trigger.
 */
export type OptionalOpener =
  | "play"
  | "attack"
  | "endTurn"
  | "activate"
  | "attachDon"
  | "removal"
  | "opponentPlay"
  | "opponentEvent"
  | "youActivateEvent"
  | "dealsDamage"
  | "becomesRested"
  | "lifeRemoved"
  | "triggerCharacterPlayed"
  | "blockerActivated"
  | "characterKod"
  | "triggerActivates";

/** Exhaustive map: every optional/returnDon trigger string seen in the card corpus. */
export const OPTIONAL_TRIGGER_OPENERS: Record<string, OptionalOpener[]> = {
  onplay: ["play"],
  main: ["play"],
  activatemain: ["activate"],
  "activate:main": ["activate"],
  whenattacking: ["attack"],
  onopponentattack: ["attack"],
  onyouropponentsattack: ["attack"],
  whenattacked: ["attack"],
  onblock: ["attack"],
  whenblockeractivated: ["attack", "blockerActivated"],
  counter: ["attack", "play"],
  trigger: ["attack", "play"],
  endofyourturn: ["endTurn"],
  endofturn: ["endTurn"],
  startofyourturn: ["endTurn"],
  startofturn: ["endTurn"],
  // Effect K.O. often opens via opponent Event/Character play as well as battle.
  onko: ["removal", "attack", "play"],
  "onk.o.": ["removal", "attack", "play"],
  whenleaving: ["removal", "attack", "play"],
  whencharacterremoved: ["removal", "play", "attack"],
  whencharacterkod: ["removal", "characterKod", "attack", "play"],
  whendealsdamage: ["dealsDamage", "attack"],
  whenyoudealdamage: ["dealsDamage", "attack"],
  whenbecomesrested: ["becomesRested", "attack", "activate"],
  whenopponentplayscharacter: ["opponentPlay"],
  whenopponentactivatesevent: ["opponentEvent"],
  whenyouactivateevent: ["youActivateEvent", "play"],
  whenliferemoved: ["lifeRemoved", "attack"],
  whentriggercharacterplayed: ["triggerCharacterPlayed", "attack", "play"],
  whentriggeractivates: ["triggerActivates", "attack", "play"],
};

function blockHasDecline(block: string): boolean {
  return (
    DECLINE_HELPER_CALL.test(block) ||
    /\bdecline\s*\(/.test(block) ||
    /optionId:\s*["']no["']/.test(block) ||
    /optionId:\s*["']decline["']/.test(block) ||
    /resolveDecision\(\s*["']effectAddDon["']\s*,\s*\{\s*optionId:\s*["']0["']/.test(block) ||
    /resolveDecision\(\s*["']effectGiveDonCount["']\s*,\s*\{\s*optionId:\s*["']0["']/.test(block) ||
    // min:0 "up to" declines via empty selection
    /selectedIds:\s*\[\s*\]/.test(block)
  );
}

function isOptionalEffectBlock(block: {
  optional?: boolean;
  costs?: unknown[];
  trigger?: string;
}): boolean {
  if (block.optional === true) return true;
  return (
    Array.isArray(block.costs) &&
    block.costs.some(
      (c) =>
        typeof c === "object" &&
        c !== null &&
        "cost" in c &&
        (c as { cost?: string }).cost === "returnDon",
    )
  );
}

/**
 * Collect unknown optional triggers (not in OPTIONAL_TRIGGER_OPENERS).
 * Empty array means every optional block is mapped.
 */
export function unknownOptionalTriggers(card: OPCard | null | undefined): string[] {
  if (!card?.effects) return [];
  const effects = card.effects as {
    effects?: Array<{ trigger?: string; optional?: boolean; costs?: unknown[] }>;
  };
  const unknown: string[] = [];
  for (const block of effects.effects ?? []) {
    if (!isOptionalEffectBlock(block)) continue;
    const trigger = (block.trigger ?? "").toLowerCase().trim();
    if (!trigger) {
      unknown.push("(missing-trigger)");
      continue;
    }
    if (!(trigger in OPTIONAL_TRIGGER_OPENERS)) {
      unknown.push(trigger);
    }
  }
  return [...new Set(unknown)];
}

/**
 * Map optional effect blocks on a card to the public commands that open them.
 * Never falls through to "any". Unmapped triggers are reported separately.
 */
export function optionalOpenersForCard(card: OPCard | null | undefined): OptionalOpener[] {
  if (!card?.effects) return [];
  const effects = card.effects as {
    effects?: Array<{ trigger?: string; optional?: boolean; costs?: unknown[] }>;
  };
  const openers = new Set<OptionalOpener>();

  for (const block of effects.effects ?? []) {
    if (!isOptionalEffectBlock(block)) continue;
    const trigger = (block.trigger ?? "").toLowerCase().trim();
    const mapped = OPTIONAL_TRIGGER_OPENERS[trigger];
    if (mapped) {
      for (const o of mapped) openers.add(o);
    }
  }

  return [...openers];
}

/**
 * Tokens that identify the card under test in source (export name, id, stem).
 * Used so playCard(unrelated) cannot satisfy a subject-bound play opener.
 *
 * Must NOT accept arbitrary imports that only share the collector number
 * (e.g. eb01Doma005 for ST04-005 Queen). Require set code and/or printed-name
 * fragment, or a reprint export that still names the subject character.
 */
export function subjectTokensForCard(card: OPCard | null | undefined, source: string): string[] {
  if (!card) return [];
  const tokens = new Set<string>();
  const base = (card.canonicalId || card.id).split("_")[0]!.toUpperCase();
  tokens.add(base);
  tokens.add(card.id);
  if (card.canonicalId) tokens.add(card.canonicalId);

  const [setPart, numPart] = base.split("-");
  const setSlug = (setPart ?? "").toLowerCase(); // st04, eb03, op04
  const num = numPart ?? "";
  // Strip parenthetical variants: "Queen (Full Art)" / "Queen (SP)" → "Queen"
  const baseName = (card.name ?? card.i18n?.en?.name ?? "").replace(/\s*\([^)]*\)\s*/g, " ").trim();
  // "Monkey.D.Luffy" → monkeydluffy; "Trafalgar Law" → trafalgarlaw
  const nameSlug = baseName.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
  // Significant name tokens (≥4 chars) for matching exports like prb01QueenFullArt005
  const nameFrags: string[] = [];
  for (const part of baseName.split(/[\s.·"']+/)) {
    const frag = part.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (frag.length >= 4) nameFrags.push(frag);
  }
  if (nameSlug.length >= 4) {
    nameFrags.push(nameSlug.slice(0, Math.min(8, nameSlug.length)));
  }
  // Also bare first 4–6 letters of the cleaned name (queen from queensp edge cases)
  if (nameSlug.length >= 4) nameFrags.push(nameSlug.slice(0, 4));
  if (nameSlug.length >= 5) nameFrags.push(nameSlug.slice(0, 5));
  // Name fragments are themselves subject tokens: local consts named after the
  // card (const shinobu = "OP16-087") bind playCard to the subject.
  for (const part of baseName.split(/[\s.·"']+/)) {
    const frag = part.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    if (frag.length >= 3) tokens.add(frag);
  }

  for (const m of source.matchAll(
    /import\s*\{([^}]+)\}\s*from\s*["'](?:@tcg\/op-cards|[^"']+)["']/g,
  )) {
    for (const part of m[1]!.split(",")) {
      const name = part
        .trim()
        .split(/\s+as\s+/)[0]!
        .trim();
      if (!name || name.length <= 4) continue;
      const lower = name.toLowerCase();
      // Must end with collector number when present
      if (num && !new RegExp(`${num}$`).test(name)) continue;
      const hasSet = setSlug.length >= 3 && lower.includes(setSlug);
      const hasName = nameFrags.some((frag) => frag.length >= 4 && lower.includes(frag));
      // Accept: st04Queen005, eb03Hina025, prb01QueenFullArt005 (name match for reprints)
      if (hasSet || hasName) tokens.add(name);
    }
  }

  // Local relative imports: import { op13X } from ".../013-foo.ts"
  for (const m of source.matchAll(
    /import\s*\{\s*([A-Za-z0-9_]+)\s*\}\s*from\s*["'][^"']*\/(\d{3})-[^"']+["']/g,
  )) {
    const exportName = m[1]!;
    const fileNum = m[2]!;
    if (num && fileNum === num) tokens.add(exportName);
  }

  return [...tokens].filter(
    (t) => t.length >= 3 && !/^(from|import|const|test|describe)$/i.test(t),
  );
}

function blockMentionsSubject(block: string, subjectTokens: string[]): boolean {
  if (subjectTokens.length === 0) return true; // cannot bind without tokens
  return subjectTokens.some((t) => {
    try {
      return new RegExp(`\\b${t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`).test(block);
    } catch {
      return block.includes(t);
    }
  });
}

function blockPlaysSubject(block: string, subjectTokens: string[]): boolean {
  // playCard(subject) or play(subject) — not an arbitrary fixture card
  for (const t of subjectTokens) {
    const esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    if (new RegExp(`\\b(?:playCard|play)\\s*\\(\\s*${esc}\\b`).test(block)) return true;
    // helper: declineOptionalAfterPlay(engine, subject
    if (new RegExp(`declineOptionalAfterPlay\\s*\\(\\s*\\w+\\s*,\\s*${esc}\\b`).test(block)) {
      return true;
    }
  }
  return false;
}

function blockHasOpenerKind(block: string, kind: OptionalOpener, subjectTokens: string[]): boolean {
  // Shared helpers always count for their family
  if (DECLINE_HELPER_CALL.test(block)) {
    // AfterPlay: second arg MUST be a subject token (never filler).
    if (kind === "play" && /declineOptionalAfterPlay\s*\(/.test(block)) {
      return blockPlaysSubject(block, subjectTokens);
    }
    // Activate: source must be resolved from subject (findCardInZone(..., subject) or leader).
    if (kind === "activate" && /declineOptionalOnActivate\s*\(/.test(block)) {
      return blockMentionsSubject(block, subjectTokens) || /leader\s*\(/.test(block);
    }
    // Attack helpers: subject must appear in the fixture/block (attacker from subject zone).
    if (kind === "attack" && /declineOptionalOnAttack\s*\(/.test(block)) {
      return blockMentionsSubject(block, subjectTokens);
    }
    if (kind === "endTurn" && /declineOptionalEndOfTurn\s*\(/.test(block)) return true;
    if (kind === "opponentPlay" && /declineOptionalOnOpponentPlay\s*\(/.test(block)) {
      // Subject (leader/character reacting) must be in fixture; played card is the opponent's.
      return blockMentionsSubject(block, subjectTokens);
    }
    if (
      (kind === "removal" || kind === "characterKod") &&
      /declineOptionalOnRemoval\s*\(/.test(block)
    ) {
      return blockMentionsSubject(block, subjectTokens);
    }
    if ((kind === "attack" || kind === "play") && /declineOptionalOnLifeTrigger\s*\(/.test(block)) {
      return true;
    }
  }

  switch (kind) {
    case "play":
      // Subject-bound: must play the card under test, not an unrelated fixture.
      return blockPlaysSubject(block, subjectTokens);
    case "attack":
      return (
        (/\bdeclareAttack\s*\(|\battack\s*\(/.test(block) &&
          blockMentionsSubject(block, subjectTokens)) ||
        /declineOptionalOnAttack\s*\(/.test(block) ||
        /declineOptionalOnLifeTrigger\s*\(/.test(block)
      );
    case "endTurn":
      return (
        /\bendTurn\s*\(|\bpassTurn\s*\(/.test(block) || /declineOptionalEndOfTurn\s*\(/.test(block)
      );
    case "activate":
      return (
        (/\bactivateEffect\s*\(|\bactivateMain\s*\(/.test(block) &&
          blockMentionsSubject(block, subjectTokens)) ||
        /declineOptionalOnActivate\s*\(/.test(block)
      );
    case "attachDon":
      return /\battachDon\s*\(/.test(block) && blockMentionsSubject(block, subjectTokens);
    case "removal":
    case "characterKod":
      return (
        /declineOptionalOnRemoval\s*\(/.test(block) ||
        (/\bdeclareAttack\s*\(/.test(block) && blockMentionsSubject(block, subjectTokens)) ||
        // Own effect removal: play Event/Character while subject (leader/character) is in fixture.
        (/\bplayCard\s*\(/.test(block) &&
          blockMentionsSubject(block, subjectTokens) &&
          (/\bleaderCardId\s*:/.test(block) ||
            /character:\s*\[/.test(block) ||
            /findCardInZone/.test(block)))
      );
    case "opponentPlay":
      return (
        /declineOptionalOnOpponentPlay\s*\(/.test(block) ||
        // Opponent plays a *different* card while subject (leader/character) is already in fixture
        (/\bplayCard\s*\(/.test(block) &&
          blockMentionsSubject(block, subjectTokens) &&
          !blockPlaysSubject(block, subjectTokens) &&
          (/\bleaderCardId\s*:/.test(block) ||
            /character:\s*\[/.test(block) ||
            /findCardInZone/.test(block)))
      );
    case "opponentEvent":
      return (
        /\bplayCard\s*\(/.test(block) &&
        blockMentionsSubject(block, subjectTokens) &&
        !blockPlaysSubject(block, subjectTokens)
      );
    case "youActivateEvent":
      return /\bplayCard\s*\(/.test(block) && blockMentionsSubject(block, subjectTokens);
    case "dealsDamage":
      return /\bdeclareAttack\s*\(|\battack\s*\(/.test(block);
    case "becomesRested":
      return (
        /\bdeclareAttack\s*\(|\bactivateEffect\s*\(|\bendTurn\s*\(/.test(block) &&
        blockMentionsSubject(block, subjectTokens)
      );
    case "lifeRemoved":
      return /\bdeclareAttack\s*\(/.test(block);
    case "triggerCharacterPlayed":
    case "triggerActivates":
      return (
        /\bdeclareAttack\s*\(/.test(block) ||
        /lifeTrigger/.test(block) ||
        /declineOptionalOnLifeTrigger\s*\(/.test(block)
      );
    case "blockerActivated":
      return /\bdeclareAttack\s*\(/.test(block) && /battleBlocker|Blocker/i.test(block);
    default:
      return false;
  }
}

/**
 * Decline block must open the optional with a command matching the card's
 * optional trigger(s), bound to the subject card where required.
 */
function blockMatchesCardOpeners(
  block: string,
  card: OPCard | null | undefined,
  source: string,
): boolean {
  if (DECLINE_HELPER_CALL.test(block)) {
    // Helper must still mention the subject when playing the subject itself
    if (/declineOptionalAfterPlay\s*\(/.test(block)) {
      const tokens = subjectTokensForCard(card, source);
      return blockPlaysSubject(block, tokens) || tokens.length === 0;
    }
    return true;
  }
  const openers = optionalOpenersForCard(card);
  if (openers.length === 0) return false;
  const tokens = subjectTokensForCard(card, source);
  return openers.some((k) => blockHasOpenerKind(block, k, tokens));
}

/** Soft / theatrical patterns that must not count as Grade A decline. */
function isTheatricalDeclineBlock(
  block: string,
  card: OPCard | null | undefined,
  source: string,
): boolean {
  // Bulk try/catch "may decline …" stubs without shared helpers are never Grade A.
  if (
    /may decline the optional/i.test(block) &&
    /try\s*\{/.test(block) &&
    /catch\s*\{/.test(block) &&
    !DECLINE_HELPER_CALL.test(block)
  ) {
    return true;
  }
  // Soft DON!! pool slack (e.g. toBeLessThanOrEqual(donPoolBefore + 5)).
  if (/toBeLessThanOrEqual\s*\(\s*donPoolBefore\s*\+\s*\d+\s*\)/.test(block)) return true;
  // Prompts length slack as the only "outcome" (no strict economy/field assert).
  if (
    /prompts\.length\)\.toBeLessThan\s*\(\s*\d+\s*\)/.test(block) &&
    !STRICT_DECLINE_OUTCOME.test(block)
  ) {
    return true;
  }
  // Decline only inside if(hasPendingChoice) with no explicit optionId "no" and no open cmd.
  const hasUnconditionalNo =
    /optionId:\s*["']no["']/.test(block) ||
    /resolveDecision\(\s*["']effectAddDon["']\s*,\s*\{\s*optionId:\s*["']0["']/.test(block) ||
    /selectedIds:\s*\[\s*\]/.test(block) ||
    DECLINE_HELPER_CALL.test(block);
  const onlyConditionalDecline =
    /if\s*\(\s*\w+\.hasPendingChoice[\s\S]{0,200}?\bdecline\s*\(/.test(block) &&
    !hasUnconditionalNo &&
    !OPENS_OPTIONAL_WINDOW.test(block);
  if (onlyConditionalDecline) return true;
  // Counter Event "decline cost" titles that never enter battle Counter.
  if (
    /may decline the optional cost when the Event/i.test(block) &&
    !/\bdeclareAttack\s*\(/.test(block) &&
    !/\bbattleCounter\b/.test(block) &&
    !/declineOptionalOnLifeTrigger\s*\(/.test(block)
  ) {
    return true;
  }
  // Wrong opener family or wrong subject
  if (card && !blockMatchesCardOpeners(block, card, source)) {
    return true;
  }
  // playCard-only bulk template for non-onPlay optional cards
  const openers = optionalOpenersForCard(card);
  const onlyPlay =
    /\bplayCard\s*\(/.test(block) &&
    !/\bdeclareAttack\s*\(/.test(block) &&
    !/\bendTurn\s*\(/.test(block) &&
    !/\bactivateEffect\s*\(/.test(block) &&
    !/\bactivateMain\s*\(/.test(block) &&
    !DECLINE_HELPER_CALL.test(block);
  if (onlyPlay && openers.length > 0 && !openers.includes("play")) {
    return true;
  }
  // try/catch swallowing decline without helper — still theatrical if no hard open succeeded
  if (
    /try\s*\{[\s\S]*?optionId:\s*["']no["'][\s\S]*?\}\s*catch/.test(block) &&
    !DECLINE_HELPER_CALL.test(block)
  ) {
    // Allow try/catch only when subject-bound opener is clearly present without catch on open
    const beforeTry = block.split(/try\s*\{/)[0] ?? "";
    if (!blockMatchesCardOpeners(beforeTry + block, card, source)) {
      // re-check whole block already done; mark theatrical if opener is only inside try/catch with soft fail
      if (
        !blockMatchesCardOpeners(
          block.replace(/try\s*\{/g, "{").replace(/\}\s*catch[\s\S]*?\{[\s\S]*?\}/g, ""),
          card,
          source,
        )
      ) {
        // keep non-theatrical if openers match on full block including try body
      }
    }
  }
  return false;
}

/**
 * True when at least one decline/no path:
 * 1. Opens the optional window via a command matching the card's optional trigger,
 * 2. Explicitly declines (decline / optionId "no" / amount-0 grant / helper),
 * 3. Asserts a strict player-visible non-effect (exact toBe on economy/field).
 */
export function hasMeaningfulDecline(source: string, card?: OPCard | null): boolean {
  if (!hasDecline(source)) return false;
  // Hard reject bulk try/catch optional stubs without shared helpers (whole file).
  if (
    /may decline the optional/i.test(source) &&
    /try\s*\{/.test(source) &&
    /catch\s*\{/.test(source) &&
    !/\b(?:declineOptionalAfterPlay|declineOptionalOnAttack|declineOptionalEndOfTurn|declineOptionalOnActivate|declineOptionalOnOpponentPlay|declineOptionalOnRemoval|declineOptionalOnLifeTrigger)\s*\(/.test(
      source,
    )
  ) {
    // Only fail if the ONLY decline is the bulk stub (no helper).
    // Still allow other meaningful declines in the same file.
    const blocks = source.split(/(?<![\w.])test(?:\.only)?\s*\(/);
    let anyGood = false;
    for (const block of blocks.slice(1)) {
      if (!/optionId:\s*["']no["']|\bdecline\s*\(/.test(block) && !/declineOptional/.test(block))
        continue;
      if (
        /may decline the optional/i.test(block) &&
        /try\s*\{/.test(block) &&
        /catch\s*\{/.test(block) &&
        !/declineOptional/.test(block)
      ) {
        continue; // skip bulk theater
      }
      anyGood = true;
    }
    if (!anyGood) return false;
  }

  const blocks = source.split(/(?<![\w.])test(?:\.only)?\s*\(/);
  for (const block of blocks.slice(1)) {
    if (!blockHasDecline(block)) continue;
    if (isTheatricalDeclineBlock(block, card, source)) continue;
    if (!blockMatchesCardOpeners(block, card, source) && !DECLINE_HELPER_CALL.test(block)) {
      continue;
    }
    // Helpers return snapshots — require before/after economy or STRICT_DECLINE_OUTCOME
    const helperWithAssert =
      DECLINE_HELPER_CALL.test(block) &&
      (STRICT_DECLINE_OUTCOME.test(block) ||
        /\bbefore\.(?:donPool|lifeCount|handCount|donDeckCount)\b/.test(block) ||
        /\bafter\.(?:donPool|lifeCount|handCount|donDeckCount)\b/.test(block) ||
        /snapshotEconomy/.test(block));
    if (
      DECLINE_HELPER_CALL.test(block) &&
      !helperWithAssert &&
      !STRICT_DECLINE_OUTCOME.test(block)
    ) {
      // Still require some strict outcome in the same test block
      if (!STRICT_DECLINE_OUTCOME.test(block)) continue;
    }
    if (!STRICT_DECLINE_OUTCOME.test(block) && !helperWithAssert) continue;

    // amount-0 grant path
    if (
      /optionId:\s*["']0["']/.test(block) &&
      /\bexpect\s*\([\s\S]{0,200}?activeDon[\s\S]{0,40}?\.toBe\s*\(/.test(block)
    ) {
      return true;
    }

    if (
      (DECLINE_HELPER_CALL.test(block) ||
        /\bdecline\s*\(/.test(block) ||
        /optionId:\s*["']no["']/.test(block) ||
        /selectedIds:\s*\[\s*\]/.test(block)) &&
      (STRICT_DECLINE_OUTCOME.test(block) || helperWithAssert)
    ) {
      if (blockMatchesCardOpeners(block, card, source) || DECLINE_HELPER_CALL.test(block)) {
        return true;
      }
    }
  }

  return false;
}

/** Bulk template smell: titled decline without a live open-window path. */
export function hasWeakDeclineOnly(source: string, card?: OPCard | null): boolean {
  if (!hasDecline(source)) return false;
  if (hasMeaningfulDecline(source, card)) return false;
  return (
    /may decline the optional/i.test(source) ||
    /if\s*\(\s*\w+\.hasPendingChoice/.test(source) ||
    /toBeLessThanOrEqual\s*\(\s*donPoolBefore\s*\+/.test(source)
  );
}

function hasNegative(source: string): boolean {
  return (
    /\bexpectFailure\s*\(/.test(source) ||
    /Expected .+ to fail/.test(source) ||
    /\.accepted\)\.toBe\(false\)/.test(source) ||
    /toThrow\s*\(/.test(source)
  );
}

function hasPlayerCommand(source: string): boolean {
  return (
    /\bplayCard\s*\(/.test(source) ||
    /\bplay\s*\(/.test(source) ||
    /\bactivateEffect\s*\(/.test(source) ||
    /\bactivateMain\s*\(/.test(source) ||
    /\bdeclareAttack\s*\(/.test(source) ||
    /\battack\s*\(/.test(source) ||
    /\bendTurn\s*\(/.test(source) ||
    /\battachDon\s*\(/.test(source) ||
    /\bexec\s*\(/.test(source) ||
    /type:\s*["'](?:playCard|declareAttack|activateEffect|endTurn|attachDon)["']/.test(source) ||
    /define\w+Tests?\s*\(/.test(source) ||
    // Continuous permanent proofs: fixture + projected power/cost without a play move.
    (/\bOnePieceTestEngine\.create\s*\(/.test(source) &&
      /\bgetView\s*\(/.test(source) &&
      (/\.(?:power|cost)\b/.test(source) ||
        /\b(?:power|cost)\s*:\s*\d+/.test(source) ||
        /toMatchObject\s*\([\s\S]{0,80}?\b(?:power|cost)\b/.test(source))) ||
    // Effect-action boundary proofs that drive shipped processEffectAction + view assert.
    (/\bprocessEffectAction\s*\(/.test(source) && /\bgetView\s*\(/.test(source))
  );
}

function hasPromptResolution(source: string): boolean {
  return (
    /\bresolveDecision\s*\(/.test(source) ||
    /\bpendingDecision\s*\(/.test(source) ||
    /\bchoose\s*\(/.test(source) ||
    /\baccept\s*\(/.test(source) ||
    /\bdecline\s*\(/.test(source) ||
    /\bchooseAmount\s*\(/.test(source) ||
    /\bresolvePrompt\b/.test(source) ||
    /type:\s*["']resolvePrompt["']/.test(source) ||
    /define\w+Tests?\s*\(/.test(source)
  );
}

function hasViewAssert(source: string): boolean {
  return (
    /\bgetView\s*\(/.test(source) ||
    /\bpendingDecision\s*\(/.test(source) ||
    // Older proofs use getState / findCardInZone for outcomes; still command-driven.
    /\bgetState\s*\(/.test(source) ||
    /\bfindCardInZone\s*\(/.test(source) ||
    /define\w+Tests?\s*\(/.test(source) ||
    DECLINE_HELPER_CALL.test(source) ||
    /\bsnapshotEconomy\s*\(/.test(source)
  );
}

function isPermanentContinuousStyle(source: string): boolean {
  // Fixture places card; endTurn exercises continuous; multi-assert without activate/play prompts
  const hasTurn = /\bendTurn\s*\(/.test(source) || /\bpassTurn\s*\(/.test(source);
  const assertCount = (source.match(/\bexpect\s*\(/g) ?? []).length;
  return hasTurn && assertCount >= 4;
}

function cardProducesChoices(card: OPCard | null | undefined): boolean {
  if (!card?.effects) return false;
  const j = JSON.stringify(card.effects);
  // Only actions/flags that project player decisions — not mere cost-reduction stats.
  if (/"optional"\s*:\s*true/.test(j)) return true;
  if (/"upTo"\s*:\s*true/.test(j)) return true;
  if (
    /"action"\s*:\s*"(search|choice|lookAt|reveal|play|returnToHand|returnToDeck|trashFromHand)"/.test(
      j,
    )
  )
    return true;
  return false;
}

/**
 * Require a meaningful decline when the primary already exercises optional accept
 * (optionId "yes" / accept / returnDon payment) AND the card has structured
 * optional. Does **not** require declines on every optional:true card without an
 * accept path (that bar drove bulk theater).
 *
 * Committed Main/Counter Event and Life Trigger returnDon costs are mandatory
 * after activation — they must not force a decline path by themselves.
 */
export function cardNeedsDecline(card: OPCard | null | undefined, source: string): boolean {
  if (!card?.effects) return false;
  const effectsJson = JSON.stringify(card.effects);
  // Only explicit optional:true is a skippable effect. returnDon alone is often
  // a mandatory post-commit cost on Events / Life Triggers.
  if (!/"optional"\s*:\s*true/.test(effectsJson)) return false;
  const provesOptionalAccept =
    /optionId:\s*["']yes["']/.test(source) ||
    /\baccept\s*\(/.test(source) ||
    /effectCostReturnDon/.test(source);
  return provesOptionalAccept;
}

/** Optional-structure signal for reporting / soft quality tools. */
export function cardHasStructuredOptional(card: OPCard | null | undefined): boolean {
  if (!card?.effects) return false;
  const effectsJson = JSON.stringify(card.effects);
  return /"optional"\s*:\s*true/.test(effectsJson);
}

export function gradeSource(path: string, source: string, card?: OPCard | null): GradeAResult {
  const baseName = path.split("/").pop() ?? path;
  if (HARNESS_ONLY.has(baseName) || path.endsWith(".shared.ts")) {
    // Shared factories graded as A if they define multi-test command suites
    if (path.endsWith(".shared.ts") && /export\s+function\s+define\w+Tests?/.test(source)) {
      if (hasPlayerCommand(source) && hasViewAssert(source) && countActiveTests(source) >= 1) {
        if (countActiveTests(source) >= 2 || hasDecline(source) || hasNegative(source)) {
          return { ok: true, grade: "A", reasons: ["shared factory"], path };
        }
        if ((source.match(/(?<![\w.])test\s*\(/g) ?? []).length >= 2) {
          return { ok: true, grade: "A", reasons: ["shared factory multi-test"], path };
        }
        return {
          ok: false,
          grade: "B",
          reasons: ["shared factory lacks second test/decline/negative"],
          path,
        };
      }
    }
    return { ok: true, grade: "SKIP", reasons: ["harness/non-primary"], path };
  }

  if (isSkipOnlyPlaceholder(source) || !isCommandDrivenProof(source)) {
    return { ok: true, grade: "SKIP", reasons: ["not a command-driven primary"], path };
  }

  const reasons: string[] = [];
  const activeTests = countActiveTests(source);
  const playerCmd = hasPlayerCommand(source);
  const prompts = hasPromptResolution(source);
  const view = hasViewAssert(source);
  const rawDecline = hasDecline(source);
  // Only meaningful declines count toward depth / satisfy needsDecline.
  const meaningfulDecline = rawDecline && hasMeaningfulDecline(source, card);
  const negative = hasNegative(source);
  const permanent = isPermanentContinuousStyle(source);
  const needsDecline = cardNeedsDecline(card, source);
  const expectsChoices =
    cardProducesChoices(card) ||
    /effectOptional|optionId:\s*["']yes["']|\baccept\s*\(/.test(source);

  if (!playerCmd) reasons.push("missing public play/activate/attack/endTurn command");
  if (!view) reasons.push("missing getView/pendingDecision asserts");
  // Prompt resolution when the test enters a choice path (yes/optional/search).
  const testOpensChoice =
    /effectOptional|optionId:\s*["']yes["']|\baccept\s*\(|effectSearch|effectTargetSelection|effectPlaySelection|effectCost/.test(
      source,
    );
  if (expectsChoices && testOpensChoice && !prompts && !permanent) {
    reasons.push("missing prompt resolution for choice-producing card");
  }
  if (activeTests < 1 && !/define\w+Tests?\s*\(/.test(source)) {
    reasons.push("no active test()");
  }

  // Depth: ≥2 tests, meaningful decline, negative, or thorough multi-assert (≥4 expects).
  const expectCount = (source.match(/\bexpect\s*\(/g) ?? []).length;
  const multiAssert = expectCount >= 4;
  const hasDepth = activeTests >= 2 || meaningfulDecline || negative || multiAssert || permanent;

  if (!hasDepth) {
    reasons.push("needs second test, decline path, negative case, or multi-assert (≥4 expects)");
  }

  const unknownTriggers = unknownOptionalTriggers(card);
  if (unknownTriggers.length > 0) {
    reasons.push(`unknown-optional-trigger:${unknownTriggers.join(",")}`);
  }

  if (needsDecline && !rawDecline) {
    reasons.push("optional/you-may/DON!!−N card missing explicit decline test");
  } else if (needsDecline && rawDecline && !meaningfulDecline) {
    reasons.push(
      "optional card decline is not meaningful (need trigger-matched subject-bound open + strict board/DON!!/hand outcome, not bulk playCard theater)",
    );
  } else if (rawDecline && !meaningfulDecline) {
    // Decline present but theatrical: does not satisfy depth; if depth already fails, ok.
    // Still flag so bulk theater cannot hide as a second path.
    if (hasDepth && !multiAssert && activeTests < 2 && !negative && !permanent) {
      // depth came only from counting raw decline elsewhere — already excluded
    }
  }

  if (reasons.length === 0) {
    return { ok: true, grade: "A", reasons: ["grade A"], path };
  }

  // Assign B/C/D for reporting
  let grade: GradeAResult["grade"] = "B";
  if (!playerCmd || !view) grade = "D";
  else if (expectsChoices && testOpensChoice && !prompts && !permanent) grade = "C";
  else if (!hasDepth || (needsDecline && !meaningfulDecline)) grade = "B";

  return { ok: false, grade, reasons, path };
}

/** True when `path` looks like a dedicated proof for `cardId`, not a fixture import. */
export function pathLooksLikeSubject(path: string, cardId: string): boolean {
  const base = cardId.split("_")[0]!.toUpperCase();
  const baseName = path.split("/").pop() ?? path;
  if (extractCardIds(baseName).has(base)) return true;

  const [setPart, numPart] = base.split("-");
  if (!setPart || !numPart) return false;
  if (!baseName.startsWith(`${numPart}-`) && !baseName.toLowerCase().startsWith(`${numPart}-`)) {
    // also allow op14-040- style already handled by extractCardIds
    if (!new RegExp(`(?:^|[^a-z0-9])${numPart}-`, "i").test(baseName)) return false;
  }
  // .../OP11/.../023-name.test.ts
  if (new RegExp(`/${setPart}/`, "i").test(path)) return true;
  // Product folders like OP14EB04 still host OP14-NNN cards
  if (/^OP\d+$/i.test(setPart) && new RegExp(`/${setPart}EB\\d+/`, "i").test(path)) return true;
  // Promo product folders PRB01 hosting P-NNN or PRB01-NNN
  if ((/^P$/i.test(setPart) || /^PRB\d+$/i.test(setPart)) && /\/PRB\d+\//i.test(path)) {
    return true;
  }
  return false;
}

export function primaryProofPathForCard(
  cardId: string,
  proofIndex: Map<string, string[]>,
): string | undefined {
  const base = cardId.split("_")[0]!.toUpperCase();
  const paths = proofIndex.get(base) ?? [];
  if (paths.length === 0) return undefined;
  // Prefer: subject-named file > tests/cards > src/cards > alphabetical.
  // This stops fixture-only mentions (e.g. OP14-040 imported into an Arlong test)
  // from beating the card's real primary when both are indexed.
  const ranked = [...paths].sort((a, b) => {
    const as = pathLooksLikeSubject(a, base) ? 0 : 1;
    const bs = pathLooksLikeSubject(b, base) ? 0 : 1;
    if (as !== bs) return as - bs;
    const at = a.includes("/tests/cards/") || a.includes("tests/cards/") ? 0 : 1;
    const bt = b.includes("/tests/cards/") || b.includes("tests/cards/") ? 0 : 1;
    return at - bt || a.localeCompare(b);
  });
  return ranked[0];
}

export function buildProofIndex(testFiles: string[]): Map<string, string[]> {
  const index = new Map<string, string[]>();
  for (const file of testFiles) {
    const baseName = file.split("/").pop() ?? file;
    if (HARNESS_ONLY.has(baseName)) continue;
    const source = readFileSync(file, "utf8");
    if (!isCommandDrivenProof(source) || isSkipOnlyPlaceholder(source)) continue;
    // Index ids from the filename (subject) first; still include source ids so
    // multi-card shared suites remain discoverable. primaryProofPathForCard
    // prefers subject-matching paths so fixture imports do not steal primaries.
    const ids = extractCardIds(`${baseName}\n${source}`);
    for (const id of ids) {
      const base = id.split("_")[0]!.toUpperCase();
      if (!/^(?:OP|EB|ST|PRB)\d*-\d{3}$/.test(base) && !/^(?:OP|EB|ST|PRB)\d+-\d{3}$/.test(base)) {
        // keep OP01-004 style
      }
      if (!/^[A-Z]{1,4}\d{0,2}-\d{3}$/.test(base)) continue;
      const list = index.get(base) ?? [];
      if (!list.includes(file)) list.push(file);
      index.set(base, list);
    }
  }
  return index;
}

export function listCardBehaviorTestFiles(): string[] {
  return [
    ...walkTestFiles(TESTS_CARDS_ROOT),
    ...walkTestFiles(SRC_CARDS_ROOT),
    // shared factories that define multi-card suites
    ...walkTestFiles(TESTS_CARDS_ROOT).filter((p) => p.endsWith(".shared.ts")),
  ].filter((p, i, arr) => arr.indexOf(p) === i);
}
