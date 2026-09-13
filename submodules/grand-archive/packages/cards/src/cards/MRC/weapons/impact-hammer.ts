import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const impactHammer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "chsbalegbs",
  slug: "impact-hammer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "chsbalegbs:face:default",
      catalogId: "chsbalegbs",
      name: "Impact Hammer",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HAMMER"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Impact Hammer gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)\n\nWhenever a unit uses this weapon for an attack, deal 3 damage to it.",
      abilities: [
        {
          id: "chsbalegbs-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Impact Hammer gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          id: "chsbalegbs-a2",
          kind: "triggered",
          text: "Whenever a unit uses this weapon for an attack, deal 3 damage to it.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
              using: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "event-subject",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default impactHammer;
