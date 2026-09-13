import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lamentationsToll: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1t3dvor61i",
  slug: "lamentations-toll",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1t3dvor61i:face:default",
      catalogId: "1t3dvor61i",
      name: "Lamentation's Toll",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SWORD"],
      },
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "[Level 2+] Lamentation's Toll gets +X power, where X is the highest power stat among your omens. (An omen is a card in a banishment with an omen counter on it.)",
      abilities: [
        {
          id: "1t3dvor61i-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Level 2+] Lamentation's Toll gets +X power, where X is the highest power stat among your omens. (An omen is a card in a banishment with an omen counter on it.)",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "aggregate-property",
                operation: "maximum",
                collection: {
                  zones: ["banishment"],
                  player: "controller",
                  filter: {
                    kind: "has-counter",
                    counter: "omen",
                  },
                },
                property: "power",
                basis: "base",
                emptyValue: 0,
              },
            },
          ],
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
                  kind: "aggregate-property",
                  operation: "maximum",
                  collection: {
                    zones: ["banishment"],
                    player: "controller",
                    filter: {
                      kind: "has-counter",
                      counter: "omen",
                    },
                  },
                  property: "power",
                  basis: "base",
                  emptyValue: 0,
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default lamentationsToll;
