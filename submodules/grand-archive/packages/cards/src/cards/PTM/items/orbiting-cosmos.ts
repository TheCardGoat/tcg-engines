import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const orbitingCosmos: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qM9yzxQbfF",
  slug: "orbiting-cosmos",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qM9yzxQbfF:face:default",
      catalogId: "qM9yzxQbfF",
      name: "Orbiting Cosmos",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "ARTIFACT"],
      },
      elements: ["ASTRA"],
      stats: {},
      rulesText:
        "If you would glimpse an amount, glimpse X instead, where X is that amount plus 1.\n\n(3), Banish Orbiting Cosmos: Draw a card into your memory.",
      abilities: [
        {
          id: "qM9yzxQbfF-a1",
          kind: "static",
          staticKind: "effects",
          text: "If you would glimpse an amount, glimpse X instead, where X is that amount plus 1.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "keyword-action-performed",
                action: "glimpse",
                actor: "controller",
              },
              operation: {
                kind: "replace-with",
                effect: {
                  kind: "keyword-action",
                  action: "glimpse",
                  amount: {
                    kind: "calculate",
                    operator: "add",
                    operands: [
                      {
                        kind: "event-amount",
                      },
                      1,
                    ],
                  },
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "qM9yzxQbfF-a2",
          kind: "activated",
          text: "(3), Banish Orbiting Cosmos: Draw a card into your memory.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "banish-self",
              },
            ],
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

export default orbitingCosmos;
