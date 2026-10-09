import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const kindlingFlare: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dcgw05qzza",
  slug: "kindling-flare",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dcgw05qzza:face:default",
      catalogId: "dcgw05qzza",
      name: "Kindling Flare",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice any amount of Herbs.\n\nDeal 1+X damage split among any amount of target units where X is the amount of Herbs sacrificed.",
      abilities: [
        {
          id: "dcgw05qzza-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice any amount of Herbs.",
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
                  kind: "any-number",
                },
                bindResultAs: "sacrificed-objects",
                filter: {
                  kind: "subtype",
                  oneOf: ["HERB"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "dcgw05qzza-a2",
          kind: "card-resolution",
          text: "Deal 1+X damage split among any amount of target units where X is the amount of Herbs sacrificed.",
          targets: [
            {
              id: "damage-targets",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "any-number",
              },
              unique: true,
              distributedAmount: {
                kind: "calculate",
                operator: "add",
                operands: [
                  1,
                  {
                    kind: "variable",
                    symbol: "X",
                  },
                ],
              },
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
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "binding-count",
                binding: "sacrificed-objects",
              },
            },
          ],
          effect: {
            kind: "distribute",
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                1,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
            among: {
              id: "damage-recipients",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "all",
              },
              candidates: {
                kind: "object",
                binding: "damage-targets",
              },
            },
            payload: {
              kind: "damage",
              source: {
                kind: "source",
              },
            },
          },
        },
      ],
    },
  },
};

export default kindlingFlare;
