import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const gildasChroniclerOfAesa: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "JAs9SmLqUS",
  slug: "gildas-chronicler-of-aesa",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "JAs9SmLqUS:face:default",
      catalogId: "JAs9SmLqUS",
      name: "Gildas, Chronicler of Aesa",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "(Unique — You can control only one object with this card's name.)\n\nBalance — Gildas gets +3 POWER as long as the amount of cards in your hand and memory are equal. ",
      abilities: [
        {
          id: "JAs9SmLqUS-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Unique — You can control only one object with this card's name.)",
          keyword: {
            name: "unique",
          },
        },
        {
          id: "JAs9SmLqUS-a2",
          kind: "static",
          staticKind: "effects",
          text: "Balance — Gildas gets +3 POWER as long as the amount of cards in your hand and memory are equal.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["hand"],
                      player: "controller",
                    },
                  },
                  operator: "eq",
                  right: {
                    kind: "count",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
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
                amount: 3,
              },
            },
          ],
          label: {
            name: "Balance",
          },
        },
      ],
    },
  },
};

export default gildasChroniclerOfAesa;
