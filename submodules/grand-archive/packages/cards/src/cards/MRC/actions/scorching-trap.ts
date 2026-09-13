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
          kind: "card-resolution",
          text: "[Class Bonus] If it’s not your turn, you may remove a preparation counter from your champion to activate this card from your memory without paying its reserve cost.",
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
                  oneOf: ["CHAMPION"],
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
            kind: "conditional",
            condition: {
              kind: "turn-player",
              player: "opponent",
            },
            then: {
              kind: "optional",
              player: "controller",
              allOrNothing: true,
              effect: {
                kind: "remove-counter",
                subject: {
                  kind: "bound",
                  binding: "target-1",
                },
                counter: "preparation",
                amount: 1,
                bindResultAs: "removed-counters",
              },
            },
          },
        },
        {
          id: "wjbqjdmthh-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target attacking unit.",
          targets: [
            {
              id: "wjbqjdmthh-a2:target-1",
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
              binding: "wjbqjdmthh-a2:target-1",
            },
            amount: 2,
          },
        },
      ],
    },
  },
};

export default scorchingTrap;
