import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogCreatureOfTheNight: CharacterCard = {
  id: "1x1",
  cardType: "character",
  name: "Chernabog",
  version: "Creature of the Night",
  fullName: "Chernabog - Creature of the Night",
  inkType: ["amethyst"],
  franchise: "Fantasia",
  set: "007",
  text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
  cost: 5,
  strength: 2,
  willpower: 6,
  lore: 1,
  cardNumber: 50,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "f8c82e67f89c9ff310443e3e85dd847673575b7e",
  },
  abilities: [
    {
      id: "1x1-1",
      type: "triggered",
      name: "MIDNIGHT REVEL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "restriction",
        restriction: "cant-ready",
        target: "SELF",
        duration: "their-next-turn",
      },
      text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
};
