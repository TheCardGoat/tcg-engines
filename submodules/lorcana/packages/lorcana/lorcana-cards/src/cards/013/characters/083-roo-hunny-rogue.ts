import type { CharacterCard } from "@tcg/lorcana-types";
import { rooHunnyRogueI18n } from "./083-roo-hunny-rogue.i18n";

import { ward } from "../../../helpers/abilities/ward";

export const rooHunnyRogue: CharacterCard = {
  id: "4I7",
  canonicalId: "ci_4I7",
  slug: "lorcana-ci_4I7",
  printings: [
    {
      id: "set13-083",
      artId: "set13-083",
      setCode: "set13",
      collectorNumber: "83",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-083"],
  cardType: "character",
  name: "Roo",
  version: "Hunny Rogue",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "013",
  cardNumber: 83,
  rarity: "uncommon",
  cost: 1,
  strength: 1,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_1e4e5fcae0fd4a5d92c33919e298257c",
  },
  text: [
    {
      title: "Ward",
    },
    {
      title: "ELUSIVE EXPERTISE",
      description: "While you have another Hunny character in play, this character gains Evasive.",
    },
  ],
  classifications: ["Dreamborn", "Ally", "Hunny"],
  abilities: [
    ward,
    {
      type: "static",
      name: "ELUSIVE EXPERTISE",
      text: "ELUSIVE EXPERTISE While you have another Hunny character in play, this character gains Evasive.",
      condition: {
        type: "has-character-count",
        controller: "you",
        comparison: "greater-or-equal",
        count: 1,
        classification: "Hunny",
        excludeSelf: true,
      },
      effect: {
        type: "gain-keyword",
        keyword: "Evasive",
        target: "SELF",
      },
    },
  ],
  i18n: rooHunnyRogueI18n,
};
