import type { CharacterCard } from "@tcg/lorcana-types";

export const maximuspalaceHorse: CharacterCard = {
  id: "174",
  cardType: "character",
  name: "Maximus",
  version: "Palace Horse",
  fullName: "Maximus - Palace Horse",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "001",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)\nSupport (Whenever this character quests, you may add their {S} to another chosen character's {S} this turn.)",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 1,
  cardNumber: 10,
  inkable: true,
  externalIds: {
    ravensburger: "9c79c4e5854191f1b12a381fa7541ea2ea9b38da",
  },
  abilities: [
    {
      id: "174-1",
      text: "Bodyguard",
      type: "keyword",
      keyword: "Bodyguard",
    },
    {
      id: "174-2",
      text: "Support",
      type: "keyword",
      keyword: "Support",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
