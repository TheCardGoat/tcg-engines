import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const inertSword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "2s08hssegf",
  slug: "inert-sword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "2s08hssegf:face:default",
      catalogId: "2s08hssegf",
      name: "Inert Sword",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "DISTORTION", "SWORD"],
      },
      elements: ["ASTRA"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "As an additional cost to materialize this weapon, pay (2).\n\n[Class Bonus] Inert Sword gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "2s08hssegf-a1",
          kind: "static",
          staticKind: "effects",
          text: "As an additional cost to materialize this weapon, pay (2).",
          effects: [
            {
              kind: "rule-modification",
              mode: "add-cost",
              action: "materialize",
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
        {
          id: "2s08hssegf-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Inert Sword gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)",
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
      ],
    },
  },
};

export default inertSword;
