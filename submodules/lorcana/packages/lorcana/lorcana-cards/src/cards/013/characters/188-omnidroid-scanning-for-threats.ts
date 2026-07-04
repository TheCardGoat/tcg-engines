import type { CharacterCard } from "@tcg/lorcana-types";
import { omnidroidScanningForThreatsI18n } from "./188-omnidroid-scanning-for-threats.i18n";

export const omnidroidScanningForThreats: CharacterCard = {
  id: "mlq",
  canonicalId: "ci_mlq",
  slug: "lorcana-ci_mlq",
  printings: [
    {
      id: "set13-188",
      artId: "set13-188",
      setCode: "set13",
      collectorNumber: "188",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set13-188"],
  cardType: "character",
  name: "Omnidroid",
  version: "Scanning for Threats",
  inkType: ["steel"],
  franchise: "Incredibles",
  set: "013",
  cardNumber: 188,
  rarity: "common",
  cost: 3,
  strength: 4,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_c320d3dd28714ed285931cb1a13605d5",
  },
  text: [
    {
      title: "FACTORY SETTINGS",
      description: "While this character has no damage, it gets +2 strength.",
    },
  ],
  classifications: ["Storyborn", "Robot"],
  abilities: [
    {
      id: "mlq-1",
      name: "Factory Settings",
      text: "Factory Settings While this character has no damage, it gets +2 {S}.",
      type: "static",
      condition: {
        type: "no-damage",
      },
      effect: {
        type: "modify-stat",
        stat: "strength",
        modifier: 2,
        target: "SELF",
      },
    },
  ],
  i18n: omnidroidScanningForThreatsI18n,
};
