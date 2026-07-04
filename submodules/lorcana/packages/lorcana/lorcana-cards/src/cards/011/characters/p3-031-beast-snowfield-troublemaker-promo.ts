import type { CharacterCard } from "@tcg/lorcana-types";
import { beastSnowfieldTroublemakerP3PromoI18n } from "./p3-031-beast-snowfield-troublemaker-promo.i18n";

import { rush } from "../../../helpers/abilities/rush";

export const beastSnowfieldTroublemakerP3Promo: CharacterCard = {
  id: "qT3",
  canonicalId: "ci_dg5",
  slug: "lorcana-ci_dg5",
  printings: [
    {
      id: "set11-p3-031-promo",
      artId: "ci_dg5-promo",
      setCode: "set11",
      collectorNumber: "31",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set11-118"],
  cardType: "character",
  name: "Beast",
  version: "Snowfield Troublemaker",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "011",
  cardNumber: 31,
  rarity: "special",
  specialRarity: "promo",
  cost: 2,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_cde01953c3aa414290991fddcffe4651",
    tcgPlayer: "673337",
  },
  text: [
    {
      title: "Rush",
    },
    {
      title: "DYNAMIC MANEUVER",
      description:
        "Whenever this character challenges, if he's at a location, he takes no damage from the challenge.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    rush,
    {
      id: "dg5-1",
      type: "triggered",
      name: "DYNAMIC MANEUVER",
      text: "DYNAMIC MANEUVER Whenever this character challenges, if he's at a location, he takes no damage from the challenge.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "at-location",
      },
      effect: {
        type: "grant-ability",
        ability: "takes-no-damage-from-challenges",
        duration: "this-turn",
        target: "SELF",
      },
    },
  ],
  i18n: beastSnowfieldTroublemakerP3PromoI18n,
};
