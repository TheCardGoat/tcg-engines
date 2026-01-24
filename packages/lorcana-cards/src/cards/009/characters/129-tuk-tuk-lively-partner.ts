import type { CharacterCard } from "@tcg/lorcana-types";

export const tukTukLivelyPartner: CharacterCard = {
  id: "1qb",
  cardType: "character",
  name: "Tuk Tuk",
  version: "Lively Partner",
  fullName: "Tuk Tuk - Lively Partner",
  inkType: ["ruby"],
  franchise: "Raya and the Last Dragon",
  set: "009",
  text: "Evasive (Only characters with Evasive can challenge this character.) ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  cardNumber: 129,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "e0924443108d0df64a23851b0300bc32953f3c15",
  },
  abilities: [
    {
      id: "1qb-1",
      type: "triggered",
      name: "Evasive ON A ROLL",
      trigger: {
        event: "play",
        timing: "when",
        on: "SELF",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "YOUR_CHARACTERS",
        duration: "this-turn",
      },
      text: "Evasive ON A ROLL When you play this character, you may move him and one of your other characters to the same location for free. If you do, the other character gets +2 {S} this turn.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
};
