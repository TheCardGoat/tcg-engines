import type { CharacterCard } from "@tcg/lorcana-types";
import { elisaMazaTransformedGargoyleP3ChallengeI18n } from "./p3-030-elisa-maza-transformed-gargoyle-challenge.i18n";

import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const elisaMazaTransformedGargoyleP3Challenge: CharacterCard = {
  id: "Bdg",
  canonicalId: "ci_KtZ",
  slug: "lorcana-ci_KtZ",
  printings: [
    {
      id: "set11-p3-030-challenge",
      artId: "ci_KtZ-challenge",
      setCode: "set11",
      collectorNumber: "30",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set11-112"],
  cardType: "character",
  name: "Elisa Maza",
  version: "Transformed Gargoyle",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "011",
  cardNumber: 30,
  rarity: "special",
  specialRarity: "challenge",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8d6d9d233b644d8d88baf2a34751328b",
    tcgPlayer: "673350",
  },
  text: [
    {
      title: "FOREVER STRONG",
      description: "Your characters' {S} can't be reduced below their printed value.",
    },
    {
      title: "STONE BY DAY",
      description: "If you have 3 or more cards in your hand, this character can't ready.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Gargoyle", "Detective"],
  abilities: [
    {
      id: "153-1",
      name: "FOREVER STRONG",
      text: "FOREVER STRONG Your characters' {S} can't be reduced below their printed value.",
      type: "static",
      effect: {
        type: "stat-floor",
        stat: "strength",
        minimum: "printed",
        target: "YOUR_CHARACTERS",
      },
    },
    stoneByDay,
  ],
  i18n: elisaMazaTransformedGargoyleP3ChallengeI18n,
};
