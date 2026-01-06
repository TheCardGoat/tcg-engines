import type { CharacterCard } from "@tcg/lorcana-types";

export const johnSilverAlienPirate: CharacterCard = {
  id: "a8j",
  cardType: "character",
  name: "John Silver",
  version: "Alien Pirate",
  fullName: "John Silver - Alien Pirate",
  inkType: ["emerald"],
  franchise: "Disney",
  set: "001",
  text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  cardNumber: 82,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**PICK YOUR FIGHTS** When you play this character and whenever he quests, chosen opposing character gains **Reckless** during their next turn. _(They can",
      id: "a8j-1",
      effect: {
        type: "play-card",
        from: "hand",
      },
    },
  ],
  classifications: ["Alien", "Storyborn", "Villain", "Pirate", "Captain"],
};
