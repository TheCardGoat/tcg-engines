import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bulwarkSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "8kmoi0a5uh",
  slug: "bulwark-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "8kmoi0a5uh:face:default",
      catalogId: "8kmoi0a5uh",
      name: "Bulwark Sword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Bulwark Sword gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)\n\nAs an additional cost to use this weapon for an attack, pay (2).",
      abilities: [
        {
          id: "8kmoi0a5uh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Bulwark Sword gets +1 POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
          id: "8kmoi0a5uh-a2",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to use this weapon for an attack, pay (2).",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "use-weapon-for-attack",
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

export default bulwarkSword;
