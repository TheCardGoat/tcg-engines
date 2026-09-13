import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moltenImpact: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "7Pc1aiu3Bq",
  slug: "molten-impact",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "7Pc1aiu3Bq:face:default",
      catalogId: "7Pc1aiu3Bq",
      name: "Molten Impact",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "As an additional cost to activate this card, sacrifice a weapon.\n\nDeal 2+X damage to target unit, where X is the amount of durability counters that was on the sacrificed weapon.\n",
      abilities: [
        {
          id: "7Pc1aiu3Bq-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to activate this card, sacrifice a weapon.",
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
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "7Pc1aiu3Bq-a2",
          kind: "card-resolution",
          text: "Deal 2+X damage to target unit, where X is the amount of durability counters that was on the sacrificed weapon.",
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
            amount: {
              kind: "calculate",
              operator: "add",
              operands: [
                2,
                {
                  kind: "variable",
                  symbol: "X",
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default moltenImpact;
