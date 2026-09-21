import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const moltenArrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "mvfcd0ukk6",
  slug: "molten-arrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "mvfcd0ukk6:face:default",
      catalogId: "mvfcd0ukk6",
      name: "Molten Arrow",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "ARROW"],
      },
      elements: ["FIRE"],
      stats: {
        power: 3,
      },
      rulesText:
        "REST: Load Molten Arrow into target unloaded Bow weapon you control. \n\nBanish three other fire element cards from your graveyard: Load the card from your graveyard into target unloaded Bow weapon you control.",
      abilities: [
        {
          id: "mvfcd0ukk6-a1",
          kind: "activated",
          text: "REST: Load Molten Arrow into target unloaded Bow weapon you control.",
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
                      oneOf: ["BOW"],
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
          id: "mvfcd0ukk6-a2",
          kind: "activated",
          text: "Banish three other fire element cards from your graveyard: Load the card from your graveyard into target unloaded Bow weapon you control.",
          activation: "ability",
          functionalZones: ["graveyard"],
          cost: {
            kind: "select-and-move",
            player: "controller",
            from: "graveyard",
            to: "banishment",
            count: {
              kind: "exactly",
              amount: 3,
            },
            filter: {
              kind: "all",
              filters: [
                {
                  kind: "element",
                  oneOf: ["FIRE"],
                },
                {
                  kind: "not-source",
                },
              ],
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
                      oneOf: ["BOW"],
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
            from: "graveyard",
            destination: {
              zone: "loaded",
              host: {
                kind: "bound",
                binding: "target-weapon",
              },
            },
          },
        },
      ],
    },
  },
};

export default moltenArrow;
