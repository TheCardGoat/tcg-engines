import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelGiftedArtist: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "n2g-1",
      keyword: "Shift",
      text: "Shift 3",
      type: "keyword",
    },
    {
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      id: "n2g-2",
      name: "LET YOUR POWER SHINE",
      text: "LET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      type: "triggered",
    },
  ],
  cardNumber: 19,
  cardType: "character",
  classifications: ["Floodborn", "Hero", "Princess"],
  cost: 5,
  externalIds: {
    ravensburger: "5323f351160ce7e27e6c6f0a14b74b17e2b6f539",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Gifted Artist",
  id: "n2g",
  inkType: ["amber"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Rapunzel",
  set: "002",
  strength: 0,
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
  version: "Gifted Artist",
  willpower: 6,
};
