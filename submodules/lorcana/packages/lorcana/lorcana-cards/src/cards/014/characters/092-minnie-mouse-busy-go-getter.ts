import type { CharacterCard } from "@tcg/lorcana-types";
import { minnieMouseBusyGogetterI18n } from "./092-minnie-mouse-busy-go-getter.i18n";

export const minnieMouseBusyGogetter: CharacterCard = {
  id: "vFk",
  canonicalId: "ci_vFk",
  slug: "lorcana-ci_vFk",
  printings: [
    {
      id: "set14-092",
      artId: "set14-092",
      setCode: "set14",
      collectorNumber: "92",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-092"],
  cardType: "character",
  name: "Minnie Mouse",
  version: "Busy Go-Getter",
  inkType: ["emerald"],
  set: "014",
  cardNumber: 92,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "Great Find",
      description: "During each opponent's turn, this character gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    {
      id: "res-1",
      name: "Great Find",
      type: "static",
      text: "Great Find During each opponent's turn, this character gains Resist +2.",
      condition: {
        type: "during-turn",
        whose: "opponent",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
    },
  ],
  i18n: minnieMouseBusyGogetterI18n,
};
