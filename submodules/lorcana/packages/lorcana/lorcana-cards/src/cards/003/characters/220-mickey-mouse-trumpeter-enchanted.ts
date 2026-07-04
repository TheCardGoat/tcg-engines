import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseTrumpeterEnchantedI18n } from "./220-mickey-mouse-trumpeter-enchanted.i18n";

export const mickeyMouseTrumpeterEnchanted: CharacterCard = {
  id: "aZ3",
  canonicalId: "ci_gBS",
  slug: "lorcana-ci_gBS",
  printings: [
    {
      id: "set3-220-enchanted",
      artId: "ci_gBS-enchanted",
      setCode: "set3",
      collectorNumber: "220",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-182", "set9-172"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Trumpeter",
  inkType: ["steel"],
  set: "003",
  cardNumber: 220,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 4,
  strength: 0,
  willpower: 1,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_631c3f90c74b4c0cabded03d2b07f85b",
    tcgPlayer: "650106",
  },
  text: [
    {
      title: "SOUND THE CALL",
      description: "{E}, 2 {I} — Play a character for free.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      cost: {
        exert: true,
        ink: 2,
      },
      effect: {
        cardType: "character",
        cost: "free",
        from: "hand",
        type: "play-card",
      },
      id: "6jz-1",
      name: "SOUND THE CALL",
      text: "SOUND THE CALL {E}, 2 {I} — Play a character for free.",
      type: "activated",
    },
  ],
  i18n: mickeyMouseTrumpeterEnchantedI18n,
};
