import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windriderInvoker: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lx6xwr42i6",
  slug: "windrider-invoker",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lx6xwr42i6:face:default",
      catalogId: "lx6xwr42i6",
      name: "Windrider Invoker",
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
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "On Enter: You may remove two enlighten counters from your champion. If you do, draw a card and Windrider Invoker gets +3 POWER until end of turn.",
      abilities: [
        {
          id: "lx6xwr42i6-a1",
          kind: "triggered",
          text: "On Enter: You may remove two enlighten counters from your champion. If you do, draw a card and Windrider Invoker gets +3 POWER until end of turn.",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "remove-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "enlighten",
                  amount: 2,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                    {
                      kind: "continuous",
                      subjects: {
                        kind: "source",
                      },
                      affectedSet: "locked",
                      duration: {
                        kind: "this-turn",
                      },
                      layer: {
                        layer: "E",
                        modifies: "stat",
                        sublayer: "modifier",
                      },
                      change: {
                        kind: "numeric",
                        property: "power",
                        operation: "add",
                        amount: 3,
                      },
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default windriderInvoker;
