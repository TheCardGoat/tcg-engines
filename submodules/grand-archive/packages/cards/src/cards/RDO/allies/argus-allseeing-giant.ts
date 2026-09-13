import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const argusAllseeingGiant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4GFKcHg9NU",
  slug: "argus-allseeing-giant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4GFKcHg9NU:face:default",
      catalogId: "4GFKcHg9NU",
      name: "Argus, All-Seeing Giant",
      cost: {
        kind: "reserve",
        amount: 10,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "CONSTRUCT", "GOLEM"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 4,
        life: 10,
      },
      rulesText:
        "While paying for this card's reserve cost, you may banish one or more cards named Crystal of Argus or Eye of Argus from your material deck. Each card banished this way pays for 3 of that cost.\n\nTaunt, True Sight, Vigor\n\nAs long as Argus is awake, it has omnishroud.",
      abilities: [
        {
          id: "4GFKcHg9NU-a1",
          kind: "static",
          staticKind: "effects",
          text: "While paying for this card's reserve cost, you may banish one or more cards named Crystal of Argus or Eye of Argus from your material deck. Each card banished this way pays for 3 of that cost.",
          effects: [
            {
              kind: "rule-modification",
              mode: "payment-contribution",
              action: "pay-cost",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              cost: {
                kind: "select-and-move",
                player: "controller",
                from: "material-deck",
                to: "banishment",
                count: {
                  kind: "at-least",
                  amount: 1,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "name",
                          value: "Crystal of Argus",
                        },
                        {
                          kind: "name",
                          value: "Eye of Argus",
                        },
                      ],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["ARGUS"],
                    },
                  ],
                },
              },
              amount: 3,
              contributionBasis: "per-paid-object",
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "4GFKcHg9NU-a2",
          kind: "keyword-group",
          text: "Taunt, True Sight, Vigor",
          keywords: [
            {
              name: "taunt",
            },
            {
              name: "true-sight",
            },
            {
              name: "vigor",
            },
          ],
        },
        {
          id: "4GFKcHg9NU-a3",
          kind: "static",
          staticKind: "effects",
          text: "As long as Argus is awake, it has omnishroud.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "object-state",
                subject: {
                  kind: "source",
                },
                state: "awake",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "omnishroud",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default argusAllseeingGiant;
