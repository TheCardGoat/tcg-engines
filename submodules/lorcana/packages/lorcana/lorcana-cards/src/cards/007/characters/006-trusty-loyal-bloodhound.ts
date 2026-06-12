import type { CharacterCard } from "@tcg/lorcana-types";
import { trustyLoyalBloodhoundI18n } from "./006-trusty-loyal-bloodhound.i18n";
import { support } from "../../../helpers/abilities/support";

export const trustyLoyalBloodhound: CharacterCard = {
  id: "zUf",
  canonicalId: "ci_zUf",
  reprints: ["set7-006"],
  cardType: "character",
  name: "Trusty",
  version: "Loyal Bloodhound",
  inkType: ["amber"],
  franchise: "Lady and the Tramp",
  set: "007",
  cardNumber: 6,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_ea6328bcbfc440899e5ecf6e16dbd5f0",
    tcgPlayer: 619409,
  },
  text: "Support",
  classifications: ["Storyborn", "Ally"],
  abilities: [support],
  i18n: trustyLoyalBloodhoundI18n,
};
