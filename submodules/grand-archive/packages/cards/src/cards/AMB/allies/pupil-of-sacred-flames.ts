import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pupilOfSacredFlames: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n06isycm60",
  slug: "pupil-of-sacred-flames",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n06isycm60:face:default",
      catalogId: "n06isycm60",
      name: "Pupil of Sacred Flames",
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
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, empower 2.\n\n[Kongming Bonus] On Death: If your Shifting Currents face East, each player draws a card and then you may change the direction of your Shifting Currents to a different direction of your choice.",
      abilities: [
        {
          id: "n06isycm60-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may banish a fire element card from your graveyard. If you do, empower 2.",
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
                        amount: 1,
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
                    kind: "keyword-action",
                    action: "empower",
                    amount: 2,
                  },
                },
              ],
            },
          },
        },
        {
          id: "n06isycm60-a2",
          kind: "triggered",
          text: "[Kongming Bonus] On Death: If your Shifting Currents face East, each player draws a card and then you may change the direction of your Shifting Currents to a different direction of your choice.",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "conditional",
                condition: {
                  kind: "player-state",
                  player: "controller",
                  state: {
                    named: "shifting-currents",
                    value: "East",
                  },
                },
                then: {
                  kind: "draw",
                  player: "each-player",
                  amount: 1,
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose-direction",
                  player: "controller",
                  state: "shifting-currents",
                  directions: ["north", "east", "south", "west"],
                  differentFromCurrent: true,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default pupilOfSacredFlames;
