import type { CharacterCard } from "@tcg/lorcana-types";
import { danteLoyalAlebrijeI18n } from "./054-dante-loyal-alebrije.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { shift } from "../../../helpers/abilities/shift";

export const danteLoyalAlebrije: CharacterCard = {
  id: "C4J",
  canonicalId: "ci_C4J",
  slug: "lorcana-ci_C4J",
  printings: [
    {
      id: "set14-054",
      artId: "set14-054",
      setCode: "set14",
      collectorNumber: "54",
      rarity: "super_rare",
      imageUrl: "",
    },
  ],
  reprints: ["set14-054"],
  cardType: "character",
  name: "Dante",
  version: "Loyal Alebrije",
  inkType: ["amethyst"],
  franchise: "Coco",
  set: "014",
  cardNumber: 54,
  rarity: "super_rare",
  cost: 6,
  strength: 6,
  willpower: 4,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "Evasive",
    },
    {
      title: "Trash to Treasure",
      description: "While you have 10 or more cards in your discard, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    shift(4),
    evasive,
    {
      id: "C4J-3",
      name: "Trash to Treasure",
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
        modifier: 2,
        target: "SELF",
      },
      text: "Trash to Treasure While you have 10 or more cards in your discard, this character gets +2 {L}.",
    },
  ],
  i18n: danteLoyalAlebrijeI18n,
};
