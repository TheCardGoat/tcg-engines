import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const overwhelmingSwing: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aebjvwbciz",
  slug: "overwhelming-swing",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aebjvwbciz:face:default",
      catalogId: "aebjvwbciz",
      name: "Overwhelming Swing",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HAMMER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 5,
      },
      rulesText:
        "[Class Bonus] [Level 2+] Combat damage dealt by this attack is unpreventable. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "aebjvwbciz-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] Combat damage dealt by this attack is unpreventable. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
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
              kind: "rule-modification",
              mode: "forbid",
              action: "prevent-damage",
              using: {
                kind: "source",
              },
              damageKind: "combat",
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

export default overwhelmingSwing;
