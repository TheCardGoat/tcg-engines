import type { CharacterCard } from "@tcg/lorcana-types";
import { grammaTalaConnectedToNatureI18n } from "./148-gramma-tala-connected-to-nature.i18n";

export const grammaTalaConnectedToNature: CharacterCard = {
  id: "iSA",
  canonicalId: "ci_iSA",
  reprints: ["set11-148"],
  cardType: "character",
  name: "Gramma Tala",
  version: "Connected to Nature",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 148,
  rarity: "rare",
  cost: 12,
  strength: 6,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_600ad28b57694ad2b078261118277ad2",
    tcgPlayer: 673343,
  },
  text: [
    {
      title: "ANCESTORS' GIFT",
      description: "For each card in your inkwell, you pay 1 {I} less to play this character.",
    },
  ],
  classifications: ["Storyborn", "Mentor"],
  abilities: [
    {
      id: "9jo-1",
      name: "ANCESTORS' GIFT",
      sourceZones: ["hand"],
      effect: {
        amount: {
          type: "filtered-count",
          owner: "you",
          zones: ["inkwell"],
          filters: [],
        },
        cardType: "character",
        type: "cost-reduction",
      },
      type: "static",
      text: "ANCESTORS’ GIFT For each card in your inkwell, you pay 1 {I} less to play this character.",
    },
  ],
  i18n: grammaTalaConnectedToNatureI18n,
};
