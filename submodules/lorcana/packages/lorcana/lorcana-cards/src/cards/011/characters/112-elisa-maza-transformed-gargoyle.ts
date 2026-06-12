import type { CharacterCard } from "@tcg/lorcana-types";
import { elisaMazaTransformedGargoyleI18n } from "./112-elisa-maza-transformed-gargoyle.i18n";
import { stoneByDay } from "../../../helpers/abilities/stoneByDay";

export const elisaMazaTransformedGargoyle: CharacterCard = {
  id: "HGB",
  canonicalId: "ci_HGB",
  reprints: ["set11-112"],
  cardType: "character",
  name: "Elisa Maza",
  version: "Transformed Gargoyle",
  inkType: ["ruby"],
  franchise: "Gargoyles",
  set: "011",
  cardNumber: 112,
  rarity: "rare",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_8d6d9d233b644d8d88baf2a34751328b",
    tcgPlayer: 673350,
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
  i18n: elisaMazaTransformedGargoyleI18n,
};
