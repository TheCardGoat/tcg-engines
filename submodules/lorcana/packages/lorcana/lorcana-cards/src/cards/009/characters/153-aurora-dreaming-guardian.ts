import type { CharacterCard } from "@tcg/lorcana-types";
import { auroraDreamingGuardianI18n } from "./153-aurora-dreaming-guardian.i18n";

export const auroraDreamingGuardian: CharacterCard = {
  id: "HnN",
  canonicalId: "ci_mSW",
  slug: "lorcana-ci_mSW",
  printings: [
    {
      id: "set9-153",
      artId: "set9-153",
      setCode: "set9",
      collectorNumber: "153",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set1-139", "set9-153"],
  cardType: "character",
  name: "Aurora",
  version: "Dreaming Guardian",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "009",
  cardNumber: 153,
  rarity: "common",
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
      title: "Shift 3 {I}",
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
  i18n: auroraDreamingGuardianI18n,
};
