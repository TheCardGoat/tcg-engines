import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraDreamingGuardianEnchantedI18n } from "./213-aurora-dreaming-guardian-enchanted.i18n";

export const auroraDreamingGuardianEnchanted: CharacterCard = {
  id: "349",
  canonicalId: "ci_mSW",
  slug: "lorcana-ci_mSW",
  printings: [
    {
      id: "set1-213-enchanted",
      artId: "ci_mSW-enchanted",
      setCode: "set1",
      collectorNumber: "213",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set1-139", "set9-153"],
  cardType: "character",
  name: "Aurora",
  version: "Dreaming Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "001",
  cardNumber: 213,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_81f418041acd4fd98990e02403938de4",
    tcgPlayer: "650088",
  },
  text: [
    {
      title: "Shift 3",
    },
    {
      title: "PROTECTIVE EMBRACE",
      description: "Your other characters gain Ward.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess"],
  abilities: [
    {
      cost: {
        ink: 3,
      },
      id: "11z-1",
      keyword: "Shift",
      text: "Shift 3 {I}",
      type: "keyword",
    },
    {
      effect: {
        keyword: "Ward",
        target: {
          selector: "all",
          count: "all",
          owner: "you",
          zones: ["play"],
          cardTypes: ["character"],
          excludeSelf: true,
        },
        type: "gain-keyword",
      },
      id: "11z-2",
      name: "PROTECTIVE EMBRACE",
      text: "PROTECTIVE EMBRACE Your other characters gain Ward.",
      type: "static",
    },
  ],
  i18n: auroraDreamingGuardianEnchantedI18n,
};
