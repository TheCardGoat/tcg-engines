import type { CharacterCard } from "@tcg/lorcana-types";
import { stitchAlienBuccaneerP2PromoI18n } from "./p2-008-stitch-alien-buccaneer-promo.i18n";

import { shift } from "../../../helpers/abilities/shift";

export const stitchAlienBuccaneerP2Promo: CharacterCard = {
  id: "3Ok",
  canonicalId: "ci_bae",
  slug: "lorcana-ci_bae",
  printings: [
    {
      id: "set6-p2-008-promo",
      artId: "ci_bae-promo",
      setCode: "set6",
      collectorNumber: "8",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set6-072"],
  cardType: "character",
  name: "Stitch",
  version: "Alien Buccaneer",
  inkType: ["emerald"],
  franchise: "Lilo and Stitch",
  set: "006",
  cardNumber: 8,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_efcb250575354ffd8cdce9e8c45d52bf",
    tcgPlayer: "578176",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "READY FOR ACTION",
      description:
        "When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Alien", "Pirate"],
  abilities: [
    shift(3),
    {
      condition: {
        type: "used-shift",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          type: "return-from-discard",
          cardType: "action",
          destination: "top-of-deck",
          target: "CONTROLLER",
          count: 1,
        },
      },
      id: "19n-2",
      name: "READY FOR ACTION",
      text: "READY FOR ACTION When you play this character, if you used Shift to play him, you may put an action card from your discard on the top of your deck.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: stitchAlienBuccaneerP2PromoI18n,
};
