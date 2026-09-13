import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const wildgrowthFatestone: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "x2oydmfcre",
  slug: "wildgrowth-fatestone",
  definitionKind: "card",
  layout: {
    kind: "double-faced",
    defaultFace: {
      id: "x2oydmfcre:face:default",
      catalogId: "x2oydmfcre",
      name: "Wildgrowth Fatestone",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "FATESTONE"],
      },
      elements: ["WIND"],
      stats: {},
      rulesText:
        "[Guo Jia Bonus] Whenever another wind element object enters the field under your control, put a buff counter on Wildgrowth Fatestone. Then if there are six or more buff counters on Wildgrowth Fatestone, you may transform it.",
      abilities: [
        {
          id: "x2oydmfcre-a1",
          kind: "triggered",
          text: "[Guo Jia Bonus] Whenever another wind element object enters the field under your control, put a buff counter on Wildgrowth Fatestone. Then if there are six or more buff counters on Wildgrowth Fatestone, you may transform it.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "not-source",
                    },
                  ],
                },
              },
            },
          },
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
            kind: "sequence",
            effects: [
              {
                kind: "add-counter",
                subject: {
                  kind: "source",
                },
                counter: "buff",
                amount: 1,
              },
              {
                kind: "conditional",
                condition: {
                  kind: "has-counter",
                  subject: {
                    kind: "source",
                  },
                  counter: "buff",
                  comparison: {
                    left: {
                      kind: "counter-count",
                      subject: {
                        kind: "source",
                      },
                      counter: "buff",
                    },
                    operator: "gte",
                    right: 6,
                  },
                },
                then: {
                  kind: "optional",
                  player: "controller",
                  allOrNothing: true,
                  effect: {
                    kind: "transform",
                    subject: {
                      kind: "source",
                    },
                  },
                },
              },
            ],
          },
        },
      ],
    },
    flipFace: {
      id: "x2oydmfcre:face:flip",
      catalogId: "qusirqt538",
      name: "Elder Mandrill",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "FATEBOUND", "MONKEY"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText: "",
      abilities: [],
    },
  },
};

export default wildgrowthFatestone;
