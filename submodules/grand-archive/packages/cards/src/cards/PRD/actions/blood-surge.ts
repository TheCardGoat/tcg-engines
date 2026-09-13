import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const bloodSurge: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yHIeIwxWde",
  slug: "blood-surge",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yHIeIwxWde:face:default",
      catalogId: "yHIeIwxWde",
      name: "Blood Surge",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["MAGE"],
        subtypes: ["MAGE", "AENEAN", "SPELL"],
      },
      elements: ["EXIA"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] Draw a card.\n\n[Level 5+] [Damage 10+] Draw a card.\n\n[Level 9+] [Damage 20+] Draw a card.\n\nUntil end of turn, you can't draw cards.",
      abilities: [
        {
          id: "yHIeIwxWde-a1",
          kind: "card-resolution",
          text: "[Class Bonus] Draw a card.",
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
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "yHIeIwxWde-a2",
          kind: "card-resolution",
          text: "[Level 5+] [Damage 10+] Draw a card.",
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
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 10,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "yHIeIwxWde-a3",
          kind: "card-resolution",
          text: "[Level 9+] [Damage 20+] Draw a card.",
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
                  right: 9,
                },
              },
            },
            {
              kind: "static",
              name: "damage-restriction",
              condition: {
                kind: "has-counter",
                subject: {
                  kind: "champion",
                  player: "controller",
                },
                counter: "damage",
                comparison: {
                  left: {
                    kind: "counter-count",
                    subject: {
                      kind: "champion",
                      player: "controller",
                    },
                    counter: "damage",
                  },
                  operator: "gte",
                  right: 20,
                },
              },
            },
          ],
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
          },
        },
        {
          id: "yHIeIwxWde-a4",
          kind: "card-resolution",
          text: "Until end of turn, you can't draw cards.",
          effect: {
            kind: "rule-modification",
            mode: "forbid",
            action: "draw",
            subject: {
              kind: "player",
              player: "controller",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default bloodSurge;
