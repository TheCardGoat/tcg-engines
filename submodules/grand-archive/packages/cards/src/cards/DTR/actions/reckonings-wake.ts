import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reckoningsWake: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "m3nlelc53u",
  slug: "reckonings-wake",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "m3nlelc53u:face:default",
      catalogId: "m3nlelc53u",
      name: "Reckoning's Wake",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISTORTION", "SKILL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Look at the top 3+X cards of your deck, where X is the amount of Distortion objects you control. Put those cards back on top of your deck in any order.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "m3nlelc53u-a1",
          kind: "card-resolution",
          text: "Look at the top 3+X cards of your deck, where X is the amount of Distortion objects you control. Put those cards back on top of your deck in any order.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "subtype",
                    oneOf: ["DISTORTION"],
                  },
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "look-at",
                player: "controller",
                selection: {
                  id: "looked-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "exactly",
                    amount: {
                      kind: "calculate",
                      operator: "add",
                      operands: [
                        3,
                        {
                          kind: "count",
                          collection: {
                            zones: ["field"],
                            player: "controller",
                            filter: {
                              kind: "subtype",
                              oneOf: ["DISTORTION"],
                            },
                          },
                        },
                      ],
                    },
                  },
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: "controller",
                    fromTop: true,
                  },
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "bound",
                  binding: "looked-cards",
                },
                from: "main-deck",
                destination: {
                  zone: "main-deck",
                  placement: {
                    kind: "top",
                    orderChosenBy: "controller",
                  },
                },
              },
            ],
          },
        },
        {
          id: "m3nlelc53u-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default reckoningsWake;
