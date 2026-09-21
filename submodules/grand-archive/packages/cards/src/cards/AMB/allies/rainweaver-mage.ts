import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const rainweaverMage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qb6zhphtw6",
  slug: "rainweaver-mage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qb6zhphtw6:face:default",
      catalogId: "qb6zhphtw6",
      name: "Rainweaver Mage",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: You may banish a card with floating memory from your graveyard. If you do, empower 4. (The next Spell card you activate this turn activates and resolves as if your champion got +4 level.)",
      abilities: [
        {
          id: "qb6zhphtw6-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a card with floating memory from your graveyard. If you do, empower 4. (The next Spell card you activate this turn activates and resolves as if your champion got +4 level.)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
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
                  bindSucceededAs: "optional-action-succeeded",
                },
                {
                  kind: "conditional",
                  condition: {
                    kind: "effect-succeeded",
                    binding: "optional-action-succeeded",
                  },
                  then: {
                    kind: "keyword-action",
                    action: "empower",
                    amount: 4,
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

export default rainweaverMage;
