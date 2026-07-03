import type { CharacterCard } from "@tcg/lorcana-types";
import { belleApprenticeInventorP3PromoI18n } from "./p3-037-belle-apprentice-inventor-promo.i18n";

export const belleApprenticeInventorP3Promo: CharacterCard = {
  id: "pgq",
  canonicalId: "ci_vbJ",
  slug: "lorcana-ci_vbJ",
  printings: [
    {
      id: "set7-p3-037-promo",
      artId: "ci_vbJ-promo",
      setCode: "set7",
      collectorNumber: "37",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set7-159"],
  cardType: "character",
  name: "Belle",
  version: "Apprentice Inventor",
  inkType: ["sapphire"],
  franchise: "Beauty and the Beast",
  set: "007",
  cardNumber: 37,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 3,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_fcb0a2f9a4044b86bba8e0ff3ade2988",
  },
  text: [
    {
      title: "WHAT",
      description:
        "A MESS During your turn, you may banish chosen item of yours to play this character for free.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Princess", "Inventor"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          target: {
            selector: "chosen",
            count: 1,
            owner: "you",
            zones: ["play"],
            cardTypes: ["item"],
          },
          type: "banish",
        },
        type: "optional",
      },
      alternativeCost: "sacrifice-item",
      id: "sb6-1",
      name: "WHAT A MESS",
      text: "WHAT A MESS During your turn, you may banish chosen item of yours to play this character for free.",
      type: "action",
    },
  ],
  i18n: belleApprenticeInventorP3PromoI18n,
};
