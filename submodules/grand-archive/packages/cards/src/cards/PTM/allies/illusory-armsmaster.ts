import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const illusoryArmsmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LnVEY7nVXn",
  slug: "illusory-armsmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LnVEY7nVXn:face:default",
      catalogId: "LnVEY7nVXn",
      name: "Illusory Armsmaster",
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
      elements: ["EXALTED", "WATER"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Fast Activation (You may activate this card at fast speed.)\n\n[Class Bonus] On Enter: Target Warrior weapon you control gains spellshroud until end of turn. Put two durability counters on it.",
      abilities: [
        {
          id: "LnVEY7nVXn-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Fast Activation (You may activate this card at fast speed.)",
          keyword: {
            name: "fast-activation",
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
        {
          id: "LnVEY7nVXn-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Target Warrior weapon you control gains spellshroud until end of turn. Put two durability counters on it.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["WARRIOR"],
                    },
                  ],
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
            kind: "sequence",
            effects: [
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
                    name: "spellshroud",
                  },
                },
              },
              {
                kind: "add-counter",
                subject: {
                  kind: "event-subject",
                },
                counter: "durability",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default illusoryArmsmaster;
