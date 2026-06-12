import type { CharacterCard } from "@tcg/lorcana-types";
import { tianaWarmAndHappyI18n } from "./005-tiana-warm-and-happy.i18n";
import { support } from "../../../helpers/abilities/support";

export const tianaWarmAndHappy: CharacterCard = {
  id: "5Io",
  canonicalId: "ci_FOF",
  reprints: ["set11-005"],
  cardType: "character",
  name: "Tiana",
  version: "Warm and Happy",
  inkType: ["amber"],
  franchise: "Princess and the Frog",
  set: "011",
  cardNumber: 5,
  rarity: "common",
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_801cd6ba9a3048499af41d6186fa4100",
    tcgPlayer: 677142,
  },
  text: "Support",
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [support],
  i18n: tianaWarmAndHappyI18n,
};
