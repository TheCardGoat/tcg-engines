import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const berserkerPlate: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ci00l7pqcx",
  slug: "berserker-plate",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ci00l7pqcx:face:default",
      catalogId: "ci00l7pqcx",
      name: "Berserker Plate",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "ARMOR"],
      },
      elements: ["EXIA"],
      stats: {},
      rulesText:
        "[Class Bonus] Your champion gets +7 LIFE. (Apply this effect only if your champion's class matches this card's class.)\n\nAt the beginning of your recollection phase, deal 3 unpreventable damage to your champion then draw a card.",
      abilities: [
        {
          id: "ci00l7pqcx-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Your champion gets +7 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 7,
              },
            },
          ],
        },
        {
          id: "ci00l7pqcx-a2",
          kind: "triggered",
          text: "At the beginning of your recollection phase, deal 3 unpreventable damage to your champion then draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                amount: 3,
                preventable: false,
              },
              {
                kind: "draw",
                player: "controller",
                amount: 1,
              },
            ],
          },
        },
      ],
    },
  },
};

export default berserkerPlate;
