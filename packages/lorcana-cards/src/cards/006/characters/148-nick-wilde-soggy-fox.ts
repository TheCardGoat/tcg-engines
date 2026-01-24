import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeSoggyFox: CharacterCard = {
  id: "10j",
  cardType: "character",
  name: "Nick Wilde",
  version: "Soggy Fox",
  fullName: "Nick Wilde - Soggy Fox",
  inkType: ["sapphire"],
  franchise: "Zootropolis",
  set: "006",
  text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
  cost: 1,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 148,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "83b82508f808e3474f91baaf49efd065f71a2820",
  },
  abilities: [
    {
      id: "10j-1",
      type: "action",
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
