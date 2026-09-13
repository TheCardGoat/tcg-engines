import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const vanishingShot: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "0iqmyn2rz3",
  slug: "vanishing-shot",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "0iqmyn2rz3:face:default",
      catalogId: "0iqmyn2rz3",
      name: "Vanishing Shot",
      cost: {
        kind: "reserve",
        amount: 1,
      },
      typeLine: {
        supertypes: [],
        types: ["ITEM"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "BULLET"],
      },
      elements: ["WIND"],
      stats: {
        power: 2,
      },
      rulesText:
        "REST: Load Vanishing Shot into target unloaded Gun weapon you control.\n\nOn Ally Hit: You may return the hit ally to its owner's memory. ",
      abilities: [
        {
          id: "0iqmyn2rz3-a1",
          kind: "activated",
          text: "REST: Load Vanishing Shot into target unloaded Gun weapon you control.",
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
          id: "0iqmyn2rz3-a2",
          kind: "triggered",
          text: "On Ally Hit: You may return the hit ally to its owner's memory.",
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
                  oneOf: ["ALLY"],
                },
              },
            },
          },
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "move",
              subject: {
                kind: "event-recipient",
              },
              from: "field",
              destination: {
                zone: "memory",
              },
            },
          },
        },
      ],
    },
  },
};

export default vanishingShot;
