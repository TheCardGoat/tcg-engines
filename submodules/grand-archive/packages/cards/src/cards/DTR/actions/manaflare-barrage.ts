import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const manaflareBarrage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "a8mmiv2ptn",
  slug: "manaflare-barrage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "a8mmiv2ptn:face:default",
      catalogId: "a8mmiv2ptn",
      name: "Manaflare Barrage",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nDeal 2 damage to all units except for your champion. If your champion is distant, deal 3 damage to those units instead.\n\nYou may load Manaflare Barrage into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "a8mmiv2ptn-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 2 less to activate.",
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
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "a8mmiv2ptn-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to all units except for your champion. If your champion is distant, deal 3 damage to those units instead.",
          effect: {
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
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-subject",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                      },
                    ],
                  },
                },
              },
              amount: 3,
            },
            else: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "each-player",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY", "CHAMPION"],
                      },
                      {
                        kind: "not-subject",
                        subject: {
                          kind: "champion",
                          player: "controller",
                        },
                      },
                    ],
                  },
                },
              },
              amount: 2,
            },
          },
        },
        {
          id: "a8mmiv2ptn-a3",
          kind: "card-resolution",
          text: "You may load Manaflare Barrage into an Aetherwing weapon you control.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-weapon",
                kind: "choice",
                declared: "resolution",
                chooser: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                unique: true,
                candidates: {
                  kind: "object",
                  zones: ["field"],
                  relationship: "controlled-by",
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "chosen-weapon",
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default manaflareBarrage;
