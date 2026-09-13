import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const lotorTrinket: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "o6tBGQeC33",
  slug: "lotor-trinket",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "o6tBGQeC33:face:default",
      catalogId: "o6tBGQeC33",
      name: "Lotor Trinket",
      cost: {
        kind: "memory",
        amount: 1,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "RACCOON", "BAUBLE"],
      },
      elements: ["NORM"],
      stats: {},
      rulesText:
        "[Class Bonus] As long as an opponent has no cards in their graveyard, Raccoon allies you control get +1POWER.\n\nOn Enter: Scavenge 6 for a Raccoon ally card.\n\n",
      abilities: [
        {
          id: "o6tBGQeC33-a1",
          kind: "static",
          staticKind: "effects",
          text: "[Class Bonus] As long as an opponent has no cards in their graveyard, Raccoon allies you control get +1POWER.",
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
                        kind: "subtype",
                        oneOf: ["RACCOON"],
                      },
                    ],
                  },
                },
              },
              affectedSet: "dynamic",
              condition: {
                kind: "player-zone-count",
                players: "each-opponent",
                quantifier: "any",
                zone: "graveyard",
                operator: "eq",
                value: 0,
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
                amount: 1,
              },
            },
          ],
        },
        {
          id: "o6tBGQeC33-a2",
          kind: "triggered",
          text: "On Enter: Scavenge 6 for a Raccoon ally card.",
          trigger: {
            kind: "event",
            event: {
              name: "object-entered-field",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "keyword-action",
            action: "scavenge",
            amount: 6,
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
                {
                  kind: "subtype",
                  oneOf: ["RACCOON"],
                },
              ],
            },
          },
        },
      ],
    },
  },
};

export default lotorTrinket;
