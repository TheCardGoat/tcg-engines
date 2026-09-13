import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const merlinMemoryThief: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "umSsPWqb5H",
  slug: "merlin-memory-thief",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "umSsPWqb5H:face:default",
      catalogId: "umSsPWqb5H",
      name: "Merlin, Memory Thief",
      lineageName: "Merlin",
      cost: {
        kind: "memory",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["CHAMPION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        level: 2,
        life: 22,
      },
      rulesText:
        "REST: Choose a card from a graveyard and banish it. If that card has floating memory, put a level counter on Merlin. (Champions get +1 level for each level counter on them.)",
      abilities: [
        {
          id: "umSsPWqb5H-a1",
          kind: "activated",
          text: "REST: Choose a card from a graveyard and banish it. If that card has floating memory, put a level counter on Merlin. (Champions get +1 level for each level counter on them.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-graveyard-card",
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
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "each-player",
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "bound",
                    binding: "chosen-graveyard-card",
                  },
                  from: "graveyard",
                  destination: {
                    zone: "banishment",
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "bound",
                      binding: "chosen-graveyard-card",
                    },
                    filter: {
                      kind: "has-keyword",
                      keyword: "floating-memory",
                    },
                  },
                  then: {
                    kind: "add-counter",
                    subject: {
                      kind: "source",
                    },
                    counter: "level",
                    amount: 1,
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

export default merlinMemoryThief;
