import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const arsenalKeeper: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rn0yetaebj",
  slug: "arsenal-keeper",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rn0yetaebj:face:default",
      catalogId: "rn0yetaebj",
      name: "Arsenal Keeper",
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
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] On Enter: You may have Arsenal Keeper deal 2 damage to your champion. If you do, put a durability counter on a weapon you control. (Apply this effect only if your champion’s class matches this card’s class.)",
      abilities: [
        {
          id: "rn0yetaebj-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may have Arsenal Keeper deal 2 damage to your champion. If you do, put a durability counter on a weapon you control. (Apply this effect only if your champion’s class matches this card’s class.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["WEAPON"],
                },
              },
            },
          ],
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
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "champion",
                    player: "controller",
                  },
                  amount: 2,
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "durability",
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

export default arsenalKeeper;
