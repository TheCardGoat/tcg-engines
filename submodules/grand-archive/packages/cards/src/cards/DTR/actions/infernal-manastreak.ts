import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const infernalManastreak: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "rovbfpf7al",
  slug: "infernal-manastreak",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "rovbfpf7al:face:default",
      catalogId: "rovbfpf7al",
      name: "Infernal Manastreak",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "AETHERCHARGE", "SPELL"],
      },
      elements: ["FIRE"],
      speed: "fast",
      stats: {
        power: 1,
      },
      rulesText:
        "Deal 2 damage to target unit. If your champion is distant, deal 3 damage to that unit instead.\n\nYou may load Infernal Manastreak into an Aetherwing weapon you control.",
      abilities: [
        {
          id: "rovbfpf7al-a1",
          kind: "card-resolution",
          text: "Deal 2 damage to target unit. If your champion is distant, deal 3 damage to that unit instead.",
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
                filter: {
                  kind: "type",
                  oneOf: ["ALLY", "CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "conditional",
            condition: {
              kind: "object-state",
              subject: {
                kind: "champion",
                player: "controller",
              },
              state: "distant",
            },
            then: {
              kind: "deal-damage",
              source: {
                kind: "source",
              },
              recipient: {
                kind: "bound",
                binding: "target-1",
              },
              amount: 3,
            },
            else: {
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
          },
        },
        {
          id: "rovbfpf7al-a2",
          kind: "card-resolution",
          text: "You may load Infernal Manastreak into an Aetherwing weapon you control.",
          effect: {
            kind: "optional",
            player: "controller",
            allOrNothing: true,
            effect: {
              kind: "choose",
              selection: {
                id: "chosen-weapon",
                kind: "choice",
                declared: "resolution",
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
                        kind: "subtype",
                        oneOf: ["AETHERWING"],
                      },
                    ],
                  },
                },
              },
              effect: {
                kind: "move",
                subject: {
                  kind: "source",
                },
                destination: {
                  zone: "loaded",
                  host: {
                    kind: "bound",
                    binding: "chosen-weapon",
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

export default infernalManastreak;
