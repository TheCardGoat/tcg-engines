import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const dragonsDawn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9f92917r84",
  slug: "dragons-dawn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9f92917r84:face:default",
      catalogId: "9f92917r84",
      name: "Dragon's Dawn",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        'As an additional cost to materialize this card, banish three fire element cards from your graveyard. \n\n[Class Bonus] On Attack: You may discard a fire element card and have Dragon\'s Dawn deal 2 unpreventable damage to your champion. If you do, this attack gets +2 POWER and gains "On Champion Hit: Draw a card."',
      abilities: [
        {
          id: "9f92917r84-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this card, banish three fire element cards from your graveyard.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 3,
                },
                filter: {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "9f92917r84-a2",
          kind: "triggered",
          text: '[Class Bonus] On Attack: You may discard a fire element card and have Dragon\'s Dawn deal 2 unpreventable damage to your champion. If you do, this attack gets +2 POWER and gains "On Champion Hit: Draw a card."',
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
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 2,
                  preventable: false,
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-ability",
                    ability: {
                      id: "granted-1kdbmad-a1",
                      kind: "triggered",
                      text: "On Champion Hit: Draw a card.",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "attack-hit",
                          subject: {
                            kind: "source",
                          },
                          recipient: {
                            kind: "event-object",
                            bindAs: "trigger-recipient",
                            filter: {
                              kind: "type",
                              oneOf: ["CHAMPION"],
                            },
                          },
                        },
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
          },
        },
      ],
    },
  },
};

export default dragonsDawn;
