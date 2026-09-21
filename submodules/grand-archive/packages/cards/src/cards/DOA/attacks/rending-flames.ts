import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rendingFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "soO3hjaVfN",
  slug: "rending-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "soO3hjaVfN:face:default",
      catalogId: "soO3hjaVfN",
      name: "Rending Flames",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
      },
      rulesText:
        '[Class Bonus] On Attack: You may banish three fire element cards from your graveyard. If you do, Rending Flames gains "If this attack would deal damage, it deals double that damage instead."',
      abilities: [
        {
          id: "soO3hjaVfN-a1",
          kind: "triggered",
          text: '[Class Bonus] On Attack: You may banish three fire element cards from your graveyard. If you do, Rending Flames gains "If this attack would deal damage, it deals double that damage instead."',
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
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 3,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["graveyard"],
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
                      kind: "permanent",
                    },
                    layer: {
                      layer: "D",
                      modifies: "ability",
                    },
                    change: {
                      kind: "grant-ability",
                      ability: {
                        id: "granted-d0ekj-a1",
                        kind: "static",
                        staticKind: "effects",
                        text: "If this attack would deal damage, it deals double that damage instead.",
                        effects: [
                          {
                            kind: "replacement",
                            event: {
                              name: "damage-dealt",
                              using: {
                                kind: "source",
                              },
                              combatDamage: true,
                            },
                            operation: {
                              kind: "modify-amount",
                              operation: "multiply",
                              amount: 2,
                            },
                            duration: {
                              kind: "this-attack",
                            },
                          },
                        ],
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

export default rendingFlames;
