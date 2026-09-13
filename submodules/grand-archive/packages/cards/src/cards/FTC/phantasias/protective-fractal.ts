import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const protectiveFractal: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1lw9n0wpbh",
  slug: "protective-fractal",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1lw9n0wpbh:face:default",
      catalogId: "1lw9n0wpbh",
      name: "Protective Fractal",
      cost: {
        kind: "reserve",
        amount: 4,
      },
      typeLine: {
        supertypes: [],
        types: ["PHANTASIA"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "FRACTAL"],
      },
      elements: ["WATER"],
      stats: {},
      rulesText:
        "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.) \n\nREST: Prevent the next 1 damage that would be dealt to target champion this turn.",
      abilities: [
        {
          id: "1lw9n0wpbh-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "Reservable (While paying for a reserve cost, you may rest this object to pay for 1 of that cost.)",
          keyword: {
            name: "reservable",
          },
        },
        {
          id: "1lw9n0wpbh-a2",
          kind: "activated",
          text: "REST: Prevent the next 1 damage that would be dealt to target champion this turn.",
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
                filter: {
                  kind: "type",
                  oneOf: ["CHAMPION"],
                },
              },
            },
          ],
          effect: {
            kind: "replacement",
            event: {
              name: "damage-dealt",
              recipient: {
                kind: "bound-object",
                binding: "target-1",
              },
            },
            operation: {
              kind: "prevent",
            },
            capacity: {
              amount: 1,
              scope: "replacement-instance",
            },
            duration: {
              kind: "this-turn",
            },
          },
        },
      ],
    },
  },
};

export default protectiveFractal;
