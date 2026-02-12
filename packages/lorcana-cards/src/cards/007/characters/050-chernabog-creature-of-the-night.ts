import type { CharacterCard } from "@tcg/lorcana-types";

export const chernabogCreatureOfTheNight: CharacterCard = {
  abilities: [
    {
      effect: {
        duration: "until-start-of-next-turn",
        restriction: "cant-ready",
        target: "SELF",
        type: "restriction",
      },
      id: "1x1-1",
      name: "MIDNIGHT REVEL",
      text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 50,
  cardType: "character",
  classifications: ["Storyborn", "Villain"],
  cost: 5,
  externalIds: {
    ravensburger: "f8c82e67f89c9ff310443e3e85dd847673575b7e",
  },
  franchise: "Fantasia",
  fullName: "Chernabog - Creature of the Night",
  id: "1x1",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Chernabog",
  set: "007",
  strength: 2,
  text: "MIDNIGHT REVEL When you play this character, each opponent chooses and exerts one of their ready characters. They can't ready at the start of their next turn.",
  version: "Creature of the Night",
  willpower: 6,
};
