import type { CharacterCard } from "@tcg/lorcana-types";

export const herculesBelovedHero: CharacterCard = {
  id: "1wx",
  cardType: "character",
  name: "Hercules",
  version: "Beloved Hero",
  fullName: "Hercules - Beloved Hero",
  inkType: ["steel"],
  franchise: "Hercules",
  set: "009",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nResist +1 (Damage dealt to this character is reduced by 1.)",
  cost: 6,
  strength: 6,
  willpower: 5,
  lore: 2,
  cardNumber: 186,
  inkable: true,
  externalIds: {
    ravensburger: "f866b4683c87eff51a272c4dd392843627dd0da3",
  },
  abilities: [
    {
      id: "1wx-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "1wx-2",
      text: "Resist +1",
      type: "keyword",
      keyword: "Resist",
      value: 1,
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
};
