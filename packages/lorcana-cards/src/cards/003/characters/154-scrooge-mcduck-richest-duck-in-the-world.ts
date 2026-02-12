import type { CharacterCard } from "@tcg/lorcana-types";

export const scroogeMcduckRichestDuckInTheWorld: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Evasive",
        target: "SELF",
        type: "gain-keyword",
      },
      id: "1f8-1",
      text: "I'M GOING HOME! During your turn, this character gains Evasive.",
      type: "action",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "play-card",
          from: "hand",
          cardType: "item",
          cost: "free",
        },
        type: "optional",
      },
      id: "1f8-2",
      name: "I DIDN'T GET RICH BY BEING STUPID",
      text: "I DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
      trigger: {
        event: "banish",
        on: "OPPONENT_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 154,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 5,
  externalIds: {
    ravensburger: "b91ab841ba2a2c52983687a609e0d1a647a704f8",
  },
  franchise: "Ducktales",
  fullName: "Scrooge McDuck - Richest Duck in the World",
  id: "1f8",
  inkType: ["sapphire"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Scrooge McDuck",
  set: "003",
  strength: 3,
  text: "I'M GOING HOME! During your turn, this character gains Evasive. (They can challenge characters with Evasive.)\nI DIDN'T GET RICH BY BEING STUPID During your turn, whenever this character banishes another character in a challenge, you may play an item for free.",
  version: "Richest Duck in the World",
  willpower: 5,
};
