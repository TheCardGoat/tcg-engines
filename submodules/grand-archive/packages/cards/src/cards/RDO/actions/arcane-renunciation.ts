import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arcaneRenunciation: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qK7Et5ZTeT",
  slug: "arcane-renunciation",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qK7Et5ZTeT:face:default",
      catalogId: "qK7Et5ZTeT",
      name: "Arcane Renunciation",
      cost: {
        kind: "reserve",
        amount: 12,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "ULTIMATE", "SPELL"],
      },
      elements: ["ARCANE"],
      speed: "slow",
      stats: {},
      rulesText:
        "Banish all cards in your hand and memory. Then return all non-champion non-regalia arcane element cards from your graveyard and banishment to your hand. Empower 10. \n\n[Rai Bonus] Until end of turn, whenever you activate a Spell card, empower 10.",
      abilities: [
        {
          id: "qK7Et5ZTeT-a1",
          kind: "card-resolution",
          text: "Banish all cards in your hand and memory. Then return all non-champion non-regalia arcane element cards from your graveyard and banishment to your hand. Empower 10.",
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["hand", "memory"],
                    player: "controller",
                  },
                },
                destination: {
                  zone: "banishment",
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["graveyard", "banishment"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "element",
                          oneOf: ["ARCANE"],
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "type",
                            oneOf: ["CHAMPION"],
                          },
                        },
                        {
                          kind: "not",
                          filter: {
                            kind: "supertype",
                            oneOf: ["REGALIA"],
                          },
                        },
                      ],
                    },
                  },
                },
                destination: {
                  zone: "hand",
                },
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 10,
              },
            ],
          },
        },
        {
          id: "qK7Et5ZTeT-a2",
          kind: "card-resolution",
          text: "[Rai Bonus] Until end of turn, whenever you activate a Spell card, empower 10.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Rai",
              },
            },
          ],
          effect: {
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "card-activated",
                actor: "controller",
                subject: {
                  kind: "event-object",
                  filter: {
                    kind: "subtype",
                    oneOf: ["SPELL"],
                  },
                },
              },
            },
            effect: {
              kind: "keyword-action",
              action: "empower",
              amount: 10,
            },
            expires: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default arcaneRenunciation;
