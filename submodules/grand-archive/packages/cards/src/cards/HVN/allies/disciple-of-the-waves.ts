import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const discipleOfTheWaves: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m9sfzj5d1i",
  slug: "disciple-of-the-waves",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m9sfzj5d1i:face:default",
      catalogId: "m9sfzj5d1i",
      name: "Disciple of the Waves",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Deluge 3 — As long as you have three or more water element cards in your graveyard, this card costs 1 less to activate.",
      abilities: [
        {
          id: "m9sfzj5d1i-a1",
          kind: "static",
          staticKind: "effects",
          text: "Deluge 3 — As long as you have three or more water element cards in your graveyard, this card costs 1 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["graveyard"],
                      player: "controller",
                      filter: {
                        kind: "element",
                        oneOf: ["WATER"],
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
          label: {
            name: "Deluge 3",
          },
        },
      ],
    },
  },
};

export default discipleOfTheWaves;
