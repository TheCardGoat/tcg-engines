import type { CharacterCard } from "@tcg/lorcana-types";

export const iagoStompinMad: CharacterCard = {
  id: "87v",
  cardType: "character",
  name: "Iago",
  version: "Stompin' Mad",
  fullName: "Iago - Stompin' Mad",
  inkType: ["amethyst"],
  franchise: "Aladdin",
  set: "010",
  text: "Challenger +5 (While challenging, this character gets +5 {S}.)",
  cost: 2,
  strength: 0,
  willpower: 2,
  lore: 1,
  cardNumber: 43,
  inkable: true,
  externalIds: {
    ravensburger: "1d9f1179673d307584d5af2eff385d3291e06044",
  },
  abilities: [
    {
      id: "87v-1",
      type: "keyword",
      keyword: "Challenger",
      value: 5,
      text: "Challenger +5",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
