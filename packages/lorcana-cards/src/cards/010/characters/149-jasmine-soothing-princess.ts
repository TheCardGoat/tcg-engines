import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineSoothingPrincess: CharacterCard = {
  abilities: [
    {
      id: "1rh-1",
      keyword: "Boost",
      text: "Boost 2 {I}",
      type: "keyword",
      value: 2,
    },
    {
      effect: {
        condition: {
          expression: "there’s a card under her",
          type: "if",
        },
        then: {
          amount: 3,
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "remove-damage",
          upTo: true,
        },
        type: "conditional",
      },
      id: "1rh-2",
      name: "UPLIFTING AURA",
      text: "UPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 149,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
  cost: 4,
  externalIds: {
    ravensburger: "e4d864eb426598356a81fd5ded859bbce0e09158",
  },
  franchise: "Aladdin",
  fullName: "Jasmine - Soothing Princess",
  id: "1rh",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Jasmine",
  set: "010",
  strength: 2,
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nUPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
  version: "Soothing Princess",
  willpower: 5,
};
