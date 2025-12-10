import type { CharacterCard } from "@tcg/lorcana";

export const aladdinStreetRat: CharacterCard = {
  id: "ec0",
  cardType: "character",
  name: "Aladdin",
  version: "Street Rat",
  fullName: "Aladdin - Street Rat",
  inkType: ["ruby"],
  franchise: "Aladdin",
  set: "001",
  text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  cardNumber: 105,
  inkable: true,
  externalIds: {
    ravensburger: "33a8b4eedbcab6c827f3eb65178e48bf29d42142",
  },
  abilities: [
    {
      id: "ec0-1",
      text: "IMPROVISE When you play this character, each opponent loses 1 lore.",
      name: "IMPROVISE",
      type: "triggered",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
  classifications: ["Storyborn", "Hero"],
};
