import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const mandateOfHonor: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5ckzgqa186",
  slug: "mandate-of-honor",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5ckzgqa186:face:default",
      catalogId: "5ckzgqa186",
      name: "Mandate of Honor",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "As long as you control a unique ally, each player with influence eight or more can't draw cards. (A player's influence is equal to the total amount of cards in their hand and memory.)",
      abilities: [
        {
          id: "5ckzgqa186-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you control a unique ally, each player with influence eight or more can't draw cards. (A player's influence is equal to the total amount of cards in their hand and memory.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "draw",
              subject: {
                kind: "player",
                player: "each-player",
              },
              condition: {
                kind: "all",
                conditions: [
                  {
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
                            kind: "supertype",
                            oneOf: ["UNIQUE"],
                          },
                        ],
                      },
                    },
                  },
                  {
                    kind: "player-property-compare",
                    players: "event-actor",
                    quantifier: "any",
                    property: "influence",
                    operator: "gte",
                    value: 8,
                  },
                ],
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

export default mandateOfHonor;
