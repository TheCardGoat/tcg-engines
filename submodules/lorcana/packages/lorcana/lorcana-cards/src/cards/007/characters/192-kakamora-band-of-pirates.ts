import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraBandOfPiratesI18n } from "./192-kakamora-band-of-pirates.i18n";

export const kakamoraBandOfPirates: CharacterCard = {
  id: "TUI",
  canonicalId: "ci_TUI",
  reprints: ["set7-192"],
  cardType: "character",
  name: "Kakamora",
  version: "Band of Pirates",
  inkType: ["steel"],
  franchise: "Moana",
  set: "007",
  cardNumber: 192,
  rarity: "common",
  cost: 4,
  strength: 1,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e97a6df3786a4f2489911d0b9201a127",
    tcgPlayer: 619518,
  },
  text: [
    {
      title: "SHOWBOATING",
      description:
        "While you have another Pirate character in play, this character gains Challenger +3.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
  abilities: [
    {
      condition: {
        type: "has-another-character",
        classification: "Pirate",
      },
      effect: {
        keyword: "Challenger",
        target: "SELF",
        type: "gain-keyword",
        value: 3,
      },
      name: "SHOWBOATING",
      text: "SHOWBOATING While you have another Pirate character in play, this character gains Challenger +3.",
      type: "static",
    },
  ],
  i18n: kakamoraBandOfPiratesI18n,
};
