import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const magebaneLash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "oh300z2sns",
  slug: "magebane-lash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "oh300z2sns:face:default",
      catalogId: "oh300z2sns",
      name: "Magebane Lash",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "LASH"],
      },
      elements: ["WATER"],
      stats: {
        power: 0,
        durability: 4,
      },
      rulesText:
        "[Class Bonus] On Enter: Put a lash counter on your champion.\n\nMagebane Lash gets +1 POWER for each lash counter on your champion.\n\n[Nico Bonus] Whenever your champion is dealt non-combat damage, recover 2.",
      abilities: [
        {
          id: "oh300z2sns-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a lash counter on your champion.",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: {
              named: "lash",
            },
            amount: 1,
          },
        },
        {
          id: "oh300z2sns-a2",
          kind: "static",
          staticKind: "effects",
          text: "Magebane Lash gets +1 POWER for each lash counter on your champion.",
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
                  kind: "counter-count",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: {
                    named: "lash",
                  },
                },
              },
            },
          ],
        },
        {
          id: "oh300z2sns-a3",
          kind: "triggered",
          text: "[Nico Bonus] Whenever your champion is dealt non-combat damage, recover 2.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              combatDamage: false,
            },
          },
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Nico",
              },
            },
          ],
          effect: {
            kind: "recover",
            player: "controller",
            amount: 2,
          },
        },
      ],
    },
  },
};

export default magebaneLash;
