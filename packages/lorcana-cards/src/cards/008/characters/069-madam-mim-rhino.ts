import type { CharacterCard } from "@tcg/lorcana-types";

export const madamMimRhino: CharacterCard = {
  abilities: [
    {
      cost: {
        ink: 2,
      },
      id: "1jr-1",
      keyword: "Shift",
      text: "Shift 2",
      type: "keyword",
    },
    {
      effect: {
        optionLabels: [
          "MAKE WAY, COMING THROUGH! When you play this character, banish her",
          "return another chosen character of yours to your hand.",
        ],
        options: [
          {
            from: "hand",
            type: "play-card",
          },
          {
            target: {
              cardTypes: ["character"],
              count: 1,
              owner: "any",
              selector: "chosen",
              zones: ["play"],
            },
            type: "return-to-hand",
          },
        ],
        type: "choice",
      },
      id: "1jr-2",
      text: "MAKE WAY, COMING THROUGH! When you play this character, banish her or return another chosen character of yours to your hand.",
      type: "action",
    },
  ],
  cardNumber: 69,
  cardType: "character",
  classifications: ["Floodborn", "Villain", "Sorcerer"],
  cost: 6,
  externalIds: {
    ravensburger: "c8ed6402654f8ce22d7183f9306ce8d843f760b2",
  },
  franchise: "Sword in the Stone",
  fullName: "Madam Mim - Rhino",
  id: "1jr",
  inkType: ["amethyst", "ruby"],
  inkable: false,
  lore: 1,
  missingTests: true,
  name: "Madam Mim",
  set: "008",
  strength: 6,
  text: "Shift 2 (You may pay 2 {I} to play this on top of one of your characters named Madam Mim.)\nMAKE WAY, COMING THROUGH! When you play this character, banish her or return another chosen character of yours to your hand.",
  version: "Rhino",
  willpower: 5,
};
