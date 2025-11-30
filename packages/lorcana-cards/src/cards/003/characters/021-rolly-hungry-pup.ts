import type { CharacterCard } from "@tcg/lorcana";

export const rollyHungryPup: CharacterCard = {
  id: "evp",
  cardType: "character",
  name: "Rolly",
  version: "Hungry Pup",
  fullName: "Rolly - Hungry Pup",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "003",
  text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
  cardNumber: "021",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "35a17094ae0ea85e5bf8c8c37dfc63064b508a63",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "evp-ability-1",
      text: "Support (Whenever this character quests, you may add their to another chosen character's this turn.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Puppy"],
};
