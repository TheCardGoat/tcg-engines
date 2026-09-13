import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const chainedCharge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "grlpk1akxj",
  slug: "chained-charge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "grlpk1akxj:face:default",
      catalogId: "grlpk1akxj",
      name: "Chained Charge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "[Class Bonus] This card costs 1 less to activate. \n\nNegate target card activation unless its controller pays (1). Then you may load Chained Charge into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "grlpk1akxj-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] This card costs 1 less to activate.",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "grlpk1akxj-a2",
          kind: "card-resolution",
          text: "Negate target card activation unless its controller pays (1). Then you may load Chained Charge into an Aetherwing weapon you control.",
          targets: [
            {
              id: "target-stack-item",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "stack-item",
                itemTypes: ["card-activation"],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "unless-paid",
                player: {
                  controllerOf: "target-stack-item",
                },
                cost: {
                  kind: "pay-reserve",
                  amount: 1,
                },
                otherwise: {
                  kind: "negate",
                  subject: {
                    kind: "bound",
                    binding: "target-stack-item",
                  },
                  bindResultAs: "negated-stack-item",
                },
              },
              {
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
            ],
          },
        },
      ],
    },
  },
};

export default chainedCharge;
