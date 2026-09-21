import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fabledSapphireFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vzmnt0orxj",
  slug: "fabled-sapphire-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "vzmnt0orxj:face:default",
      catalogId: "vzmnt0orxj",
      name: "Fabled Sapphire Fatestone",
      cost: {
        kind: "memory",
        amount: 9,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Immortality, Spellshroud\n[Guo Jia Bonus] At the beginning of your recollection phase, each player puts the top card of their deck into their graveyard.\n\n[Guo Jia Bonus] Whenever one or more cards are put into your graveyard from your deck, put a quest counter on your champion.\n\nREST: You may remove nine quest counters from your champion. If you do, wake up and transform Fabled Sapphire Fatestone.",
      abilities: [
        {
          id: "vzmnt0orxj-a1",
          kind: "keyword-group",
          text: "Immortality, Spellshroud",
          keywords: [
            {
              name: "immortality",
            },
            {
              name: "spellshroud",
            },
          ],
        },
        {
          id: "vzmnt0orxj-a2",
          kind: "triggered",
          text: "[Guo Jia Bonus] At the beginning of your recollection phase, each player puts the top card of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "mill",
            player: "each-player",
            amount: 1,
          },
        },
        {
          id: "vzmnt0orxj-a3",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever one or more cards are put into your graveyard from your deck, put a quest counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "card-moved",
              subject: {
                kind: "event-object",
                owner: "controller",
              },
              from: "main-deck",
              to: "graveyard",
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "quest",
            },
            amount: 1,
          },
        },
        {
          id: "vzmnt0orxj-a4",
          kind: "activated",
          text: "REST: You may remove nine quest counters from your champion. If you do, wake up and transform Fabled Sapphire Fatestone.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
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
                    kind: "remove-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: {
                      named: "quest",
                    },
                    amount: 9,
                    bindResultAs: "removed-counters",
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "wake",
                        subject: {
                          kind: "source",
                        },
                      },
                      {
                        kind: "transform",
                        subject: {
                          kind: "source",
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
      ],
    },
    flipFace: {
      id: "vzmnt0orxj:face:flip",
      catalogId: "fhi78gfkli",
      name: "Genbu, Black Tortoise",
      cost: {
        kind: "reserve",
        amount: 9,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SHENJU", "FATEBOUND", "TURTLE"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
        life: 9,
      },
      rulesText:
        "Spellshroud, Taunt\n\n[Guo Jia Bonus] (3): Genbu gets +X LIFE until end of turn, where X is the amount of water element cards in your graveyard. Activate this ability only once per turn.",
      abilities: [
        {
          id: "fhi78gfkli-a1",
          kind: "keyword-group",
          text: "Spellshroud, Taunt",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "taunt",
            },
          ],
        },
        {
          id: "fhi78gfkli-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (3): Genbu gets +X LIFE until end of turn, where X is the amount of water element cards in your graveyard. Activate this ability only once per turn.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          ],
          limit: {
            count: 1,
            per: "turn",
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
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
              property: "life",
              operation: "add",
              amount: {
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "element",
                    oneOf: ["WATER"],
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default fabledSapphireFatestone;
