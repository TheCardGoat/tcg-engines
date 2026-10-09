import type { CharacterCard } from "@tcg/lorcana-types";
import { henryJWaternooseIiiChiefExecutiveOfficerEpicI18n } from "./220-henry-j-waternoose-iii-chief-executive-officer-epic.i18n";

export const henryJWaternooseIiiChiefExecutiveOfficerEpic: CharacterCard = {
  id: "ZAT",
  canonicalId: "ci_Ush",
  slug: "lorcana-ci_Ush",
  printings: [
    {
      id: "set13-220-epic",
      artId: "ci_Ush-epic",
      setCode: "set13",
      collectorNumber: "220",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set13-163"],
  cardType: "character",
  name: "Henry J. Waternoose III",
  version: "Chief Executive Officer",
  inkType: ["sapphire"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 220,
  rarity: "epic",
  specialRarity: "epic",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_ee36794d1eaf4eef92563effd73797e6",
    tcgPlayer: "704661",
  },
  text: [
    {
      title: "THE BOTTOM LINE",
      description:
        "While you have more cards in your inkwell than each opposing player, this character gets +2 {L} and gains Ward.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Monster"],
  abilities: [
    {
      type: "static",
      name: "THE BOTTOM LINE",
      text: "THE BOTTOM LINE While you have more cards in your inkwell than each opposing player, this character gets +2 {L}.",
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-inkwell",
          controller: "you",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-inkwell",
          controller: "opponent",
        },
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 2,
        target: "SELF",
      },
    },
    {
      type: "static",
      name: "THE BOTTOM LINE",
      text: "THE BOTTOM LINE While you have more cards in your inkwell than each opposing player, this character gains Ward.",
      condition: {
        type: "comparison",
        left: {
          type: "cards-in-inkwell",
          controller: "you",
        },
        comparison: "greater-than",
        right: {
          type: "cards-in-inkwell",
          controller: "opponent",
        },
      },
      effect: {
        type: "gain-keyword",
        keyword: "Ward",
        target: "SELF",
      },
    },
  ],
  i18n: henryJWaternooseIiiChiefExecutiveOfficerEpicI18n,
};
