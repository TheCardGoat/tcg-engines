import type { CharacterCard } from "@tcg/lorcana-types";

export const pepaMadrigalWeatherMaker: CharacterCard = {
  abilities: [
    {
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
      id: "7gu-1",
      name: "IT LOOKS LIKE RAIN",
      text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
  ],
  cardNumber: 53,
  cardType: "character",
  classifications: ["Storyborn", "Ally", "Madrigal"],
  cost: 5,
  externalIds: {
    ravensburger: "1aea1a364780b0736c993d3055013dd602442cf8",
  },
  franchise: "Encanto",
  fullName: "Pepa Madrigal - Weather Maker",
  id: "7gu",
  inkType: ["amethyst"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Pepa Madrigal",
  set: "004",
  strength: 1,
  text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
  version: "Weather Maker",
  willpower: 5,
};
