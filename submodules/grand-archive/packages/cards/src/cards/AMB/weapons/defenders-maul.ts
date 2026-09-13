import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const defendersMaul: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "chnppup4iz",
  slug: "defenders-maul",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "chnppup4iz:face:default",
      catalogId: "chnppup4iz",
      name: "Defender's Maul",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HAMMER"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        durability: 3,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Defender's Maul gets +2 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)\n\nAs an additional cost to use this weapon for an attack, pay (2).",
      abilities: [
        {
          id: "chnppup4iz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Defender's Maul gets +2 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 2,
                },
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
                amount: 2,
              },
            },
          ],
        },
        {
          id: "chnppup4iz-a2",
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

export default defendersMaul;
