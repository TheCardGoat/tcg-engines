import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const heatedVengeance: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "td460e8ig0",
  slug: "heated-vengeance",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "td460e8ig0:face:default",
      catalogId: "td460e8ig0",
      name: "Heated Vengeance",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "POLEARM"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
      },
      rulesText:
        "As long as your champion has taken damage this turn, Heated Vengeance gets +3 POWER.\n\n[Class Bonus] On Attack: You may have Heated Vengeance deal 3 damage to your champion.",
      abilities: [
        {
          id: "td460e8ig0-a1",
          kind: "static",
          staticKind: "effects",
          text: "As long as your champion has taken damage this turn, Heated Vengeance gets +3 POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "history",
                event: "damage-dealt",
                window: "this-turn",
                recipient: {
                  kind: "champion",
                  player: "controller",
                },
                minimum: 1,
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
        {
          id: "td460e8ig0-a2",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may have Heated Vengeance deal 3 damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "champion",
                player: "controller",
              },
              amount: 3,
            },
          },
        },
      ],
    },
  },
};

export default heatedVengeance;
