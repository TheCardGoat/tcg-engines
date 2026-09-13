import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const psychopompsGale: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "LHFUG6stdS",
  slug: "psychopomps-gale",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "LHFUG6stdS:face:default",
      catalogId: "LHFUG6stdS",
      name: "Psychopomp's Gale",
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
      elements: ["EXALTED", "WIND"],
      speed: "fast",
      stats: {},
      rulesText:
        "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)\n\nTarget player banishes all cards in their graveyard.",
      abilities: [
        {
          id: "LHFUG6stdS-a1",
          kind: "static",
          staticKind: "intrinsic",
          text: "(Exalted — This element is enabled for you as long as you have another advanced element enabled.)",
          keyword: {
            name: "exalted",
          },
        },
        {
          id: "LHFUG6stdS-a2",
          kind: "card-resolution",
          text: "Target player banishes all cards in their graveyard.",
          targets: [
            {
              id: "target-player",
              kind: "target",
              declared: "announcement",
              chooser: "controller",
              count: {
                kind: "exactly",
                amount: 1,
              },
              unique: true,
              candidates: {
                kind: "player",
                players: ["controller", "opponent", "another-player"],
              },
            },
          ],
          effect: {
            kind: "banish",
            player: {
              binding: "target-player",
            },
            selection: {
              id: "banished-cards",
              kind: "choice",
              declared: "resolution",
              chooser: {
                binding: "target-player",
              },
              count: {
                kind: "all",
              },
              candidates: {
                kind: "card",
                zones: ["graveyard"],
                relationship: "zone-of",
                player: {
                  binding: "target-player",
                },
              },
            },
          },
        },
      ],
    },
  },
};

export default psychopompsGale;
