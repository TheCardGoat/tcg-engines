import type { CharacterCard } from "@tcg/lorcana";

export const theHeadlessHorsemanRelentlessSpirit: CharacterCard = {
  id: "i51",
  cardType: "character",
  name: "The Headless Horseman",
  version: "Relentless Spirit",
  fullName: "The Headless Horseman - Relentless Spirit",
  inkType: ["steel"],
  franchise: "Sleepy Hollow",
  set: "010",
  text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
  cardNumber: "194",
  cost: 4,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  vanilla: false,
  externalIds: {
    ravensburger: "4160bece2c94394d46717dbd1fb2880098079cd6",
  },
  keywords: ["Bodyguard"],
  abilities: [
    {
      id: "i51-ability-1",
      text: "Bodyguard (This character may enter play exerted. An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
      type: "static",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
