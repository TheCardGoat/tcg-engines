import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shredToRibbons: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5j36gn1b2s",
  slug: "shred-to-ribbons",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5j36gn1b2s:face:default",
      catalogId: "5j36gn1b2s",
      name: "Shred to Ribbons",
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
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] As long as the attacker is attacking an ally with 5 LIFE or more, Shred to Ribbons gets +3 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "5j36gn1b2s-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as the attacker is attacking an ally with 5 LIFE or more, Shred to Ribbons gets +3 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
                  kind: "type",
                  oneOf: ["ALLY"],
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
                amount: 3,
              },
            },
          ],
        },
      ],
    },
  },
};

export default shredToRibbons;
