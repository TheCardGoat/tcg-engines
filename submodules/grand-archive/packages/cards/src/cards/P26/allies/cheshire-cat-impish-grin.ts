import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const cheshireCatImpishGrin: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "cUltOcPo26",
  slug: "cheshire-cat-impish-grin",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "cUltOcPo26:face:default",
      catalogId: "cUltOcPo26",
      name: "Cheshire Cat, Impish Grin",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "DISTORTION", "ANIMAL", "HUMAN", "CAT"],
      },
      elements: ["EXALTED", "NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Spellshroud, Stealth\n\nCheshire Cat has all activated abilities of Distortion regalia you control. \n\nCheshire Cat gets +XPOWER where X is the total base power among Distortion weapons you control.",
      abilities: [
        {
          id: "cUltOcPo26-a1",
          kind: "keyword-group",
          text: "Spellshroud, Stealth",
          keywords: [
            {
              name: "spellshroud",
            },
            {
              name: "stealth",
            },
          ],
        },
        {
          id: "cUltOcPo26-a2",
          kind: "static",
          staticKind: "effects",
          text: "Cheshire Cat has all activated abilities of Distortion regalia you control.",
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
                layer: "D",
                modifies: "ability",
              },
              change: {
                kind: "copy-abilities",
                from: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "all",
                      filters: [
                        {
                          kind: "supertype",
                          oneOf: ["REGALIA"],
                        },
                        {
                          kind: "subtype",
                          oneOf: ["DISTORTION"],
                        },
                      ],
                    },
                  },
                },
                abilityKinds: ["activated"],
              },
            },
          ],
        },
        {
          id: "cUltOcPo26-a3",
          kind: "static",
          staticKind: "effects",
          text: "Cheshire Cat gets +XPOWER where X is the total base power among Distortion weapons you control.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "sum",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["WEAPON"],
                      },
                      {
                        kind: "subtype",
                        oneOf: ["DISTORTION"],
                      },
                    ],
                  },
                },
                property: "power",
                basis: "base",
                emptyValue: 0,
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
                property: "power",
                operation: "add",
                amount: {
                  kind: "variable",
                  symbol: "X",
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default cheshireCatImpishGrin;
