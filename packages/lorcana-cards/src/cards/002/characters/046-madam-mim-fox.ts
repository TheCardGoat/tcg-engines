import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimFox: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "return-to-hand",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
      id: "1ej-1",
      name: "CHASING THE RABBIT",
      text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      type: "triggered",
    },
    {
      id: "1ej-2",
      keyword: "Rush",
      text: "Rush",
      type: "keyword",
    },
  ],
  cardNumber: 46,
  cardType: "character",
  classifications: ["Storyborn", "Villain", "Sorcerer"],
  cost: 3,
  externalIds: {
    ravensburger: "b632a76e8971d47d81626acf0505fdf0b9a173ba",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Fox",
  id: "1ej",
  inkType: ["amethyst"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Madam Mim",
  set: "002",
  strength: 4,
  text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)",
  version: "Fox",
  willpower: 3,
};
