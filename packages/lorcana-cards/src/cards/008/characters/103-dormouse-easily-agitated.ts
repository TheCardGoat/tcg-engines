import type { CharacterCard } from "@tcg/lorcana-types";

export const dormouseEasilyAgitated: CharacterCard = {
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            cardTypes: ["character"],
            count: 1,
            owner: "any",
            selector: "chosen",
            zones: ["play"],
          },
          type: "put-damage",
        },
        type: "optional",
      },
      id: "1x7-1",
      name: "VERY RUDE INDEED",
      text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  cardNumber: 103,
  cardType: "character",
  classifications: ["Storyborn"],
  cost: 2,
  externalIds: {
    ravensburger: "f968b2b0712de866dd279b16a93ac01a742952af",
  },
  franchise: "Alice in Wonderland",
  fullName: "Dormouse - Easily Agitated",
  id: "1x7",
  inkType: ["emerald", "ruby"],
  inkable: true,
  lore: 1,
  missingTests: true,
  name: "Dormouse",
  set: "008",
  strength: 1,
  text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
  version: "Easily Agitated",
  willpower: 2,
};
