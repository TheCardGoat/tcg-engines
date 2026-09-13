import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const candlelightHourglass: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "fhomy86084",
  slug: "candlelight-hourglass",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "fhomy86084:face:default",
      catalogId: "fhomy86084",
      name: "Candlelight Hourglass",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: Draw a card.\n\nOn Charge 2: Candlelight Hourglass gains ”Activated abilities of allies you don't control cost (2) more to activate.” (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time two charge counters are on it.)",
      abilities: [
        {
          id: "fhomy86084-a1",
          kind: "triggered",
          text: "On Enter: Draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "fhomy86084-a2",
          kind: "triggered",
          text: "On Charge 2: Candlelight Hourglass gains ”Activated abilities of allies you don't control cost (2) more to activate.” (At the beginning of your recollection phase, put a charge counter on each object you control with an untriggered on charge ability. Trigger this ability the first time two charge counters are on it.)",
          label: {
            name: "On Charge",
            parameters: {
              threshold: 2,
            },
          },
          trigger: {
            kind: "event",
            event: {
              name: "counter-added",
              subject: {
                kind: "source",
              },
              counter: {
                named: "charge",
              },
            },
          },
          limit: {
            count: 1,
            per: "source-instance",
          },
          interveningCondition: {
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
              right: 2,
            },
          },
          effect: {
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "permanent",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-ability",
              ability: {
                id: "granted-1grjigy-a1",
                kind: "static",
                staticKind: "effects",
                text: "Activated abilities of allies you don't control cost (2) more to activate.",
                effects: [
                  {
                    kind: "rule-modification",
                    mode: "add-cost",
                    action: "activate",
                    activationKind: "ability",
                    subject: {
                      kind: "each",
                      collection: {
                        zones: ["field"],
                        player: "each-opponent",
                        filter: {
                          kind: "type",
                          oneOf: ["ALLY"],
                        },
                      },
                    },
                    cost: {
                      kind: "pay-reserve",
                      amount: 2,
                    },
                    duration: {
                      kind: "while-source-in-functional-zone",
                    },
                  },
                ],
              },
            },
          },
        },
      ],
    },
  },
};

export default candlelightHourglass;
