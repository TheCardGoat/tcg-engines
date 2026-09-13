import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const andronikaEternalHerald: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vw2ifz1nr5",
  slug: "andronika-eternal-herald",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vw2ifz1nr5:face:default",
      catalogId: "vw2ifz1nr5",
      name: "Andronika, Eternal Herald",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "AUTOMATON"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
        life: 1,
      },
      rulesText:
        "Imbue 3\n\nAs long as Andronika is imbued, Andronika gets +1 POWER and +1 LIFE, and has vigor.\n\n[Class Bonus] On Enter: Put a buff counter on up to two Automaton allies you control.",
      abilities: [
        {
          id: "vw2ifz1nr5-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Imbue 3",
          keyword: {
            name: "imbue",
            value: 3,
            elementRequirement: "source-elements",
          },
        },
        {
          id: "vw2ifz1nr5-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as Andronika is imbued, Andronika gets +1 POWER and +1 LIFE, and has vigor.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
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
                property: "life",
                operation: "add",
                amount: 1,
              },
            },
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "activation-state",
                state: "imbued",
              },
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
                  name: "vigor",
                },
              },
            },
          ],
        },
        {
          id: "vw2ifz1nr5-a3",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Put a buff counter on up to two Automaton allies you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
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
            kind: "choose",
            selection: {
              id: "counter-recipients",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
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
            effect: {
              kind: "add-counter",
              subject: {
                kind: "bound",
                binding: "counter-recipients",
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

export default andronikaEternalHerald;
