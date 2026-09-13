import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const trainedBirdroid: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "84lj40Kyhv",
  slug: "trained-birdroid",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "84lj40Kyhv:face:default",
      catalogId: "84lj40Kyhv",
      name: "Trained Birdroid",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISCORP", "AUTOMATON", "BIRD"],
      },
      elements: ["NORM"],
      stats: {
        power: 2,
        life: 2,
      },
      rulesText:
        "Automaton allies you control have true sight. (They can attack units with stealth.)\n\n[Class Bonus] Whenever you activate an ability of a Powercell item that targets another ally you control, Trained Birdroid gets +1POWER until end of turn.",
      abilities: [
        {
          id: "84lj40Kyhv-a1",
          kind: "static",
          staticKind: "effects",
          text: "Automaton allies you control have true sight. (They can attack units with stealth.)",
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
                        kind: "subtype",
                        oneOf: ["AUTOMATON"],
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "grant-keyword",
                keyword: {
                  name: "true-sight",
                },
              },
            },
          ],
        },
        {
          id: "84lj40Kyhv-a2",
          kind: "triggered",
          text: "[Class Bonus] Whenever you activate an ability of a Powercell item that targets another ally you control, Trained Birdroid gets +1POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "card-activated",
              actor: "controller",
              subject: {
                kind: "event-object",
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ITEM"],
                    },
                    {
                      kind: "not-source",
                    },
                    {
                      kind: "subtype",
                      oneOf: ["POWERCELL"],
                    },
                  ],
                },
              },
            },
          },
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
            kind: "continuous",
            subjects: {
              kind: "source",
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default trainedBirdroid;
