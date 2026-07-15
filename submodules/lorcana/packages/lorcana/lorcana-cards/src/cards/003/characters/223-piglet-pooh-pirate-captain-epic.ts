import type { CharacterCard } from "@tcg/lorcana-types";
import { pigletPoohPirateCaptainEpicI18n } from "./223-piglet-pooh-pirate-captain-epic.i18n";

export const pigletPoohPirateCaptainEpic: CharacterCard = {
  id: "c5k",
  canonicalId: "ci_51V",
  slug: "lorcana-ci_51V",
  printings: [
    {
      id: "set3-223-epic",
      artId: "ci_51V-epic",
      setCode: "set3",
      collectorNumber: "223",
      rarity: "epic",
      imageUrl: "",
    },
  ],
  reprints: ["set3-016"],
  cardType: "character",
  name: "Piglet",
  version: "Pooh Pirate Captain",
  inkType: ["amber"],
  franchise: "Winnie the Pooh",
  set: "003",
  cardNumber: 223,
  rarity: "common",
  specialRarity: "epic",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f478c96f7b1b45b790d74395480da563",
    tcgPlayer: "531822",
  },
  text: [
    {
      title: "AND I'M THE CAPTAIN!",
      description: "While you have 2 or more other characters in play, this character gets +2 {L}.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Pirate", "Captain"],
  abilities: [
    {
      condition: {
        type: "has-character-count",
        comparison: "greater-or-equal",
        controller: "you",
        count: 3,
      },
      effect: {
        modifier: 2,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
      },
      id: "51i-1",
      name: "AND I'M THE CAPTAIN!",
      text: "AND I'M THE CAPTAIN! While you have 2 or more other characters in play, this character gets +2 {L}.",
      type: "static",
    },
  ],
  i18n: pigletPoohPirateCaptainEpicI18n,
};
