import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const razeTheLand: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "6i0iqmyn2r",
  slug: "raze-the-land",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "6i0iqmyn2r:face:default",
      catalogId: "6i0iqmyn2r",
      name: "Raze the Land",
      cost: {
        kind: "reserve",
        amount: 3,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["GUARDIAN"],
        subtypes: ["GUARDIAN", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Destroy target domain.\n\nFloating Memory",
      abilities: [
        {
          id: "6i0iqmyn2r-a1",
          kind: "card-resolution",
          text: "Destroy target domain.",
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
                  oneOf: ["DOMAIN"],
                },
              },
            },
          ],
          effect: {
            kind: "destroy",
            subject: {
              kind: "bound",
              binding: "target-1",
            },
            bindResultAs: "destroyed-object",
          },
        },
        {
          id: "6i0iqmyn2r-a2",
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

export default razeTheLand;
