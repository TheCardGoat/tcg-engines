import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const raiStormSeer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "g92bHLtTNl",
  slug: "rai-storm-seer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "g92bHLtTNl:face:default",
      catalogId: "g92bHLtTNl",
      name: "Rai, Storm Seer",
      lineageName: "Rai",
      cost: {
        kind: "memory",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["ARCANE"],
      stats: {
        level: 3,
        life: 25,
      },
      rulesText:
        'Rai Lineage (Rai, Storm Seer must be leveled from a previous level "Rai" champion.)\n\nRai gets +1 level for each arcane element Mage Spell card in your banishment.',
      abilities: [
        {
          id: "g92bHLtTNl-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: 'Rai Lineage (Rai, Storm Seer must be leveled from a previous level "Rai" champion.)',
          keyword: {
            name: "lineage",
            lineageName: "Rai",
          },
        },
        {
          id: "g92bHLtTNl-a2",
          kind: "static",
          staticKind: "effects",
          text: "Rai gets +1 level for each arcane element Mage Spell card in your banishment.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
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
                property: "level",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["ARCANE"],
                        },
                        {
                          kind: "class",
                          oneOf: ["MAGE"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["SPELL"],
                        },
                      ],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default raiStormSeer;
