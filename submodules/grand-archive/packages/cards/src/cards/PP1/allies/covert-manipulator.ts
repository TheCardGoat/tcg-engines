import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const covertManipulator: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "A1jfgrWpiN",
  slug: "covert-manipulator",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "A1jfgrWpiN:face:default",
      catalogId: "A1jfgrWpiN",
      name: "Covert Manipulator",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Look at the top card of each opponent's deck. Then you may choose an opponent. If you do, you gain the Crowd's Favor status, that opponent draws a card, and each of your other opponents puts the top card of their deck into their graveyard. ",
      abilities: [
        {
          id: "A1jfgrWpiN-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Look at the top card of each opponent's deck. Then you may choose an opponent. If you do, you gain the Crowd's Favor status, that opponent draws a card, and each of your other opponents puts the top card of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
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
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-opponent-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: 1,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "each-opponent",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "choose",
                  selection: {
                    id: "chosen-opponent",
                    kind: "choice",
                    declared: "resolution",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    unique: true,
                    candidates: {
                      kind: "player",
                      players: "each-opponent",
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "set-player-state",
                        player: "controller",
                        state: {
                          named: "crowds-favor",
                        },
                        value: true,
                      },
                      {
                        kind: "draw",
                        player: {
                          binding: "chosen-opponent",
                        },
                        amount: 1,
                      },
                      {
                        kind: "mill",
                        player: {
                          eachExcept: {
                            binding: "chosen-opponent",
                          },
                        },
                        amount: 1,
                      },
                    ],
                  },
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default covertManipulator;
