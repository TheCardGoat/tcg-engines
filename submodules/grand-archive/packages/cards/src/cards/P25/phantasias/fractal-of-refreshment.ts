import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fractalOfRefreshment: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cxqf8rr452",
  slug: "fractal-of-refreshment",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cxqf8rr452:face:default",
      catalogId: "cxqf8rr452",
      name: "Fractal of Refreshment",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable\n\nOn Enter: You may reveal up to three water element cards from your memory and put them on the bottom of your deck in any order. Then draw that many cards into your memory.",
      abilities: [
        {
          id: "cxqf8rr452-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "cxqf8rr452-a2",
          kind: "triggered",
          text: "On Enter: You may reveal up to three water element cards from your memory and put them on the bottom of your deck in any order. Then draw that many cards into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "optional",
                player: "controller",
                allOrNothing: true,
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "reveal",
                      player: "controller",
                      selection: {
                        id: "revealed-cards",
                        kind: "choice",
                        declared: "resolution",
                        chooser: "controller",
                        count: {
                          kind: "up-to",
                          amount: 3,
                        },
                        candidates: {
                          kind: "card",
                          zones: ["memory"],
                          relationship: "zone-of",
                          player: "controller",
                          filter: {
                            kind: "element",
                            oneOf: ["WATER"],
                          },
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "revealed-cards",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                  ],
                },
              },
              {
                kind: "draw",
                player: "controller",
                amount: {
                  kind: "modified-ability-result-amount",
                  metric: "cards-moved",
                },
                to: "memory",
              },
            ],
          },
        },
      ],
    },
  },
};

export default fractalOfRefreshment;
