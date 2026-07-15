import type { CharacterCard } from "@tcg/lorcana-types";

export const rollyHungryPup: CharacterCard = {
  abilities: [
    {
      id: "evp-1",
      keyword: "Support",
      text: "Support",
      type: "keyword",
    },
  ],
  cardNumber: 21,
  cardType: "character",
  classifications: ["Storyborn", "Puppy"],
  cost: 3,
  externalIds: {
    ravensburger: "35a17094ae0ea85e5bf8c8c37dfc63064b508a63",
  },
  franchise: "101 Dalmatians",
  fullName: "Rolly - Hungry Pup",
  id: "evp",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  name: "Rolly",
  set: "003",
  strength: 3,
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  version: "Hungry Pup",
  willpower: 3,
};
