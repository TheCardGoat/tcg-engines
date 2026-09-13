import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const windsOfRetribution: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "huqj5bbae3",
  slug: "winds-of-retribution",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "huqj5bbae3:face:default",
      catalogId: "huqj5bbae3",
      name: "Winds of Retribution",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "[Class Bonus] [Level 2+] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)\n\nAllies you control get +2 POWER until end of turn. ",
      abilities: [
        {
          id: "huqj5bbae3-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] [Level 2+] This card costs 2 less to activate. (Apply this effect only if your champion's class matches this card's class and only if your champion is level 2 or higher.)",
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
          id: "huqj5bbae3-a2",
          kind: "card-resolution",
          text: "Allies you control get +2 POWER until end of turn.",
          effect: {
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "E",
              modifies: "stat",
              sublayer: "modifier",
            },
            change: {
              kind: "numeric",
              property: "power",
              operation: "add",
              amount: 2,
            },
          },
        },
      ],
    },
  },
};

export default windsOfRetribution;
