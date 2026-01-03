import type { CharacterCard } from "@tcg/lorcana-types";

export const CinderellaGentleAndKind: CharacterCard = {
  id: "qil",
  cardType: "character",
  name: "Cinderella",
  version: "Gentle and Kind",
  fullName: "Cinderella - Gentle and Kind",
  inkType: ["amber"],
  franchise: "Disney",
  set: "001",
  text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 2,
  cardNumber: 3,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "qil-1",
      text: "**Singer** 5 _(This character counts as cost 5 to sing songs.)_\n\n**A WONDERFUL DREAM** {E}− Remove up to 3 damage from chosen Princess character.",
      effect: {
        type: "remove-damage",
        amount: 3,
        upTo: true,
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
        },
      },
    },
  ],
  classifications: ["Hero", "Storyborn", "Princess"],
};
