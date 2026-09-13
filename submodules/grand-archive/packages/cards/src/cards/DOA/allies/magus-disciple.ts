import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const magusDisciple: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pnDhApDNvR",
  slug: "magus-disciple",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pnDhApDNvR:face:default",
      catalogId: "pnDhApDNvR",
      name: "Magus Disciple",
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
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Your champion gets +1 level.\n\n[Class Bonus] On Death: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "pnDhApDNvR-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +1 level.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
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
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "pnDhApDNvR-a2",
          kind: "triggered",
          text: "[Class Bonus] On Death: Draw a card. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-died",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default magusDisciple;
