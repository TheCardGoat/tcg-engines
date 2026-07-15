import type { CharacterCard } from "@tcg/lorcana-types";

export const brunoMadrigalSingingSeer: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1cp-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
        type: "optional",
      },
      id: "1cp-2",
      name: "BRIGHT FUTURE",
      text: "BRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
      trigger: { event: "play", on: "SELF", timing: "when" },
      type: "triggered",
    },
  ],
  cardNumber: 20,
  cardType: "character",
  classifications: ["Floodborn", "Ally", "Madrigal"],
  cost: 7,
  externalIds: {
    ravensburger: "af817278afe783681674103e4c50e09941209817",
  },
  franchise: "Encanto",
  fullName: "Bruno Madrigal - Singing Seer",
  id: "1cp",
  inkType: ["amber", "amethyst"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Bruno Madrigal",
  set: "008",
  strength: 3,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Bruno Madrigal.)\nBRIGHT FUTURE Whenever this character sings a song, you may draw a card for each character you have in play.",
  version: "Singing Seer",
  willpower: 7,
};
