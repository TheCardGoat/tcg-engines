import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embertailSquirrel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "W1vZwOXfG3",
  slug: "embertail-squirrel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "W1vZwOXfG3:face:default",
      catalogId: "W1vZwOXfG3",
      name: "Embertail Squirrel",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "SQUIRREL"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: You may discard a fire element card. If you do, Embertail Squirrel gets +2 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "W1vZwOXfG3-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may discard a fire element card. If you do, Embertail Squirrel gets +2 POWER until end of turn. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["FIRE"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "continuous",
                    subjects: {
                      kind: "source",
                    },
                    affectedSet: "locked",
                    duration: {
                      kind: "this-turn",
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
                      amount: 2,
                    },
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

export default embertailSquirrel;
