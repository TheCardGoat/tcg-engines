import type { CharacterCard } from "@tcg/lorcana-types";

export const yokaiEnigmaticInventor: CharacterCard = {
  abilities: [
    {
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
      id: "nt2-1",
      name: "TIME TO UPGRADE",
      text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Inventor"],
  cost: 4,
  externalIds: {
    ravensburger: "55cd9563ee89ea9d2f1a02ae1e76ddb0ba8d24fe",
  },
  franchise: "Big Hero 6",
  fullName: "Yokai - Enigmatic Inventor",
  id: "nt2",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Yokai",
  set: "006",
  strength: 3,
  text: "TIME TO UPGRADE Whenever this character quests, you may return one of your items to your hand to pay 2 {I} less for the next item you play this turn.",
  version: "Enigmatic Inventor",
  willpower: 3,
};
