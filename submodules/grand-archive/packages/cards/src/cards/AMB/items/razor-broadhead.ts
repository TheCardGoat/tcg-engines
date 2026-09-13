import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const razorBroadhead: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "si9ux3ak6o",
  slug: "razor-broadhead",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "si9ux3ak6o:face:default",
      catalogId: "si9ux3ak6o",
      name: "Razor Broadhead",
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
      elements: ["NORM"],
      stats: {
        power: 3,
      },
      rulesText:
        "REST: Load Razor Broadhead into target unloaded Bow weapon you control.\n\nOn Attack: If the attacker is distant, Razor Broadhead gets +3 POWER.",
      abilities: [
        {
          id: "si9ux3ak6o-a1",
          kind: "activated",
          text: "REST: Load Razor Broadhead into target unloaded Bow weapon you control.",
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
          id: "si9ux3ak6o-a2",
          kind: "triggered",
          text: "On Attack: If the attacker is distant, Razor Broadhead gets +3 POWER.",
          trigger: {
            kind: "event",
            event: {
              name: "attack-declared",
              subject: {
                kind: "source",
              },
            },
          },
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "event-attacker",
              },
              state: "distant",
            },
            then: {
              kind: "continuous",
              subjects: {
                kind: "source",
              },
              affectedSet: "locked",
              duration: {
                kind: "permanent",
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
                amount: 3,
              },
            },
          },
        },
      ],
    },
  },
};

export default razorBroadhead;
