import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const shadedDoppelganger: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "Jr4Ivpcnst",
  slug: "shaded-doppelganger",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "Jr4Ivpcnst:face:default",
      catalogId: "Jr4Ivpcnst",
      name: "Shaded Doppelganger",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "HUMAN"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Stealth\n\nShaded Doppelganger gets +XPOWER, where X is the highest base power stat among other allies you control.",
      abilities: [
        {
          id: "Jr4Ivpcnst-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Stealth",
          keyword: {
            name: "stealth",
          },
        },
        {
          id: "Jr4Ivpcnst-a2",
          kind: "static",
          staticKind: "effects",
          text: "Shaded Doppelganger gets +XPOWER, where X is the highest base power stat among other allies you control.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
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

export default shadedDoppelganger;
