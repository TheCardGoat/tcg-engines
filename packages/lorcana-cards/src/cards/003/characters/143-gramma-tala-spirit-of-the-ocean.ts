import type { CharacterCard } from "@tcg/lorcana-types";

export const grammaTalaSpiritOfTheOcean: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 5,
      },
      id: "1xw-1",
      keyword: "Shift",
      text: "Shift 5",
      type: "keyword",
    },
    {
      effect: {
        type: "gain-lore",
        amount: 1,
      },
      id: "1xw-2",
      name: "DO YOU KNOW WHO YOU ARE?",
      text: "DO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.",
      trigger: { event: "play", timing: "when", on: "SELF" },
      type: "triggered",
    },
  ],
  cardNumber: 143,
  cardType: "character",
  classifications: ["Floodborn", "Mentor"],
  cost: 7,
  externalIds: {
    ravensburger: "fbf243419cbfdb464f79114d25217e7266819b65",
  },
  franchise: "Moana",
  fullName: "Gramma Tala - Spirit of the Ocean",
  id: "1xw",
  inkType: ["sapphire"],
  inkable: true,
  lore: 2,
  missingTests: true,
  name: "Gramma Tala",
  set: "003",
  strength: 4,
  text: "Shift 5 (You may pay 5 {I} to play this on top of one of your characters named Gramma Tala.)\nDO YOU KNOW WHO YOU ARE? Whenever a card is put into your inkwell, gain 1 lore.",
  version: "Spirit of the Ocean",
  willpower: 8,
};
