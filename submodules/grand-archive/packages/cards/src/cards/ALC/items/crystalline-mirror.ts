import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crystallineMirror: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9agwj4f15j",
  slug: "crystalline-mirror",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9agwj4f15j:face:default",
      catalogId: "9agwj4f15j",
      name: "Crystalline Mirror",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Whenever a phantasia enters the field under your control, glimpse 1. \n\n[Class Bonus] Banish Crystalline Mirror: Destroy target item with memory cost 0 or reserve cost 3 or less. Activate this ability only if you control three or more phantasias.",
      abilities: [
        {
          id: "9agwj4f15j-a1",
          kind: "triggered",
          text: "Whenever a phantasia enters the field under your control, glimpse 1.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["PHANTASIA"],
                },
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "glimpse",
            amount: 1,
          },
        },
        {
          id: "9agwj4f15j-a2",
          kind: "activated",
          text: "[Class Bonus] Banish Crystalline Mirror: Destroy target item with memory cost 0 or reserve cost 3 or less. Activate this ability only if you control three or more phantasias.",
          activation: "ability",
          cost: {
            kind: "banish-self",
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "any",
                      filters: [
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "memory-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 0,
                          },
                        },
                        {
                          kind: "numeric",
                          comparison: {
                            left: {
                              kind: "property",
                              subject: {
                                kind: "candidate",
                              },
                              property: "reserve-cost",
                              basis: "base",
                            },
                            operator: "lte",
                            right: 3,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          ],
          condition: {
            kind: "compare",
            comparison: {
              left: {
                kind: "count",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "type",
                    oneOf: ["PHANTASIA"],
                  },
                },
              },
              operator: "gte",
              right: 3,
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
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default crystallineMirror;
