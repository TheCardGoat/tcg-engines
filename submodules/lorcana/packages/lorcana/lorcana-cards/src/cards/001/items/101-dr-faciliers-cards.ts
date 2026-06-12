import type { ItemCard } from "@tcg/lorcana-types";
import { drFaciliersCardsI18n } from "./101-dr-faciliers-cards.i18n";

export const drFaciliersCards: ItemCard = {
  id: "flR",
  canonicalId: "ci_flR",
  reprints: ["set1-101"],
  cardType: "item",
  name: "Dr. Facilier’s Cards",
  inkType: ["emerald"],
  franchise: "Princess and the Frog",
  set: "001",
  cardNumber: 101,
  rarity: "uncommon",
  cost: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_b30843c0d5e845ee88fc040b5c5e727b",
    tcgPlayer: 508762,
  },
  text: [
    {
      title: "THE CARDS WILL TELL",
      description: "— You pay 1 less for the next action you play this turn.",
    },
  ],
  abilities: [
    {
      cost: {
        exert: true,
      },
      effect: {
        amount: 1,
        cardType: "action",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
        type: "cost-reduction",
      },
      id: "18f-1",
      name: "THE CARDS WILL TELL",
      text: "THE CARDS WILL TELL {E} — You pay 1 {I} less for the next action you play this turn.",
      type: "activated",
    },
  ],
  i18n: drFaciliersCardsI18n,
};
