import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiEnigmaticInventor: CharacterCard = {
  id: "nt2",
  cardType: "character",
  name: "Yokai",
  version: "Enigmatic Inventor",
  fullName: "Yokai - Enigmatic Inventor",
  inkType: ["sapphire"],
  franchise: "Big Hero 6",
  set: "006",
  text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "55cd9563ee89ea9d2f1a02ae1e76ddb0ba8d24fe",
  },
  abilities: [
    {
      id: "nt2-1",
      type: "triggered",
      name: "TIME TO UPGRADE",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Inventor"],
};
