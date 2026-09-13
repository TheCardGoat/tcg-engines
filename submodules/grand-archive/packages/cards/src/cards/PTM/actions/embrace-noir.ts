import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const embraceNoir: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pw9b6IJWEr",
  slug: "embrace-noir",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pw9b6IJWEr:face:default",
      catalogId: "pw9b6IJWEr",
      name: "Embrace Noir",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Until end of turn, all allies gain stealth.\n\n[Ciel Bonus] If you have one or more umbra element omens, draw a card into your memory.",
      abilities: [
        {
          id: "pw9b6IJWEr-a1",
          kind: "card-resolution",
          text: "Until end of turn, all allies gain stealth.",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
        {
          id: "pw9b6IJWEr-a2",
          kind: "card-resolution",
          text: "[Ciel Bonus] If you have one or more umbra element omens, draw a card into your memory.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Ciel",
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["banishment"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "has-counter",
                      counter: "omen",
                    },
                    {
                      kind: "element",
                      oneOf: ["UMBRA"],
                    },
                  ],
                },
              },
            },
            then: {
              kind: "draw",
              player: "controller",
              amount: 1,
              to: "memory",
            },
          },
        },
      ],
    },
  },
};

export default embraceNoir;
