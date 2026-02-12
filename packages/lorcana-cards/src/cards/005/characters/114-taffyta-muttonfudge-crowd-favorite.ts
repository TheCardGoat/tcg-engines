import type { CharacterCard } from "@tcg/lorcana-types";

export const taffytaMuttonfudgeCrowdFavorite: CharacterCard = {
  abilities: [
    {
      effect: {
        condition: {
          expression: "you have a location in play",
          type: "if",
        },
        then: {
          amount: 1,
          target: "EACH_OPPONENT",
          type: "lose-lore",
        },
        type: "conditional",
      },
      id: "1a4-1",
      name: "SHOWSTOPPER",
      text: "SHOWSTOPPER When you play this character, if you have a location in play, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
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
