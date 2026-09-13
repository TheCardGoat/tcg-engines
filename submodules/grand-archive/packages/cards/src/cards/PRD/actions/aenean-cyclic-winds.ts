import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const aeneanCyclicWinds: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "3GjTPUfsp3",
  slug: "aenean-cyclic-winds",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "3GjTPUfsp3:face:default",
      catalogId: "3GjTPUfsp3",
      name: "Aenean Cyclic Winds",
      cost: {
        kind: "reserve",
        amount: 5,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 3+] This card costs 2 less to activate.\n\nReturn target Spell card from your graveyard to your memory.\n\n[Class Bonus] [Level 5+] Reveal up to two wind element cards from your memory and return them to your hand. Then empower 2.",
      abilities: [
        {
          id: "3GjTPUfsp3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 3+] This card costs 2 less to activate.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
                  right: 3,
                },
              },
            },
          ],
          effects: [
            {
              kind: "rule-modification",
              mode: "modify-cost",
              action: "activate",
              subject: {
                kind: "source",
              },
              costKind: "reserve",
              costOperation: "subtract",
              amount: 2,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "3GjTPUfsp3-a2",
          kind: "card-resolution",
          text: "Return target Spell card from your graveyard to your memory.",
          targets: [
            {
              id: "target-card",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: "controller",
                filter: {
                  kind: "subtype",
                  oneOf: ["SPELL"],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "bound",
              binding: "target-card",
            },
            from: "graveyard",
            destination: {
              zone: "memory",
            },
          },
        },
        {
          id: "3GjTPUfsp3-a3",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 5+] Reveal up to two wind element cards from your memory and return them to your hand. Then empower 2.",
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
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
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "sequence",
                effects: [
                  {
                    kind: "reveal",
                    player: "controller",
                    selection: {
                      id: "reveal-selection",
                      kind: "choice",
                      declared: "resolution",
                      chooser: "controller",
                      count: {
                        kind: "up-to",
                        amount: 2,
                      },
                      candidates: {
                        kind: "card",
                        zones: ["memory"],
                        relationship: "zone-of",
                        player: "controller",
                        filter: {
                          kind: "element",
                          oneOf: ["WIND"],
                        },
                      },
                    },
                  },
                  {
                    kind: "move",
                    subject: {
                      kind: "bound",
                      binding: "reveal-selection",
                    },
                    from: "memory",
                    destination: {
                      zone: "hand",
                    },
                  },
                ],
              },
              {
                kind: "keyword-action",
                action: "empower",
                amount: 2,
              },
            ],
          },
        },
      ],
    },
  },
};

export default aeneanCyclicWinds;
