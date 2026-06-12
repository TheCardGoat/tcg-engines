import type { ActionCard } from "@tcg/lorcana-types";
import { allFunnedOutI18n } from "./164-all-funned-out.i18n";

export const allFunnedOut: ActionCard = {
  id: "uyQ",
  canonicalId: "ci_uyQ",
  reprints: ["set5-164"],
  cardType: "action",
  name: "All Funned Out",
  inkType: ["sapphire"],
  franchise: "Emperors New Groove",
  set: "005",
  cardNumber: 164,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_22015e39f7a8462688822b423e11f891",
    tcgPlayer: 561971,
  },
  text: "Put chosen character of yours into your inkwell facedown and exerted.",
  abilities: [
    {
      effect: {
        exerted: true,
        facedown: true,
        source: "chosen-card-in-play",
        target: {
          selector: "chosen",
          count: 1,
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
        },
        type: "put-into-inkwell",
      },
      id: "1mz-1",
      text: "Put chosen character of yours into your inkwell facedown and exerted.",
      type: "action",
    },
  ],
  i18n: allFunnedOutI18n,
};
