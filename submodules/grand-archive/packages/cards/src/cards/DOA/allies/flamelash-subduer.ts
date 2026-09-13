import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const flamelashSubduer: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1i6ierdDjq",
  slug: "flamelash-subduer",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1i6ierdDjq:face:default",
      catalogId: "1i6ierdDjq",
      name: "Flamelash Subduer",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ALLY"],
        classes: ["TAMER"],
        subtypes: ["TAMER", "HUMAN"],
      },
      elements: ["FIRE"],
      stats: {
        power: 1,
        life: 3,
      },
      rulesText:
        "Your champion gets +1 level as long as you control an Animal or Beast ally.\n\n[Class Bonus] REST: Deal 2 damage to target ally you control. That ally gets +2 POWER until end of turn. (Activate this ability only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "1i6ierdDjq-a1",
          kind: "static",
          staticKind: "effects",
          text: "Your champion gets +1 level as long as you control an Animal or Beast ally.",
          effects: [
            {
              kind: "continuous",
              subjects: {
                kind: "champion",
                player: "controller",
              },
              affectedSet: "dynamic",
              condition: {
                kind: "collection-exists",
                collection: {
                  zones: ["field"],
                  player: "controller",
                  filter: {
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
                property: "level",
                operation: "add",
                amount: 1,
              },
            },
          ],
        },
        {
          id: "1i6ierdDjq-a2",
          kind: "activated",
          text: "[Class Bonus] REST: Deal 2 damage to target ally you control. That ally gets +2 POWER until end of turn. (Activate this ability only if your champion's class matches this card's class.)",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-1",
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
                relationship: "controlled-by",
                player: "controller",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
          ],
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
            kind: "sequence",
            effects: [
              {
                kind: "deal-damage",
                source: {
                  kind: "source",
                },
                recipient: {
                  kind: "bound",
                  binding: "target-1",
                },
                amount: 2,
              },
              {
                kind: "continuous",
                subjects: {
                  kind: "bound",
                  binding: "target-1",
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
      ],
    },
  },
};

export default flamelashSubduer;
