import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const turbulentBullet: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "f8urrqtjot",
  slug: "turbulent-bullet",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "f8urrqtjot:face:default",
      catalogId: "f8urrqtjot",
      name: "Turbulent Bullet",
      cost: {
        kind: "memory",
        amount: 0,
      },
      typeLine: {
        supertypes: ["REGALIA"],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["WIND"],
      stats: {
        power: 1,
      },
      rulesText:
        "Renewable\n\nREST: Load Turbulent Bullet into target unloaded Gun weapon you control.\n\n[Class Bonus] On Hit: Up to two target allies you control get +1 POWER until end of turn.",
      abilities: [
        {
          id: "f8urrqtjot-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "f8urrqtjot-a2",
          kind: "activated",
          text: "REST: Load Turbulent Bullet into target unloaded Gun weapon you control.",
          activation: "ability",
          cost: {
            kind: "rest",
            subject: {
              kind: "source",
            },
          },
          targets: [
            {
              id: "target-weapon",
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
                  kind: "all",
                  filters: [
                    {
                      kind: "type",
                      oneOf: ["WEAPON"],
                    },
                    {
                      kind: "not",
                      filter: {
                        kind: "object-state",
                        state: "loaded",
                      },
                    },
                    {
                      kind: "subtype",
                      oneOf: ["GUN"],
                    },
                  ],
                },
              },
            },
          ],
          effect: {
            kind: "move",
            subject: {
              kind: "source",
            },
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
        {
          id: "f8urrqtjot-a3",
          kind: "triggered",
          text: "[Class Bonus] On Hit: Up to two target allies you control get +1 POWER until end of turn.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
            },
          },
          targets: [
            {
              id: "target-1",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "up-to",
                amount: 2,
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
              amount: 1,
            },
          },
        },
      ],
    },
  },
};

export default turbulentBullet;
