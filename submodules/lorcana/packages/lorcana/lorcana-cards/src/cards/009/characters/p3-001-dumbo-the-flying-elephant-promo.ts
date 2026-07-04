import type { CharacterCard } from "@tcg/lorcana-types";
import { dumboTheFlyingElephantP3PromoI18n } from "./p3-001-dumbo-the-flying-elephant-promo.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const dumboTheFlyingElephantP3Promo: CharacterCard = {
  id: "rie",
  canonicalId: "ci_Lu3",
  slug: "lorcana-ci_Lu3",
  printings: [
    {
      id: "set9-p3-001-promo",
      artId: "ci_Lu3-promo",
      setCode: "set9",
      collectorNumber: "1",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set9-046"],
  cardType: "character",
  name: "Dumbo",
  version: "The Flying Elephant",
  inkType: ["amethyst"],
  franchise: "Dumbo",
  set: "009",
  cardNumber: 1,
  rarity: "special",
  specialRarity: "promo",
  cost: 3,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_1c42d9e976d0414099a145227b83b08c",
    tcgPlayer: "647679",
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "AERIAL DUO",
      description:
        "When you play this character, chosen character gains Evasive until the start of your next turn.",
    },
  ],
  classifications: ["Storyborn", "Hero"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "any",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "ab9-2",
      name: "AERIAL DUO",
      text: "AERIAL DUO When you play this character, chosen character gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: dumboTheFlyingElephantP3PromoI18n,
};
