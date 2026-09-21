import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inquisitiveMagician: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cbxpjya4u1",
  slug: "inquisitive-magician",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cbxpjya4u1:face:default",
      catalogId: "cbxpjya4u1",
      name: "Inquisitive Magician",
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
        power: 2,
        life: 2,
      },
      rulesText:
        "On Enter: You may reveal two Mage cards from your hand and/or memory. If you do, put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
      abilities: [
        {
          id: "cbxpjya4u1-a1",
          kind: "triggered",
          text: "On Enter: You may reveal two Mage cards from your hand and/or memory. If you do, put an enlighten counter on your champion. (You may remove three enlighten counters from your champion to draw a card.)",
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
                  kind: "attempt",
                  effect: {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "reveal-selection",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["hand"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["MAGE"],
                        },
                      },
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
                    kind: "add-counter",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "enlighten",
                    amount: 1,
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

export default inquisitiveMagician;
