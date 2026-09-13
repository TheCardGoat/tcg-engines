import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lavaheatedBrew: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o98vn1voy5",
  slug: "lavaheated-brew",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o98vn1voy5:face:default",
      catalogId: "o98vn1voy5",
      name: "Lavaheated Brew",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Draw a card, then discard a card. If you didn't discard a Potion item card, deal 3 damage to your champion.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "o98vn1voy5-a1",
          kind: "card-resolution",
          text: "Draw a card, then discard a card. If you didn't discard a Potion item card, deal 3 damage to your champion.",
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
                  kind: "not",
                  condition: {
                    kind: "subject-matches",
                    subject: {
                      kind: "bound",
                      binding: "discarded-card",
                    },
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "type",
                          oneOf: ["ITEM"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["POTION"],
                        },
                      ],
                    },
                  },
                },
                then: {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 3,
                },
              },
            ],
          },
        },
        {
          id: "o98vn1voy5-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
        },
      ],
    },
  },
};

export default lavaheatedBrew;
