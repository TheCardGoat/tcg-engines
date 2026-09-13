import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windriderMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "ZfCtSldRIy",
  slug: "windrider-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "ZfCtSldRIy:face:default",
      catalogId: "ZfCtSldRIy",
      name: "Windrider Mage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)\n\n[Class Bonus] At the beginning of your recollection phase, you may return Windrider Mage to your hand. If you do, put an enlighten counter on your champion.",
      abilities: [
        {
          id: "ZfCtSldRIy-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth (This unit can't be targeted by attacks unless permitted by true sight.)",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "ZfCtSldRIy-a2",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, you may return Windrider Mage to your hand. If you do, put an enlighten counter on your champion.",
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
              kind: "sequence",
              effects: [
                {
                  kind: "move",
                  subject: {
                    kind: "source",
                  },
                  destination: {
                    zone: "hand",
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "enlighten",
                  amount: 1,
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default windriderMage;
