import type { CharacterCard } from "@tcg/lorcana-types";
import { pepitaImeldasRightHandI18n } from "./119-pepita-imeldas-right-hand.i18n";
import { shift } from "../../../helpers/abilities/shift";

export const pepitaImeldasRightHand: CharacterCard = {
  id: "6oW",
  canonicalId: "ci_6oW",
  slug: "lorcana-ci_6oW",
  printings: [
    {
      id: "set14-119",
      artId: "set14-119",
      setCode: "set14",
      collectorNumber: "119",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-119"],
  cardType: "character",
  name: "Pepita",
  version: "Imelda's Right Hand",
  inkType: ["ruby"],
  franchise: "Coco",
  set: "014",
  cardNumber: 119,
  rarity: "super_rare",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Ancestral Wisdom",
      description:
        "While you have 10 or more cards in your discard, this character gets +2 {S} and +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    shift(3),
    {
      id: "6oW-1",
      name: "Ancestral Wisdom",
      type: "static",
      text: "Ancestral Wisdom While you have 10 or more cards in your discard, this character gets +2 {S}.",
      condition: {
        type: "resource-count",
        what: "cards-in-discard",
        controller: "you",
        comparison: "greater-or-equal",
        value: 10,
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
    {
      id: "6oW-2",
      name: "Ancestral Wisdom",
      type: "static",
      text: "Ancestral Wisdom While you have 10 or more cards in your discard, this character gets +2 {L}.",
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
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: pepitaImeldasRightHandI18n,
};
