import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const apprenticeAeromancer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "9f0nsj62l6",
  slug: "apprentice-aeromancer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "9f0nsj62l6:face:default",
      catalogId: "9f0nsj62l6",
      name: "Apprentice Aeromancer",
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
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)\n\n[Class Bonus] Whenever you activate a wind element Spell card, Apprentice Aeromancer gets +1 POWER until end of turn.",
      abilities: [
        {
          id: "9f0nsj62l6-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "keyword-action",
            action: "empower",
            amount: 2,
          },
        },
        {
          id: "9f0nsj62l6-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate a wind element Spell card, Apprentice Aeromancer gets +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "element",
                      oneOf: ["WIND"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPELL"],
                    },
                  ],
                },
              },
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
            kind: "continuous",
            subjects: {
              kind: "source",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
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
        },
      ],
    },
  },
};

export default apprenticeAeromancer;
