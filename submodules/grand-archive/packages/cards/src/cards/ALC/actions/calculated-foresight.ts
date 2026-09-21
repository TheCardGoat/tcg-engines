import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const calculatedForesight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sl7dedg616",
  slug: "calculated-foresight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sl7dedg616:face:default",
      catalogId: "sl7dedg616",
      name: "Calculated Foresight",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put the top two cards of your deck into your graveyard. Then you may banish a card with floating memory from your graveyard. If you do, your champion gains ranged 3 until end of turn. (Multiple instances of ranged stack.)",
      abilities: [
        {
          id: "sl7dedg616-a1",
          kind: "card-resolution",
          text: "Put the top two cards of your deck into your graveyard. Then you may banish a card with floating memory from your graveyard. If you do, your champion gains ranged 3 until end of turn. (Multiple instances of ranged stack.)",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "mill",
                player: "controller",
                amount: 2,
              },
              {
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
                              kind: "has-keyword",
                              keyword: "floating-memory",
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
                          kind: "champion",
                          player: "controller",
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
                            name: "ranged",
                            value: 3,
                          },
                        },
                      },
                    },
                  ],
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default calculatedForesight;
