import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const deflectingAdvantage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "40TLLuE6oG",
  slug: "deflecting-advantage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "40TLLuE6oG:face:default",
      catalogId: "40TLLuE6oG",
      name: "Deflecting Advantage",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL", "POLEARM", "REACTION"],
      },
      elements: ["EXIA"],
      speed: "fast",
      stats: {},
      rulesText:
        "Prevent the next 1 damage that would be dealt to target unit this turn from sources you don't control for every three damage counters on your champion.\n\n[Jin Bonus] Choose a Polearm weapon you control and trigger each of its on enter effects. Then put a durability counter on it.",
      abilities: [
        {
          id: "40TLLuE6oG-a1",
          kind: "card-resolution",
          text: "Prevent the next 1 damage that would be dealt to target unit this turn from sources you don't control for every three damage counters on your champion.",
          targets: [
            {
              id: "target-unit",
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
              subject: {
                kind: "event-object",
                controller: "opponent",
              },
              recipient: {
                kind: "bound-object",
                binding: "target-unit",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: {
                kind: "calculate",
                operator: "divide",
                operands: [
                  {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  3,
                ],
                rounding: "down",
              },
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
        {
          id: "40TLLuE6oG-a2",
          kind: "card-resolution",
          text: "[Jin Bonus] Choose a Polearm weapon you control and trigger each of its on enter effects. Then put a durability counter on it.",
          restrictions: [
            {
              kind: "static",
              name: "champion-bonus",
              condition: {
                kind: "champion-lineage-is",
                name: "Jin",
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-polearm",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
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
                      oneOf: ["POLEARM"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "trigger-abilities",
                  subject: {
                    kind: "bound",
                    binding: "chosen-polearm",
                  },
                  triggerName: "on-enter",
                  count: "each",
                },
                {
                  kind: "add-counter",
                  subject: {
                    kind: "bound",
                    binding: "chosen-polearm",
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

export default deflectingAdvantage;
