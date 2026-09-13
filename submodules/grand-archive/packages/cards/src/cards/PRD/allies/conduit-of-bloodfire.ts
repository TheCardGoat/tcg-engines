import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const conduitOfBloodfire: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "epwl2vqikh",
  slug: "conduit-of-bloodfire",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "epwl2vqikh:face:default",
      catalogId: "epwl2vqikh",
      name: "Conduit of Bloodfire",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 2,
      },
      rulesText:
        "On Enter: Remove all damage counters from each champion your opponents control. For every four counters removed this way, put a buff counter on Conduit of Bloodfire.",
      abilities: [
        {
          id: "epwl2vqikh-a1",
          kind: "triggered",
          text: "On Enter: Remove all damage counters from each champion your opponents control. For every four counters removed this way, put a buff counter on Conduit of Bloodfire.",
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
            kind: "sequence",
            effects: [
              {
                kind: "remove-counter",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "each-opponent",
                    filter: {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                  },
                },
                counter: "damage",
                amount: {
                  kind: "all",
                },
                bindResultAs: "removed-damage-counters",
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "modified-ability-result-amount",
                      metric: "counters-removed",
                    },
                    4,
                  ],
                  rounding: "down",
                },
              },
            ],
          },
        },
      ],
    },
  },
};

export default conduitOfBloodfire;
