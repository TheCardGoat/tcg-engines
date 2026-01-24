import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsHonorablePirate: CharacterCard = {
  id: "1el",
  cardType: "character",
  name: "Jim Hawkins",
  version: "Honorable Pirate",
  fullName: "Jim Hawkins - Honorable Pirate",
  inkType: ["amber"],
  franchise: "Treasure Planet",
  set: "006",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nHIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  cost: 7,
  strength: 4,
  willpower: 7,
  lore: 2,
  cardNumber: 25,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b65dd4f44013d00440a5e7cd10def97b510a95a1",
  },
  abilities: [
    {
      id: "1el-1",
      type: "keyword",
      keyword: "Bodyguard",
      text: "Bodyguard",
    },
    {
      id: "1el-2",
      type: "triggered",
      name: "HIRE A CREW",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      text: "HIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
};
