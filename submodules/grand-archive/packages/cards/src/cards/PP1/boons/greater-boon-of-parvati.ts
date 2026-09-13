import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const greaterBoonOfParvati: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "WOTtcgwVc9",
  slug: "greater-boon-of-parvati",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "WOTtcgwVc9:face:default",
      catalogId: "WOTtcgwVc9",
      name: "Greater Boon of Parvati",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["GREATER BOON"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SPELL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText:
        'Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)\n\nAs you gain this boon, draw a card.\n\nRegalia you control have "REST: Prevent the next 1 damage that would be dealt to target unit this turn."',
      abilities: [
        {
          id: "WOTtcgwVc9-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 2 (Play this card only if your champion’s base level is 2 or higher.)",
          effects: [
            {
              kind: "rule-modification",
              mode: "require",
              action: "play",
              subject: {
                kind: "source",
              },
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
                    basis: "base",
                  },
                  operator: "gte",
                  right: 2,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "WOTtcgwVc9-a2",
          kind: "triggered",
          text: "As you gain this boon, draw a card.",
          trigger: {
            kind: "event",
            event: {
              name: "boon-gained",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "WOTtcgwVc9-a3",
          kind: "static",
          staticKind: "effects",
          text: 'Regalia you control have "REST: Prevent the next 1 damage that would be dealt to target unit this turn."',
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "supertype",
                    oneOf: ["REGALIA"],
                  },
                },
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-ability",
                ability: {
                  id: "granted-9yeqnp-a1",
                  kind: "activated",
                  text: "REST: Prevent the next 1 damage that would be dealt to target unit this turn.",
                  activation: "ability",
                  cost: {
                    kind: "rest",
                    subject: {
                      kind: "source",
                    },
                  },
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
                          oneOf: ["ALLY", "CHAMPION"],
                        },
                      },
                    },
                  ],
                  effect: {
                    kind: "replacement",
                    event: {
                      name: "damage-dealt",
                      recipient: {
                        kind: "bound-object",
                        binding: "target-1",
                      },
                    },
                    operation: {
                      kind: "prevent",
                    },
                    capacity: {
                      amount: 1,
                      scope: "replacement-instance",
                    },
                    duration: {
                      kind: "this-turn",
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default greaterBoonOfParvati;
