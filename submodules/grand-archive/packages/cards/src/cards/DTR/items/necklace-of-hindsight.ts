import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const necklaceOfHindsight: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "21g6ldxwrv",
  slug: "necklace-of-hindsight",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "21g6ldxwrv:face:default",
      catalogId: "21g6ldxwrv",
      name: "Necklace of Hindsight",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "DISTORTION", "ACCESSORY"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 1 less to materialize.\n\nBanish Necklace of Hindsight: Look at the top four cards of target opponent's deck. Put any amount of those cards on the bottom of their deck in any order and the rest on the top of their deck in any order.",
      abilities: [
        {
          id: "21g6ldxwrv-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to materialize.",
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
              action: "materialize",
              subject: {
                kind: "source",
              },
              costKind: "memory",
              costOperation: "subtract",
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "21g6ldxwrv-a2",
          kind: "activated",
          text: "Banish Necklace of Hindsight: Look at the top four cards of target opponent's deck. Put any amount of those cards on the bottom of their deck in any order and the rest on the top of their deck in any order.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-opponent",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["opponent"],
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
                    amount: 4,
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    zones: ["main-deck"],
                    relationship: "zone-of",
                    player: {
                      binding: "target-opponent",
                    },
                    fromTop: true,
                  },
                },
              },
              {
                kind: "choose",
                selection: {
                  id: "bottom-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  unique: true,
                  candidates: {
                    kind: "card",
                    binding: "looked-cards",
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "move",
                      subject: {
                        kind: "bound",
                        binding: "bottom-cards",
                      },
                      destination: {
                        zone: "main-deck",
                        placement: {
                          kind: "bottom",
                          orderChosenBy: "controller",
                        },
                      },
                    },
                    {
                      kind: "move",
                      subject: {
                        kind: "binding-remainder",
                        binding: "looked-cards",
                        excluding: "bottom-cards",
                      },
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
            ],
          },
        },
      ],
    },
  },
};

export default necklaceOfHindsight;
