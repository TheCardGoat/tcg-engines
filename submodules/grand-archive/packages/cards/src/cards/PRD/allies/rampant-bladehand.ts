import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rampantBladehand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3WQKmqDgtA",
  slug: "rampant-bladehand",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3WQKmqDgtA:face:default",
      catalogId: "3WQKmqDgtA",
      name: "Rampant Bladehand",
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
        power: 3,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Attack: You may remove a durability counter from a weapon you control. If you do, this attack gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "3WQKmqDgtA-a1",
          kind: "triggered",
          text: "[Class Bonus] On Attack: You may remove a durability counter from a weapon you control. If you do, this attack gets +1POWER. (Apply this effect only if your champion's class matches this card's class.)",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
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
                  kind: "remove-counter",
                  subject: {
                    kind: "bound",
                    binding: "target-1",
                  },
                  counter: "durability",
                  amount: 1,
                  bindResultAs: "removed-counters",
                },
                {
                  kind: "continuous",
                  subjects: {
                    kind: "current-attack",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-attack",
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
          },
        },
      ],
    },
  },
};

export default rampantBladehand;
