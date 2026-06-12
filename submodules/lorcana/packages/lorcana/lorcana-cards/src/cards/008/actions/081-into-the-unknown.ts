import type { ActionCard } from "@tcg/lorcana-types";
import { intoTheUnknownI18n } from "./081-into-the-unknown.i18n";

export const intoTheUnknown: ActionCard = {
  id: "8Sv",
  canonicalId: "ci_TcE",
  reprints: ["set8-081"],
  cardType: "action",
  name: "Into the Unknown",
  inkType: ["amethyst", "sapphire"],
  franchise: "Frozen",
  set: "008",
  cardNumber: 81,
  rarity: "common",
  cost: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_1f6ec070467643d195c82c92cf93c955",
    tcgPlayer: 632720,
  },
  text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      id: "8Sv-1",
      text: "Put chosen exerted character into their player's inkwell facedown and exerted.",
      effect: {
        exerted: true,
        facedown: true,
        source: "chosen-character",
        target: "CHOSEN_EXERTED_CHARACTER",
        type: "put-into-inkwell",
      },
      type: "action",
    },
  ],
  i18n: intoTheUnknownI18n,
};
