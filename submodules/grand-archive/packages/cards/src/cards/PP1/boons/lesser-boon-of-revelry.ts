import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lesserBoonOfRevelry: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "AOFRjoIHVe",
  slug: "lesser-boon-of-revelry",
  definitionKind: "card",
  formatRestriction: {
    kind: "pantheon-only",
    source: "printed-border-tag",
  },
  layout: {
    kind: "single-faced",
    face: {
      id: "AOFRjoIHVe:face:default",
      catalogId: "AOFRjoIHVe",
      name: "Lesser Boon of Revelry",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["LESSER BOON"],
        classes: ["GUARDIAN", "TAMER"],
        subtypes: ["GUARDIAN", "TAMER", "SPELL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Level Locked 1\n\nAs you gain this boon, choose an ally and put a buff counter on it.\n\n(3): Target player that controls exactly one ally puts a buff counter on an ally they control without a buff counter on it.",
      abilities: [
        {
          id: "AOFRjoIHVe-a1",
          kind: "static",
          staticKind: "effects",
          text: "Level Locked 1",
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
                  right: 1,
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "AOFRjoIHVe-a2",
          kind: "triggered",
          text: "As you gain this boon, choose an ally and put a buff counter on it.",
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
            kind: "choose",
            selection: {
              id: "target-1",
              kind: "choice",
              declared: "resolution",
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
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "target-1",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
        {
          id: "AOFRjoIHVe-a3",
          kind: "activated",
          text: "(3): Target player that controls exactly one ally puts a buff counter on an ally they control without a buff counter on it.",
          activation: "ability",
          cost: {
            kind: "pay-reserve",
            amount: 3,
          },
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
                zoneCount: {
                  zone: "field",
                  filter: {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  operator: "eq",
                  value: 1,
                },
              },
            },
          ],
          effect: {
            kind: "choose",
            selection: {
              id: "ally-without-buff",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: {
                  binding: "target-player",
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "has-counter",
                        counter: "buff",
                      },
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "ally-without-buff",
              },
              counter: "buff",
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default lesserBoonOfRevelry;
