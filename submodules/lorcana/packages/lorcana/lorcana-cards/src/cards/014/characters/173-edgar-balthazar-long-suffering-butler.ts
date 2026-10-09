import type { CharacterCard } from "@tcg/lorcana-types";
import { edgarBalthazarLongsufferingButlerI18n } from "./173-edgar-balthazar-long-suffering-butler.i18n";

export const edgarBalthazarLongsufferingButler: CharacterCard = {
  id: "S04",
  canonicalId: "ci_S04",
  slug: "lorcana-ci_S04",
  printings: [
    {
      id: "set14-173",
      artId: "set14-173",
      setCode: "set14",
      collectorNumber: "173",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-173"],
  cardType: "character",
  name: "Edgar Balthazar",
  version: "Long-Suffering Butler",
  inkType: ["steel"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 173,
  rarity: "common",
  cost: 5,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Trusty Umbrella",
      description: "While this character has no damage, he gains Resist +2.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      id: "S04-1",
      name: "Trusty Umbrella",
      type: "static",
      text: "Trusty Umbrella While this character has no damage, he gains Resist +2.",
      condition: {
        type: "no-damage",
      },
      effect: {
        type: "gain-keyword",
        keyword: "Resist",
        value: 2,
        target: "SELF",
      },
    },
  ],
  i18n: edgarBalthazarLongsufferingButlerI18n,
};
