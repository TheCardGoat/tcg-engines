import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scorchingTrap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "wjbqjdmthh",
  slug: "scorching-trap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "wjbqjdmthh:face:default",
      catalogId: "wjbqjdmthh",
      name: "Scorching Trap",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost. \n\nDeal 2 damage to target attacking unit.",
      abilities: [
        {
          id: "wjbqjdmthh-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost.",
          functionalZones: ["memory"],
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
          effects: [
            {
              kind: "rule-modification",
              mode: "allow",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              condition: {
                kind: "not",
                condition: {
                  kind: "turn-player",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
            {
              kind: "rule-modification",
              mode: "replace-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              fromZone: "memory",
              costKind: "reserve",
              cost: {
                kind: "remove-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "preparation",
                amount: 1,
              },
              condition: {
                kind: "not",
                condition: {
                  kind: "turn-player",
                  player: "controller",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "wjbqjdmthh-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target attacking unit.",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                    {
                      kind: "object-state",
                      state: "attacking",
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "deal-damage",
            source: {
              kind: "source",
            },
            recipient: {
              kind: "bound",
              binding: "target-1",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default scorchingTrap;
