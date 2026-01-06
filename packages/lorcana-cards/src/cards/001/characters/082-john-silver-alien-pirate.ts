import type { CharacterCard } from "@tcg/lorcana-types/cards/card-types";

export const johnSilver: CharacterCard = {
  id: "a8j",
  cardType: "character",
  name: "John Silver",
  version: "Alien Pirate",
  fullName: "John Silver - Alien Pirate",
  inkType: ["emerald"],
  franchise: "General",
  set: "001",
  text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can't quest and must challenge if able.)_",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  rarity: "legendary",
  externalIds: {
    ravensburger: "",
    tcgPlayer: 507476,
  },
  classifications: ["Alien", "Storyborn", "Villain", "Pirate", "Captain"],
};
