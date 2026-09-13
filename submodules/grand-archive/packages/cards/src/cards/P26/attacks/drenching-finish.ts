import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const drenchingFinish: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "en3DD836cp",
  slug: "drenching-finish",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "en3DD836cp:face:default",
      catalogId: "en3DD836cp",
      name: "Drenching Finish",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ATTACK"],
        classes: ["WARRIOR"],
        subtypes: ["WARRIOR", "SWORD"],
      },
      elements: ["WATER"],
      stats: {
        power: 2,
      },
      rulesText:
        "[Class Bonus] On Kill: Target player puts the top three cards of their deck into their graveyard.",
      abilities: [
        {
          id: "en3DD836cp-a1",
          kind: "triggered",
          text: "[Class Bonus] On Kill: Target player puts the top three cards of their deck into their graveyard.",
          trigger: {
            kind: "event",
            event: {
              name: "object-killed",
              subject: {
                kind: "source",
              },
            },
          },
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
          restrictions: [
            {
              kind: "static",
              name: "class-bonus",
              condition: {
                kind: "champion-matches-source",
                characteristic: "class",
              },
            },
          ],
          effect: {
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 3,
          },
        },
      ],
    },
  },
};

export default drenchingFinish;
