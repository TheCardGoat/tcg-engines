import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ferventBeastmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7NMFSRR5V3",
  slug: "fervent-beastmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7NMFSRR5V3:face:default",
      catalogId: "7NMFSRR5V3",
      name: "Fervent Beastmaster",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)\n\nAs long as you control a Beast ally, Fervent Beastmaster gets +1 POWER and +1 LIFE. ",
      abilities: [
        {
          id: "7NMFSRR5V3-a1",
          kind: "triggered",
          intrinsic: true,
          text: "[Class Bonus] Vigor (This unit wakes up at the beginning of your end phase. Apply this effect only if your champion's class matches this card's class.)",
          keyword: {
            name: "vigor",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
        {
          id: "7NMFSRR5V3-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a Beast ally, Fervent Beastmaster gets +1 POWER and +1 LIFE.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
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
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["BEAST"],
                      },
                    ],
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
                property: "life",
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

export default ferventBeastmaster;
