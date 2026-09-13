import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const disenchant: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "zd83net7x0",
  slug: "disenchant",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "zd83net7x0:face:default",
      catalogId: "zd83net7x0",
      name: "Disenchant",
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
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Destroy target phantasia.",
      abilities: [
        {
          id: "zd83net7x0-a1",
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
      ],
    },
  },
};

export default disenchant;
