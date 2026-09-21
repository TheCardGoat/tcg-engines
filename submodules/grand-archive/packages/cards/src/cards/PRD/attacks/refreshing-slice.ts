import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const refreshingSlice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oLGzDmCBQ9",
  slug: "refreshing-slice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oLGzDmCBQ9:face:default",
      catalogId: "oLGzDmCBQ9",
      name: "Refreshing Slice",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: You may pay (3). If you do, recover 3+LV. (To recover, remove that many damage counters from your champion. LV refers to your champion’s level.)",
      abilities: [
        {
          id: "oLGzDmCBQ9-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may pay (3). If you do, recover 3+LV. (To recover, remove that many damage counters from your champion. LV refers to your champion’s level.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "pay",
                    player: "controller",
                    cost: {
                      kind: "pay-reserve",
                      amount: 3,
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "recover",
                    player: "controller",
                    amount: {
                      kind: "calculate",
                      operator: "add",
                      operands: [
                        3,
                        {
                          kind: "property",
                          subject: {
                            kind: "champion",
                            player: "controller",
                          },
                          property: "level",
                          basis: "current",
                        },
                      ],
                    },
                  },
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default refreshingSlice;
