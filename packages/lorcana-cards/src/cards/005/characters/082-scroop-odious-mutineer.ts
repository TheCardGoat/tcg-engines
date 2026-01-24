import type { CharacterCard } from "@tcg/lorcana-types";

export const scroopOdiousMutineer: CharacterCard = {
  id: "br6",
  cardType: "character",
  name: "Scroop",
  version: "Odious Mutineer",
  fullName: "Scroop - Odious Mutineer",
  inkType: ["emerald"],
  franchise: "Treasure Planet",
  set: "005",
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.",
  cost: 3,
  strength: 2,
  willpower: 1,
  lore: 2,
  cardNumber: 82,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "2a5d939bc141ebe8540f3584cea9e8e2cb51fc57",
  },
  abilities: [
    {
      id: "br6-1",
      type: "keyword",
      keyword: "Evasive",
      text: "Evasive",
    },
    {
      id: "br6-2",
      type: "action",
      effect: {
        type: "play-card",
        from: "hand",
      },
      text: "DO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Pirate"],
};
