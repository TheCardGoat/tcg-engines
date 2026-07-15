import type { CharacterCard } from "@tcg/lorcana-types";
import { tamatoaSeekerOfShineEnchantedI18n } from "./237-tamatoa-seeker-of-shine-enchanted.i18n";

import { boost } from "../../../helpers/abilities/boost";
import { ward } from "../../../helpers/abilities/ward";

export const tamatoaSeekerOfShineEnchanted: CharacterCard = {
  id: "fxQ",
  canonicalId: "ci_zL3",
  slug: "lorcana-ci_zL3",
  printings: [
    {
      id: "set11-237-enchanted",
      artId: "ci_zL3-enchanted",
      setCode: "set11",
      collectorNumber: "237",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set11-156"],
  cardType: "character",
  name: "Tamatoa",
  version: "Seeker of Shine",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 237,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_82807328c2514c0d8f22366b4720a583",
    tcgPlayer: "677168",
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "Ward",
    },
    {
      title: "ANYTHING THAT GLITTERS",
      description:
        "Whenever you put a card under one of your characters or locations, this character gets +1 {L} this turn.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Whisper"],
  abilities: [
    boost(2),
    ward,
    {
      id: "v4g-3",
      effect: {
        modifier: 1,
        stat: "lore",
        target: "SELF",
        type: "modify-stat",
        duration: "this-turn",
      },
      name: "ANYTHING THAT GLITTERS",
      trigger: {
        event: "put-card-under",
        timing: "whenever",
        on: "YOUR_CHARACTERS_OR_LOCATIONS",
      },
      type: "triggered",
      text: "ANYTHING THAT GLITTERS Whenever you put a card under one of your characters or locations, this character gets +1 {L} this turn.",
    },
  ],
  i18n: tamatoaSeekerOfShineEnchantedI18n,
};
