import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimFox: CharacterCard = {
  id: "1ej",
  cardType: "character",
  name: "Madam Mim",
  version: "Fox",
  fullName: "Madam Mim - Fox",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "002",
  text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.\nRush (This character can challenge the turn they're played.)",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  cardNumber: 46,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "b632a76e8971d47d81626acf0505fdf0b9a173ba",
  },
  abilities: [
    {
      id: "1ej-1",
      type: "triggered",
      name: "CHASING THE RABBIT",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
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
      text: "CHASING THE RABBIT When you play this character, banish her or return another chosen character of yours to your hand.",
    },
    {
      id: "1ej-2",
      type: "keyword",
      keyword: "Rush",
      text: "Rush",
    },
  ],
  classifications: ["Storyborn", "Villain", "Sorcerer"],
};
