import type { CharacterCard } from "@tcg/lorcana-types";
import { falinePlayfulFawnI18n } from "./145-faline-playful-fawn.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const falinePlayfulFawn: CharacterCard = {
  id: "OjR",
  canonicalId: "ci_OjR",
  slug: "lorcana-ci_OjR",
  printings: [
    {
      id: "set8-145",
      artId: "set8-145",
      setCode: "set8",
      collectorNumber: "145",
      rarity: "rare",
      imageUrl: "",
    },
  ],
  reprints: ["set8-145"],
  cardType: "character",
  name: "Faline",
  version: "Playful Fawn",
  inkType: ["ruby"],
  franchise: "Bambi",
  set: "008",
  cardNumber: 145,
  rarity: "rare",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_586a47f740a3450b930cd1cbc7f3e640",
    tcgPlayer: "631445",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "PRECOCIOUS FRIEND",
      description:
        "While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    evasive,
    {
      condition: {
        type: "target-aggregate-comparison",
        left: {
          query: {
            selector: "all",
            owner: "you",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        right: {
          query: {
            selector: "all",
            owner: "opponent",
            zones: ["play"],
            cardType: "character",
            filters: [],
          },
          attribute: "strength",
          aggregate: "max",
        },
        comparison: "gt",
        requireLeftNonEmpty: true,
        ifRightEmpty: "pass",
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "12c-2",
      name: "PRECOCIOUS FRIEND",
      text: "PRECOCIOUS FRIEND While you have a character in play with more {S} than each opposing character, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: falinePlayfulFawnI18n,
};
