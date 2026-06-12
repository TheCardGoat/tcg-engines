import type { CharacterCard } from "@tcg/lorcana-types";
import { enchantressUnexpectedJudgeI18n } from "./080-enchantress-unexpected-judge.i18n";

export const enchantressUnexpectedJudge: CharacterCard = {
  id: "q7w",
  canonicalId: "ci_pH4",
  reprints: ["set2-080", "set9-081"],
  cardType: "character",
  name: "Enchantress",
  version: "Unexpected Judge",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 80,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 1,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_140b8662d4f1474e8c39019b0bfbd3f3",
    tcgPlayer: 650021,
  },
  text: [
    {
      title: "TRUE FORM",
      description: "While being challenged, this character gets +2 {S}.",
    },
  ],
  classifications: ["Dreamborn", "Sorcerer"],
  abilities: [
    {
      condition: {
        role: "defender",
        type: "in-challenge",
      },
      effect: {
        modifier: 2,
        stat: "strength",
        target: "SELF",
        type: "modify-stat",
      },
      id: "q7w-1",
      name: "TRUE FORM",
      text: "TRUE FORM While being challenged, this character gets +2 {S}.",
      type: "static",
    },
  ],
  i18n: enchantressUnexpectedJudgeI18n,
};
