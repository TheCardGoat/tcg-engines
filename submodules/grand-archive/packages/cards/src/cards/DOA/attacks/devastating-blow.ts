import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const devastatingBlow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "At1UNRG7F0",
  slug: "devastating-blow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "At1UNRG7F0:face:default",
      catalogId: "At1UNRG7F0",
      name: "Devastating Blow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN", "WARRIOR"],
        subtypes: ["GUARDIAN", "WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Class Bonus] [Level 3+] Devastating Blow gets +4 POWER and can't be retaliated. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 3 or higher.)",
      abilities: [
        {
          id: "At1UNRG7F0-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 3+] Devastating Blow gets +4 POWER and can't be retaliated. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 3 or higher.)",
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
                  right: 3,
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
                amount: 4,
              },
            },
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "retaliate",
              against: {
                kind: "source",
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

export default devastatingBlow;
