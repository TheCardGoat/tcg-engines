import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const soutirerVortex: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "du4df43ci2",
  slug: "soutirer-vortex",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "du4df43ci2:face:default",
      catalogId: "du4df43ci2",
      name: "Soutirer Vortex",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["PHANTASIA"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "As long as you have three or more  omens with different reserve costs, this card costs 3 less to activate.\n\nYour omens have ”Whenever an opponent activates a card with the same reserve cost as this omen, recover 1 and deal 1 damage to their champion.”\n",
      abilities: [
        {
          id: "du4df43ci2-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as you have three or more  omens with different reserve costs, this card costs 3 less to activate.",
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "count",
                    distinctBy: "reserve-cost",
                    collection: {
                      zones: ["banishment"],
                      player: "controller",
                      filter: {
                        kind: "has-counter",
                        counter: "omen",
                      },
                    },
                  },
                  operator: "gte",
                  right: 3,
                },
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 3,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "du4df43ci2-a2",
          kind: "static",
          staticKind: "effects",
          text: "Your omens have ”Whenever an opponent activates a card with the same reserve cost as this omen, recover 1 and deal 1 damage to their champion.”",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-1fma93v-a1",
                  kind: "triggered",
                  text: "Whenever an opponent activates a card with the same reserve cost as this omen, recover 1 and deal 1 damage to their champion.",
                  trigger: {
                    kind: "event",
                    event: {
                      name: "card-activated",
                      actor: "opponent",
                    },
                  },
                  interveningCondition: {
                    kind: "compare",
                    comparison: {
                      left: {
                        kind: "property",
                        subject: {
                          kind: "event-subject",
                        },
                        property: "reserve-cost",
                        basis: "base",
                      },
                      operator: "eq",
                      right: {
                        kind: "property",
                        subject: {
                          kind: "ability-bearer",
                        },
                        property: "reserve-cost",
                        basis: "base",
                      },
                    },
                  },
                  effect: {
                    kind: "sequence",
                    effects: [
                      {
                        kind: "recover",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "deal-damage",
                        source: {
                          kind: "ability-bearer",
                        },
                        recipient: {
                          kind: "champion",
                          player: "event-actor",
                        },
                        amount: 1,
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default soutirerVortex;
