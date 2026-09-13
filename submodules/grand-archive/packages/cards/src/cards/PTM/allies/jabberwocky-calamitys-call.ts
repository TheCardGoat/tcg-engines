import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const jabberwockyCalamitysCall: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "yicNKtzC3H",
  slug: "jabberwocky-calamitys-call",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "yicNKtzC3H:face:default",
      catalogId: "yicNKtzC3H",
      name: "Jabberwocky, Calamity's Call",
      cost: {
        kind: "reserve",
        amount: 8,
      },
      typeLine: {
        supertypes: ["UNIQUE"],
        types: ["ALLY"],
        classes: ["ANOMALY"],
        subtypes: ["ANOMALY", "SPECTER", "BEAST", "DRAGON"],
      },
      elements: ["UMBRA"],
      stats: {
        power: 4,
        life: 3,
      },
      rulesText:
        "(2), Banish a Specter ally card from your graveyard: Recover 2 and Jabberwocky gets +2 POWER until end of turn.\n\nAs long as a player doesn't control an object named Vorpal Sword, prevent all damage that would be dealt to Jabberwocky.\n",
      abilities: [
        {
          id: "yicNKtzC3H-a1",
          kind: "activated",
          text: "(2), Banish a Specter ally card from your graveyard: Recover 2 and Jabberwocky gets +2 POWER until end of turn.",
          activation: "ability",
          cost: {
            kind: "all",
            costs: [
              {
                kind: "pay-reserve",
                amount: 2,
              },
              {
                kind: "select-and-move",
                player: "controller",
                from: "graveyard",
                to: "banishment",
                count: {
                  kind: "exactly",
                  amount: 1,
                },
                filter: {
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["ALLY"],
                    },
                    {
                      kind: "subtype",
                      oneOf: ["SPECTER"],
                    },
                  ],
                },
              },
            ],
          },
          effect: {
            kind: "sequence",
            effects: [
              {
                kind: "recover",
                player: "controller",
                amount: 2,
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "source",
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
            ],
          },
        },
        {
          id: "yicNKtzC3H-a2",
          kind: "static",
          staticKind: "effects",
          text: "As long as a player doesn't control an object named Vorpal Sword, prevent all damage that would be dealt to Jabberwocky.",
          effects: [
            {
              kind: "replacement",
              event: {
                name: "damage-dealt",
                recipient: {
                  kind: "source",
                },
              },
              condition: {
                kind: "player-zone-count",
                players: "each-player",
                quantifier: "any",
                zone: "field",
                filter: {
                  kind: "name",
                  value: "Vorpal Sword",
                },
                operator: "eq",
                value: 0,
              },
              operation: {
                kind: "prevent",
                amount: {
                  kind: "all",
                },
              },
              duration: {
                kind: "while-source-in-functional-zone",
              },
            },
          ],
        },
      ],
    },
  },
};

export default jabberwockyCalamitysCall;
