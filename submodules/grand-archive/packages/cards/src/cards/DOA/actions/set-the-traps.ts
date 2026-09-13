import type { GrandArchiveAbilityDefinition, GrandArchiveCard } from "@tcg/grand-archive-types";

export const setTheTraps: GrandArchiveCard<GrandArchiveAbilityDefinition, "card"> = {
  canonicalId: "xipHhhsgJy",
  slug: "set-the-traps",
  definitionKind: "card",
  layout: {
    kind: "single-faced",
    face: {
      id: "xipHhhsgJy:face:default",
      catalogId: "xipHhhsgJy",
      name: "Set the Traps",
      cost: {
        kind: "reserve",
        amount: 2,
      },
      typeLine: {
        supertypes: [],
        types: ["ACTION"],
        classes: ["ASSASSIN"],
        subtypes: ["ASSASSIN", "SKILL"],
      },
      elements: ["WATER"],
      speed: "slow",
      stats: {},
      rulesText:
        "Target player puts the top two cards of their deck into their graveyard.\n\n[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion's class matches this card's class.)",
      abilities: [
        {
          id: "xipHhhsgJy-a1",
          kind: "card-resolution",
          text: "Target player puts the top two cards of their deck into their graveyard.",
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
            kind: "mill",
            player: {
              binding: "target-player",
            },
            amount: 2,
          },
        },
        {
          id: "xipHhhsgJy-a2",
          kind: "card-resolution",
          text: "[Class Bonus] Put a preparation counter on your champion. (Apply this effect only if your champion's class matches this card's class.)",
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
            kind: "add-counter",
            subject: {
              kind: "champion",
              player: "controller",
            },
            counter: "preparation",
            amount: 1,
          },
        },
      ],
    },
  },
};

export default setTheTraps;
