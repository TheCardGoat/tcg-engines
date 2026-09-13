import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const legendarySaddle: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AXE6sCzjZU",
  slug: "legendary-saddle",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "AXE6sCzjZU:face:default",
      catalogId: "AXE6sCzjZU",
      name: "Legendary Saddle",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: For the rest of the game, ignore the elemental requirements of non-advanced element Horse cards you activate.\n\nBanish Legendary Saddle:  Draw a card into your memory. Activate this ability only if you control three or more Horse allies.",
      abilities: [
        {
          id: "AXE6sCzjZU-a1",
          kind: "triggered",
          text: "On Enter: For the rest of the game, ignore the elemental requirements of non-advanced element Horse cards you activate.",
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
            kind: "rule-modification",
            mode: "allow",
            action: "ignore-element-requirement",
            subject: {
              kind: "player",
              player: "controller",
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "element-category",
                  value: "non-advanced",
                },
                {
                  kind: "subtype",
                  oneOf: ["HORSE"],
                },
              ],
            },
            duration: {
              kind: "permanent",
            },
          },
        },
        {
          id: "AXE6sCzjZU-a2",
          kind: "activated",
          text: "Banish Legendary Saddle:  Draw a card into your memory. Activate this ability only if you control three or more Horse allies.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
                },
              },
              operator: "gte",
              right: 3,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
      ],
    },
  },
};

export default legendarySaddle;
