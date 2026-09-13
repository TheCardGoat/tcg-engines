import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const ripplebackTerrapin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "srkomr8ght",
  slug: "rippleback-terrapin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "srkomr8ght:face:default",
      catalogId: "srkomr8ght",
      name: "Rippleback Terrapin",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "ANIMAL", "TURTLE"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 4,
      },
      rulesText:
        "[Class Bonus] Spellshroud (This ally can't be targeted by Spells.)\n\nOn Enter: You may banish a card with floating memory from your graveyard. If you do, put a buff counter on Rippleback Terrapin and draw a card.",
      abilities: [
        {
          id: "srkomr8ght-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "[Class Bonus] Spellshroud (This ally can't be targeted by Spells.)",
          keyword: {
            name: "spellshroud",
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
          id: "srkomr8ght-a2",
          kind: "triggered",
          text: "On Enter: You may banish a card with floating memory from your graveyard. If you do, put a buff counter on Rippleback Terrapin and draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "sequence",
              effects: [
                {
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
                      zones: ["graveyard"],
                      relationship: "zone-of",
                      player: "controller",
                      filter: {
                        kind: "has-keyword",
                        keyword: "floating-memory",
                      },
                    },
                  },
                },
                {
                  kind: "sequence",
                  effects: [
                    {
                      kind: "add-counter",
                      subject: {
                        kind: "source",
                      },
                      counter: "buff",
                      amount: 1,
                    },
                    {
                      kind: "draw",
                      player: "controller",
                      amount: 1,
                    },
                  ],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default ripplebackTerrapin;
