import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHavingAThink: CharacterCard = {
  id: "18k",
  cardType: "character",
  name: "Winnie the Pooh",
  version: "Having a Think",
  fullName: "Winnie the Pooh - Having a Think",
  inkType: ["sapphire"],
  franchise: "Winnie the Pooh",
  set: "009",
  text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 2,
  cardNumber: 159,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "a0ac5d7c21c80cd3df94d836790d6e371f81ae76",
  },
  abilities: [
    {
      id: "18k-1",
      type: "triggered",
      name: "HUNNY POT",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          facedown: true,
        },
        chooser: "CONTROLLER",
      },
      text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
