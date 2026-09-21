import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fatestoneOfRevelations: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xd4kv0akqr",
  slug: "fatestone-of-revelations",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "xd4kv0akqr:face:default",
      catalogId: "xd4kv0akqr",
      name: "Fatestone of Revelations",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "On Enter: You may reveal two Fatestone and/or Fatebound cards from your hand and/or memory. If you do, draw a card.\n\n[Guo Jia Bonus] (6): Transform Fatestone of Revelations. This ability costs (LV) less to activate. (LV refers to your champion's level.)",
      abilities: [
        {
          id: "xd4kv0akqr-a1",
          kind: "triggered",
          text: "On Enter: You may reveal two Fatestone and/or Fatebound cards from your hand and/or memory. If you do, draw a card.",
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
                          kind: "any",
                          filters: [
                            {
                              kind: "subtype",
                              oneOf: ["FATESTONE"],
                            },
                            {
                              kind: "subtype",
                              oneOf: ["FATEBOUND"],
                            },
                          ],
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
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                  },
                },
              ],
            },
          },
        },
        {
          id: "xd4kv0akqr-a2",
          kind: "activated",
          text: "[Guo Jia Bonus] (6): Transform Fatestone of Revelations. This ability costs (LV) less to activate. (LV refers to your champion's level.)",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 6,
          },
          costModifiers: [
            {
              operation: "subtract",
              amount: {
                kind: "property",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                property: "level",
                basis: "current",
              },
            },
          ],
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Guo Jia",
              },
            },
          ],
          effect: {
            kind: "transform",
            subject: {
              kind: "source",
            },
          },
        },
      ],
    },
    flipFace: {
      id: "xd4kv0akqr:face:flip",
      catalogId: "iozkgfx68u",
      name: "Young Wyrmling",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "DRAGON"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default fatestoneOfRevelations;
