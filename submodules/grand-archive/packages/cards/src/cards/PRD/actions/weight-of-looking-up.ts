import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const weightOfLookingUp: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "i1BCY4T5fL",
  slug: "weight-of-looking-up",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "i1BCY4T5fL:face:default",
      catalogId: "i1BCY4T5fL",
      name: "Weight of Looking Up",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "You may banish a champion card with base level 3 or higher from your material deck. If you do, draw a card into your memory.\n\nFloating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
      abilities: [
        {
          id: "i1BCY4T5fL-a1",
          kind: "card-resolution",
          text: "You may banish a champion card with base level 3 or higher from your material deck. If you do, draw a card into your memory.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
                  kind: "attempt",
                  effect: {
                    kind: "banish",
                    player: "controller",
                    selection: {
                      id: "banished-cards",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "exactly",
                        amount: 1,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "type",
                          oneOf: ["CHAMPION"],
                        },
                      },
                    },
                  },
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "draw",
                    player: "controller",
                    amount: 1,
                    to: "memory",
                  },
                },
              ],
            },
          },
        },
        {
          id: "i1BCY4T5fL-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory (While paying for a memory cost, you may banish this card from your graveyard to pay for 1 of that cost.)",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default weightOfLookingUp;
