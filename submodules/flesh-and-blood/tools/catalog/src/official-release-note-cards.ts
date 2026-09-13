/**
 * Official Usurp the Shadow Throne identities that LSS has published in the
 * set release notes but The FAB Cube has not admitted yet. Cube unique_id is
 * still the long-term canonicalId; these placeholders are skipped as soon as
 * Cube publishes the same name+pitch, then retired on the next refresh.
 *
 * Source: https://fabtcg.com/rules-and-policy-center/release-notes/usurp-the-shadow-throne/
 */

const CORRUPTED_CORPSE_ID = "qmC78MP6bjTHcDChc6RMJ";

type OfficialReleaseNoteCubeCard = {
  readonly unique_id: string;
  readonly name: string;
  readonly color: string;
  readonly pitch: string;
  readonly cost: string;
  readonly power: string;
  readonly defense: string;
  readonly health: string;
  readonly intelligence: string;
  readonly arcane: string;
  readonly types: readonly string[];
  readonly traits: readonly string[];
  readonly card_keywords: readonly string[];
  readonly abilities_and_effects: readonly string[];
  readonly ability_and_effect_keywords: readonly string[];
  readonly granted_keywords: readonly string[];
  readonly removed_keywords: readonly string[];
  readonly interacts_with_keywords: readonly string[];
  readonly functional_text: string;
  readonly functional_text_plain: string;
  readonly type_text: string;
  readonly played_horizontally: boolean;
  readonly blitz_legal: boolean;
  readonly cc_legal: boolean;
  readonly commoner_legal: boolean;
  readonly ll_legal: boolean;
  readonly silver_age_legal: boolean;
  readonly blitz_living_legend: boolean;
  readonly cc_living_legend: boolean;
  readonly blitz_banned: boolean;
  readonly cc_banned: boolean;
  readonly commoner_banned: boolean;
  readonly ll_banned: boolean;
  readonly silver_age_banned: boolean;
  readonly upf_banned: boolean;
  readonly blitz_suspended: boolean;
  readonly cc_suspended: boolean;
  readonly commoner_suspended: boolean;
  readonly ll_restricted: boolean;
  readonly printings: readonly [];
  readonly referenced_cards?: readonly string[];
};

const LEGAL_DEFAULTS = {
  traits: [],
  abilities_and_effects: [],
  ability_and_effect_keywords: [],
  granted_keywords: [],
  removed_keywords: [],
  interacts_with_keywords: [],
  played_horizontally: false,
  blitz_legal: true,
  cc_legal: true,
  commoner_legal: true,
  ll_legal: true,
  silver_age_legal: true,
  blitz_living_legend: false,
  cc_living_legend: false,
  blitz_banned: false,
  cc_banned: false,
  commoner_banned: false,
  ll_banned: false,
  silver_age_banned: false,
  upf_banned: false,
  blitz_suspended: false,
  cc_suspended: false,
  commoner_suspended: false,
  ll_restricted: false,
  printings: [],
} as const;

export const OFFICIAL_RELEASE_NOTE_CARDS: readonly OfficialReleaseNoteCubeCard[] = [
  {
    ...LEGAL_DEFAULTS,
    unique_id: "2vfyA32UrTDEvWN89DzbY",
    name: "Clambering Corpses",
    color: "Blue",
    pitch: "3",
    cost: "0",
    power: "1",
    defense: "3",
    health: "",
    intelligence: "",
    arcane: "",
    types: ["Shadow", "Necromancer", "Action", "Attack"],
    card_keywords: [],
    functional_text:
      "When this attacks, you may discard a zombie. If you do, this gets +3{p} and go again.\n\nWhen this hits a hero, your zombie attacks this turn get go again.",
    functional_text_plain:
      "When this attacks, you may discard a zombie. If you do, this gets +3{p} and go again.\nWhen this hits a hero, your zombie attacks this turn get go again.",
    type_text: "Shadow Necromancer Action - Attack",
  },
  {
    ...LEGAL_DEFAULTS,
    unique_id: "yZVKqsVG5nMJ5jkmz466z",
    name: "Otherworldly Ossuary",
    color: "Blue",
    pitch: "3",
    cost: "1",
    power: "",
    defense: "3",
    health: "",
    intelligence: "",
    arcane: "",
    types: ["Shadow", "Necromancer", "Action"],
    card_keywords: ["Go again"],
    functional_text: "Create a Corrupted Corpse in your banished zone.\n\n**Go again**",
    functional_text_plain: "Create a Corrupted Corpse in your banished zone.\nGo again",
    type_text: "Shadow Necromancer Action",
    referenced_cards: [CORRUPTED_CORPSE_ID],
  },
];

export function withOfficialReleaseNoteCards<T extends { name: string; pitch: string }>(
  cards: readonly T[],
): T[] {
  if (!cards.some((card) => card.name === "Malice, Domina of the Dead")) return [...cards];
  const seen = new Set(cards.map((card) => `${card.name}\0${card.pitch}`));
  return [
    ...cards,
    ...OFFICIAL_RELEASE_NOTE_CARDS.filter((card) => !seen.has(`${card.name}\0${card.pitch}`)).map(
      (card) => card as unknown as T,
    ),
  ];
}
