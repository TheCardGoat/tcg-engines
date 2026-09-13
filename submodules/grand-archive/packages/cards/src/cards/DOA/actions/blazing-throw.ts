import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const blazingThrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "iohZMWh5v5",
  slug: "blazing-throw",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "iohZMWh5v5:face:default",
      catalogId: "iohZMWh5v5",
      name: "Blazing Throw",
      cost: {
        kind: "reserve",
        amount: 1,
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
        "As an additional cost to activate this card, sacrifice a weapon.\n\nDeal 4 damage to target unit.",
      abilities: [
        {
          id: "iohZMWh5v5-a1",
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
          id: "iohZMWh5v5-a2",
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

export default blazingThrow;
