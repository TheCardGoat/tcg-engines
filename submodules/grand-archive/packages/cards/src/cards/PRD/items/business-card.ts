import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const businessCard: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lumV6cG9oc",
  slug: "business-card",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lumV6cG9oc:face:default",
      catalogId: "lumV6cG9oc",
      name: "Business Card",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ACCESSORY"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "As Business Card enters the field, choose an ally card name.\n\n(2), Sacrifice Business Card: Scavenge 8 for an ally card with the chosen name. If you control a Phone item, scavenge 20 for an ally card with the chosen name instead.",
      abilities: [
        {
          id: "lumV6cG9oc-a1",
          kind: "static",
          staticKind: "effects",
          text: "As Business Card enters the field, choose an ally card name.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "object-entered-field",
                subject: {
                  kind: "source",
                },
              },
              operation: {
                kind: "perform-before-commit",
                effect: {
                  kind: "choose-value",
                  selection: {
                    id: "entry-choice",
                    kind: "choice",
                    declared: "event-processing",
                    chooser: "controller",
                    count: {
                      kind: "exactly",
                      amount: 1,
                    },
                    candidates: {
                      kind: "characteristic",
                      characteristic: "card-name",
                      optionsFrom: {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                    },
                  },
                  trackAs: "chosen-card-name",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "lumV6cG9oc-a2",
          kind: "activated",
          text: "(2), Sacrifice Business Card: Scavenge 8 for an ally card with the chosen name. If you control a Phone item, scavenge 20 for an ally card with the chosen name instead.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            player: "controller",
            amount: {
              kind: "conditional",
              condition: {
                kind: "controls",
                player: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["PHONE"],
                    },
                  ],
                },
              },
              then: 20,
              else: 8,
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "matches-tracked-characteristic",
                  key: "chosen-card-name",
                  characteristic: "card-name",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default businessCard;
