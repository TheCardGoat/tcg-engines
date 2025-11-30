import type { CharacterCard } from "@tcg/lorcana";

export const iagoStompinMad: CharacterCard = {
  id: "87v",
  cardType: "character",
  name: "Iago",
  version: "Stompin' Mad",
  fullName: "Iago - Stompin' Mad",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "010",
  text: "Challenger +5 (While challenging, this character gets +5.)",
  cardNumber: "043",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    ravensburger: "1d9f1179673d307584d5af2eff385d3291e06044",
  },
  keywords: [
    {
      type: "Challenger",
      value: 5,
    },
  ],
  abilities: [
    {
      id: "87va1",
      text: "Challenger +5",
      type: "keyword",
      keyword: "Challenger",
      value: 5,
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
