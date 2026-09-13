import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jianyeDawnsKeep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4ms1r3hjxp",
  slug: "jianye-dawns-keep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4ms1r3hjxp:face:default",
      catalogId: "4ms1r3hjxp",
      name: "Jianye, Dawn's Keep",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["DOMAIN"],
        classes: ["TAMER", "WARRIOR"],
        subtypes: ["TAMER", "WARRIOR", "SIEGEABLE", "CASTLE"],
      },
      elements: ["FIRE"],
      stats: {
        durability: 7,
      },
      rulesText:
        "Kindle 6\n\n[Class Bonus] Fire element allies you control have On Death: If your influence is six or less, draw a card. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "4ms1r3hjxp-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Kindle 6",
          keyword: {
            name: "kindle",
            value: 6,
          },
        },
        {
          id: "4ms1r3hjxp-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Fire element allies you control have On Death: If your influence is six or less, draw a card. (A player's influence is equal to the total amount of cards in their hand and memory.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
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
                        kind: "element",
                        oneOf: ["FIRE"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-zwesgg-a1",
                  kind: "triggered",
                  text: "On Death: If your influence is six or less, draw a card.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "object-died",
                      subject: {
                        kind: "ability-bearer",
                      },
                    },
                  },
                  interveningCondition: {
                    kind: "player-property-compare",
                    players: "controller",
                    quantifier: "all",
                    property: "influence",
                    operator: "lte",
                    value: 6,
                  },
                  effect: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
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

export default jianyeDawnsKeep;
