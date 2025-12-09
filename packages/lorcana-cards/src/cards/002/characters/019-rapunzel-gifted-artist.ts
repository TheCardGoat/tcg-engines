import type { CharacterCard } from "@tcg/lorcana";

export const rapunzelGiftedArtist: CharacterCard = {
  id: "n2g",
  cardType: "character",
  name: "Rapunzel",
  version: "Gifted Artist",
  fullName: "Rapunzel - Gifted Artist",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "002",
  text: "Shift 3 (You may pay 3 {I} to play this on top of one of your characters named Rapunzel.)\nLET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
  cost: 5,
  strength: 0,
  willpower: 6,
  lore: 2,
  cardNumber: 19,
  inkable: true,
  externalIds: {
    ravensburger: "5323f351160ce7e27e6c6f0a14b74b17e2b6f539",
  },
  abilities: [
    {
      id: "n2g-1",
      text: "Shift 3",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 3,
      },
    },
    {
      id: "n2g-2",
      text: "LET YOUR POWER SHINE Whenever you remove 1 or more damage from one of your characters, you may draw a card.",
      name: "LET YOUR POWER SHINE",
      type: "triggered",
      trigger: {
        event: "banish",
        timing: "whenever",
        on: "YOUR_OTHER_CHARACTERS",
      },
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
};
