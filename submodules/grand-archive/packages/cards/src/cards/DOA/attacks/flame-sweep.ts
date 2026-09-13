import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flameSweep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "FGvq4eQPbP",
  slug: "flame-sweep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "FGvq4eQPbP:face:default",
      catalogId: "FGvq4eQPbP",
      name: "Flame Sweep",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
      },
      rulesText:
        "Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)\n\n[Class Bonus] [Level 2+] Flame Sweep gets +1 POWER. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "FGvq4eQPbP-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Cleave (Attack all units a chosen opponent controls. This attack can't be intercepted.)",
          keyword: {
            name: "cleave",
          },
        },
        {
          id: "FGvq4eQPbP-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Flame Sweep gets +1 POWER. (Apply this effect only if your champion's class matches this card's class, and only if your champion is level 2 or higher.)",
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
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default flameSweep;
