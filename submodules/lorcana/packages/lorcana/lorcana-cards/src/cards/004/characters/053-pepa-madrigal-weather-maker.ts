import type { CharacterCard } from "@tcg/lorcana-types";
import { pepaMadrigalWeatherMakerI18n } from "./053-pepa-madrigal-weather-maker.i18n";

export const pepaMadrigalWeatherMaker: CharacterCard = {
  id: "Vvx",
  canonicalId: "ci_Vvx",
  reprints: ["set4-053"],
  cardType: "character",
  name: "Pepa Madrigal",
  version: "Weather Maker",
  inkType: ["amethyst"],
  franchise: "Encanto",
  set: "004",
  cardNumber: 53,
  rarity: "rare",
  cost: 5,
  strength: 1,
  willpower: 5,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_8f5bdfa86b31418bb75a251ce2ebd313",
    tcgPlayer: 548205,
  },
  text: [
    {
      title: "IT LOOKS LIKE RAIN",
      description:
        "When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
    },
  ],
  classifications: ["Storyborn", "Ally", "Madrigal"],
  abilities: [
    {
      id: "7gu-1",
      name: "IT LOOKS LIKE RAIN",
      type: "triggered",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        effect: {
          type: "sequence",
          steps: [
            {
              type: "exert",
              target: {
                selector: "chosen",
                count: 1,
                owner: "opponent",
                cardTypes: ["character"],
                zones: ["play"],
              },
            },
            {
              type: "restriction",
              restriction: "cant-ready",
              duration: "until-start-of-next-turn",
              condition: {
                type: "not",
                condition: {
                  type: "at-location",
                },
              },
              target: { ref: "previous-target" },
            },
          ],
        },
      },
      text: "IT LOOKS LIKE RAIN When you play this character, you may exert chosen opposing character. That character can't ready at the start of their next turn unless they're at a location.",
    },
  ],
  i18n: pepaMadrigalWeatherMakerI18n,
};
