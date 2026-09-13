import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sunkenBattlePriest: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sm68d3we64",
  slug: "sunken-battle-priest",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sm68d3we64:face:default",
      catalogId: "sm68d3we64",
      name: "Sunken Battle Priest",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "SPECTER"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Other ephemeral allies you control get +1POWER.\n\nEphemerate — (3), Banish a card with floating memory from your graveyard. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
      abilities: [
        {
          id: "sm68d3we64-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Other ephemeral allies you control get +1POWER.",
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
                        kind: "all",
                        filters: [
                          {
                            kind: "type",
                            oneOf: ["ALLY"],
                          },
                          {
                            kind: "object-state",
                            state: "ephemeral",
                          },
                        ],
                      },
                      {
                        kind: "not-source",
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
        {
          id: "sm68d3we64-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Ephemerate — (3), Banish a card with floating memory from your graveyard. (You may activate this card from your graveyard by paying this cost. Ally cards played this way become ephemeral as they enter the field.)",
          keyword: {
            name: "ephemerate",
            cost: {
              kind: "all",
              costs: [
                {
                  kind: "pay-reserve",
                  amount: 3,
                },
                {
                  kind: "select-and-move",
                  player: "controller",
                  from: "graveyard",
                  to: "banishment",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  filter: {
                    kind: "has-keyword",
                    keyword: "floating-memory",
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default sunkenBattlePriest;
