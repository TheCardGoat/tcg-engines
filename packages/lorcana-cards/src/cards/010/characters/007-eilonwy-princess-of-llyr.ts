import type { CharacterCard } from "@tcg/lorcana";

export const eilonwyPrincessOfLlyr: CharacterCard = {
  id: "49a",
  cardType: "character",
  name: "Eilonwy",
  version: "Princess of Llyr",
  fullName: "Eilonwy - Princess of Llyr",
  inkType: ["amber"],
  franchise: "Black Cauldron",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  cardNumber: 7,
  inkable: true,
  externalIds: {
    ravensburger: "0f58ea02eaf39ac3ef2bc75f001ad1d539b477ed",
  },
  abilities: [
    {
      id: "49a-1",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally", "Princess"],
};
