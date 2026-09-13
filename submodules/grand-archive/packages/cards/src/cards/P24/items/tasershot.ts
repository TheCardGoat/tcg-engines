import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const tasershot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "4x7e22tk3i",
  slug: "tasershot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "4x7e22tk3i:face:default",
      catalogId: "4x7e22tk3i",
      name: "Tasershot",
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
      elements: ["NORM"],
      stats: {
        power: 1,
      },
      rulesText:
        "Renewable\n\nREST: Load Tasershot into target unloaded Gun weapon you control.\n\n[Class Bonus] On Champion Hit: Until the beginning of your next turn, whenever the hit champion levels up, deal 4 unpreventable damage to them.",
      abilities: [
        {
          id: "4x7e22tk3i-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Renewable",
          keyword: {
            name: "renewable",
          },
        },
        {
          id: "4x7e22tk3i-a2",
          kind: "activated",
          text: "REST: Load Tasershot into target unloaded Gun weapon you control.",
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
          id: "4x7e22tk3i-a3",
          kind: "triggered",
          text: "[Class Bonus] On Champion Hit: Until the beginning of your next turn, whenever the hit champion levels up, deal 4 unpreventable damage to them.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-hit",
              subject: {
                kind: "source",
              },
              recipient: {
                kind: "event-object",
                bindAs: "trigger-recipient",
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
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
            kind: "create-delayed-trigger",
            trigger: {
              kind: "event",
              event: {
                name: "champion-leveled-up",
                subject: {
                  kind: "bound-object",
                  binding: "trigger-recipient",
                },
              },
            },
            effect: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "trigger-recipient",
              },
              amount: 4,
              preventable: false,
            },
            expires: {
              kind: "until-start-of-turn",
              whose: "controller",
            },
          },
        },
      ],
    },
  },
};

export default tasershot;
