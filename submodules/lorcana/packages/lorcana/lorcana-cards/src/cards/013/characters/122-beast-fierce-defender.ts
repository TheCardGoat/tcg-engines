import type { CharacterCard } from "@tcg/lorcana-types";
import { beastFierceDefenderI18n } from "./122-beast-fierce-defender.i18n";

export const beastFierceDefender: CharacterCard = {
  id: "C3L",
  canonicalId: "ci_C3L",
  slug: "lorcana-ci_C3L",
  printings: [
    {
      id: "set13-122",
      artId: "set13-122",
      setCode: "set13",
      collectorNumber: "122",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-122"],
  cardType: "character",
  name: "Beast",
  version: "Fierce Defender",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "013",
  cardNumber: 122,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Formidable Love",
      description: "While you have a character named Belle in play, this character gets +2 {S}.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      type: "static",
      name: "FORMIDABLE LOVE",
      text: "FORMIDABLE LOVE While you have a character named Belle in play, this character gets +2 {S}.",
      condition: {
        type: "has-named-character",
        name: "Belle",
        controller: "you",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: beastFierceDefenderI18n,
};
