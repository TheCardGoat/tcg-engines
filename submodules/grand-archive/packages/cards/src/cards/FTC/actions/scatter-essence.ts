import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const scatterEssence: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zi5h8asbie",
  slug: "scatter-essence",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zi5h8asbie:face:default",
      catalogId: "zi5h8asbie",
      name: "Scatter Essence",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["CLERIC"],
        subtypes: ["CLERIC", "SPELL"],
      },
      elements: ["WIND"],
      speed: "slow",
      stats: {},
      rulesText: "Destroy target phantasia.\n\nFloating Memory",
      abilities: [
        {
          id: "zi5h8asbie-a1",
          kind: "card-resolution",
          text: "Destroy target phantasia.",
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
                  oneOf: ["PHANTASIA"],
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
          id: "zi5h8asbie-a2",
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

export default scatterEssence;
