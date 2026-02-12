import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverAlienPirate: CharacterCard = {
  abilities: [
    {
      effect: {
        keyword: "Reckless",
        target: "CHOSEN_CHARACTER",
        type: "gain-keyword",
      },
      id: "4t5-1",
      name: "PICK YOUR FIGHTS When you play this character and",
      text: "PICK YOUR FIGHTS When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 89,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Alien", "Pirate", "Captain"],
  cost: 6,
  externalIds: {
    ravensburger: "11558c64b32cb39749583bcfb6fd5638e6a0ea03",
  },
  franchise: "Treasure Planet",
  fullName: "John Silver - Alien Pirate",
  id: "4t5",
  inkType: ["emerald"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "John Silver",
  set: "009",
  strength: 5,
  text: "PICK YOUR FIGHTS When you play this character and whenever he quests, chosen opposing character gains Reckless during their next turn. (They can't quest and must challenge if able.)",
  version: "Alien Pirate",
  willpower: 5,
};
