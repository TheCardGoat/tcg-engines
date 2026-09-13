import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flingFood: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pVHGi99Svy",
  slug: "fling-food",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pVHGi99Svy:face:default",
      catalogId: "pVHGi99Svy",
      name: "Fling Food",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "KITCHEN", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a Food item.\n\nDeal 4 damage to target unit.",
      abilities: [
        {
          id: "pVHGi99Svy-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a Food item.",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "select-and-sacrifice",
                player: "controller",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                bindResultAs: "sacrificed-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["FOOD"],
                    },
                  ],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "pVHGi99Svy-a2",
          kind: "card-resolution",
          text: "Deal 4 damage to target unit.",
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
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 4,
          },
        },
      ],
    },
  },
};

export default flingFood;
