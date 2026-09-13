import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fellowshipsGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "payjps7DkB",
  slug: "fellowships-gale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "payjps7DkB:face:default",
      catalogId: "payjps7DkB",
      name: "Fellowship's Gale",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["WIND"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Load Fellowship's Gale into an Aetherwing weapon you control.\n\nFellowship's Gale gets +1 POWER for each ally you control.",
      abilities: [
        {
          id: "payjps7DkB-a1",
          kind: "card-resolution",
          text: "Load Fellowship's Gale into an Aetherwing weapon you control.",
          effect: {
            kind: "choose",
            selection: {
              id: "chosen-weapon",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
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
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["AETHERWING"],
                    },
                  ],
                },
              },
            },
            effect: {
              kind: "move",
              subject: {
                kind: "source",
              },
              destination: {
                zone: "loaded",
                host: {
                  kind: "bound",
                  binding: "chosen-weapon",
                },
              },
            },
          },
        },
        {
          id: "payjps7DkB-a2",
          kind: "static",
          staticKind: "effects",
          text: "Fellowship's Gale gets +1 POWER for each ally you control.",
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
                  kind: "count",
                  collection: {
                    zones: ["field"],
                    player: "controller",
                    filter: {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                  },
                },
              },
            },
          ],
        },
      ],
    },
  },
};

export default fellowshipsGale;
