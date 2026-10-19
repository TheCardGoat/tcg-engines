import { allCards } from "@tcg/alpha-clash-cards";
import type { AcCardDefinition } from "@tcg/alpha-clash-types";

export interface AlphaClashDeckEntry {
  readonly name: string;
  readonly count: number;
}

export interface AlphaClashLabDeck {
  readonly id: string;
  readonly name: string;
  readonly contender: string;
  readonly source: string;
  readonly resultSource: string;
  readonly result: string;
  readonly sourceRetrievedOn?: string;
  readonly sourceUpdatedAt?: string;
  readonly sourceNote?: string;
  readonly main: readonly AlphaClashDeckEntry[];
  readonly side: readonly AlphaClashDeckEntry[];
}

const entries = (rows: readonly (readonly [number, string])[]): AlphaClashDeckEntry[] =>
  rows.map(([count, name]) => ({ count, name }));

/** Published lists are preserved, including sideboards. Matches use the main deck only. */
export const ALPHA_CLASH_META_DECKS: readonly AlphaClashLabDeck[] = [
  {
    id: "clarity-hyper-aggro",
    name: "Clarity Hyper Aggro",
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
    name: "The Absence — Makati",
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
  {
    id: "season3-undefendable-clarity",
    name: "Clarity — undefendable (Season 3 link)",
    contender: "Clarity, Ready for Trials",
    source: "https://op-deckplanet.com/alpha_clash/deck/be48dd18-0a88-477a-b9d7-10c841624b21",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "undefendable — 2nd, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceNote:
      "Recovered from the web cache (reported crawl: September 2026). The original host returns DEPLOYMENT_NOT_FOUND; the same ID on www.deckplanet.net is inaccessible. Card names resolved from cached image printing numbers; the displayed totals are 51 main and 11 side.",
    main: entries([
      [4, "Zhao Li, Reconnaissance Agent"],
      [4, "Haven, the Resourceful Helper"],
      [4, "LINN, the Nanite Assassin"],
      [4, "Cao Ling, Demon Hunter"],
      [3, "Colonel Edwards, Mastermind"],
      [2, "Marcus, Ghost of the Gambit"],
      [4, "Denver"],
      [4, "Sacrificial Strength"],
      [4, "Controlling the Situation"],
      [3, "Bombardment"],
      [3, "Restoration"],
      [2, "From Life to Death"],
      [2, "From Beginning to End"],
      [2, "Sharpshooter Moxie"],
      [2, "Clarity's 1911"],
      [1, "Shadowlight, the Skilled"],
      [1, "Clarity, Harbinger of Death"],
      [1, "Kheprius"],
      [1, "Haven, Quick Witted"],
    ]),
    side: entries([
      [2, "Ancient Protection"],
      [2, "Home Field Advantage"],
      [2, "Cybernetic Recall"],
      [2, "Webber's Binoculars"],
      [1, "Marcus, Ghost of the Gambit"],
      [1, "From Life to Death"],
      [1, "Lord Krung, the Agitated"],
    ]),
  },
  {
    id: "season3-fexar-clarity",
    name: "Clarity — fexar (Season 3 link)",
    contender: "Clarity, Ready for Trials",
    source: "https://www.deckplanet.net/alpha_clash/deck/58126252-e6a3-421e-8556-13e2c286812d",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "fexar — 3rd, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-09-23T19:21:45.200Z",
    sourceNote:
      "Live linked list. The page was updated after the event; the original Season 3 submission is not verified.",
    main: entries([
      [4, "Zhao Li, Reconnaissance Agent"],
      [4, "Haven, the Resourceful Helper"],
      [4, "LINN, the Nanite Assassin"],
      [4, "Cao Ling, Demon Hunter"],
      [2, "Colonel Edwards, Mastermind"],
      [2, "Marcus, Ghost of the Gambit"],
      [4, "Denver"],
      [4, "Sacrificial Strength"],
      [4, "Controlling the Situation"],
      [3, "Bombardment"],
      [3, "Restoration"],
      [2, "From Life to Death"],
      [2, "Sharpshooter Moxie"],
      [2, "Clarity's 1911"],
      [1, "Shadowlight, the Skilled"],
      [1, "Clarity, Harbinger of Death"],
      [1, "Kheprius"],
      [1, "Haven, Quick Witted"],
      [1, "Lord Krung, the Agitated"],
      [1, "Shadowblade"],
    ]),
    side: entries([
      [2, "Ancient Protection"],
      [2, "Home Field Advantage"],
      [2, "Cybernetic Recall"],
      [2, "Webber's Binoculars"],
      [1, "Marcus, Ghost of the Gambit"],
      [1, "From Life to Death"],
    ]),
  },
  {
    id: "season3-xiii-war",
    name: "War — xiii (Season 3 link)",
    contender: "War, Legion Commander",
    source: "https://www.deckplanet.net/alpha_clash/deck/182f7a71-2424-4805-80e9-3ece79fa55b3",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result: "xiii — 5th, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-10-10T15:12:42.438Z",
    sourceNote:
      'The Season 3 article link now shows "7th Place Progenitor\'s Gambit: USA (R. Acosta)". Preserved as the current linked list, not a verified Season 3 submission.',
    main: entries([
      [4, "War's Gauntlets"],
      [4, "Modern Bardaga"],
      [4, "War, Combat Marshal"],
      [3, "I am Chaos"],
      [3, "Favorable Outcome"],
      [4, "Areson, Call to Arms"],
      [4, "War, Bloodlust Commander"],
      [4, "Rizlac, Ferocious Threat"],
      [2, "Bardagan Warhorn"],
      [3, "Conquering Might"],
      [4, "Decimation"],
      [2, "The Beginning of the End"],
      [4, "War, Strife Bringer"],
      [4, "Areson, Rising Threat"],
      [1, "War, the Second Horseman"],
      [1, "Consuming Fire"],
      [1, "HERE COMES THE BOOM!"],
      [4, "Energy Blast"],
      [2, "Replicate"],
      [2, "Warzone"],
    ]),
    side: entries([]),
  },
  {
    id: "season3-sloppy-valen",
    name: "Valen — sloppy (Season 3 link)",
    contender: "Valen Solariel, Healer of Eldralore",
    source: "https://www.deckplanet.net/alpha_clash/deck/19552f17-de2f-40ac-a233-a1548280172f",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "sloppy — 6th, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-09-20T10:31:59.396Z",
    sourceNote:
      "Live linked list. The page was updated after the event; the original Season 3 submission is not verified.",
    main: entries([
      [1, "Conquest, the Contentious"],
      [3, "Somewhere in San Francisco"],
      [3, "Clarity's Suite"],
      [4, "Triumphant Revitalization"],
      [2, "Ancient Protection"],
      [3, "Sphere of Protection"],
      [1, "Cleansing Whirlwind Kick"],
      [4, "Life From Ashes"],
      [2, "Haven, Hiding in Plain Sight"],
      [3, "HERE COMES THE BOOM!"],
      [3, "LINN, Adaptable Fighter"],
      [4, "Master Zephyrion, Holding the Line"],
      [4, "Clarity, Omniscient Envoy"],
      [3, "Clarity, Foreseeing Fate"],
      [4, "Flare, Explosive Combatant"],
      [1, "Chains of Dominion"],
      [3, "Valen Solariel"],
      [2, "Chaos Ensues"],
    ]),
    side: entries([]),
  },
  {
    id: "season3-silou-death",
    name: "Death — silou (Season 3 link)",
    contender: "Death, Chaos Bringer",
    source: "https://www.deckplanet.net/alpha_clash/deck/f9675478-fe5e-454a-ad65-8c0f701f3210",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "silou — 7th, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-09-21T18:11:14.263Z",
    sourceNote:
      "Live linked list. The page was updated after the event; the original Season 3 submission is not verified.",
    main: entries([
      [3, "Death, Agent of the Dark"],
      [4, "I am Demise"],
      [4, "Death, Queen of the Dark"],
      [4, "Death, the Endbringer"],
      [4, "Death, Charging Through"],
      [4, "Sharpshooter Moxie"],
      [3, "Low Earth Orbit"],
      [3, "Shadowstrike"],
      [4, "Death, the Dreadful"],
      [4, "Pestilence, the Infectious"],
      [1, "Cadavros"],
      [1, "Kilimanjaro, the Versatile"],
      [4, "Deflating"],
      [3, "Amazon Rainforest"],
      [1, "Thragor, Dread Titan"],
      [3, "Clarity, Bad Omen"],
      [3, "Clarity, From the Shadows"],
      [3, "From Life to Death"],
    ]),
    side: entries([
      [4, "Spatial Gateway"],
      [1, "From Life to Death"],
      [4, "Magnate's Plan"],
    ]),
  },
  {
    id: "season3-silou-clarity",
    name: "Clarity — silou (Season 3 link)",
    contender: "Clarity, Ready for Trials",
    source: "https://www.deckplanet.net/alpha_clash/deck/d6c61784-9846-49a1-9f5f-94dc323b6883",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "silou — 7th, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-10-01T06:08:21.642Z",
    sourceNote:
      "Live linked list. The page was updated after the event; the original Season 3 submission is not verified.",
    main: entries([
      [4, "I am Demise"],
      [4, "Areson, Call to Arms"],
      [4, "Areson, Rising Threat"],
      [4, "Rizlac, Ferocious Threat"],
      [4, "Death, the Endbringer"],
      [4, "War, Bloodlust Commander"],
      [4, "War, Strife Bringer"],
      [3, "Shadowstrike"],
      [4, "Deflating"],
      [1, "Moxie, the Decisive"],
      [1, "Iron Piston"],
      [4, "Favorable Outcome"],
      [3, "Bombardment"],
      [3, "Somewhere in San Francisco"],
      [3, "Sharpshooter Moxie"],
      [4, "Anzudak, in the Mix"],
    ]),
    side: entries([
      [1, "Sharpshooter Moxie"],
      [4, "Consuming Fire"],
      [1, "Somewhere in San Francisco"],
      [4, "HERE COMES THE BOOM!"],
    ]),
  },
  {
    id: "season3-avalogaming-kilimanjaro",
    name: "Kilimanjaro — avalogaming (Season 3 link)",
    contender: "Kilimanjaro, Power Erupting",
    source: "https://www.deckplanet.net/alpha_clash/deck/bb3ab20f-ceed-4292-99f2-4244f3056dda",
    resultSource: "https://alphaclashtcg.com/news/alpha-clash-online-league-season3-recap",
    result:
      "avalogaming — 8th, Online League Season 3, 2026-08-19 (article result; linked-list snapshot)",
    sourceRetrievedOn: "2026-10-11",
    sourceUpdatedAt: "2026-10-06T20:53:45.275Z",
    sourceNote:
      "Live linked list. The page was updated after the event; the original Season 3 submission is not verified.",
    main: entries([
      [4, "LINN, the Nanite Assassin"],
      [4, "Pestilence, the Infectious"],
      [4, "Pestilence, Mayhem Maker"],
      [3, "Moxie, Alpha Hunting Specialist"],
      [4, "Cadavros, Vile Virtuoso"],
      [3, "Pestilence, Devious Servant"],
      [1, "Cao Ling, the Huntsman"],
      [2, "Magnate, the Tyrant"],
      [3, "Khagan, the Dragon"],
      [1, "Thragor, Dread Titan"],
      [1, "Apex, the Fastest"],
      [1, "Kilimanjaro, the Versatile"],
      [1, "Lord Krung, the Agitated"],
      [3, "Bombardment"],
      [2, "Under Pressure"],
      [2, "Restoration"],
      [2, "Endless Cycle"],
      [2, "Danger Detected"],
      [2, "Harvest of Souls"],
      [2, "Chaotic Unmaking"],
      [4, "Amazon Rainforest"],
      [3, "Molten Crag"],
    ]),
    side: entries([
      [3, "Marcus, Ghost of the Gambit"],
      [3, "Ancient Greed"],
      [3, "Kilimanjaro, the Primordial"],
      [2, "From Life to Death"],
      [2, "Clarity, From the Shadows"],
      [2, "Lefty's Last Stand"],
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
      if (!Number.isInteger(entry.count) || entry.count < 1) {
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
    // Construction rules belong to format admission, not practice execution.
    ready: issues.every((issue) => issue.zone === "side"),
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
