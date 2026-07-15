import type { CharacterCard } from "@tcg/lorcana-types";

export const ursulaDeceiver: CharacterCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "d21-1",
      name: "YOU'LL NEVER EVEN MISS IT",
      text: "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 90,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 2,
  externalIds: {
    ravensburger: "2f0ee159014b24c95f95963bdfa4b8ec79329fac",
  },
  franchise: "Little Mermaid",
  fullName: "Ursula - Deceiver",
  id: "d21",
  inkType: ["emerald"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Ursula",
  set: "009",
  strength: 1,
  text: "YOU'LL NEVER EVEN MISS IT When you play this character, chosen opponent reveals their hand and discards a song card of your choice.",
  version: "Deceiver",
  willpower: 3,
};
