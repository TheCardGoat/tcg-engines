import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const maidenOfPrimalVirtue: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "hbt487eux7",
  slug: "maiden-of-primal-virtue",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "hbt487eux7:face:default",
      catalogId: "hbt487eux7",
      name: "Maiden of Primal Virtue",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA", "ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "APPARITION"],
      },
      elements: ["TERA"],
      stats: {
        power: 0,
        life: 0,
      },
      rulesText:
        "Maiden of Primal Virtue gets +1 POWER and +1 LIFE for each phantasia you control.",
      abilities: [
        {
          id: "hbt487eux7-a1",
          kind: "static",
          staticKind: "effects",
          text: "Maiden of Primal Virtue gets +1 POWER and +1 LIFE for each phantasia you control.",
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
                property: "power",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["PHANTASIA"],
                    },
                  },
                },
              },
            },
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
                property: "life",
                operation: "add",
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["PHANTASIA"],
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

export default maidenOfPrimalVirtue;
