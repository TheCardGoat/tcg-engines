import type { CharacterCard } from "@tcg/lorcana-types";
import { tamatoaSeekerOfShineI18n } from "./156-tamatoa-seeker-of-shine.i18n";
import { boost } from "../../../helpers/abilities/boost";
import { ward } from "../../../helpers/abilities/ward";

export const tamatoaSeekerOfShine: CharacterCard = {
  id: "lED",
  canonicalId: "ci_zL3",
  reprints: ["set11-156"],
  cardType: "character",
  name: "Tamatoa",
  version: "Seeker of Shine",
  inkType: ["sapphire"],
  franchise: "Moana",
  set: "011",
  cardNumber: 156,
  rarity: "common",
  cost: 7,
  strength: 6,
  willpower: 6,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_82807328c2514c0d8f22366b4720a583",
    tcgPlayer: 677168,
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
  i18n: tamatoaSeekerOfShineI18n,
};
