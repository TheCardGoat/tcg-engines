import type { CharacterCard } from "@tcg/lorcana-types";

export const scroopOdiousMutineer: CharacterCard = {
  abilities: [
    {
      id: "br6-1",
      keyword: "Evasive",
      text: "Evasive",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "br6-2",
      text: "DO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.",
      type: "action",
    },
  ],
  cardNumber: 82,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate"],
  cost: 3,
  externalIds: {
    ravensburger: "2a5d939bc141ebe8540f3584cea9e8e2cb51fc57",
  },
  franchise: "Treasure Planet",
  fullName: "Scroop - Odious Mutineer",
  id: "br6",
  inkType: ["emerald"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Scroop",
  set: "005",
  strength: 2,
  text: "Evasive (Only characters with Evasive can challenge this character.)\nDO SAY HELLO TO MR. ARROW When you play this character, you may pay 3 {I} to banish chosen damaged character.",
  version: "Odious Mutineer",
  willpower: 1,
};
