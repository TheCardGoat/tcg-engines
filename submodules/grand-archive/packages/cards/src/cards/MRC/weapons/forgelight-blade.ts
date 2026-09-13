import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const forgelightBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ly4wiffei7",
  slug: "forgelight-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ly4wiffei7:face:default",
      catalogId: "ly4wiffei7",
      name: "Forgelight Blade",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["WEAPON"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        durability: 2,
      },
      rulesText:
        "[Class Bonus] Forgelight Blade gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)\n\nOn Enter: Deal 4 damage to your champion.",
      abilities: [
        {
          id: "ly4wiffei7-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Forgelight Blade gets +1 POWER. (Apply this effect only if your champion’s class matches this card’s class.)",
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
          id: "ly4wiffei7-a2",
          kind: "triggered",
          text: "On Enter: Deal 4 damage to your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
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
            amount: 4,
          },
        },
      ],
    },
  },
};

export default forgelightBlade;
