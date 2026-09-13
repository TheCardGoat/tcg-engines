import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const betrayingBlade: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qwxvzfkpaj",
  slug: "betraying-blade",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qwxvzfkpaj:face:default",
      catalogId: "qwxvzfkpaj",
      name: "Betraying Blade",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "DAGGER"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "On Attack: You may pay (2). If you do, put a preparation counter on your champion.\n\n[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.) ",
      abilities: [
        {
          id: "qwxvzfkpaj-a1",
          kind: "triggered",
          text: "On Attack: You may pay (2). If you do, put a preparation counter on your champion.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "pay",
                  player: "controller",
                  cost: {
                    kind: "pay-reserve",
                    amount: 2,
                  },
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "champion",
                    player: "controller",
                  },
                  counter: "preparation",
                  amount: 1,
                },
              ],
            },
          },
        },
        {
          id: "qwxvzfkpaj-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
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

export default betrayingBlade;
