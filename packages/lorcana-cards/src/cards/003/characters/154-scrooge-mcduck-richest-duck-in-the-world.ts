import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckRichestDuckInTheWorld: CharacterCard = {
  id: "1f8",
  cardType: "character",
  name: "Scrooge McDuck",
  version: "Richest Duck in the World",
  fullName: "Scrooge McDuck - Richest Duck in the World",
  inkType: ["sapphire"],
  franchise: "Ducktales",
  set: "003",
  text: "I'M GOING HOME! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nI DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 1,
  cardNumber: 154,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "b91ab841ba2a2c52983687a609e0d1a647a704f8",
  },
  abilities: [
    {
      id: "1f8-1",
      type: "action",
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "I'M GOING HOME! During your turn, this character gains Evasive.",
    },
    {
      id: "1f8-2",
      type: "triggered",
      name: "I DIDN'T GET RICH BY BEING STUPID",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "OPPONENT_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "item",
          cost: "free",
        },
        chooser: "CONTROLLER",
      },
      text: "I DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
