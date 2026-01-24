import type { CharacterCard } from "@tcg/lorcana-types";

export const jasmineSoothingPrincess: CharacterCard = {
  id: "1rh",
  cardType: "character",
  name: "Jasmine",
  version: "Soothing Princess",
  fullName: "Jasmine - Soothing Princess",
  inkType: ["sapphire"],
  franchise: "Aladdin",
  set: "010",
  text: "Boost 2 {I} (Once during your turn, you may pay 2 {I} to put the top card of your deck facedown under this character.)\nUPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 149,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e4d864eb426598356a81fd5ded859bbce0e09158",
  },
  abilities: [
    {
      id: "1rh-1",
      type: "keyword",
      keyword: "Boost",
      value: 2,
      text: "Boost 2 {I}",
    },
    {
      id: "1rh-2",
      type: "triggered",
      name: "UPLIFTING AURA",
      trigger: {
        event: "quest",
        timing: "whenever",
        on: "SELF",
      },
      effect: {
        type: "conditional",
        condition: {
          type: "if",
          expression: "there’s a card under her",
        },
        then: {
          type: "remove-damage",
          amount: 3,
          upTo: true,
          target: {
            selector: "all",
            count: "all",
            owner: "you",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
      },
      text: "UPLIFTING AURA Whenever this character quests, if there’s a card under her, remove up to 3 damage from each of your characters.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Whisper"],
};
