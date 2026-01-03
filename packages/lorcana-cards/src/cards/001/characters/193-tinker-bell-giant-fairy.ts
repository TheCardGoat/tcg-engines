import type { CharacterCard } from "@tcg/lorcana-types";

export const TinkerBellGiantFairy: CharacterCard = {
  id: "kvc",
  cardType: "character",
  name: "Tinker Bell",
  version: "Giant Fairy",
  fullName: "Tinker Bell - Giant Fairy",
  inkType: ["steel"],
  franchise: "Disney",
  set: "001",
  text: "**Shift** 4 (_You may pay 4 {I} to play this on top of one of your characters named Tinker Bell._)\n**ROCK THE BOAT** When you play this character, deal 1 damage to each opposing character.\n\n**PUNY PIRATE!** During your turn, whenever this character banishes another character in a challenge, you may deal 2 damage to chosen opposing character.",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  cardNumber: 193,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      id: "c3s-1",
      text: "**FAIRY DUST** When you play this character, you may deal 1 damage to each opposing character.",
      effect: {
        type: "optional",
        effect: {
          type: "deal-damage",
          amount: 1,
          target: {
            selector: "all",
            count: "all",
            owner: "opponent",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
    },
  ],
  classifications: ["Floodborn", "Ally", "Fairy"],
};
