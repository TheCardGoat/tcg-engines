import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelLettingDownHerHair: CharacterCard = {
  id: "w6r",
  cardType: "character",
  name: "Rapunzel",
  version: "Letting Down Her Hair",
  fullName: "Rapunzel - Letting Down Her Hair",
  inkType: ["ruby"],
  franchise: "Tangled",
  set: "009",
  text: "TANGLE When you play this character, each opponent loses 1 lore.",
  cost: 6,
  strength: 5,
  willpower: 4,
  lore: 2,
  cardNumber: 124,
  inkable: false,
  missingTests: true,
  externalIds: {
    ravensburger: "74021e80777ac22b8eccc6e3c94d0662b00fcf9c",
  },
  abilities: [
    {
      id: "w6r-1",
      type: "triggered",
      name: "TANGLE",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "lose-lore",
        amount: 1,
        target: "EACH_OPPONENT",
      },
      text: "TANGLE When you play this character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
};
