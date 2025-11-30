import type { CharacterCard } from "@tcg/lorcana";

export const annaMakingSnowPlans: CharacterCard = {
  id: "9zf",
  cardType: "character",
  name: "Anna",
  version: "Making Snow Plans",
  fullName: "Anna - Making Snow Plans",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "010",
  text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cardNumber: "139",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 2,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "23fbbd7099c1f99fe8cea396e7cb66af956ebcb0",
  },
  keywords: ["Support"],
  abilities: [
    {
      id: "9zf-ability-1",
      text: "Support (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Hero", "Queen"],
};
