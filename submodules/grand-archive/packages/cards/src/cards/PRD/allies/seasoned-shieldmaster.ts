import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const seasonedShieldmaster: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "qsm4o98vn1",
  slug: "seasoned-shieldmaster",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "qsm4o98vn1:face:default",
      catalogId: "qsm4o98vn1",
      name: "Seasoned Shieldmaster",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Whenever an ally you control becomes fostered, draw a card into your memory.\n\n[Class Bonus] Fostered allies you control get +1 POWER and +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "qsm4o98vn1-a1",
          kind: "triggered",
          text: "Whenever an ally you control becomes fostered, draw a card into your memory.",
          trigger: {
            kind: "event",
            event: {
              name: "object-state-changed",
              subject: {
                kind: "event-object",
                controller: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
              state: "fostered",
              to: true,
            },
          },
          effect: {
            kind: "draw",
            player: "controller",
            amount: 1,
            to: "memory",
          },
        },
        {
          id: "qsm4o98vn1-a2",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] Fostered allies you control get +1 POWER and +1 LIFE. (Apply this effect only if your champion's class matches this card's class.)",
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
                        kind: "object-state",
                        state: "fostered",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FOSTERED"],
                      },
                    ],
                  },
                },
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
                property: "power",
                operation: "add",
                amount: 1,
              },
            },
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
                        kind: "object-state",
                        state: "fostered",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["FOSTERED"],
                      },
                    ],
                  },
                },
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
      ],
    },
  },
};

export default seasonedShieldmaster;
