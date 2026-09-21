import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const unwelcomeFortune: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "pgt4lhko8w",
  slug: "unwelcome-fortune",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "pgt4lhko8w:face:default",
      catalogId: "pgt4lhko8w",
      name: "Unwelcome Fortune",
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
      speed: "fast",
      stats: {},
      rulesText: "Look at target player's memory.\n\nFloating Memory",
      abilities: [
        {
          id: "pgt4lhko8w-a1",
          kind: "card-resolution",
          text: "Look at target player's memory.",
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
            kind: "look-at",
            player: "controller",
            selection: {
              id: "memory-cards",
              kind: "choice",
              declared: "resolution",
              chooser: "controller",
              count: {
                kind: "all",
              },
              candidates: {
                kind: "card",
                zones: ["memory"],
                relationship: "zone-of",
                player: {
                  binding: "target-player",
                },
              },
            },
          },
        },
        {
          id: "pgt4lhko8w-a2",
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

export default unwelcomeFortune;
