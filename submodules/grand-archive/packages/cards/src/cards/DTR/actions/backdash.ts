import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const backdash: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mf0jmealoy",
  slug: "backdash",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mf0jmealoy:face:default",
      catalogId: "mf0jmealoy",
      name: "Backdash",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "Target unit becomes distant.\n\n[Class Bonus] [Level 2+] Draw a card. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
      abilities: [
        {
          id: "mf0jmealoy-a1",
          kind: "card-resolution",
          text: "Target unit becomes distant.",
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
            kind: "set-object-state",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            state: "distant",
            value: true,
          },
        },
        {
          id: "mf0jmealoy-a2",
          kind: "card-resolution",
          text: "[Class Bonus] [Level 2+] Draw a card. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
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
                  right: 2,
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
      ],
    },
  },
};

export default backdash;
