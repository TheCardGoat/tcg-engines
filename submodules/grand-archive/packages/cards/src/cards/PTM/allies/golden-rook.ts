import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const goldenRook: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iCgcAFU458",
  slug: "golden-rook",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iCgcAFU458:face:default",
      catalogId: "iCgcAFU458",
      name: "Golden Rook",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CHESSMAN", "ROOK", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "As long as Golden Rook is attacking a unit with an even life stat, Golden Rook gets +1POWER.",
      abilities: [
        {
          id: "iCgcAFU458-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as Golden Rook is attacking a unit with an even life stat, Golden Rook gets +1POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "source",
                },
                otherFilter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default goldenRook;
