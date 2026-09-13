import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const burstAsunder: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rzsr6aw4hz",
  slug: "burst-asunder",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rzsr6aw4hz:face:default",
      catalogId: "rzsr6aw4hz",
      name: "Burst Asunder",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "SPELL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] This card costs 2 less to activate.\n\nDeal 2 damage to target unit. Then you may sacrifice any amount of Fractals. For each Fractal sacrificed this way, deal an additional 2 damage to that unit.",
      abilities: [
        {
          id: "rzsr6aw4hz-a1",
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
          id: "rzsr6aw4hz-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. Then you may sacrifice any amount of Fractals. For each Fractal sacrificed this way, deal an additional 2 damage to that unit.",
          targets: [
            {
              id: "target-unit",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-unit",
                },
                amount: 2,
              },
              {
                kind: "choose",
                selection: {
                  id: "sacrificed-fractals",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "any-number",
                  },
                  candidates: {
                    kind: "object",
                    zones: ["field"],
                    relationship: "controlled-by",
                    player: "controller",
                    filter: {
                      kind: "subtype",
                      oneOf: ["FRACTAL"],
                    },
                  },
                },
                effect: {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "sacrifice",
                      subject: {
                        kind: "bound",
                        binding: "sacrificed-fractals",
                      },
                      bindResultAs: "sacrificed-fractals-result",
                    },
                    {
                      kind: "repeat",
                      count: {
                        kind: "modified-ability-result-amount",
                        metric: "objects-sacrificed",
                      },
                      effect: {
                        kind: "deal-damage",
                        source: {
                          kind: "source",
                        },
                        recipient: {
                          kind: "bound",
                          binding: "target-unit",
                        },
                        amount: 2,
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

export default burstAsunder;
