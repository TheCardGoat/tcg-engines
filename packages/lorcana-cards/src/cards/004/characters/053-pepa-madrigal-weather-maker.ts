import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalWeatherMaker: CharacterCard = {
  id: "7gu",
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Weather Maker",
  fullName: "Pepa Madrigal - Weather Maker",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  cardNumber: 53,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "1aea1a364780b0736c993d3055013dd602442cf8",
  },
  abilities: [
    {
      id: "7gu-1",
      type: "triggered",
      name: "IT LOOKS LIKE RAIN",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "restriction",
          restriction: "cant-ready",
          target: "SELF",
          duration: "until-start-of-next-turn",
        },
        chooser: "CONTROLLER",
      },
      text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
};
