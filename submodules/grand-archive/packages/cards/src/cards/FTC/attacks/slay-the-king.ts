import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const slayTheKing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6v374coy34",
  slug: "slay-the-king",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6v374coy34:face:default",
      catalogId: "6v374coy34",
      name: "Slay the King",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["CRUX"],
      stats: {
        power: 4,
      },
      rulesText:
        '[Class Bonus] On Attack: You may banish a card from your material deck. If you do, Slay the King gains "On Kill: You may play the banished card."',
      abilities: [
        {
          id: "6v374coy34-a1",
          kind: "triggered",
          text: '[Class Bonus] On Attack: You may banish a card from your material deck. If you do, Slay the King gains "On Kill: You may play the banished card."',
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
                      zones: ["material-deck"],
                      relationship: "zone-of",
                      player: "controller",
                    },
                  },
                },
                {
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
                      id: "granted-ye5b4p-a1",
                      kind: "triggered",
                      text: "On Kill: You may play the banished card.",
                      trigger: {
                        kind: "event",
                        event: {
                          name: "object-killed",
                          subject: {
                            kind: "source",
                          },
                        },
                      },
                      effect: {
                        kind: "optional",
                        player: "controller",
                        allOrNothing: true,
                        effect: {
                          kind: "play-card",
                          subject: {
                            kind: "each",
                            collection: {
                              zones: ["banishment"],
                              host: {
                                kind: "source",
                              },
                              relationship: "banished-by",
                            },
                          },
                          payCosts: true,
                        },
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

export default slayTheKing;
