import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const viciousSlice: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n1uoy5ttka",
  slug: "vicious-slice",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n1uoy5ttka:face:default",
      catalogId: "n1uoy5ttka",
      name: "Vicious Slice",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] As long as the attacker is attacking a Human, Vicious Slice gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "n1uoy5ttka-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as the attacker is attacking a Human, Vicious Slice gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
              condition: {
                kind: "combat-relation",
                relation: "attacking",
                subject: {
                  kind: "event-attacker",
                },
                otherFilter: {
                  kind: "subtype",
                  oneOf: ["HUMAN"],
                },
              },
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

export default viciousSlice;
