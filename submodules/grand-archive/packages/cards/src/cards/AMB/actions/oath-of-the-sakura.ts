import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const oathOfTheSakura: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "vlno9ankzi",
  slug: "oath-of-the-sakura",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "vlno9ankzi:face:default",
      catalogId: "vlno9ankzi",
      name: "Oath of the Sakura",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText:
        "Put a buff counter on each ally you control.\n\nIf you control exactly three allies that are all unique, they each get +2 POWER until end of turn.",
      abilities: [
        {
          id: "vlno9ankzi-a1",
          kind: "card-resolution",
          text: "Put a buff counter on each ally you control.",
          effect: {
            kind: "add-counter",
            subject: {
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
            counter: "buff",
            amount: 1,
          },
        },
        {
          id: "vlno9ankzi-a2",
          kind: "card-resolution",
          text: "If you control exactly three allies that are all unique, they each get +2 POWER until end of turn.",
          effect: {
            kind: "conditional",
            condition: {
              kind: "player-zone-count",
              players: "controller",
              quantifier: "all",
              zone: "field",
              filter: {
                kind: "all",
                filters: [
                  {
                    kind: "type",
                    oneOf: ["ALLY"],
                  },
                  {
                    kind: "supertype",
                    oneOf: ["UNIQUE"],
                  },
                ],
              },
              operator: "eq",
              value: 3,
            },
            then: {
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
                        kind: "supertype",
                        oneOf: ["UNIQUE"],
                      },
                    ],
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
                amount: 2,
              },
            },
          },
        },
      ],
    },
  },
};

export default oathOfTheSakura;
