import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const morganSoulGuide: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ka5av43ehj",
  slug: "morgan-soul-guide",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ka5av43ehj:face:default",
      catalogId: "ka5av43ehj",
      name: "Morgan, Soul Guide",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Level 1+] Prevent all non-combat damage that would be dealt to Morgan.\n\n[Level 2+] Your opponents can't  recover.\n\n[Class Bonus] At the beginning of your recollection phase, you may glimpse 1. If you don't, recover 1.",
      abilities: [
        {
          id: "ka5av43ehj-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 1+] Prevent all non-combat damage that would be dealt to Morgan.",
          restrictions: [
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
                  right: 1,
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: false,
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
        {
          id: "ka5av43ehj-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] Your opponents can't  recover.",
          effects: [
            {
              kind: "rule-modification",
              mode: "forbid",
              action: "recover",
              subject: {
                kind: "player",
                player: "opponent",
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "ka5av43ehj-a3",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, you may glimpse 1. If you don't, recover 1.",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
            },
          },
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
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "keyword-action",
              action: "glimpse",
              amount: 1,
            },
            otherwise: {
              kind: "recover",
              player: "controller",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default morganSoulGuide;
