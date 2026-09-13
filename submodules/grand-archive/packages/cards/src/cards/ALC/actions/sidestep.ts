import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const sidestep: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "voy5ttkk39",
  slug: "sidestep",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "voy5ttkk39:face:default",
      catalogId: "voy5ttkk39",
      name: "Sidestep",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL", "REACTION"],
      },
      elements: ["NORM"],
      speed: "fast",
      stats: {},
      rulesText:
        "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)\n\nTarget ally gains stealth until end of turn. (This unit can't be targeted by attacks unless permitted by true sight.)",
      abilities: [
        {
          id: "voy5ttkk39-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] This card costs 1 less to activate. (Apply this effect only if your champion is level 2 or higher.)",
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
              amount: 1,
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
        {
          id: "voy5ttkk39-a2",
          kind: "card-resolution",
          text: "Target ally gains stealth until end of turn. (This unit can't be targeted by attacks unless permitted by true sight.)",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
          effect: {
            kind: "continuous",
            subjects: {
              kind: "bound",
              binding: "target-1",
            },
            affectedSet: "locked",
            duration: {
              kind: "this-turn",
            },
            layer: {
              layer: "D",
              modifies: "ability",
            },
            change: {
              kind: "grant-keyword",
              keyword: {
                name: "stealth",
              },
            },
          },
        },
      ],
    },
  },
};

export default sidestep;
