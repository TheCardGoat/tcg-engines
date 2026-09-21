import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const pyrolysisSage: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "VJdQQmnL2Z",
  slug: "pyrolysis-sage",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "VJdQQmnL2Z:face:default",
      catalogId: "VJdQQmnL2Z",
      name: "Pyrolysis Sage",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC", "MAGE"],
        subtypes: ["CLERIC", "MAGE", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 2,
        life: 1,
      },
      rulesText:
        "[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
      abilities: [
        {
          id: "VJdQQmnL2Z-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a fire element card from your graveyard. If you do, empower 2. (The next Spell card you activate this turn activates and resolves as if your champion got +2 level.)",
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
                          kind: "element",
                          oneOf: ["FIRE"],
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
                    amount: 2,
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

export default pyrolysisSage;
