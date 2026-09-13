import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weaponsmith: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6gN5KjqRW5",
  slug: "weaponsmith",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6gN5KjqRW5:face:default",
      catalogId: "6gN5KjqRW5",
      name: "Weaponsmith",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] At the beginning of your recollection phase, put a durability counter on target weapon you control. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "6gN5KjqRW5-a1",
          kind: "triggered",
          text: "[Class Bonus] At the beginning of your recollection phase, put a durability counter on target weapon you control. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "phase-begins",
              phase: "recollection",
              actor: "controller",
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
            kind: "add-counter",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            counter: "durability",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default weaponsmith;
