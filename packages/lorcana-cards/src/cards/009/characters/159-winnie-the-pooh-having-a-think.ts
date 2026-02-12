import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHavingAThink: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          type: "put-into-inkwell",
          source: "hand",
          target: "CONTROLLER",
          facedown: true,
        },
        type: "optional",
      },
      id: "18k-1",
      name: "HUNNY POT",
      text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 159,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 3,
  externalIds: {
    ravensburger: "a0ac5d7c21c80cd3df94d836790d6e371f81ae76",
  },
  franchise: "Winnie the Pooh",
  fullName: "Winnie the Pooh - Having a Think",
  id: "18k",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Winnie the Pooh",
  set: "009",
  strength: 2,
  text: "HUNNY POT Whenever this character quests, you may put a card from your hand into your inkwell facedown.",
  version: "Having a Think",
  willpower: 3,
};
