import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const adventOfTheShenju: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "c53tomoaw3",
  slug: "advent-of-the-shenju",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "c53tomoaw3:face:default",
      catalogId: "c53tomoaw3",
      name: "Advent of the Shenju",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATEBOUND", "SPELL"],
      },
      elements: ["LUXEM"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Guo Jia Bonus] Put target Fatestone card from your banishment onto the field. If that card is a regalia, put five quest counters on your champion. \n\n[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, you may banish all cards in your memory. Draw a card into your memory for each card banished this way.",
      abilities: [
        {
          id: "c53tomoaw3-a1",
          kind: "card-resolution",
          text: "[Guo Jia Bonus] Put target Fatestone card from your banishment onto the field. If that card is a regalia, put five quest counters on your champion.",
          targets: [
            {
              id: "target-fatestone",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["banishment"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["FATESTONE"],
                },
              },
            },
          ],
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
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "target-fatestone",
                },
                from: "banishment",
                destination: {
                  zone: "field",
                },
              },
              {
                kind: "conditional",
                condition: {
                  kind: "subject-matches",
                  subject: {
                    kind: "bound",
                    binding: "target-fatestone",
                  },
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
                then: {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "quest",
                  },
                  amount: 5,
                },
              },
            ],
          },
        },
        {
          id: "c53tomoaw3-a2",
          kind: "triggered",
          text: "[Class Bonus] [Element Bonus] Whenever you reveal this card from your memory, you may banish all cards in your memory. Draw a card into your memory for each card banished this way.",
          trigger: {
            kind: "event",
            event: {
              name: "card-revealed",
              actor: "controller",
              from: "memory",
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
            {
              kind: "static",
              name: "element-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "element",
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
                  kind: "move",
                  subject: {
                    kind: "each",
                    collection: {
                      zones: ["memory"],
                      player: "controller",
                    },
                  },
                  from: "memory",
                  destination: {
                    zone: "banishment",
                  },
                  bindResultAs: "banished-memory-cards",
                },
                {
                  kind: "draw",
                  player: "controller",
                  to: "memory",
                  amount: {
                    kind: "count",
                    collection: {
                      binding: "banished-memory-cards",
                    },
                  },
                },
              ],
            },
          },
          functionalZones: ["memory"],
        },
      ],
    },
  },
};

export default adventOfTheShenju;
