import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const relicOfDancingEmbers: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i8g5013x9j",
  slug: "relic-of-dancing-embers",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i8g5013x9j:face:default",
      catalogId: "i8g5013x9j",
      name: "Relic of Dancing Embers",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ARTIFACT"],
      },
      elements: ["FIRE"],
      stats: {},
      rulesText:
        "Hindered (This object entered the field rested.)\n\nWhenever a fire element ally you control deals combat damage to a champion while Relic of Dancing Embers is awake, you may sacrifice Relic of Dancing Embers. If you do, deal 3 damage to that champion.\n\n[Class Bonus] Floating Memory",
      abilities: [
        {
          id: "i8g5013x9j-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Hindered (This object entered the field rested.)",
          keyword: {
            name: "hindered",
          },
        },
        {
          id: "i8g5013x9j-a2",
          kind: "triggered",
          text: "Whenever a fire element ally you control deals combat damage to a champion while Relic of Dancing Embers is awake, you may sacrifice Relic of Dancing Embers. If you do, deal 3 damage to that champion.",
          trigger: {
            kind: "event",
            event: {
              name: "damage-dealt",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "element",
                      oneOf: ["FIRE"],
                    },
                  ],
                },
              },
              recipient: {
                kind: "event-object",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
              combatDamage: true,
            },
          },
          interveningCondition: {
            kind: "object-state",
            subject: {
              kind: "source",
            },
            state: "awake",
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "sacrifice",
                  subject: {
                    kind: "source",
                  },
                },
                {
                  kind: "deal-damage",
                  source: {
                    kind: "source",
                  },
                  recipient: {
                    kind: "event-recipient",
                  },
                  amount: 3,
                },
              ],
            },
          },
        },
        {
          id: "i8g5013x9j-a3",
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

export default relicOfDancingEmbers;
