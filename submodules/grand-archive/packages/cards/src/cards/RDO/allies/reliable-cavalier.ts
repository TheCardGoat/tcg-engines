import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const reliableCavalier: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "bXxU1ZzMpR",
  slug: "reliable-cavalier",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "bXxU1ZzMpR:face:default",
      catalogId: "bXxU1ZzMpR",
      name: "Reliable Cavalier",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "HUMAN"],
      },
      elements: ["NORM"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Equestrian — As long as you control a Horse ally, Reliable Cavalier gets +3POWER.",
      abilities: [
        {
          id: "bXxU1ZzMpR-a1",
          kind: "static",
          staticKind: "effects",
          text: "Equestrian — As long as you control a Horse ally, Reliable Cavalier gets +3POWER.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
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
                        oneOf: ["HORSE"],
                      },
                    ],
                  },
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
                amount: 3,
              },
            },
          ],
          label: {
            name: "Equestrian",
          },
        },
      ],
    },
  },
};

export default reliableCavalier;
