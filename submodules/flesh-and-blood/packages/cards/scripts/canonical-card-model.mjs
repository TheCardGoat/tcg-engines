import path from "node:path";

export const CANONICAL_CARD_DIRECTORIES = [
  "actions",
  "attack-reactions",
  "defense-reactions",
  "instants",
  "blocks",
  "equipment",
  "weapons",
  "heroes",
  "allies",
  "companions",
  "resources",
  "tokens",
  "mentors",
  "demi-heroes",
  "macros",
  "events",
  "placeholders",
  "conditions",
];

export const PRIMARY_TYPE_BY_DIRECTORY = {
  placeholders: "Placeholder Card",
  "demi-heroes": "Demi-Hero",
  companions: "Companion",
  mentors: "Mentor",
  actions: "Action",
  "attack-reactions": "Attack Reaction",
  "defense-reactions": "Defense Reaction",
  instants: "Instant",
  blocks: "Block",
  equipment: "Equipment",
  weapons: "Weapon",
  resources: "Resource",
  tokens: "Token",
  allies: "Ally",
  heroes: "Hero",
  macros: "Macro",
  events: "Event",
  conditions: "Token",
};

const TYPE_PRECEDENCE = Object.entries(PRIMARY_TYPE_BY_DIRECTORY).map(([directory, type]) => [
  type,
  directory,
]);
const EXPLICIT_DIRECTORY_BY_SLUG = { marked: "conditions" };
const COLOR_PITCH = { red: "1", yellow: "2", blue: "3" };

export function classifyDirectory(types, slug) {
  const explicit = EXPLICIT_DIRECTORY_BY_SLUG[slug];
  if (explicit) return explicit;
  for (const [type, directory] of TYPE_PRECEDENCE) {
    if (types.includes(type)) return directory;
  }
  return undefined;
}

export function primaryTypeForCard(card) {
  const directory = classifyDirectory(card.types, card.slug);
  return directory ? PRIMARY_TYPE_BY_DIRECTORY[directory] : undefined;
}

export function canonicalBaseSlug(card) {
  const match = card.slug.match(/-(red|yellow|blue)$/);
  if (!match) return card.slug;
  const color = match[1];
  if (String(card.color ?? "").toLowerCase() !== color) return card.slug;
  if (card.pitch !== undefined && String(card.pitch) !== COLOR_PITCH[color]) return card.slug;
  return card.slug.slice(0, -(color.length + 1));
}

export function canonicalTarget(cardsRoot, card) {
  const directory = classifyDirectory(card.types, card.slug);
  if (!directory) return undefined;
  return path.join(cardsRoot, directory, `${canonicalBaseSlug(card)}.ts`);
}
