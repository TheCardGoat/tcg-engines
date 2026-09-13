import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const torchMarshal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "izgiu216l2",
  slug: "torch-marshal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "izgiu216l2:face:default",
      catalogId: "izgiu216l2",
      name: "Torch Marshal",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
        life: 3,
      },
      rulesText:
        "[Class Bonus] Torch Marshal gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)\n\nAs an additional cost to declare an attack with this ally, pay (2).",
      abilities: [
        {
          id: "izgiu216l2-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Torch Marshal gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
                kind: "source",
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "izgiu216l2-a2",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to declare an attack with this ally, pay (2).",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "attack",
              subject: {
                kind: "source",
              },
              cost: {
                kind: "pay-reserve",
                amount: 2,
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default torchMarshal;
