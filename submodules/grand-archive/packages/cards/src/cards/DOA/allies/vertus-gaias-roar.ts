import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vertusGaiasRoar: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "dZ960Hnkzv",
  slug: "vertus-gaias-roar",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "dZ960Hnkzv:face:default",
      catalogId: "dZ960Hnkzv",
      name: "Vertus, Gaia's Roar",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "BEAST", "LION"],
      },
      elements: ["TERA"],
      stats: {
        power: 8,
        life: 6,
      },
      rulesText:
        "Pride 10 (This ally won't obey you unless your champion is level 10 or higher.)\n\n[Class Bonus] On Enter: Allies you control get +1 POWER for each Animal and/or Beast ally card in your graveyard until end of turn.",
      abilities: [
        {
          id: "dZ960Hnkzv-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Pride 10 (This ally won't obey you unless your champion is level 10 or higher.)",
          keyword: {
            name: "pride",
            value: 10,
          },
        },
        {
          id: "dZ960Hnkzv-a2",
          kind: "triggered",
          text: "[Class Bonus] On Enter: Allies you control get +1 POWER for each Animal and/or Beast ally card in your graveyard until end of turn.",
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
            kind: "continuous",
            subjects: {
              kind: "each",
              collection: {
                zones: ["field"],
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
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
                kind: "count",
                collection: {
                  zones: ["graveyard"],
                  player: "controller",
                  filter: {
                    kind: "all",
                    filters: [
                      {
                        kind: "type",
                        oneOf: ["ALLY"],
                      },
                      {
                        kind: "any",
                        filters: [
                          {
                            kind: "subtype",
                            oneOf: ["ANIMAL"],
                          },
                          {
                            kind: "subtype",
                            oneOf: ["BEAST"],
                          },
                        ],
                      },
                    ],
                  },
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default vertusGaiasRoar;
