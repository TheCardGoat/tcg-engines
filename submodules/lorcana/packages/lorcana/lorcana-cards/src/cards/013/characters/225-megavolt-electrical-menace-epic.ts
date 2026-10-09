import type { CharacterCard } from "@tcg/lorcana-types";
import { megavoltElectricalMenaceEpicI18n } from "./225-megavolt-electrical-menace-epic.i18n";

export const megavoltElectricalMenaceEpic: CharacterCard = {
  id: "BQF",
  canonicalId: "ci_uDC",
  slug: "lorcana-ci_uDC",
  printings: [
    {
      id: "set13-225-epic",
      artId: "ci_uDC-epic",
      setCode: "set13",
      collectorNumber: "225",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-186"],
  cardType: "character",
  name: "Megavolt",
  version: "Electrical Menace",
  inkType: ["steel"],
  franchise: "Darkwing Duck",
  set: "013",
  cardNumber: 225,
  rarity: "epic",
  specialRarity: "epic",
  cost: 4,
  strength: 1,
  willpower: 4,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_55dccae9eb0b4f79b68bcf7e1d853e07",
    tcgPlayer: "704681",
  },
  text: [
    {
      title: "FORCE FIELD",
      description: "While you have no cards in your hand, this character gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Super", "Villain"],
  abilities: [
    {
      id: "uDC-1",
      name: "Force Field",
      text: "Force Field While you have no cards in your hand, this character gains Resist +2.",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-hand",
        controller: "you",
        comparison: "equal",
        value: 0,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
    },
  ],
  i18n: megavoltElectricalMenaceEpicI18n,
};
