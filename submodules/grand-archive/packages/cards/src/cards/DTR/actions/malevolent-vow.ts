import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const malevolentVow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "up6fw61vf1",
  slug: "malevolent-vow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "up6fw61vf1:face:default",
      catalogId: "up6fw61vf1",
      name: "Malevolent Vow",
      cost: {
        kind: "reserve",
        amount: 0,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      stats: {},
      rulesText:
        "Discard up to three cards. Recover 3+X, where X is three times amount of cards discarded this way. Put Malevolent Vow on the bottom of your champion's lineage.\n\nInherited Effect — This object gets -2LIFE. (Champions have this ability as long as this card is part of its lineage.) ",
      abilities: [
        {
          id: "up6fw61vf1-a1",
          kind: "card-resolution",
          text: "Discard up to three cards. Recover 3+X, where X is three times amount of cards discarded this way. Put Malevolent Vow on the bottom of your champion's lineage.",
          variables: [
            {
              symbol: "X",
              kind: "derived",
              amount: {
                kind: "calculate",
                operator: "multiply",
                operands: [
                  3,
                  {
                    kind: "modified-ability-result-amount",
                    metric: "cards-moved",
                  },
                ],
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "discard",
                player: "controller",
                selection: {
                  id: "discarded-cards",
                  kind: "choice",
                  declared: "resolution",
                  chooser: "controller",
                  count: {
                    kind: "up-to",
                    amount: 3,
                  },
                  candidates: {
                    kind: "card",
                    zones: ["hand"],
                    relationship: "zone-of",
                    player: "controller",
                  },
                },
                bindResultAs: "discarded-cards-result",
              },
              {
                kind: "recover",
                player: "controller",
                amount: {
                  kind: "calculate",
                  operator: "add",
                  operands: [
                    3,
                    {
                      kind: "calculate",
                      operator: "multiply",
                      operands: [
                        3,
                        {
                          kind: "modified-ability-result-amount",
                          metric: "cards-moved",
                        },
                      ],
                    },
                  ],
                },
              },
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "champion",
                    player: "controller",
                  },
                  placement: {
                    kind: "bottom",
                  },
                },
              },
            ],
          },
        },
        {
          id: "up6fw61vf1-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect — This object gets -2LIFE. (Champions have this ability as long as this card is part of its lineage.)",
          label: {
            name: "Inherited Effect",
          },
          functionalZones: ["inner-lineage"],
          executionSource: "lineage-host",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "ability-bearer",
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
                operation: "subtract",
                amount: 2,
              },
            },
          ],
        },
      ],
    },
  },
};

export default malevolentVow;
