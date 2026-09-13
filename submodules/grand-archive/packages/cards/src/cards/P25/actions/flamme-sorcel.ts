import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flammeSorcel: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "j6er6z99sv",
  slug: "flamme-sorcel",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "j6er6z99sv:face:default",
      catalogId: "j6er6z99sv",
      name: "Flamme Sorcel",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card, then discard a card. If the reserve cost of the discarded card is equal to the reserve cost of one of your omens, draw another card. ",
      abilities: [
        {
          id: "j6er6z99sv-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card. If the reserve cost of the discarded card is equal to the reserve cost of one of your omens, draw another card.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                  {
                    kind: "discard",
                    player: "controller",
                    selection: {
                      id: "discarded-card",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                      },
                    },
                    bindResultAs: "discarded-card",
                  },
                ],
              },
              {
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
                          kind: "same-characteristic",
                          binding: "discarded-card",
                          characteristic: "reserve-cost",
                        },
                      ],
                    },
                  },
                },
                then: {
                  kind: "draw",
                  player: "controller",
                  amount: 1,
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default flammeSorcel;
