import type { CharacterCard } from "@tcg/lorcana-types";
import { henryJWaternooseIiiChiefExecutiveOfficerI18n } from "./163-henry-j-waternoose-iii-chief-executive-officer.i18n";

export const henryJWaternooseIiiChiefExecutiveOfficer: CharacterCard = {
  id: "Ush",
  canonicalId: "ci_Ush",
  slug: "lorcana-ci_Ush",
  printings: [
    {
      id: "set13-163",
      artId: "set13-163",
      setCode: "set13",
      collectorNumber: "163",
      rarity: "rare",
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
  cardNumber: 163,
  rarity: "rare",
  cost: 6,
  strength: 5,
  willpower: 5,
  lore: 2,
  inkable: false,
  text: [
    {
      title: "The Bottom Line",
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
  i18n: henryJWaternooseIiiChiefExecutiveOfficerI18n,
};
