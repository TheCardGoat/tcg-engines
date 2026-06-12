import type { CharacterCard } from "@tcg/lorcana-types";
import { gizmoduckSuitedUpI18n } from "./105-gizmoduck-suited-up.i18n";
import { resist } from "../../../helpers/abilities/resist";

export const gizmoduckSuitedUp: CharacterCard = {
  id: "4Oe",
  canonicalId: "ci_4Oe",
  reprints: ["set7-105"],
  cardType: "character",
  name: "Gizmoduck",
  version: "Suited Up",
  inkType: ["emerald", "steel"],
  franchise: "Ducktales",
  set: "007",
  cardNumber: 105,
  rarity: "uncommon",
  cost: 4,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_bca7b817c7d54046bdf02f573d14d87a",
    tcgPlayer: 619463,
  },
  text: [
    {
      title: "Resist +1",
    },
    {
      title: "BLATHERING BLATHERSKITE",
      description: "This character can challenge ready damaged characters.",
    },
  ],
  classifications: ["Storyborn", "Inventor"],
  abilities: [
    resist(1),
    {
      effect: {
        ability: {
          type: "can-challenge-ready",
          onlyDamaged: true,
        },
        target: "SELF",
        type: "grant-ability",
      },
      id: "4Oe-2",
      name: "BLATHERING BLATHERSKITE",
      text: "BLATHERING BLATHERSKITE This character can challenge ready damaged characters.",
      type: "static",
    },
  ],
  i18n: gizmoduckSuitedUpI18n,
};
