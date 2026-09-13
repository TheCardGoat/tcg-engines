import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const archonBroadsword: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pyx8bd7ozu",
  slug: "archon-broadsword",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pyx8bd7ozu:face:default",
      catalogId: "pyx8bd7ozu",
      name: "Archon Broadsword",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NEOS"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "As an additional cost to use this weapon for an attack, pay (2).\n\n[Class Bonus] Archon Broadsword gets +1 POWER for each token you control. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "pyx8bd7ozu-a1",
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
        {
          id: "pyx8bd7ozu-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Archon Broadsword gets +1 POWER for each token you control. (Apply this effect only if your champion's class matches this card's class.)",
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
                amount: {
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "token",
                      value: true,
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default archonBroadsword;
