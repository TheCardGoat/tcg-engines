import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveExecutableAbility,
} from "@tcg/grand-archive-types";

export type GrandArchiveExecutableCard = GrandArchiveAnyCard<GrandArchiveExecutableAbility>;

export interface GrandArchiveMatchProgram {
  readonly schemaVersion: 1;
  readonly fingerprint: string;
  readonly cardsById: Readonly<Record<string, GrandArchiveExecutableCard>>;
}

function hashText(text: string): string {
  let hash = 0x811c9dc5;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(16).padStart(8, "0");
}

function stableSerialize(value: unknown): string {
  if (value === null) return "null";
  if (typeof value === "string") return JSON.stringify(value);
  if (typeof value === "number" || typeof value === "boolean") return String(value);
  if (typeof value === "undefined") return "undefined";
  if (Array.isArray(value)) return `[${value.map(stableSerialize).join(",")}]`;
  if (typeof value === "object") {
    const entries = Object.entries(value).sort(([left], [right]) =>
      left < right ? -1 : left > right ? 1 : 0,
    );
    return `{${entries.map(([key, child]) => `${JSON.stringify(key)}:${stableSerialize(child)}`).join(",")}}`;
  }
  throw new Error(`Match programs cannot serialize ${typeof value} values`);
}

function deepFreeze<T>(value: T): T {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  for (const child of Object.values(value as Record<string, unknown>)) deepFreeze(child);
  return Object.freeze(value);
}

type GrandArchiveAdmissibleCard = GrandArchiveAnyCard<GrandArchiveAbilityDefinition>;

function abilitiesOf(card: GrandArchiveAdmissibleCard) {
  return facesOf(card).flatMap((face) => face.abilities);
}

function facesOf(card: GrandArchiveAdmissibleCard) {
  return card.layout.kind === "single-faced"
    ? [card.layout.face]
    : [card.layout.defaultFace, card.layout.flipFace];
}

function assertPrintedSpeedIsRulesLegal(card: GrandArchiveAdmissibleCard): void {
  if (card.definitionKind !== "card") return;
  for (const face of facesOf(card)) {
    const slowOnlyType = face.typeLine.types.find(
      (type) =>
        type === "ALLY" ||
        type === "ATTACK" ||
        type === "DOMAIN" ||
        type === "ITEM" ||
        type === "PHANTASIA" ||
        type === "WEAPON",
    );
    if (slowOnlyType && face.speed === "fast") {
      throw new Error(
        `Card ${card.canonicalId} face ${face.id} gives slow-only ${slowOnlyType} cards fast speed`,
      );
    }
  }
}

function assertFunctionalTypeStatsAreRulesLegal(card: GrandArchiveAdmissibleCard): void {
  if (card.definitionKind !== "card") return;
  for (const face of facesOf(card)) {
    const types = face.typeLine.types;
    const subtypes = face.typeLine.subtypes;
    const requiresLife = types.includes("CHAMPION") || types.includes("ALLY");
    if (requiresLife && face.stats.life === undefined) {
      throw new Error(
        `Card ${card.canonicalId} face ${face.id} requires a life stat for its card type`,
      );
    }
    const requiresPower =
      types.includes("ALLY") ||
      types.includes("ATTACK") ||
      types.includes("WEAPON") ||
      (types.includes("ITEM") && (subtypes.includes("BULLET") || subtypes.includes("ARROW"))) ||
      subtypes.includes("AETHERCHARGE");
    if (requiresPower && face.stats.power === undefined) {
      throw new Error(
        `Card ${card.canonicalId} face ${face.id} requires a power stat for its card or functional type`,
      );
    }
    // A transformed weapon can omit a printed durability value because it
    // keeps the counters established by its default face. Initial entry must
    // still have a durability-bearing face.
    const isEntryFace =
      card.layout.kind === "single-faced" || face.id === card.layout.defaultFace.id;
    const requiresDurability =
      (isEntryFace && types.includes("WEAPON")) ||
      (types.includes("DOMAIN") && subtypes.includes("SIEGEABLE"));
    if (requiresDurability && face.stats.durability === undefined) {
      throw new Error(
        `Card ${card.canonicalId} face ${face.id} requires a durability stat for its functional type`,
      );
    }
  }
}

function isExecutableCard(card: GrandArchiveAdmissibleCard): card is GrandArchiveExecutableCard {
  return abilitiesOf(card).every((ability) => ability.kind !== "unparsed");
}

export function createGrandArchiveMatchProgram(
  cards: readonly GrandArchiveAdmissibleCard[],
): GrandArchiveMatchProgram {
  const cardsById: Record<string, GrandArchiveExecutableCard> = {};
  for (const card of structuredClone(cards)) {
    if (cardsById[card.canonicalId]) {
      throw new Error(`Duplicate Grand Archive card identity: ${card.canonicalId}`);
    }
    assertPrintedSpeedIsRulesLegal(card);
    assertFunctionalTypeStatsAreRulesLegal(card);
    const unparsed = abilitiesOf(card).find((ability) => ability.kind === "unparsed");
    if (!isExecutableCard(card)) {
      throw new Error(
        `Card ${card.canonicalId} contains non-executable ability ${unparsed?.id ?? "unknown"}`,
      );
    }
    cardsById[card.canonicalId] = deepFreeze(card);
  }
  const identities = Object.keys(cardsById).sort();
  return Object.freeze({
    schemaVersion: 1,
    fingerprint: `ga-program-v1-${hashText(
      identities.map((identity) => stableSerialize(cardsById[identity])).join("\n"),
    )}`,
    cardsById: deepFreeze(cardsById),
  });
}

export function requireGrandArchiveCard(
  program: GrandArchiveMatchProgram,
  definitionId: string,
): GrandArchiveExecutableCard {
  const card = program.cardsById[definitionId];
  if (!card) throw new Error(`Unknown Grand Archive card: ${definitionId}`);
  return card;
}
