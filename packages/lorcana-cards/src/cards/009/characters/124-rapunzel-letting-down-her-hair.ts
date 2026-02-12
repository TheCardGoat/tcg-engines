import type { CharacterCard } from "@tcg/lorcana-types";

export const rapunzelLettingDownHerHair: CharacterCard = {
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "w6r-1",
      name: "TANGLE",
      text: "TANGLE When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 124,
  cardType: "character",
  classifications: ["Dreamborn", "Hero", "Princess"],
  cost: 6,
  externalIds: {
    ravensburger: "74021e80777ac22b8eccc6e3c94d0662b00fcf9c",
  },
  franchise: "Tangled",
  fullName: "Rapunzel - Letting Down Her Hair",
  id: "w6r",
  inkType: ["ruby"],
  inkable: false,
  lore: 2,
  missingTests: true,
  name: "Rapunzel",
  set: "009",
  strength: 5,
  text: "TANGLE When you play this character, each opponent loses 1 lore.",
  version: "Letting Down Her Hair",
  willpower: 4,
};
