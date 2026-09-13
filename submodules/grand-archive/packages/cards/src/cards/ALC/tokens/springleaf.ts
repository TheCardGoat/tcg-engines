import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const springleaf: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "69iq4d5vet",
  slug: "springleaf",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "69iq4d5vet:face:default",
      catalogId: "69iq4d5vet",
      name: "Springleaf",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "ADJUVANT", "LEAF"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Sacrifice Springleaf: Put a card from your hand on the bottom of your deck. If you do, draw a card.",
      abilities: [
        {
          id: "69iq4d5vet-a1",
          kind: "activated",
          text: "Sacrifice Springleaf: Put a card from your hand on the bottom of your deck. If you do, draw a card.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          effect: {
            kind: "choose",
            selection: {
              id: "returned-card",
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
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  bindSucceededAs: "returned-card-moved",
                  effect: {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "returned-card",
                    },
                    from: "hand",
                    destination: {
                      zone: "main-deck",
                      placement: {
                        kind: "bottom",
                      },
                    },
                  },
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "returned-card-moved",
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
        },
      ],
    },
  },
};

export default springleaf;
