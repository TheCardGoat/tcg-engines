import type { ItemCard } from "@tcg/lorcana-types";

export const imperialProclamation: ItemCard = {
  abilities: [
    {
      effect: {
        from: "hand",
        type: "play-card",
      },
      id: "12k-1",
      name: "CALL TO THE FRONT",
      text: "CALL TO THE FRONT Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
      trigger: {
        event: "banish",
        on: "YOUR_OTHER_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  cardNumber: 131,
  cardType: "item",
  cost: 1,
  externalIds: {
    ravensburger: "8b04c1aa6989c48cb5eff4b133824a7f25a7a517",
  },
  franchise: "Mulan",
  id: "12k",
  inkType: ["ruby"],
  inkable: true,
  missingTests: true,
  name: "Imperial Proclamation",
  set: "004",
  text: "CALL TO THE FRONT Whenever one of your characters challenges another character, you pay 1 {I} less for the next character you play this turn.",
};
