import type {
  GrandArchiveAbilityDefinition,
  GrandArchiveAnyCard,
  GrandArchiveCard,
} from "@tcg/grand-archive-types";

type ClassBonusFixtureKind = "activation-discount" | "floating-memory";

export function grandArchiveTestFace(card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>) {
  return card.layout.kind === "single-faced" ? card.layout.face : card.layout.defaultFace;
}

export function grandArchiveDefaultFaceId(canonicalId: string): `${string}:face:default` {
  return `${canonicalId}:face:default` as `${string}:face:default`;
}

export function grandArchiveAbilityId(canonicalId: string, index: number): `${string}-a${number}` {
  return `${canonicalId}-a${index}` as `${string}-a${number}`;
}

export function requireSingleFace(card: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">) {
  if (card.layout.kind !== "single-faced") throw new Error("Expected a single-faced card");
  return card.layout.face;
}

export function createClassBonusTestChampion(
  card: GrandArchiveAnyCard<GrandArchiveAbilityDefinition>,
  classBonusEnabled: boolean,
  fixtureKind: ClassBonusFixtureKind,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const face = grandArchiveTestFace(card);
  const [firstElement, ...remainingElements] = face.elements;
  if (!firstElement) throw new Error(`${face.name} must have at least one element.`);
  if (face.typeLine.classes.includes("SPIRIT")) {
    throw new Error("The nonmatching test champion must not share the SPIRIT class.");
  }
  const state = classBonusEnabled ? "enabled" : "disabled";
  const canonicalId = `${card.canonicalId}-${fixtureKind}-${state}`;
  return {
    canonicalId,
    slug: `${card.slug}-${fixtureKind}-${state}`,
    definitionKind: "card",
    layout: {
      kind: "single-faced",
      face: {
        id: grandArchiveDefaultFaceId(canonicalId),
        catalogId: `${card.canonicalId}-${fixtureKind}-test-champion`,
        name: `Test Champion (${face.name})`,
        lineageName: "Test Champion",
        cost: { kind: "memory", amount: 0 },
        typeLine: {
          supertypes: [],
          types: ["CHAMPION"],
          classes: classBonusEnabled ? face.typeLine.classes : ["SPIRIT"],
          subtypes: classBonusEnabled ? face.typeLine.classes : ["SPIRIT"],
        },
        elements: [firstElement, ...remainingElements],
        stats: { level: 0, life: 15 },
        rulesText: "",
        abilities: [],
      },
    },
  };
}

export function grantTestChampionLevel(
  champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
  extraLevel: number,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const face = requireSingleFace(champion);
  const canonicalId = `${champion.canonicalId}-lv${extraLevel}`;
  return {
    ...champion,
    canonicalId,
    slug: `${champion.slug}-lv${extraLevel}`,
    layout: {
      kind: "single-faced",
      face: {
        ...face,
        id: grandArchiveDefaultFaceId(canonicalId),
        abilities: [
          ...face.abilities,
          {
            id: grandArchiveAbilityId(canonicalId, 1),
            kind: "static",
            staticKind: "effects",
            text: `This champion gets +${extraLevel} level.`,
            effects: [
              {
                kind: "continuous",
                subjects: { kind: "source" },
                affectedSet: "dynamic",
                duration: { kind: "while-source-in-functional-zone" },
                layer: { layer: "E", modifies: "stat", sublayer: "modifier" },
                change: {
                  kind: "numeric",
                  property: "level",
                  operation: "add",
                  amount: extraLevel,
                },
              },
            ],
          },
        ],
      },
    },
  };
}

/** Keep the champion's printed element identity while enabling all card elements. */
export function enableAllTestElements(
  champion: GrandArchiveCard<GrandArchiveAbilityDefinition, "card">,
): GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> {
  const face = requireSingleFace(champion);
  return {
    ...champion,
    layout: {
      kind: "single-faced",
      face: {
        ...face,
        abilities: [
          ...face.abilities,
          {
            id: grandArchiveAbilityId(champion.canonicalId, face.abilities.length + 1),
            kind: "static",
            staticKind: "effects",
            text: "All elements are enabled for the fixture.",
            effects: [
              {
                kind: "continuous-player-state",
                players: "controller",
                state: { named: "enabled-element", value: "ALL" },
                value: true,
                duration: { kind: "while-source-in-functional-zone" },
              },
            ],
          },
        ],
      },
    },
  };
}
