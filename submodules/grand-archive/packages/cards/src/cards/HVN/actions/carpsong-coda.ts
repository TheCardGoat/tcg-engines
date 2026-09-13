import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const carpsongCoda: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3omh6h3a4y",
  slug: "carpsong-coda",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3omh6h3a4y:face:default",
      catalogId: "3omh6h3a4y",
      name: "Carpsong Coda",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "SKILL", "HARMONY"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Harmonize — If you've activated a Melody card this turn, put the top four cards of your deck into your graveyard.\n\nDeal an amount of damage to target unit equal to the highest life stat among water element Animal and Beast ally cards in your graveyard.",
      abilities: [
        {
          id: "3omh6h3a4y-a1",
          kind: "card-resolution",
          text: "Harmonize — If you've activated a Melody card this turn, put the top four cards of your deck into your graveyard.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "history",
              event: "card-activated",
              window: "this-turn",
              actor: "controller",
              filter: {
                kind: "subtype",
                oneOf: ["MELODY"],
              },
              minimum: 1,
            },
            then: {
              kind: "mill",
              player: "controller",
              amount: 4,
            },
          },
          label: {
            name: "Harmonize",
          },
        },
        {
          id: "3omh6h3a4y-a2",
          kind: "card-resolution",
          text: "Deal an amount of damage to target unit equal to the highest life stat among water element Animal and Beast ally cards in your graveyard.",
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: {
              kind: "aggregate-property",
              operation: "maximum",
              collection: {
                zones: ["graveyard"],
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WATER"],
                    },
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "subtype",
                          oneOf: ["ANIMAL"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["BEAST"],
                        },
                      ],
                    },
                  ],
                },
              },
              property: "life",
              basis: "current",
              emptyValue: 0,
            },
          },
        },
      ],
    },
  },
};

export default carpsongCoda;
