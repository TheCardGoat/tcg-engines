import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaSpiritOfTheOcean: CharacterCard = {
  id: "1xw",
  cardType: "character",
  name: "Gramma Tala",
  version: "Spirit of the Ocean",
  fullName: "Gramma Tala - Spirit of the Ocean",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "003",
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Gramma Tala.)\nDO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.",
  cost: 7,
  strength: 4,
  willpower: 8,
  lore: 2,
  cardNumber: 143,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "fbf243419cbfdb464f79114d25217e7266819b65",
  },
  abilities: [
    {
      id: "1xw-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        ink: 5,
      },
      text: "Shift 5",
    },
    {
      id: "1xw-2",
      type: "triggered",
      name: "DO YOU KNOW WHO YOU ARE?",
      trigger: { event: "play", timing: "when", on: "SELF" },
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      text: "DO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.",
    },
  ],
  classifications: ["Floodborn", "Mentor"],
};
