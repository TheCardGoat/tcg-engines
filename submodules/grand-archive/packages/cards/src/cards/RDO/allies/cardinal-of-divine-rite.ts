import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cardinalOfDivineRite: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "UilIL2xYxb",
  slug: "cardinal-of-divine-rite",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "UilIL2xYxb:face:default",
      catalogId: "UilIL2xYxb",
      name: "Cardinal of Divine Rite",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText: "Angel cards and objects can't become imbued.",
      abilities: [
        {
          id: "UilIL2xYxb-a1",
          kind: "static",
          staticKind: "effects",
          text: "Angel cards and objects can't become imbued.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "imbue",
              filter: {
                kind: "subtype",
                oneOf: ["ANGEL"],
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default cardinalOfDivineRite;
