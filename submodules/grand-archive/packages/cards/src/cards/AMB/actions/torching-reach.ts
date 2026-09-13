import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const torchingReach: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "kHhxq4UZTe",
  slug: "torching-reach",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "kHhxq4UZTe:face:default",
      catalogId: "kHhxq4UZTe",
      name: "Torching Reach",
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
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "Draw a card, then discard a card. Then if your champion is distant, draw another card. ",
      abilities: [
        {
          id: "kHhxq4UZTe-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card. Then if your champion is distant, draw another card.",
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
                  kind: "object-state",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  state: "distant",
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

export default torchingReach;
