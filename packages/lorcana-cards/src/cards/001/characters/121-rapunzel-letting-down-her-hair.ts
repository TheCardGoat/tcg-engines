import type { CharacterCard } from "@tcg/lorcana-types";

export const RapunzelLettingDownHerHair: CharacterCard = {
  id: "eqs",
  cardType: "character",
  name: "Rapunzel",
  version: "Letting Down Her Hair",
  fullName: "Rapunzel - Letting Down Her Hair",
  inkType: ["ruby"],
  franchise: "Disney",
  set: "001",
  text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 121,
  inkable: true,
  externalIds: {
    ravensburger: "",
  },
  abilities: [
    {
      type: "action",
      text: "**TANGLE** When you play this character, each opponent loses 1 lore.",
      id: "eqs-1",
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
    },
  ],
  classifications: ["Hero", "Dreamborn", "Princess"],
};
