import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const etherealSlime: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "n06zlhihka",
  slug: "ethereal-slime",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "n06zlhihka:face:default",
      catalogId: "n06zlhihka",
      name: "Ethereal Slime",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "SLIME"],
      },
      elements: ["CRUX"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Pride 3, Stealth, True Sight\n\n[Class Bonus] On Enter: You may banish a Tamer card from your material deck. If you do, draw a card and put a buff counter on Ethereal Slime.\n\n[Level 5+] Prevent all non-combat damage that would be dealt to Ethereal Slime.",
      abilities: [
        {
          id: "n06zlhihka-a1",
          kind: "keyword-group",
          text: "Pride 3, Stealth, True Sight",
          keywords: [
            {
              name: "pride",
              value: 3,
            },
            {
              name: "stealth",
            },
            {
              name: "true-sight",
            },
          ],
        },
        {
          id: "n06zlhihka-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: You may banish a Tamer card from your material deck. If you do, draw a card and put a buff counter on Ethereal Slime.",
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
                        zones: ["material-deck"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "subtype",
                          oneOf: ["TAMER"],
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
                    kind: "sequence",
                    effects: [
                      {
                        kind: "draw",
                        player: "controller",
                        amount: 1,
                      },
                      {
                        kind: "add-counter",
                        subject: {
                          kind: "source",
                        },
                        counter: "buff",
                        amount: 1,
                      },
                    ],
                  },
                },
              ],
            },
          },
        },
        {
          id: "n06zlhihka-a3",
          kind: "static",
          staticKind: "effects",
          text: "[Level 5+] Prevent all non-combat damage that would be dealt to Ethereal Slime.",
          restrictions: [
            {
              kind: "static",
              name: "level-restriction",
              condition: {
                kind: "compare",
                comparison: {
                  left: {
                    kind: "property",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    property: "level",
                    basis: "current",
                  },
                  operator: "gte",
                  right: 5,
                },
              },
            },
          ],
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
                combatDamage: false,
              },
              operation: {
                kind: "prevent",
              },
              duration: {
                kind: "while-source-on-field",
              },
            },
          ],
        },
      ],
    },
  },
};

export default etherealSlime;
