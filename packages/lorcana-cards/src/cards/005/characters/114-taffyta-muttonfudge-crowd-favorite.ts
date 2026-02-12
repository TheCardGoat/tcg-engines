import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeCrowdFavorite: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "you have a location in play",
        },
        then: {
          type: "lose-lore",
          amount: 1,
          target: "EACH_OPPONENT",
        },
      },
      id: "1a4-1",
      name: "SHOWSTOPPER",
      text: "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 114,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Racer"],
  cost: 1,
  externalIds: {
    ravensburger: "a6456a6446cdb4d9a61078c45ea55152f8bbcc31",
  },
  franchise: "Wreck It Ralph",
  fullName: "Taffyta Muttonfudge - Crowd Favorite",
  id: "1a4",
  inkType: ["ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Taffyta Muttonfudge",
  set: "005",
  strength: 1,
  text: "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.",
  version: "Crowd Favorite",
  willpower: 2,
};
