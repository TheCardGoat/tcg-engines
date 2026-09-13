import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const standBeforeTheQueen: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "v9SJgS6z40",
  slug: "stand-before-the-queen",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "v9SJgS6z40:face:default",
      catalogId: "v9SJgS6z40",
      name: "Stand Before the Queen",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SPELL", "REACTION"],
      },
      elements: ["WATER"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 2 damage that would be dealt to target unit this turn.\n\n[Sheen 8+] The first time damage is prevented from being dealt to a unit this way, that unit gains stealth until end of turn unless an opponent pays (2).\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "v9SJgS6z40-a1",
          kind: "card-resolution",
          text: "Prevent the next 2 damage that would be dealt to target unit this turn.",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 2,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "v9SJgS6z40-a2",
          kind: "ability-modifier",
          text: "[Sheen 8+] The first time damage is prevented from being dealt to a unit this way, that unit gains stealth until end of turn unless an opponent pays (2).",
          modifies: {
            kind: "preceding-non-modifier-ability",
          },
          restrictions: [
            {
              kind: "static",
              name: "sheen-restriction",
              condition: {
                kind: "mastery-has-counter",
                mastery: "Fractured Memories",
                counter: {
                  named: "sheen",
                },
                minimum: 8,
              },
            },
          ],
          operation: {
            kind: "append-effect",
            effect: {
              kind: "create-delayed-trigger",
              trigger: {
                kind: "event",
                event: {
                  name: "damage-prevented",
                  recipient: {
                    kind: "event-object",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
              },
              limit: 1,
              expires: {
                kind: "this-turn",
              },
              effect: {
                kind: "unless-paid",
                player: "opponent",
                cost: {
                  kind: "pay-reserve",
                  amount: 2,
                },
                otherwise: {
                  kind: "continuous",
                  subjects: {
                    kind: "event-recipient",
                  },
                  affectedSet: "locked",
                  duration: {
                    kind: "this-turn",
                  },
                  layer: {
                    layer: "D",
                    modifies: "ability",
                  },
                  change: {
                    kind: "grant-keyword",
                    keyword: {
                      name: "stealth",
                    },
                  },
                },
              },
            },
          },
        },
        {
          id: "v9SJgS6z40-a3",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Floating Memory",
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

export default standBeforeTheQueen;
