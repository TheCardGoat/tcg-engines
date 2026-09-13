import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const crumblingReign: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "EFelNCz3Zv",
  slug: "crumbling-reign",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "EFelNCz3Zv:face:default",
      catalogId: "EFelNCz3Zv",
      name: "Crumbling Reign",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["RANGER"],
        subtypes: ["RANGER", "SKILL"],
      },
      elements: ["EXALTED", "FIRE"],
      speed: "slow",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nDestroy target item or weapon.",
      abilities: [
        {
          id: "EFelNCz3Zv-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "EFelNCz3Zv-a2",
          kind: "card-resolution",
          text: "Destroy target item or weapon.",
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
                  oneOf: ["ITEM", "WEAPON"],
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
          },
        },
      ],
    },
  },
};

export default crumblingReign;
