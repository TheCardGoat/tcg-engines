import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heavenlyGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "tkdky3sxao",
  slug: "heavenly-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "tkdky3sxao:face:default",
      catalogId: "tkdky3sxao",
      name: "Heavenly Guide",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Level 2+] On Enter: If an opponent controls a non-Spirit champion with a card on top of its lineage that wasn't played, level up your champion. (Your champion levels up into a compatible champion card from your material deck. A card was played if it was activated or materialized.)",
      abilities: [
        {
          id: "tkdky3sxao-a1",
          kind: "triggered",
          text: "[Level 2+] On Enter: If an opponent controls a non-Spirit champion with a card on top of its lineage that wasn't played, level up your champion. (Your champion levels up into a compatible champion card from your material deck. A card was played if it was activated or materialized.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "collection-exists",
              collection: {
                zones: ["field"],
                player: "each-opponent",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["CHAMPION"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["SPIRIT"],
                      },
                    },
                  ],
                },
              },
            },
            then: {
              kind: "level-up",
              subject: {
                kind: "champion",
                player: "controller",
              },
            },
          },
        },
      ],
    },
  },
};

export default heavenlyGuide;
