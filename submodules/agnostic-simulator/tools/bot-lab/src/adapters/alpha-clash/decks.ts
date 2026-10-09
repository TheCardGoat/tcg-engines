import { allCards } from "../../../../../../alpha-clash/packages/cards/src/index.ts";
import type { AcCardDefinition } from "../../../../../../alpha-clash/packages/types/src/index.ts";

export interface AlphaClashDeckEntry {
  readonly name: string;
  readonly count: number;
}

export interface AlphaClashLabDeck {
  readonly id: string;
  readonly contender: string;
  readonly source: string;
  readonly resultSource: string;
  readonly result: string;
  readonly main: readonly AlphaClashDeckEntry[];
  readonly side: readonly AlphaClashDeckEntry[];
}

const entries = (rows: readonly (readonly [number, string])[]): AlphaClashDeckEntry[] =>
  rows.map(([count, name]) => ({ count, name }));

/** Published lists are preserved, including sideboards. Matches use the main deck only. */
export const ALPHA_CLASH_META_DECKS: readonly AlphaClashLabDeck[] = [
  {
    id: "clarity-hyper-aggro",
    contender: "Clarity, Ready for Trials",
    source: "https://www.deckplanet.net/alpha_clash/deck/0162d182-517c-4bdf-97a2-69c8e3520301",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result: "Shaneth / shane — 1st, Online League Season 3, 2026-08-19",
    main: entries([
      [4, "Sacrificial Strength"],
      [4, "Controlling the Situation"],
      [2, "Clarity's 1911"],
      [2, "Webber's Binoculars"],
      [2, "Sharpshooter Moxie"],
      [3, "Restoration"],
      [3, "Bombardment"],
      [4, "Zhao Li, Reconnaissance Agent"],
      [4, "Haven, the Resourceful Helper"],
      [4, "Cao Ling, Demon Hunter"],
      [4, "LINN, the Nanite Assassin"],
      [3, "Colonel Edwards, Mastermind"],
      [2, "Marcus, Ghost of the Gambit"],
      [1, "Lord Krung, the Agitated"],
      [1, "Haven, Quick Witted"],
      [1, "Kheprius"],
      [1, "Shadowlight, the Skilled"],
      [1, "Clarity, Harbinger of Death"],
      [4, "Denver"],
    ]),
    side: entries([
      [2, "Sharpshooter Moxie"],
      [3, "Cybernetic Recall"],
      [2, "From Life to Death"],
      [1, "Bombardment"],
      [1, "Ancient Protection"],
      [1, "Marcus, Ghost of the Gambit"],
    ]),
  },
  {
    id: "absence-makati",
    contender: "The Absence, Voice of the Void",
    source: "https://www.deckplanet.net/alpha_clash/deck/45fd8407-7912-4fbc-b900-6bb2dbb06216",
    resultSource: "https://alphaclashtcg.com/news/tvg476vnbr9u595ldw7z0y1vfr63px",
    result: "Edison Curameng / eddyzone01 — 1st, Clashground Makati, 2026-08-25 recap",
    main: entries([
      [3, "Shadowstrike"],
      [4, "Breach the Void"],
      [2, "From Life to Death"],
      [4, "The Absence, Shadow Incarnate"],
      [4, "The Absence, New Host"],
      [2, "Avenging Guy, Taking Aim"],
      [1, "Death, Overseer"],
      [2, "Death, the Endbringer"],
      [2, "Clarity, From the Shadows"],
      [4, "Death, the Dreadful"],
      [4, "Gur, Savage Aggressor"],
      [4, "Lord Krung, Ruthless Warlord"],
      [4, "Morac, the Devourer"],
      [4, "Rizlac, Ferocious Threat"],
      [4, "Trugg, Unruly Scavenger"],
      [1, "Cadavros"],
      [1, "Kilimanjaro, the Versatile"],
      [3, "Undiscovered Passageway"],
      [3, "Amazon Rainforest"],
      [3, "Low Earth Orbit"],
      [1, "Cataclysmic Surge"],
    ]),
    side: entries([
      [3, "Chaotic Unmaking"],
      [4, "Sharpshooter Moxie"],
      [4, "Magnate's Plan"],
      [4, "Entropy's Palace"],
    ]),
  },
];

