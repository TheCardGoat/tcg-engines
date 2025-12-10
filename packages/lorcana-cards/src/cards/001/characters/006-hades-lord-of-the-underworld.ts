import type { CharacterCard } from "@tcg/lorcana";

export const hadesLordOfTheUnderworld: CharacterCard = {
  id: "1yp",
  cardType: "character",
  name: "Hades",
  version: "Lord of the Underworld",
  fullName: "Hades - Lord of the Underworld",
  inkType: ["amber"],
  franchise: "Hercules",
  set: "001",
  text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
  cost: 4,
  strength: 3,
  willpower: 2,
  lore: 1,
  cardNumber: 6,
  inkable: false,
  externalIds: {
    ravensburger: "fee01a363b4de2d6f92c340520d2adaea461f380",
  },
  abilities: [
    {
      id: "1yp-1",
      text: "WELL OF SOULS When you play this character, return a character card from your discard to your hand.",
      name: "WELL OF SOULS",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "return-from-discard",
        cardType: "character",
        target: "CONTROLLER",
      },
    },
  ],
  classifications: ["Storyborn", "Villain", "Deity"],
};
