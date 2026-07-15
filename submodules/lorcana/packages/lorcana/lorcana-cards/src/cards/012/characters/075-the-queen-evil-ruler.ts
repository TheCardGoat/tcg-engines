import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenEvilRulerI18n } from "./075-the-queen-evil-ruler.i18n";

export const theQueenEvilRuler: CharacterCard = {
  id: "nvJ",
  canonicalId: "ci_nvJ",
  slug: "lorcana-ci_nvJ",
  printings: [
    {
      id: "set12-075",
      artId: "set12-075",
      setCode: "set12",
      collectorNumber: "75",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set12-075"],
  cardType: "character",
  name: "The Queen",
  version: "Evil Ruler",
  inkType: ["emerald"],
  franchise: "Snow White",
  set: "012",
  cardNumber: 75,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_5f3231b198754189915b51adbdda3f7c",
    tcgPlayer: "678234",
  },
  text: [
    {
      title: "UNEQUALED CRUELTY",
      description: "While an opposing damaged character is in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    {
      id: "nvJ-1",
      name: "UNEQUALED CRUELTY",
      type: "static",
      condition: {
        type: "opponent-has-damaged-character",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: theQueenEvilRulerI18n,
};
