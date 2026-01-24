import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaOnTheLookout: CharacterCard = {
  id: "1uw",
  cardType: "character",
  name: "Perdita",
  version: "On the Lookout",
  fullName: "Perdita - On the Lookout",
  inkType: ["amber"],
  franchise: "101 Dalmatians",
  set: "008",
  text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  cardNumber: 14,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f122c7757ba00f7654f65a121fe801983148a4ab",
  },
  abilities: [
    {
      id: "1uw-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "SELF",
      },
      text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
