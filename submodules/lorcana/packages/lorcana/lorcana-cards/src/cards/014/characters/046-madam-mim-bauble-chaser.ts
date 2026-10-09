import type { CharacterCard } from "@tcg/lorcana-types";
import { madamMimBaubleChaserI18n } from "./046-madam-mim-bauble-chaser.i18n";

export const madamMimBaubleChaser: CharacterCard = {
  id: "SDE",
  canonicalId: "ci_SDE",
  slug: "lorcana-ci_SDE",
  printings: [
    {
      id: "set14-046",
      artId: "set14-046",
      setCode: "set14",
      collectorNumber: "46",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-046"],
  cardType: "character",
  name: "Madam Mim",
  version: "Bauble Chaser",
  inkType: ["amethyst"],
  franchise: "Sword in the Stone",
  set: "014",
  cardNumber: 46,
  rarity: "common",
  cost: 1,
  strength: 2,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_97732480c67243eea104065b21c61544",
  },
  text: [
    {
      title: "HARD TO HANDLE",
      description: "While you have an ink drop, this character gains Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Villain", "Sorcerer"],
  abilities: [
    {
      id: "SDE-1",
      name: "HARD TO HANDLE",
      type: "static",
      condition: {
        type: "resource-count",
        what: "ink-drops",
        controller: "you",
        comparison: "greater-or-equal",
        value: 1,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
      text: "HARD TO HANDLE While you have an ink drop, this character gains Evasive.",
    },
  ],
  i18n: madamMimBaubleChaserI18n,
};
