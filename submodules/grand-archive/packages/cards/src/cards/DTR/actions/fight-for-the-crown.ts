import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const fightForTheCrown: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "1lij42a9sh",
  slug: "fight-for-the-crown",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "1lij42a9sh:face:default",
      catalogId: "1lij42a9sh",
      name: "Fight for the Crown",
      cost: {
        kind: "reserve",
        amount: 6,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SKILL"],
      },
      elements: ["NORM"],
      speed: "slow",
      stats: {},
      rulesText: "Each player sacrifices an ally.",
      abilities: [
        {
          id: "1lij42a9sh-a1",
          kind: "card-resolution",
          text: "Each player sacrifices an ally.",
          effect: {
            kind: "choose",
            selection: {
              id: "sacrificed-object",
              kind: "choice",
              declared: "resolution",
              chooser: "each-player",
              count: {
                kind: "exactly",
                amount: 1,
              },
              candidates: {
                kind: "object",
                zones: ["field"],
                relationship: "controlled-by",
                player: "each-player",
                filter: {
                  kind: "type",
                  oneOf: ["ALLY"],
                },
              },
            },
            effect: {
              kind: "sacrifice",
              subject: {
                kind: "bound",
                binding: "sacrificed-object",
              },
            },
          },
        },
      ],
    },
  },
};

export default fightForTheCrown;
