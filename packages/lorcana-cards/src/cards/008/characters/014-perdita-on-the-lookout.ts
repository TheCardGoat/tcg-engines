import type { CharacterCard } from "@tcg/lorcana-types";

export const perditaOnTheLookout: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "willpower",
        modifier: 1,
        target: "SELF",
      },
      id: "1uw-1",
      text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
      type: "action",
    },
  ],
  cardNumber: 14,
  cardType: "character",
  classifications: ["Storyborn", "Hero"],
  cost: 2,
  externalIds: {
    ravensburger: "f122c7757ba00f7654f65a121fe801983148a4ab",
  },
  franchise: "101 Dalmatians",
  fullName: "Perdita - On the Lookout",
  id: "1uw",
  inkType: ["amber"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Perdita",
  set: "008",
  strength: 1,
  text: "KEEPING WATCH While you have a Puppy character in play, this character gets +1 {W}.",
  version: "On the Lookout",
  willpower: 4,
};
