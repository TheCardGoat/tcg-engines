import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const eventideSpear: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xjkdokzfd9",
  slug: "eventide-spear",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xjkdokzfd9:face:default",
      catalogId: "xjkdokzfd9",
      name: "Eventide Spear",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        durability: 1,
      },
      rulesText:
        "[Class Bonus] As long as an opponent controls two or more rested units, you may activate this card from your material deck. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "xjkdokzfd9-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent controls two or more rested units, you may activate this card from your material deck. (Apply this effect only if your champion's class matches this card's class.)",
          functionalZones: ["material-deck"],
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
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "material-deck",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    collection: {
                      zones: ["field"],
                      player: "each-opponent",
                      filter: {
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY", "CHAMPION"],
                          },
                          {
                            kind: "object-state",
                            state: "rested",
                          },
                        ],
                      },
                    },
                  },
                  operator: "gte",
                  right: 2,
                },
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

export default eventideSpear;
