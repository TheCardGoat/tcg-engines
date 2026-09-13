import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const waterfallSage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "lbhW6j1bJN",
  slug: "waterfall-sage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "lbhW6j1bJN:face:default",
      catalogId: "lbhW6j1bJN",
      name: "Waterfall Sage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Attack: Cascade— \n• 1— Empower 1. \n• 2— Empower 2.\n• 3— This attack gets +3POWER.\n(This ability changes each cascade.)",
      abilities: [
        {
          id: "lbhW6j1bJN-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: Cascade—\n• 1— Empower 1.\n• 2— Empower 2.\n• 3— This attack gets +3POWER.\n(This ability changes each cascade.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          cascade: {
            kind: "cascade",
            advanceOn: "trigger",
            tracking: {
              scope: "source-instance",
              includesCurrent: true,
              advancesIfStackEntryFailsToResolve: true,
            },
            copiedAbility: "repeat-pending-effect-without-advancing",
            modes: [
              {
                id: "cascade-1",
                text: "Empower 1.",
                counts: [1],
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: 1,
                },
              },
              {
                id: "cascade-2",
                text: "Empower 2.",
                counts: [2],
                effect: {
                  kind: "keyword-action",
                  action: "empower",
                  amount: 2,
                },
              },
              {
                id: "cascade-3",
                text: "This attack gets +3POWER.",
                counts: [3],
                effect: {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
              },
            ],
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
        },
      ],
    },
  },
};

export default waterfallSage;
