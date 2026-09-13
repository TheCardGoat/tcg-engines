import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const razorvine: GrandArchiveCard<GrandArchiveAbilityDefinition, "token-representation"> = {
  canonicalId: "jnltv5klry",
  slug: "razorvine",
  definitionKind: "token-representation",
  layout: {
    kind: "single-faced",
    face: {
      id: "jnltv5klry:face:default",
      catalogId: "jnltv5klry",
      name: "Razorvine",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HERB", "CATALYST", "LEAF"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Sacrifice Razorvine: Put a card from your hand on the bottom of your deck. If you do, draw a card.",
      abilities: [
        {
          id: "jnltv5klry-a1",
          kind: "activated",
          text: "Sacrifice Razorvine: Put a card from your hand on the bottom of your deck. If you do, draw a card.",
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

export default razorvine;
