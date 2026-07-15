import type { CharacterCard } from "@tcg/lorcana-types";

export const plutoGuardDog: CharacterCard = {
  abilities: [
    {
      id: "173-1",
      keyword: "Bodyguard",
      text: "Bodyguard",
      type: "keyword",
    },
    {
      effect: {
        modifier: 4,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "173-2",
      text: "BRAVO While this character has no damage, he gets +4 {S}.",
      type: "static",
    },
  ],
  cardNumber: 186,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 4,
  externalIds: {
    ravensburger: "9c5bb650890624e6318d5c6b2158c61235bdcf01",
  },
  fullName: "Pluto - Guard Dog",
  id: "173",
  inkType: ["steel"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Pluto",
  set: "006",
  strength: 1,
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nBRAVO While this character has no damage, he gets +4 {S}.",
  version: "Guard Dog",
  willpower: 5,
};
