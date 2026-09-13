import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const haloclineScout: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "jntoa4h8re",
  slug: "halocline-scout",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "jntoa4h8re:face:default",
      catalogId: "jntoa4h8re",
      name: "Halocline Scout",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN", "WARRIOR"],
        subtypes: ["ASSASSIN", "WARRIOR", "HUMAN"],
      },
      elements: ["WATER"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "[Class Bonus] On Enter: Rest target unit. (Apply this effect only if your champion's class matches this card's class)\n\n[Class Bonus] Other allies you control get +1 POWER as long as they're attacking rested units.",
      abilities: [
        {
          id: "jntoa4h8re-a1",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Rest target unit. (Apply this effect only if your champion's class matches this card's class)",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
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
            kind: "rest",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
          },
        },
        {
          id: "jntoa4h8re-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Other allies you control get +1 POWER as long as they're attacking rested units.",
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
                kind: "each",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "not-source",
                      },
                      {
                        kind: "object-state",
                        state: "attacking",
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "current-attack-target-matches",
                filter: {
                  kind: "object-state",
                  state: "rested",
                },
              },
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
      ],
    },
  },
};

export default haloclineScout;
