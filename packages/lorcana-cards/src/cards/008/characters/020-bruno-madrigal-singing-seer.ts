import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalSingingSeer: CharacterCard = {
  id: "1cp",
  cardType: "character",
  name: "Bruno Madrigal",
  version: "Singing Seer",
  fullName: "Bruno Madrigal - Singing Seer",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "008",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
  cost: 7,
  strength: 3,
  willpower: 7,
  lore: 2,
  cardNumber: 20,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "af817278afe783681674103e4c50e09941209817",
  },
  abilities: [
    {
      id: "1cp-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1cp-2",
      type: "triggered",
      name: "BRIGHT FUTURE",
      effect: {
        type: "optional",
        effect: {
          type: "draw",
          amount: 1,
          target: "CONTROLLER",
        },
        chooser: "CONTROLLER",
      },
      text: "BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
    },
  ],
  classifications: ["Floodborn", "Ally", "Madrigal"],
};
