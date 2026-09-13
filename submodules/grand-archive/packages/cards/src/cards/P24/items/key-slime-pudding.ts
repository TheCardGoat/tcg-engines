import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const keySlimePudding: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4wuq20gvcg",
  slug: "key-slime-pudding",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4wuq20gvcg:face:default",
      catalogId: "4wuq20gvcg",
      name: "Key Slime Pudding",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FOOD"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "Banish Key Slime Pudding: Until end of turn, Slime allies that enter the field under your control enter with an additional buff counter on them.",
      abilities: [
        {
          id: "4wuq20gvcg-a1",
          kind: "activated",
          text: "Banish Key Slime Pudding: Until end of turn, Slime allies that enter the field under your control enter with an additional buff counter on them.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          effect: {
            kind: "replacement",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SLIME"],
                    },
                  ],
                },
              },
            },
            operation: {
              kind: "add-object-counters",
              counters: [
                {
                  counter: "buff",
                  amount: 1,
                },
              ],
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default keySlimePudding;
