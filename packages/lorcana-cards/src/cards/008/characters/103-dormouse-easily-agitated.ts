import type { CharacterCard } from "@tcg/lorcana-types";

export const dormouseEasilyAgitated: CharacterCard = {
  id: "1x7",
  cardType: "character",
  name: "Dormouse",
  version: "Easily Agitated",
  fullName: "Dormouse - Easily Agitated",
  inkType: ["emerald", "ruby"],
  franchise: "Alice in Wonderland",
  set: "008",
  text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  cardNumber: 103,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "f968b2b0712de866dd279b16a93ac01a742952af",
  },
  abilities: [
    {
      id: "1x7-1",
      type: "triggered",
      name: "VERY RUDE INDEED",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "optional",
        effect: {
          type: "put-damage",
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
        },
        chooser: "CONTROLLER",
      },
      text: "VERY RUDE INDEED When you play this character, you may put 1 damage counter on chosen character.",
    },
  ],
  classifications: ["Storyborn"],
};
