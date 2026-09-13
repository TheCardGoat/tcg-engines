import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const savageArrow: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "uuty5scwug",
  slug: "savage-arrow",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "uuty5scwug:face:default",
      catalogId: "uuty5scwug",
      name: "Savage Arrow",
      cost: {
        kind: "reserve",
        amount: 2,
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
        "REST: Load Savage Arrow into target unloaded Bow weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)\n\nFloating Memory",
      abilities: [
        {
          id: "uuty5scwug-a1",
          kind: "activated",
          text: "REST: Load Savage Arrow into target unloaded Bow weapon you control. (As a weapon is used for an attack, all of its loaded cards are put into the attacker's intent.)",
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
          id: "uuty5scwug-a2",
          kind: "static",
          staticKind: "intrinsic",
          text: "Floating Memory",
          keyword: {
            name: "floating-memory",
          },
        },
      ],
    },
  },
};

export default savageArrow;
