import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloodbondBladesworn: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "blyb6fd6vy",
  slug: "bloodbond-bladesworn",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "blyb6fd6vy:face:default",
      catalogId: "blyb6fd6vy",
      name: "Bloodbond Bladesworn",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["EXIA"],
      stats: {
        power: 3,
        life: 6,
      },
      rulesText:
        "[Class Bonus] Bloodbond Bladesworn gets +1 POWER for every ten damage counters on your champion.\n\nWhenever Bloodbond Bladesworn is dealt damage, deal that much damage to your champion.",
      abilities: [
        {
          id: "blyb6fd6vy-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Bloodbond Bladesworn gets +1 POWER for every ten damage counters on your champion.",
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
                amount: {
                  kind: "calculate",
                  operator: "divide",
                  operands: [
                    {
                      kind: "counter-count",
                      subject: {
                        kind: "champion",
                        player: "controller",
                      },
                      counter: "damage",
                    },
                    10,
                  ],
                  rounding: "down",
                },
              },
            },
          ],
        },
        {
          id: "blyb6fd6vy-a2",
          kind: "triggered",
          text: "Whenever Bloodbond Bladesworn is dealt damage, deal that much damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              recipient: {
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
              kind: "champion",
              player: "controller",
            },
            amount: {
              kind: "event-amount",
            },
          },
        },
      ],
    },
  },
};

export default bloodbondBladesworn;
