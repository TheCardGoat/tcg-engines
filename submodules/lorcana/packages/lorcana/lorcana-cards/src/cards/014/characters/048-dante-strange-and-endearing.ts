import type { CharacterCard } from "@tcg/lorcana-types";
import { danteStrangeAndEndearingI18n } from "./048-dante-strange-and-endearing.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const danteStrangeAndEndearing: CharacterCard = {
  id: "PJW",
  canonicalId: "ci_PJW",
  slug: "lorcana-ci_PJW",
  printings: [
    {
      id: "set14-048",
      artId: "set14-048",
      setCode: "set14",
      collectorNumber: "48",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-048"],
  cardType: "character",
  name: "Dante",
  version: "Strange and Endearing",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 48,
  rarity: "uncommon",
  cost: 1,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Digging in the Trash",
      description: "While you have 10 or more cards in your discard, this character gets +1 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      id: "PJW-2",
      name: "Digging in the Trash",
      type: "static",
      condition: {
        type: "resource-count",
        what: "cards-in-discard",
        controller: "you",
        comparison: "greater-or-equal",
        value: 10,
      },
      effect: {
        type: "modify-stat",
        stat: "lore",
        modifier: 1,
        target: "SELF",
      },
      text: "Digging in the Trash While you have 10 or more cards in your discard, this character gets +1 {L}.",
    },
  ],
  i18n: danteStrangeAndEndearingI18n,
};
