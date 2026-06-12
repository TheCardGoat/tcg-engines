import type { CharacterCard } from "@tcg/lorcana-types";
import { liShangValorousGeneralI18n } from "./112-li-shang-valorous-general.i18n";

export const liShangValorousGeneral: CharacterCard = {
  id: "4HP",
  canonicalId: "ci_4HP",
  reprints: ["set4-112"],
  cardType: "character",
  name: "Li Shang",
  version: "Valorous General",
  inkType: ["ruby"],
  franchise: "Mulan",
  set: "004",
  cardNumber: 112,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4a59e793877041acaa1b8bf5543d85b0",
    tcgPlayer: 547766,
  },
  text: [
    {
      title:
        "Shift: Discard a character card (You may discard a character card to play this on top of one of your characters named Li Shang.)",
    },
    {
      title: "LEAD THE CHARGE",
      description: "Your characters with 4 {S} or more get +1 {L}.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      id: "4HP-1",
      type: "keyword",
      keyword: "Shift",
      cost: {
        discardCards: 1,
        discardCardType: "character",
      },
      shiftTarget: "Li Shang",
      text: "Shift: Discard a character card (You may discard a character card to play this on top of one of your characters named Li Shang.)",
    },
    {
      id: "4HP-2",
      name: "LEAD THE CHARGE",
      type: "static",
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "strength-comparison",
              comparison: "greater-or-equal",
              value: 4,
            },
          ],
        },
      },
      text: "LEAD THE CHARGE Your characters with 4 {S} or more get +1 {L}.",
    },
  ],
  i18n: liShangValorousGeneralI18n,
};
