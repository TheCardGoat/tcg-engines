import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const emergentDagger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wljhyokktb",
  slug: "emergent-dagger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wljhyokktb:face:default",
      catalogId: "wljhyokktb",
      name: "Emergent Dagger",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Emergent Dagger gets +2 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "wljhyokktb-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Emergent Dagger gets +2 POWER. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
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
      ],
    },
  },
};

export default emergentDagger;
