/**
 * Flesh and Blood binds a bot to a seated hero. Cyberpunk cannot: three
 * Legends overlap across the authored lists, and the plan lives in the
 * 40-card main deck.
 *
 * This table is the analogue of FAB_HERO_PROFILE_BINDINGS. Each row is a
 * small core-interaction signature (required names, optional exclusions).
 * First match wins — unique payoffs first, then overlapping combos split
 * by the card the other list does not play.
 */
import { structuredCards } from "@tcg/cyberpunk-cards";

import {
  deckProfileFor,
  type AuthoredBotLabDeckId,
  type AuthoredDeckStrategyProfile,
} from "./deck-profiles.ts";

export interface DeckArchetypeSignature {
  readonly profileId: AuthoredBotLabDeckId;
  readonly label: string;
  /** Display names → minimum copies (main deck + legends). */
  readonly require: Readonly<Record<string, number>>;
  /** Display names → reject when the deck has at least this many copies. */
  readonly forbid?: Readonly<Record<string, number>>;
}

const tokenToEngineName = new Map<string, string>();
for (const card of structuredCards) {
  tokenToEngineName.set(card.name, card.name);
  if (card.displayName) tokenToEngineName.set(card.displayName, card.name);
  if (card.id) tokenToEngineName.set(card.id, card.name);
}

function engineNameFor(token: string): string | undefined {
  return tokenToEngineName.get(token);
}

/**
 * Ordered signatures. Unique payoffs first so a brew that splashes a
 * headline card still gets that plan; overlapping rifles/recursion split
 * on the interaction the other list does not run.
 */
export const DECK_ARCHETYPE_SIGNATURES: readonly DeckArchetypeSignature[] = [
  {
    profileId: "authored-judy-top-deck-discount",
    label: "Judy top-deck discount",
    require: { "Judy Álvarez: Nothing to Doubt": 1 },
  },
  {
    profileId: "authored-relic-smasher-total-sweep",
    label: "Relic Smasher",
    require: { "Adam Smasher: Metal Over Meat": 1 },
  },
  {
    profileId: "authored-relic-placide-surgical-reanimation",
    label: "Relic Placide",
    require: {
      "The Relic: Experimental Biochip": 1,
      "Placide: Voodoo Sentinel": 1,
    },
  },
  {
    profileId: "authored-cyberpsychosis-deadman-burst-insurance",
    label: "Cyberpsychosis + Deadman",
    require: { "Deadman Transmitter": 1 },
  },
  {
    profileId: "authored-ryg-low-cost-value",
    label: "RYG low-cost value",
    require: { "Field Operator": 1 },
  },
  {
    profileId: "authored-ryb-low-cost-tempo",
    label: "RYB low-cost tempo",
    require: { "Psycho Squad": 1 },
  },
  {
    profileId: "authored-hanako-netdriver-gigs-draw-engine",
    label: "Hanako + Netdriver",
    require: {
      "Overwatch: Panam's Gift": 1,
      "NetWatch Netdriver": 1,
    },
  },
  {
    profileId: "authored-overwatch-recharge-control",
    label: "Overwatch recharge",
    require: {
      "Overwatch: Panam's Gift": 2,
      Sandevistan: 1,
    },
    forbid: { "NetWatch Netdriver": 1 },
  },
  {
    profileId: "authored-alt-gears-multiplied-economy",
    label: "Alt gear engine",
    require: {
      "Alt Cunningham: Mother of Daemons": 2,
      "NetWatch Netdriver": 1,
    },
    forbid: { "The Relic: Experimental Biochip": 1 },
  },
  {
    profileId: "authored-oda-industrial-assembly-pairs-plateaus",
    label: "Oda pairs",
    require: { "Sandayu Oda: Hanako's Guardian": 3 },
  },
  {
    profileId: "authored-yorinobu-two-units-for-one",
    label: "Yorinobu recursion",
    require: { "Yorinobu Arasaka: Steel Dragon": 3 },
  },
  {
    profileId: "authored-johnny-fight-ready-steal",
    label: "Johnny double attack",
    require: {
      "Johnny Silverhand: Never Stop Fighting": 2,
      "Satori: Sword of Saburo": 2,
    },
    forbid: {
      Cyberpsychosis: 1,
      "Yorinobu Arasaka: Steel Dragon": 1,
    },
  },
];

function countEngineNames(tokens: readonly string[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const token of tokens) {
    const name = engineNameFor(token);
    if (!name) continue;
    counts.set(name, (counts.get(name) ?? 0) + 1);
  }
  return counts;
}

function signatureMatches(counts: Map<string, number>, signature: DeckArchetypeSignature): boolean {
  for (const [displayName, min] of Object.entries(signature.require)) {
    const name = engineNameFor(displayName);
    if (!name || (counts.get(name) ?? 0) < min) return false;
  }
  for (const [displayName, atLeast] of Object.entries(signature.forbid ?? {})) {
    const name = engineNameFor(displayName);
    if (name && (counts.get(name) ?? 0) >= atLeast) return false;
  }
  return true;
}

/**
 * Infer an authored plan from a bag of card tokens (engine names, display
 * names, or definition ids). Unknown bags return undefined — the generic
 * tactical/greedy seat stays unbound.
 */
export function matchDeckProfile(
  cards: readonly string[],
): AuthoredDeckStrategyProfile | undefined {
  if (cards.length === 0) return undefined;
  const counts = countEngineNames(cards);
  for (const signature of DECK_ARCHETYPE_SIGNATURES) {
    if (signatureMatches(counts, signature)) {
      return deckProfileFor(signature.profileId);
    }
  }
  return undefined;
}

/**
 * Resolve a seat's plan. An authored fixture id wins when present; otherwise
 * the card bag is matched against {@link DECK_ARCHETYPE_SIGNATURES}.
 */
export function resolveDeckProfile(input: {
  readonly deckId?: string | null;
  readonly cards?: readonly string[];
}): AuthoredDeckStrategyProfile | undefined {
  if (input.deckId) {
    const exact = deckProfileFor(input.deckId);
    if (exact) return exact;
  }
  if (input.cards && input.cards.length > 0) return matchDeckProfile(input.cards);
  return undefined;
}
