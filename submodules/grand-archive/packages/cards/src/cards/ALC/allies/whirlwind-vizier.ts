import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const whirlwindVizier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "5swaf8urrq",
  slug: "whirlwind-vizier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "5swaf8urrq:face:default",
      catalogId: "5swaf8urrq",
      name: "Whirlwind Vizier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "[Class Bonus] Whirlwind Vizier gets +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)\n\n(3), REST, Sacrifice Whirlwind Vizier: Destroy target non-Fractal phantasia.",
      abilities: [
        {
          id: "5swaf8urrq-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Whirlwind Vizier gets +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
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
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              duration: {
                kind: "while-source-in-functional-zone",
              },
              layer: {
                layer: "E",
                modifies: "stat",
                sublayer: "modifier",
              },
              change: {
                kind: "numeric",
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "5swaf8urrq-a2",
          kind: "activated",
          text: "(3), REST, Sacrifice Whirlwind Vizier: Destroy target non-Fractal phantasia.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 3,
              },
              {
                kind: "rest",
                subject: {
                  kind: "source",
                },
              },
              {
                kind: "sacrifice",
                subject: {
                  kind: "source",
                },
              },
            ],
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["PHANTASIA"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "subtype",
                        oneOf: ["FRACTAL"],
                      },
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
      ],
    },
  },
};

export default whirlwindVizier;
