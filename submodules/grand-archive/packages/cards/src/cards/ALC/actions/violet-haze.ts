import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const violetHaze: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vdxi74wa4x",
  slug: "violet-haze",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vdxi74wa4x:face:default",
      catalogId: "vdxi74wa4x",
      name: "Violet Haze",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "CURSE", "SPELL"],
      },
      elements: ["UMBRA"],
      speed: "fast",
      stats: {},
      rulesText:
        "All units you control become distant, then put Violet Haze on the bottom of target champion's lineage.\n\nInherited Effect: This object gets -2 LIFE.",
      abilities: [
        {
          id: "vdxi74wa4x-a1",
          kind: "card-resolution",
          text: "All units you control become distant, then put Violet Haze on the bottom of target champion's lineage.",
          targets: [
            {
              id: "target-champion",
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
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "set-object-state",
                subject: {
                  kind: "each",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY", "CHAMPION"],
                    },
                  },
                },
                state: "distant",
                value: true,
              },
              {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "inner-lineage",
                  host: {
                    kind: "bound",
                    binding: "target-champion",
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
          id: "vdxi74wa4x-a2",
          kind: "static",
          staticKind: "effects",
          text: "Inherited Effect: This object gets -2 LIFE.",
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

export default violetHaze;
