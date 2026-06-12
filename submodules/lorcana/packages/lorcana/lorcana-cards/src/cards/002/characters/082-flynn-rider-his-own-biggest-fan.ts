import type { CharacterCard } from "@tcg/lorcana-types";
import { flynnRiderHisOwnBiggestFanI18n } from "./082-flynn-rider-his-own-biggest-fan.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const flynnRiderHisOwnBiggestFan: CharacterCard = {
  id: "Q7q",
  canonicalId: "ci_Q7q",
  reprints: ["set2-082"],
  cardType: "character",
  name: "Flynn Rider",
  version: "His Own Biggest Fan",
  inkType: ["emerald"],
  franchise: "Tangled",
  set: "002",
  cardNumber: 82,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 3,
  lore: 4,
  inkable: false,
  externalIds: {
    lorcast: "crd_ce8e3338542f433193eaf3a3737ba1c4",
    tcgPlayer: 527178,
  },
  text: [
    {
      title: "Shift 2",
    },
    {
      title: "Evasive",
    },
    {
      title: "ONE LAST, BIG SCORE",
      description: "This character gets -1 {L} for each card in your opponents' hands.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Prince"],
  abilities: [
    shift(2),
    evasive,
    {
      effect: {
        modifier: {
          type: "cards-in-hand",
          controller: "opponents",
          modifier: -1,
        },
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "11r-3",
      name: "ONE LAST, BIG SCORE",
      text: "ONE LAST, BIG SCORE This character gets -1 {L} for each card in your opponents' hands.",
      type: "static",
    },
  ],
  i18n: flynnRiderHisOwnBiggestFanI18n,
};
