import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bairuiResplendentBarrier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "sqGcyYocLW",
  slug: "bairui-resplendent-barrier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "sqGcyYocLW:face:default",
      catalogId: "sqGcyYocLW",
      name: "Bairui, Resplendent Barrier",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "SPELL"],
      },
      elements: ["TERA"],
      stats: {},
      rulesText:
        "If damage would be dealt to your champion while Bairui has two or less charge counters on it, prevent 2 of that damage and put a charge counter on Bairui instead.\n\n[Kongming Bonus] Sacrifice Bairui: Empower 7. Activate this ability only if there are three charge counters on Bairui and only if your Shifting Currents face South.",
      abilities: [
        {
          id: "sqGcyYocLW-a1",
          kind: "static",
          staticKind: "effects",
          text: "If damage would be dealt to your champion while Bairui has two or less charge counters on it, prevent 2 of that damage and put a charge counter on Bairui instead.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "event-object",
                  controller: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["CHAMPION"],
                  },
                },
              },
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "charge",
                    },
                  },
                  operator: "lte",
                  right: 2,
                },
              },
              operation: {
                kind: "sequence",
                operations: [
                  {
                    kind: "prevent",
                    amount: 2,
                  },
                  {
                    kind: "perform-before-commit",
                    effect: {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: {
                        named: "charge",
                      },
                      amount: 1,
                    },
                  },
                ],
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "sqGcyYocLW-a2",
          kind: "activated",
          text: "[Kongming Bonus] Sacrifice Bairui: Empower 7. Activate this ability only if there are three charge counters on Bairui and only if your Shifting Currents face South.",
          activation: "ability",
          cost: {
            kind: "sacrifice",
            subject: {
              kind: "source",
            },
          },
          condition: {
            kind: "all",
            conditions: [
              {
                kind: "has-counter",
                subject: {
                  kind: "source",
                },
                counter: {
                  named: "charge",
                },
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "source",
                    },
                    counter: {
                      named: "charge",
                    },
                  },
                  operator: "eq",
                  right: 3,
                },
              },
              {
                kind: "player-state",
                player: "controller",
                state: {
                  named: "shifting-currents",
                  value: "south",
                },
              },
            ],
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Kongming",
              },
            },
          ],
          effect: {
            kind: "keyword-action",
            action: "empower",
            player: "controller",
            amount: 7,
          },
        },
      ],
    },
  },
};

export default bairuiResplendentBarrier;
