import type { CharacterCard } from "@tcg/lorcana";

export const motherGothelSelfishManipulator: CharacterCard = {
  id: "xse",
  cardType: "character",
  name: "Mother Gothel",
  version: "Selfish Manipulator",
  fullName: "Mother Gothel - Selfish Manipulator",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "001",
  text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
  cost: 6,
  strength: 3,
  willpower: 6,
  lore: 2,
  cardNumber: 90,
  inkable: true,
  externalIds: {
    ravensburger: "79c6e202cddc31d783bd416c273e9fed9f7a7eb2",
  },
  abilities: [
    {
      id: "xse-1",
      text: "SKIP THE DRAMA, STAY WITH MAMA While this character is exerted, opposing characters can't quest.",
      name: "SKIP THE DRAMA, STAY WITH MAMA",
      type: "static",
      effect: {
        type: "restriction",
        restriction: "cant-quest",
        target: "SELF",
      },
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
