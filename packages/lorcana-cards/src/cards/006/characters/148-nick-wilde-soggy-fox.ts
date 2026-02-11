import type { CharacterCard } from "@tcg/lorcana-types";

export const nickWildeSoggyFox: CharacterCard = {
  abilities: [
    {
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
      id: "10j-1",
      text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
      type: "action",
    },
  ],
  cardNumber: 148,
  cardType: "character",
  classifications: ["Storyborn", "Ally"],
  cost: 1,
  externalIds: {
    ravensburger: "83b82508f808e3474f91baaf49efd065f71a2820",
  },
  franchise: "Zootropolis",
  fullName: "Nick Wilde - Soggy Fox",
  id: "10j",
  inkType: ["sapphire"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Nick Wilde",
  set: "006",
  strength: 1,
  text: "NICE TO HAVE A PARTNER While you have another character with Support in play, this character gets +2 {S}.",
  version: "Soggy Fox",
  willpower: 2,
};