export interface AlphaClashDeckIssue {
  readonly name: string;
  readonly zone: "contender" | "main" | "side";
  readonly reason: "missing-definition" | "unparsed" | "invalid-count" | "wrong-card-type";
}

export interface AlphaClashDeckAudit {
  readonly deckId: string;
  readonly mainCount: number;
  readonly sideCount: number;
  readonly ready: boolean;
  readonly issues: readonly AlphaClashDeckIssue[];
}

function normalizedName(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// The authored catalog preserves this printed spelling. This is an explicit
// identity alias, never a fuzzy match or a replacement with a different card.
const NAME_ALIASES: Readonly<Record<string, string>> = {
  [normalizedName("Zhao Li, Reconnaissance Agent")]: "Zhao Li, Reconaissance Agent",
};

function resolveName(
  name: string,
  catalog: readonly AcCardDefinition[],
): AcCardDefinition | undefined {
  const key = normalizedName(name);
  const alias = NAME_ALIASES[key];
  return (
    catalog.find((card) => normalizedName(card.name) === key) ??
    (alias
      ? catalog.find((card) => normalizedName(card.name) === normalizedName(alias))
      : undefined)
  );
}

/** Checks nested effects too; an authored module can still contain inert segments. */
export function containsUnparsed(value: unknown): boolean {
  if (Array.isArray(value)) return value.some(containsUnparsed);
  if (!value || typeof value !== "object") return false;
  if ("kind" in value && value.kind === "unparsed") return true;
  return Object.values(value).some(containsUnparsed);
}

export function auditAlphaClashDeck(
  deck: AlphaClashLabDeck,
  catalog: readonly AcCardDefinition[] = allCards(),
): AlphaClashDeckAudit {
  const issues: AlphaClashDeckIssue[] = [];
  for (const zone of ["contender", "main", "side"] as const) {
    const rows = zone === "contender" ? [{ name: deck.contender, count: 1 }] : deck[zone];
    for (const entry of rows) {
      if (!Number.isInteger(entry.count) || entry.count < 1 || entry.count > 4) {
        issues.push({ name: entry.name, zone, reason: "invalid-count" });
      }
      const card = resolveName(entry.name, catalog);
      if (!card) {
        issues.push({ name: entry.name, zone, reason: "missing-definition" });
      } else if ((zone === "contender") !== (card.cardType === "contender")) {
        issues.push({ name: entry.name, zone, reason: "wrong-card-type" });
      } else if (containsUnparsed(card)) {
        issues.push({ name: entry.name, zone, reason: "unparsed" });
      }
    }
  }
  const mainCount = deck.main.reduce((total, entry) => total + entry.count, 0);
  return {
    deckId: deck.id,
    mainCount,
    sideCount: deck.side.reduce((total, entry) => total + entry.count, 0),
    // Sideboard debt is reported, but cannot change a main-deck-only match.
    ready: mainCount >= 50 && mainCount <= 60 && issues.every((issue) => issue.zone === "side"),
    issues,
  };
}

export function resolveAlphaClashLabDeck(
  deckId: string,
  catalog: readonly AcCardDefinition[] = allCards(),
) {
  const deck = ALPHA_CLASH_META_DECKS.find((entry) => entry.id === deckId);
  if (!deck) throw new Error(`Unknown Alpha Clash bot-lab deck: ${deckId}`);
  const audit = auditAlphaClashDeck(deck, catalog);
  if (!audit.ready) {
    const blockers = audit.issues.filter((issue) => issue.zone !== "side");
    throw new Error(
      `Alpha Clash deck ${deckId} is not executable (${audit.mainCount} main cards): ` +
        blockers.map((issue) => `${issue.name} [${issue.reason}]`).join("; "),
    );
  }
  const requireCard = (name: string) => {
    const card = resolveName(name, catalog);
    if (!card) throw new Error(`Missing Alpha Clash card: ${name}`);
    return card.id;
  };
  return {
    contenderId: requireCard(deck.contender),
    deckIds: deck.main.flatMap((entry) =>
      Array.from({ length: entry.count }, () => requireCard(entry.name)),
    ),
  };
}
