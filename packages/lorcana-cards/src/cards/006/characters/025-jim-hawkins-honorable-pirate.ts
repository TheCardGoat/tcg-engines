import type { CharacterCard } from "@tcg/lorcana-types";

export const jimHawkinsHonorablePirate: CharacterCard = {
  abilities: [
    {
      id: "1el-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "put-on-bottom",
          target: "CHOSEN_CHARACTER",
        },
        chooser: "CONTROLLER",
      },
      id: "1el-2",
      name: "HIRE A CREW",
      text: "HIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 25,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  cost: 7,
  externalIds: {
    ravensburger: "b65dd4f44013d00440a5e7cd10def97b510a95a1",
  },
  franchise: "Treasure Planet",
  fullName: "Jim Hawkins - Honorable Pirate",
  id: "1el",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jim Hawkins",
  set: "006",
  strength: 4,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nHIRE A CREW When you play this character, look at the top 4 cards of your deck. You may reveal any number of Pirate character cards and put them into your hand. Put the rest on the bottom of your deck in any order.",
  version: "Honorable Pirate",
  willpower: 7,
};
