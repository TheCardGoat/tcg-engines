import type { CharacterCard } from "@tcg/lorcana-types";
import { sulleyTheNewBossP3PromoI18n } from "./p3-058-sulley-the-new-boss-promo.i18n";

import { bodyguard } from "../../../helpers/abilities/bodyguard";

export const sulleyTheNewBossP3Promo: CharacterCard = {
  id: "MVa",
  canonicalId: "ci_Vn7",
  slug: "lorcana-ci_Vn7",
  printings: [
    {
      id: "set13-p3-058-promo",
      artId: "ci_Vn7-promo",
      setCode: "set13",
      collectorNumber: "58",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set13-024"],
  cardType: "character",
  name: "Sulley",
  version: "The New Boss",
  inkType: ["amber"],
  franchise: "Monsters, Inc.",
  set: "013",
  cardNumber: 58,
  rarity: "special",
  specialRarity: "promo",
  cost: 5,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_3d891594b966483f9789a9b480178942",
    tcgPlayer: "690201",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "REHIRE",
      description:
        "When you play this character, you may return a character card from your discard to your hand.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Monster"],
  abilities: [
    bodyguard,
    {
      type: "triggered",
      name: "REHIRE",
      text: "REHIRE When you play this character, you may return a character card from your discard to your hand.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-to-hand",
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["discard"],
            cardTypes: ["character"],
          },
        },
      },
    },
  ],
  i18n: sulleyTheNewBossP3PromoI18n,
};
