import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lawsurTheCarpenter: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "aenquoed10",
  slug: "lawsur-the-carpenter",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "aenquoed10:face:default",
      catalogId: "aenquoed10",
      name: "Lawsur, the Carpenter",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["CLERIC", "WARRIOR"],
        subtypes: ["CLERIC", "WARRIOR", "SPECTER"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "On Enter: Lawsur gets +XPOWER until end of turn, where X is the amount of other Specter allies you control.\n\nSpecter allies you control have stealth as long as they're awake.",
      abilities: [
        {
          id: "aenquoed10-a1",
          kind: "triggered",
          text: "On Enter: Lawsur gets +XPOWER until end of turn, where X is the amount of other Specter allies you control.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "count",
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
                        kind: "subtype",
                        oneOf: ["SPECTER"],
                      },
                    ],
                  },
                },
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
              amount: {
                kind: "variable",
                symbol: "X",
              },
            },
          },
        },
        {
          id: "aenquoed10-a2",
          kind: "static",
          staticKind: "effects",
          text: "Specter allies you control have stealth as long as they're awake.",
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
                        state: "awake",
                      },
                      {
                        kind: "subtype",
                        oneOf: ["SPECTER"],
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
                  name: "stealth",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lawsurTheCarpenter;
