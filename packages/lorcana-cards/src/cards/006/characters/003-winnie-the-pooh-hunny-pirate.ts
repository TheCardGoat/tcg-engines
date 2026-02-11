import type { CharacterCard } from "@tcg/lorcana-types";

export const winnieThePoohHunnyPirate: CharacterCard = {
  abilities: [
    {
      id: "1v3-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
    {
      effect: {
        type: "play-card",
        from: "hand",
      },
      id: "1v3-2",
      text: "WE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
      type: "action",
    },
  ],
  cardNumber: 3,
  cardType: "character",
  classifications: ["Storyborn", "Hero", "Pirate"],
  cost: 2,
  externalIds: {
    ravensburger: "f4cb028f3925f704d8e509b9f824df90e1dfdf0e",
  },
  franchise: "Winnie the Pooh",
  fullName: "Winnie the Pooh - Hunny Pirate",
  id: "1v3",
  inkType: ["amber"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Winnie the Pooh",
  set: "006",
  strength: 2,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)\n\nWE'RE PIRATES, YOU SEE Whenever this character quests, you pay 1 {I} less for the next Pirate character you play this turn.",
  version: "Hunny Pirate",
  willpower: 2,
};
