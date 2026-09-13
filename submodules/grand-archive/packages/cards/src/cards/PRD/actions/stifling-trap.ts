import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const stiflingTrap: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "z5exbwdp7q",
  slug: "stifling-trap",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "z5exbwdp7q:face:default",
      catalogId: "z5exbwdp7q",
      name: "Stifling Trap",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Class Bonus] If it's not your turn, you may remove two preparation counters from your champion to activate this card from your memory without paying its reserve cost.\n\nDeal 2 damage to target ally, then negate all on enter triggers from that ally.",
      abilities: [
        {
          id: "z5exbwdp7q-a1",
          kind: "card-resolution",
          text: "[Class Bonus] If it's not your turn, you may remove two preparation counters from your champion to activate this card from your memory without paying its reserve cost.",
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
                amount: 2,
                bindResultAs: "removed-counters",
              },
            },
          },
        },
        {
          id: "z5exbwdp7q-a2",
          kind: "card-resolution",
          text: "Deal 2 damage to target ally, then negate all on enter triggers from that ally.",
          targets: [
            {
              id: "z5exbwdp7q-a2:target-1",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "z5exbwdp7q-a2:target-1",
                },
                amount: 2,
              },
              {
                kind: "negate-triggered-abilities",
                source: {
                  kind: "bound",
                  binding: "z5exbwdp7q-a2:target-1",
                },
                triggerEvent: "object-entered-field",
              },
            ],
          },
        },
      ],
    },
  },
};

export default stiflingTrap;
